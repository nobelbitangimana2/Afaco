'use strict'

const mongoose = require('mongoose')

// Single-document collection — one record holds all editable site text
const siteContentSchema = new mongoose.Schema(
  {
    mission: { type: String, default: '' },
    vision:  { type: String, default: '' },
    partners: {
      type: [String],
      default: [
        'Great Lakes Regional Seed Bank',
        'Ministry of Agriculture – DRC',
        'FAO Central Africa',
        'International Fund for Agricultural Development',
        "Local Farmers' Cooperative Union",
        'Regional Agricultural University Network',
      ],
    },
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
