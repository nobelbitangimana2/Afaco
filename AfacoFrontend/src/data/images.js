/**
 * Mock data helpers – Gallery Images
 *
 * Helpers now operate on the live array passed in from DataContext.
 * TODO (each function): replace body with fetch('/api/images/…')
 */

/**
 * @param {Array}   liveImages
 * @param {string}  [category]
 * @returns {Promise<Array>}
 */
export async function getImages(liveImages, category) {
  // TODO: return fetch(`/api/images${category ? `?category=${category}` : ''}`).then(r => r.json())
  const results = category
    ? liveImages.filter((img) => img.category === category)
    : liveImages
  return Promise.resolve(results)
}

/**
 * @param {Array} liveImages
 * @returns {Promise<string[]>}
 */
export async function getImageCategories(liveImages) {
  // TODO: return fetch('/api/images/categories').then(r => r.json())
  const cats = [...new Set(liveImages.map((img) => img.category))]
  return Promise.resolve(cats)
}
