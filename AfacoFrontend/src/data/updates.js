/**
 * Mock data helpers – Updates / News
 *
 * These helpers now operate on the live array passed in from DataContext,
 * so admin edits are immediately visible on public pages.
 *
 * When the backend is ready, replace each function body with a real fetch() call
 * and remove the `liveUpdates` parameter — callers will just await the fetch.
 *
 * TODO (each function): replace body with fetch('/api/updates/…')
 */

/**
 * @param {Array}  liveUpdates  – the updates array from DataContext
 * @returns {Promise<Array>}
 */
export async function getUpdates(liveUpdates) {
  // TODO: return fetch('/api/updates').then(r => r.json())
  return Promise.resolve(
    [...liveUpdates].sort((a, b) => new Date(b.date) - new Date(a.date))
  )
}

/**
 * @param {string} id
 * @param {Array}  liveUpdates
 * @returns {Promise<Object|null>}
 */
export async function getUpdateById(id, liveUpdates) {
  // TODO: return fetch(`/api/updates/${id}`).then(r => r.json())
  return Promise.resolve(liveUpdates.find((u) => u.id === id) ?? null)
}
