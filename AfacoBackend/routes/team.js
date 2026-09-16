'use strict'

const express     = require('express')
const TeamMember  = require('../models/TeamMember')
const requireAuth = require('../middleware/auth')

const router = express.Router()

router.get('/team', async (req, res, next) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 })
    res.json(members)
  } catch (err) {
    next(err)
  }
})

router.post('/admin/team', requireAuth, async (req, res, next) => {
  try {
    const { name, role, bio, photoUrl } = req.body
    if (!name || !role) return res.status(400).json({ error: 'name and role are required.' })
    const order = await TeamMember.countDocuments()
    const member = await TeamMember.create({ name, role, bio, photoUrl, order })
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
})

router.put('/admin/team/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, role, bio, photoUrl } = req.body
    if (!name || !role) return res.status(400).json({ error: 'name and role are required.' })
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { name, role, bio, photoUrl },
      { new: true, runValidators: true }
    )
    if (!member) return res.status(404).json({ error: 'Team member not found.' })
    res.json(member)
  } catch (err) {
    next(err)
  }
})

router.delete('/admin/team/:id', requireAuth, async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ error: 'Team member not found.' })
    res.json({ message: 'Team member deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
