'use strict'

const express      = require('express')
const nodemailer   = require('nodemailer')
const Contact      = require('../models/Contact')
const requireAuth  = require('../middleware/auth')

const router = express.Router()

// ── Nodemailer transporter ─────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

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
 * Sends an email notification to EMAIL_TO
 */
router.post('/contact/submit', async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required.' })
    }

    await transporter.sendMail({
      from:    `"AFACO Website" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: `
        <h2>New message from the AFACO contact form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-line">${message}</p>
        <hr/>
        <p style="color:#666;font-size:12px">Sent from the AFACO website contact form.</p>
      `,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err.message)
    // Still return success to the user — log the error server-side
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
