/**
 * Mock data – Activities / Projects
 * Replace getActivities() body with a real fetch() call later.
 */

const ACTIVITIES = [
  {
    id: '1',
    title: 'High-Yield Rice Programme',
    category: 'Crop Production',
    description:
      'Introducing improved rice varieties and agronomic practices to smallholder farmers across five districts, with on-site demonstration farms and follow-up mentorship.',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    status: 'active',
  },
  {
    id: '2',
    title: 'Solar-Powered Drip Irrigation',
    category: 'Infrastructure',
    description:
      'Installation of solar-powered drip irrigation networks across 250 hectares of farmland, reducing water usage by 40 % and eliminating reliance on fuel pumps.',
    imageUrl: 'https://images.unsplash.com/photo-1561543818-e3b20f6d7011?w=800&q=80',
    status: 'active',
  },
  {
    id: '3',
    title: 'Farmer Training Workshops',
    category: 'Training & Capacity',
    description:
      'Quarterly intensive workshops on modern farming techniques including IPM, composting, climate-smart agriculture, and farm financial management.',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    status: 'active',
  },
  {
    id: '4',
    title: 'Women in Agriculture Programme',
    category: 'Community & Gender',
    description:
      'Empowering women farmers through land rights advocacy, business literacy training, and leadership development within cooperative governance.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
    status: 'active',
  },
  {
    id: '5',
    title: 'Community Grain Reserve Initiative',
    category: 'Food Security',
    description:
      'Supporting cooperatives in building and managing emergency grain reserves to protect communities against seasonal hunger and price shocks.',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    status: 'active',
  },
  {
    id: '6',
    title: 'Seed Subsidy Scheme',
    category: 'Crop Production',
    description:
      'Partnering with the Great Lakes Regional Seed Bank to provide certified, drought-resistant seeds to member cooperatives at subsidised rates each planting season.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    status: 'active',
  },
  {
    id: '7',
    title: 'Youth in Agribusiness',
    category: 'Training & Capacity',
    description:
      'Engaging young people in modern agribusiness through apprenticeships, startup incubation support, and links to microfinance opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80',
    status: 'upcoming',
  },
  {
    id: '8',
    title: 'Market Access & Value Chain Development',
    category: 'Market Linkage',
    description:
      'Connecting smallholder farmers directly to urban markets, processors, and exporters to reduce middlemen costs and increase farm-gate prices.',
    imageUrl: 'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?w=800&q=80',
    status: 'upcoming',
  },
]

/**
 * @returns {Promise<Array>}
 */
export async function getActivities() {
  // TODO: replace with → return fetch('/api/activities').then(r => r.json())
  return Promise.resolve(ACTIVITIES)
}

/**
 * Get distinct category labels.
 * @returns {Promise<string[]>}
 */
export async function getActivityCategories() {
  // TODO: replace with → return fetch('/api/activities/categories').then(r => r.json())
  const cats = [...new Set(ACTIVITIES.map((a) => a.category))]
  return Promise.resolve(cats)
}
