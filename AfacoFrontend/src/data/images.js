/**
 * Mock data – Gallery Images
 * Shape mirrors a MongoDB document.
 * Replace getImages() body with a real fetch() call later.
 */

const IMAGES = [
  { id: '1',  url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', alt: 'Green farmland at sunrise',          category: 'farmland' },
  { id: '2',  url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', alt: 'Farmer in the field',                 category: 'farmers' },
  { id: '3',  url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80', alt: 'Seed planting activity',              category: 'activities' },
  { id: '4',  url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', alt: 'Maize crop harvest',                  category: 'harvest' },
  { id: '5',  url: 'https://images.unsplash.com/photo-1561543818-e3b20f6d7011?w=800&q=80', alt: 'Irrigation channel on farmland',       category: 'infrastructure' },
  { id: '6',  url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80', alt: 'Women farmers at work',              category: 'farmers' },
  { id: '7',  url: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80', alt: 'Community meeting under trees',      category: 'community' },
  { id: '8',  url: 'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&q=80', alt: 'Aerial view of crop fields',          category: 'farmland' },
  { id: '9',  url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80', alt: 'Training workshop in progress',       category: 'activities' },
  { id: '10', url: 'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?w=800&q=80', alt: 'Fresh vegetable produce',            category: 'harvest' },
  { id: '11', url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80', alt: 'Soil preparation before planting',    category: 'farmland' },
  { id: '12', url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80', alt: 'Children learning about farming',    category: 'community' },
]

/**
 * Get all gallery images.
 * @param {string} [category] - optional filter
 * @returns {Promise<Array>}
 */
export async function getImages(category) {
  // TODO: replace with → return fetch(`/api/images${category ? `?category=${category}` : ''}`).then(r => r.json())
  const results = category ? IMAGES.filter((img) => img.category === category) : IMAGES
  return Promise.resolve(results)
}

/**
 * Get distinct category names for gallery filters.
 * @returns {Promise<string[]>}
 */
export async function getImageCategories() {
  // TODO: replace with → return fetch('/api/images/categories').then(r => r.json())
  const cats = [...new Set(IMAGES.map((img) => img.category))]
  return Promise.resolve(cats)
}
