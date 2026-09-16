'use strict'

const express      = require('express')
const SiteContent  = require('../models/SiteContent')
const requireAuth  = require('../middleware/auth')

const router = express.Router()

function normalizePartner(partner) {
  if (typeof partner === 'string') {
    return { name: partner.trim(), description: '', imageUrl: '' }
  }
  return {
    name: typeof partner?.name === 'string' ? partner.name.trim() : '',
    description: typeof partner?.description === 'string' ? partner.description.trim() : '',
    imageUrl: typeof partner?.imageUrl === 'string' ? partner.imageUrl.trim() : '',
  }
}

/** GET /api/content — public */
router.get('/content', async (req, res, next) => {
  try {
    const content = await SiteContent.findOne()
    if (!content) return res.json({ mission: '', vision: '', partners: [] })
    const response = content.toJSON()
    response.partners = (content.partners || []).map(normalizePartner).filter((partner) => partner.name)
    res.json(response)
  } catch (err) {
    next(err)
  }
})

/** PUT /api/admin/content — admin only */
router.put('/admin/content', requireAuth, async (req, res, next) => {
  try {
    const { mission, vision, partners } = req.body
    if (!mission || !vision) {
      return res.status(400).json({ error: 'Both mission and vision are required.' })
    }
    if (!Array.isArray(partners)) {
      return res.status(400).json({ error: 'Partners must be provided as a list.' })
    }
    const cleanedPartners = partners
      .map(normalizePartner)
      .filter((partner) => partner.name)
    const content = await SiteContent.findOneAndUpdate(
      {},
      { mission, vision, partners: cleanedPartners },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(content)
  } catch (err) {
    next(err)
  }
})

module.exports = router
