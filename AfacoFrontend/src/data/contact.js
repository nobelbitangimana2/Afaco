/**
 * Mock data helpers – Contact Information
 *
 * Helpers now operate on the live object passed in from DataContext.
 * TODO (each function): replace body with fetch('/api/contact/…')
 */

/**
 * @param {Object} liveContact  – the contact object from DataContext
 * @returns {Promise<Object>}
 */
export async function getContactInfo(liveContact) {
  // TODO: return fetch('/api/contact').then(r => r.json())
  return Promise.resolve(liveContact)
}

/**
 * Submit a contact form message.
 * This function is NOT driven by DataContext (it's an outbound action).
 * TODO: replace with real fetch POST
 */
export async function submitContactForm(formData) {
  // TODO: return fetch('/api/contact/submit', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData),
  // }).then(r => r.json())
  console.log('Contact form submission (mock):', formData)
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800))
}
