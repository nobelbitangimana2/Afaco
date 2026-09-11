'use strict'

const express     = require('express')
const nodemailer  = require('nodemailer')
const Contact     = require('../models/Contact')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// ── Nodemailer transporter (lazy — reads env at request time) ─────────────────
let _transporter = null
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host:   'smtp.gmail.com',
      port:   587,
      secure: false,          // STARTTLS on port 587
      family: 4,              // force IPv4 — Render free tier doesn't support IPv6
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }
  return _transporter
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
 * Sends an email to EMAIL_TO, reply-to set to the sender's address.
 */
router.post('/contact/submit', async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required.' })
    }

    // Guard: if credentials not configured, log clearly and return error
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email not configured: EMAIL_USER or EMAIL_PASS missing from environment.')
      return res.status(500).json({ error: 'Email service not configured.' })
    }

    await getTransporter().sendMail({
      from:    `"AFACO Website" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New contact form message from ${name}`,
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

    res.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err.message)
    // Reset transporter so next request tries fresh credentials
    _transporter = null
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
