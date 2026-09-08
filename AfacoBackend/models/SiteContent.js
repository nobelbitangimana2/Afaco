'use strict'

const mongoose = require('mongoose')

// Single-document collection — one record holds all editable site text
const siteContentSchema = new mongoose.Schema(
  {
    mission: { type: String, default: '' },
    vision:  { type: String, default: '' },
  },
  { timestamps: true }
)

siteContentSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('SiteContent', siteContentSchema)
