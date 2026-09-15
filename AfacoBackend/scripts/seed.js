'use strict'

/**
 * Seed script — run once to populate the database with:
 *  - One admin user  (username: admin, password: admin123)
 *  - Initial mission/vision site content
 *  - Initial contact info
 *  - 6 sample updates
 *
 * Usage:
 *   node scripts/seed.js
 *
 * The script is idempotent: it skips creation if data already exists.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const mongoose    = require('mongoose')
const bcrypt      = require('bcryptjs')
const Admin       = require('../models/Admin')
const Update      = require('../models/Update')
const Product     = require('../models/Product')
const SiteContent = require('../models/SiteContent')
const Contact     = require('../models/Contact')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✓ Connected to MongoDB')

  // ── Admin user ─────────────────────────────────────────────────────────────
  const existingAdmin = await Admin.findOne({ username: 'admin' })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12)
    await Admin.create({ username: 'admin', passwordHash })
    console.log('✓ Admin user created  (username: admin  password: admin123)')
  } else {
    console.log('– Admin user already exists, skipping')
  }

  // ── Site content ───────────────────────────────────────────────────────────
  const existingContent = await SiteContent.findOne()
  if (!existingContent) {
    await SiteContent.create({
      mission: 'To empower smallholder farmers across Central Africa with the knowledge, tools, infrastructure, and market connections they need to build sustainable livelihoods, strengthen local food systems, and contribute to long-term regional food security.',
      vision:  'A Central Africa where every farming community — regardless of geography, gender, or economic status — has equitable access to quality inputs, modern techniques, fair markets, and the social infrastructure needed to thrive.',
    })
    console.log('✓ Site content seeded')
  } else {
    console.log('– Site content already exists, skipping')
  }

  // ── Contact info ───────────────────────────────────────────────────────────
  const existingContact = await Contact.findOne()
  if (!existingContact) {
    await Contact.create({
      address:     '12 Avenue Agricole, Butembo, North Kivu, Democratic Republic of Congo',
      phone:       '+243 997 123 456',
      email:       'info@afaco.org',
      officeHours: 'Monday – Friday, 08:00 – 17:00 (CAT)',
      mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=29.27%2C0.13%2C29.30%2C0.16&layer=mapnik',
      socialLinks: {
        facebook:  'https://facebook.com/afaco',
        twitter:   'https://twitter.com/afaco',
        instagram: 'https://instagram.com/afaco',
        linkedin:  'https://linkedin.com/company/afaco',
        youtube:   'https://youtube.com/@afaco',
      },
    })
    console.log('✓ Contact info seeded')
  } else {
    console.log('– Contact info already exists, skipping')
  }

  // ── Sample updates ─────────────────────────────────────────────────────────
  const updateCount = await Update.countDocuments()
  if (updateCount === 0) {
    await Update.insertMany([
      {
        title:    'AFACO Expands Rice Cultivation to New Districts',
        date:     '2026-08-20',
        excerpt:  'Following a successful pilot season, AFACO has extended its high-yield rice programme to three additional districts, benefiting over 400 smallholder families.',
        body:     'Following a successful pilot season in Butembo and Lubero, AFACO has extended its high-yield rice cultivation programme to three additional districts: Masisi, Rutshuru, and Walikale.\n\nThe expansion is part of our five-year food security strategy and comes after pilot farms recorded an average 38 % yield increase compared to traditional methods.\n\nOver 400 smallholder families are expected to benefit directly in the first growing cycle.',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        category: 'agriculture',
      },
      {
        title:    'Farmer Training Workshop Concludes in Goma',
        date:     '2026-07-14',
        excerpt:  'A two-week intensive training on modern farming techniques wrapped up with 120 participants receiving certificates of completion.',
        body:     'A two-week intensive training workshop concluded successfully in Goma on 14 July 2026. The workshop was attended by 120 participants from farming cooperatives across North Kivu.\n\nAll 120 participants received certificates of completion and a starter kit including improved seed varieties.',
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
        category: 'training',
      },
      {
        title:    'Partnership Signed with Regional Seed Bank',
        date:     '2026-06-30',
        excerpt:  'AFACO has formalised a partnership with the Great Lakes Regional Seed Bank to improve access to drought-resistant seed varieties.',
        body:     'AFACO has signed a formal memorandum of understanding with the Great Lakes Regional Seed Bank (GLRSB) to improve smallholder access to high-quality, drought-resistant, and disease-tolerant seed varieties.\n\nThe first seed distribution under the new agreement is scheduled for September 2026.',
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
        category: 'partnerships',
      },
      {
        title:    'Harvest Festival Celebrates Record Maize Output',
        date:     '2026-05-10',
        excerpt:  'AFACO member cooperatives celebrated a record maize harvest this season, with total output up 45 % year on year.',
        body:     'AFACO member cooperatives celebrated a landmark harvest season with total maize output reaching a record high — up 45 % compared to the same period last year.\n\nThe surplus harvest has enabled several cooperatives to build emergency grain reserves for the first time.',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
        category: 'agriculture',
      },
      {
        title:    'Women in Agriculture Programme Launches',
        date:     '2026-04-08',
        excerpt:  'A new programme dedicated to empowering women farmers with land rights support, business skills, and leadership training has been officially launched.',
        body:     'AFACO officially launched its Women in Agriculture Programme on International Women\'s Day, April 2026.\n\nThe inaugural cohort consists of 80 women from five cooperatives who will receive 12 months of structured mentorship.',
        imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
        category: 'community',
      },
      {
        title:    'New Irrigation Infrastructure Commissioned',
        date:     '2026-03-22',
        excerpt:  'A solar-powered drip irrigation network serving 250 hectares was officially commissioned, cutting water usage by 40 %.',
        body:     'A solar-powered drip irrigation network serving 250 hectares was officially commissioned on World Water Day, 22 March 2026.\n\nFarmers have already reported healthier crops and reduced labour during dry months.',
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
        category: 'infrastructure',
      },
    ])
    console.log('✓ Sample updates seeded (6 records)')
  } else {
    console.log(`– Updates already exist (${updateCount} records), skipping`)
  }

  // ── Sample products ────────────────────────────────────────────────────────
  const productCount = await Product.countDocuments()
  if (productCount === 0) {
    await Product.insertMany([
      {
        name:        'White Rice',
        description: 'Premium long-grain white rice, sun-dried and stone-milled by AFACO member cooperatives in North Kivu.',
        imageUrl:    'https://images.unsplash.com/photo-1536304993881-ff86e0c9f129?w=800&q=80',
        sizes: [
          { size: '1kg',   price: 1.50  },
          { size: '5kg',   price: 6.50  },
          { size: '10kg',  price: 12.00 },
          { size: '25kg',  price: 28.00 },
          { size: '50kg',  price: 52.00 },
          { size: '100kg', price: 0     },
        ],
      },
      {
        name:        'Parboiled Rice',
        description: 'Nutritionally rich parboiled rice. Retains more vitamins and minerals than standard white rice. Ideal for bulk buyers and institutions.',
        imageUrl:    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
        sizes: [
          { size: '1kg',   price: 1.80  },
          { size: '5kg',   price: 8.00  },
          { size: '10kg',  price: 14.50 },
          { size: '25kg',  price: 33.00 },
          { size: '50kg',  price: 60.00 },
          { size: '100kg', price: 0     },
        ],
      },
      {
        name:        'Dried Maize',
        description: 'Sun-dried whole maize grain, sourced directly from AFACO cooperative farms. Suitable for milling, animal feed, and household use.',
        imageUrl:    'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80',
        sizes: [
          { size: '5kg',   price: 4.00  },
          { size: '10kg',  price: 7.50  },
          { size: '25kg',  price: 17.00 },
          { size: '50kg',  price: 30.00 },
          { size: '100kg', price: 0     },
        ],
      },
    ])
    console.log('✓ Sample products seeded (3 records)')
  } else {
    console.log(`– Products already exist (${productCount} records), skipping`)
  }

  await mongoose.disconnect()
  console.log('✓ Seed complete. Disconnected.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
