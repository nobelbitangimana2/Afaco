/**
 * DataContext — shared mutable data store.
 *
 * Both the public site and the admin panel read/write through this context.
 * When the backend is ready, replace the INITIAL_* constants and each
 * action handler body with real fetch() / axios calls.
 *
 * Usage:
 *   const { images, addImage, deleteImage, … } = useData()
 */
import React, { createContext, useContext, useState } from 'react'

// ─── Initial mock data ────────────────────────────────────────────────────────

const INITIAL_IMAGES = [
  { id: '1',  url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', alt: 'Green farmland at sunrise',       category: 'farmland'      },
  { id: '2',  url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', alt: 'Farmer in the field',              category: 'farmers'       },
  { id: '3',  url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80', alt: 'Seed planting activity',           category: 'activities'    },
  { id: '4',  url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', alt: 'Maize crop harvest',               category: 'harvest'       },
  { id: '5',  url: 'https://images.unsplash.com/photo-1561543818-e3b20f6d7011?w=800&q=80',   alt: 'Irrigation channel on farmland',  category: 'infrastructure'},
  { id: '6',  url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80', alt: 'Women farmers at work',            category: 'farmers'       },
  { id: '7',  url: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80', alt: 'Community meeting under trees',   category: 'community'     },
  { id: '8',  url: 'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&q=80', alt: 'Aerial view of crop fields',       category: 'farmland'      },
  { id: '9',  url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80', alt: 'Training workshop in progress',   category: 'activities'    },
  { id: '10', url: 'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?w=800&q=80', alt: 'Fresh vegetable produce',          category: 'harvest'       },
  { id: '11', url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',   alt: 'Soil preparation before planting',category: 'farmland'      },
  { id: '12', url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80', alt: 'Children learning about farming', category: 'community'     },
]

const INITIAL_UPDATES = [
  {
    id: '1',
    title: 'AFACO Expands Rice Cultivation to New Districts',
    date: '2026-08-20',
    excerpt: 'Following a successful pilot season, AFACO has extended its high-yield rice programme to three additional districts, benefiting over 400 smallholder families.',
    body: `Following a successful pilot season in Butembo and Lubero, AFACO has extended its high-yield rice cultivation programme to three additional districts: Masisi, Rutshuru, and Walikale.\n\nThe expansion is part of our five-year food security strategy and comes after pilot farms recorded an average 38 % yield increase compared to traditional methods. AFACO field agronomists have been deployed to each site to provide hands-on training in soil preparation, seed selection, and irrigation management.\n\nOver 400 smallholder families are expected to benefit directly in the first growing cycle, with additional support in post-harvest storage and market linkage. AFACO is grateful to its partners and donor organisations whose continued support makes this scale-up possible.`,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    category: 'agriculture',
  },
  {
    id: '2',
    title: 'Farmer Training Workshop Concludes in Goma',
    date: '2026-07-14',
    excerpt: 'A two-week intensive training on modern farming techniques wrapped up with 120 participants receiving certificates of completion.',
    body: `A two-week intensive training workshop on modern and sustainable farming techniques concluded successfully in Goma on 14 July 2026. The workshop was attended by 120 participants drawn from farming cooperatives across North Kivu.\n\nTopics covered included integrated pest management, composting and soil health, climate-smart agriculture, and basic financial record-keeping for farm enterprises.\n\nAll 120 participants received certificates of completion and a starter kit including improved seed varieties and basic testing equipment. AFACO plans to conduct quarterly follow-up visits to each cooperative to monitor progress and provide ongoing mentorship.`,
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    category: 'training',
  },
  {
    id: '3',
    title: 'Partnership Signed with Regional Seed Bank',
    date: '2026-06-30',
    excerpt: 'AFACO has formalised a partnership with the Great Lakes Regional Seed Bank to improve access to drought-resistant seed varieties.',
    body: `AFACO has signed a formal memorandum of understanding with the Great Lakes Regional Seed Bank (GLRSB) to improve smallholder access to high-quality, drought-resistant, and disease-tolerant seed varieties.\n\nUnder the agreement, AFACO member cooperatives will receive priority access to certified seeds at subsidised rates during each planting season. The GLRSB will also establish a satellite storage facility at AFACO's main demonstration farm.\n\nThis partnership is a significant step toward building resilient local food systems. The first seed distribution under the new agreement is scheduled for September 2026.`,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    category: 'partnerships',
  },
  {
    id: '4',
    title: 'Harvest Festival Celebrates Record Maize Output',
    date: '2026-05-10',
    excerpt: 'AFACO member cooperatives celebrated a record maize harvest this season, with total output up 45 % year on year.',
    body: `AFACO member cooperatives celebrated a landmark harvest season with total maize output reaching a record high — up 45 % compared to the same period last year.\n\nThe record output is attributed to the widespread adoption of improved seed varieties introduced through AFACO's seed subsidy scheme, combined with better irrigation infrastructure.\n\nThe surplus harvest has enabled several cooperatives to build emergency grain reserves for the first time, a key food security milestone.`,
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    category: 'agriculture',
  },
  {
    id: '5',
    title: 'Women in Agriculture Programme Launches',
    date: '2026-04-08',
    excerpt: 'A new programme dedicated to empowering women farmers with land rights support, business skills, and leadership training has been officially launched.',
    body: `AFACO officially launched its Women in Agriculture Programme on International Women's Day, April 2026. The programme addresses the structural barriers that limit women's participation in agricultural value chains.\n\nThree pillars define the programme: land rights advocacy, business and financial literacy training, and leadership development within cooperative governance structures.\n\nThe inaugural cohort consists of 80 women from five cooperatives who will receive 12 months of structured mentorship.`,
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
    category: 'community',
  },
  {
    id: '6',
    title: 'New Irrigation Infrastructure Commissioned',
    date: '2026-03-22',
    excerpt: 'A solar-powered drip irrigation network serving 250 hectares was officially commissioned, cutting water usage by 40 %.',
    body: `A solar-powered drip irrigation network serving 250 hectares across three farming zones was officially commissioned on World Water Day, 22 March 2026.\n\nThe system uses photovoltaic panels to pump water from a natural spring into a network of gravity-fed drip lines, reducing water consumption by an estimated 40 % compared to traditional flood irrigation.\n\nFarmers in the zones have already reported healthier crops and reduced labour during dry months.`,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    category: 'infrastructure',
  },
]

const INITIAL_CONTENT = {
  mission: 'To empower smallholder farmers across Central Africa with the knowledge, tools, infrastructure, and market connections they need to build sustainable livelihoods, strengthen local food systems, and contribute to long-term regional food security. We do this through hands-on training, cooperative development, climate-smart agricultural practice, and strategic partnerships with governments, NGOs, and the private sector.',
  vision: 'A Central Africa where every farming community — regardless of geography, gender, or economic status — has equitable access to quality inputs, modern techniques, fair markets, and the social infrastructure needed to thrive. We envision a region free from seasonal hunger, where agriculture is a dignified and prosperous livelihood, and where farmers are respected contributors to national economies.',
}

const INITIAL_CONTACT = {
  address: '12 Avenue Agricole, Butembo, North Kivu, Democratic Republic of Congo',
  phone: '+243 997 123 456',
  email: 'info@afaco.org',
  officeHours: 'Monday – Friday, 08:00 – 17:00 (CAT)',
  socialLinks: {
    facebook:  'https://facebook.com/afaco',
    twitter:   'https://twitter.com/afaco',
    instagram: 'https://instagram.com/afaco',
    linkedin:  'https://linkedin.com/company/afaco',
    youtube:   'https://youtube.com/@afaco',
  },
  mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=29.27%2C0.13%2C29.30%2C0.16&layer=mapnik',
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [images,  setImages]  = useState(INITIAL_IMAGES)
  const [updates, setUpdates] = useState(INITIAL_UPDATES)
  const [content, setContent] = useState(INITIAL_CONTENT)
  const [contact, setContact] = useState(INITIAL_CONTACT)

  // ── Image actions ────────────────────────────────────────────────────────────

  /**
   * Add an image.
   * TODO: replace body with → POST /api/images (multipart/form-data), update state from response
   * NOTE: real compression/resizing happens server-side; here we use a local object URL.
   */
  function addImage(image) {
    setImages((prev) => [...prev, image])
  }

  /**
   * Delete an image by id.
   * TODO: replace body with → DELETE /api/images/:id, then setImages(prev => prev.filter…)
   */
  function deleteImage(id) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  /**
   * Update an image's category or alt text.
   * TODO: replace body with → PATCH /api/images/:id, then update state from response
   */
  function updateImage(id, patch) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...patch } : img)))
  }

  /**
   * Reorder images within a category (move item at index by +1 or -1).
   * @param {string} category
   * @param {number} fromIndex  – index within the category-filtered array
   * @param {number} toIndex    – index within the category-filtered array
   * TODO: replace body with → PUT /api/images/reorder, then refresh list
   */
  function reorderImages(category, fromIndex, toIndex) {
    setImages((prev) => {
      const inCat  = prev.filter((i) => i.category === category)
      const others = prev.filter((i) => i.category !== category)
      const moved  = [...inCat]
      const [item] = moved.splice(fromIndex, 1)
      moved.splice(toIndex, 0, item)
      // Rebuild full list preserving order of other categories
      const result = []
      let catCursor = 0
      for (const img of prev) {
        if (img.category === category) {
          result.push(moved[catCursor++])
        } else {
          result.push(img)
        }
      }
      return result
    })
  }

  // ── Update actions ────────────────────────────────────────────────────────────

  /**
   * Add a new update.
   * TODO: replace body with → POST /api/updates, update state from response
   */
  function addUpdate(update) {
    setUpdates((prev) => [update, ...prev])
  }

  /**
   * Edit an existing update.
   * TODO: replace body with → PUT /api/updates/:id, update state from response
   */
  function editUpdate(id, patch) {
    setUpdates((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }

  /**
   * Delete an update by id.
   * TODO: replace body with → DELETE /api/updates/:id, then filter state
   */
  function deleteUpdate(id) {
    setUpdates((prev) => prev.filter((u) => u.id !== id))
  }

  // ── Content actions ───────────────────────────────────────────────────────────

  /**
   * Save mission/vision content.
   * TODO: replace body with → PUT /api/content, update state from response
   */
  function saveContent(patch) {
    setContent((prev) => ({ ...prev, ...patch }))
  }

  // ── Contact actions ───────────────────────────────────────────────────────────

  /**
   * Save contact info.
   * TODO: replace body with → PUT /api/contact, update state from response
   */
  function saveContact(patch) {
    setContact((prev) => ({ ...prev, ...patch }))
  }

  return (
    <DataContext.Provider
      value={{
        // State
        images, updates, content, contact,
        // Image actions
        addImage, deleteImage, updateImage, reorderImages,
        // Update actions
        addUpdate, editUpdate, deleteUpdate,
        // Content actions
        saveContent,
        // Contact actions
        saveContact,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

/** Convenience hook */
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
