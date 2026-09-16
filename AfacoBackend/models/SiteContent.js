'use strict'

const mongoose = require('mongoose')

// Single-document collection — one record holds all editable site text.
// Mixed keeps old string-only partner records readable during migration.
const siteContentSchema = new mongoose.Schema(
  {
    mission: { type: String, default: '' },
    vision:  { type: String, default: '' },
    partners: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { name: 'Great Lakes Regional Seed Bank', description: '', imageUrl: '' },
        { name: 'Ministry of Agriculture – DRC', description: '', imageUrl: '' },
        { name: 'FAO Central Africa', description: '', imageUrl: '' },
        { name: 'International Fund for Agricultural Development', description: '', imageUrl: '' },
        { name: "Local Farmers' Cooperative Union", description: '', imageUrl: '' },
        { name: 'Regional Agricultural University Network', description: '', imageUrl: '' },
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
