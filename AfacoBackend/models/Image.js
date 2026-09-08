'use strict'

const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema(
  {
    url:          { type: String, required: true },   // full-size WebP path (relative to /uploads)
    thumbnailUrl: { type: String, required: true },   // thumb WebP path
    alt:          { type: String, default: '' },
    category:     {
      type: String,
      enum: ['farmland', 'farmers', 'activities', 'harvest', 'infrastructure', 'community', 'general'],
      default: 'general',
    },
    order:        { type: Number, default: 0 },       // for drag-and-drop ordering
  },
  { timestamps: true }
)

imageSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Image', imageSchema)
