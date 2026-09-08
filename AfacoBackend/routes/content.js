'use strict'

const express      = require('express')
const SiteContent  = require('../models/SiteContent')
const requireAuth  = require('../middleware/auth')

const router = express.Router()

/** GET /api/content — public */
router.get('/content', async (req, res, next) => {
  try {
    const content = await SiteContent.findOne()
    res.json(content || { mission: '', vision: '' })
  } catch (err) {
    next(err)
  }
})

/** PUT /api/admin/content — admin only */
router.put('/admin/content', requireAuth, async (req, res, next) => {
  try {
    const { mission, vision } = req.body
    if (!mission || !vision) {
      return res.status(400).json({ error: 'Both mission and vision are required.' })
    }
    const content = await SiteContent.findOneAndUpdate(
      {},
      { mission, vision },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(content)
  } catch (err) {
    next(err)
  }
})

module.exports = router
