/**
 * Mock data – Contact Information
 * Replace getContactInfo() body with a real fetch() call later.
 */

const CONTACT_INFO = {
  address: '12 Avenue Agricole, Butembo, North Kivu, Democratic Republic of Congo',
  phone: '+243 997 123 456',
  email: 'info@afaco.org',
  officeHours: 'Monday – Friday, 08:00 – 17:00 (CAT)',
  socialLinks: {
    facebook: 'https://facebook.com/afaco',
    twitter: 'https://twitter.com/afaco',
    instagram: 'https://instagram.com/afaco',
    linkedin: 'https://linkedin.com/company/afaco',
    youtube: 'https://youtube.com/@afaco',
  },
  mapEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=29.27%2C0.13%2C29.30%2C0.16&layer=mapnik',
}

/**
 * @returns {Promise<Object>}
 */
export async function getContactInfo() {
  // TODO: replace with → return fetch('/api/contact').then(r => r.json())
  return Promise.resolve(CONTACT_INFO)
}

/**
 * Submit a contact form message.
 * @param {{ name: string, email: string, message: string }} formData
 * @returns {Promise<{ success: boolean }>}
 */
export async function submitContactForm(formData) {
  // TODO: replace with →
  // return fetch('/api/contact/submit', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData),
  // }).then(r => r.json())
  console.log('Contact form submission (mock):', formData)
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800))
}
