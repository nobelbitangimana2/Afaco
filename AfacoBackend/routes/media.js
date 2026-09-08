'use strict'

const express     = require('express')
const multer      = require('multer')
const sharp       = require('sharp')
const path        = require('path')
const fs          = require('fs')
const Image       = require('../models/Image')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// ── Upload directory ───────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
const THUMB_DIR  = path.join(UPLOAD_DIR, 'thumbnails')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })
fs.mkdirSync(THUMB_DIR,  { recursive: true })

// ── Multer — store in memory so Sharp can process before writing ───────────────
const storage = multer.memoryStorage()
const upload  = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },   // 20 MB raw limit
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are accepted.'))
    }
    cb(null, true)
  },
})

// ── Helper: build public URL from relative path ────────────────────────────────
function publicUrl(req, relativePath) {
  return `${req.protocol}://${req.get('host')}/${relativePath}`
}

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/media
 * Returns all images, sorted by `order` then `createdAt`.
 */
router.get('/media', async (req, res, next) => {
  try {
    const images = await Image.find().sort({ order: 1, createdAt: -1 })
    // Prefix server origin onto stored paths
    const result = images.map((img) => {
      const obj = img.toJSON()
      if (!obj.url.startsWith('http'))          obj.url          = publicUrl(req, obj.url)
      if (!obj.thumbnailUrl.startsWith('http')) obj.thumbnailUrl = publicUrl(req, obj.thumbnailUrl)
      return obj
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// ── ADMIN ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/media/upload
 * Field: `image` (single file), body: { category, alt }
 *
 * Pipeline:
 *  1. Multer reads into memory buffer
 *  2. Sharp → resize to max 1600px wide → convert to WebP (quality 82)
 *  3. Sharp → resize to max 400px wide  → convert to WebP (quality 75) as thumbnail
 *  4. Write both files to /uploads and /uploads/thumbnails
 *  5. Save paths + metadata to MongoDB
 */
router.post('/admin/media/upload', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })

    const filename  = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
    const fullPath  = path.join(UPLOAD_DIR, filename)
    const thumbPath = path.join(THUMB_DIR, filename)

    // Full-size: max width 1600px, WebP quality 82
    await sharp(req.file.buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(fullPath)

    // Thumbnail: max width 400px, WebP quality 75
    await sharp(req.file.buffer)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbPath)

    const image = await Image.create({
      url:          `uploads/${filename}`,
      thumbnailUrl: `uploads/thumbnails/${filename}`,
      alt:          req.body.alt      || '',
      category:     req.body.category || 'general',
      order:        0,
    })

    const obj = image.toJSON()
    obj.url          = publicUrl(req, obj.url)
    obj.thumbnailUrl = publicUrl(req, obj.thumbnailUrl)

    res.status(201).json(obj)
  } catch (err) {
    next(err)
  }
})

/**
 * PATCH /api/admin/media/:id
 * Body: { alt, category, order }
 */
router.patch('/admin/media/:id', requireAuth, async (req, res, next) => {
  try {
    const allowed = {}
    if (req.body.alt      !== undefined) allowed.alt      = req.body.alt
    if (req.body.category !== undefined) allowed.category = req.body.category
    if (req.body.order    !== undefined) allowed.order    = req.body.order

    const image = await Image.findByIdAndUpdate(req.params.id, allowed, { new: true })
    if (!image) return res.status(404).json({ error: 'Image not found.' })

    const obj = image.toJSON()
    obj.url          = publicUrl(req, obj.url)
    obj.thumbnailUrl = publicUrl(req, obj.thumbnailUrl)
    res.json(obj)
  } catch (err) {
    next(err)
  }
})

/**
 * PUT /api/admin/media/reorder
 * Body: { category, ids }  — ordered array of image IDs within a category
 */
router.put('/admin/media/reorder', requireAuth, async (req, res, next) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids)) return res.status(400).json({ error: '`ids` array required.' })

    const ops = ids.map((id, idx) => ({
      updateOne: { filter: { _id: id }, update: { order: idx } },
    }))
    await Image.bulkWrite(ops)
    res.json({ message: 'Order updated.' })
  } catch (err) {
    next(err)
  }
})

/**
 * DELETE /api/admin/media/:id
 * Removes DB record and deletes both files from disk.
 */
router.delete('/admin/media/:id', requireAuth, async (req, res, next) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id)
    if (!image) return res.status(404).json({ error: 'Image not found.' })

    // Remove files — ignore errors if already missing
    const fullPath  = path.join(__dirname, '..', image.url)
    const thumbPath = path.join(__dirname, '..', image.thumbnailUrl)
    fs.unlink(fullPath,  (err) => { if (err && err.code !== 'ENOENT') console.warn(err) })
    fs.unlink(thumbPath, (err) => { if (err && err.code !== 'ENOENT') console.warn(err) })

    res.json({ message: 'Image deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
