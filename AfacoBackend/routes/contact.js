'use strict'

const express     = require('express')
const Contact     = require('../models/Contact')
const requireAuth = require('../middleware/auth')

const router = express.Router()

/** GET /api/contact — public */
router.get('/contact', async (req, res, next) => {
  try {
    const contact = await Contact.findOne()
    res.json(contact || {})
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/contact/submit — public contact form
 * In production wire this to an email service (Nodemailer, SendGrid, etc.)
 */
router.post('/contact/submit', async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required.' })
    }
    // TODO: send email via Nodemailer / SendGrid
    console.log('Contact form submission:', { name, email, message })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

/** PUT /api/admin/contact — admin only */
router.put('/admin/contact', requireAuth, async (req, res, next) => {
  try {
    const { address, phone, email, officeHours, mapEmbedUrl, socialLinks } = req.body
    const contact = await Contact.findOneAndUpdate(
      {},
      { address, phone, email, officeHours, mapEmbedUrl, socialLinks },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(contact)
  } catch (err) {
    next(err)
  }
})

module.exports = router
