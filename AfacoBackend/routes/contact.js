'use strict'

const express     = require('express')
const { Resend }  = require('resend')
const Contact     = require('../models/Contact')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// ── Resend client (lazy — reads env at request time) ──────────────────────────
let _resend = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

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
 * Sends via Resend HTTP API (works on Render free tier — uses port 443)
 */
router.post('/contact/submit', async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required.' })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set.')
      return res.status(500).json({ error: 'Email service not configured.' })
    }

    const { error } = await getResend().emails.send({
      from:     'AFACO Website <onboarding@resend.dev>',
      to:       [process.env.EMAIL_TO || 'nobelbitangimana2@gmail.com'],
      replyTo:  email,
      subject:  `New contact form message from ${name}`,
      html: `
        <h2 style="color:#1b4332">New message from the AFACO contact form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-line;background:#f4f6f8;padding:1rem;border-radius:4px">${message}</p>
        <hr/>
        <p style="color:#666;font-size:12px">Sent from the AFACO website contact form.</p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err.message)
    return res.status(500).json({ error: err.message })
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
