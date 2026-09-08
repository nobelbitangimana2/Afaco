/**
 * Mock data – Team Members
 * Replace getTeamMembers() body with a real fetch() call later.
 */

const TEAM = [
  {
    id: '1',
    name: 'Jean-Pierre Mutombo',
    role: 'Executive Director',
    bio: 'Over 20 years of experience in agricultural development and rural enterprise management across Central Africa.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    id: '2',
    name: 'Amina Ndeze',
    role: 'Head of Agronomy',
    bio: 'PhD in Crop Science with expertise in climate-smart agriculture and sustainable soil management.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    id: '3',
    name: 'Emmanuel Bahati',
    role: 'Partnerships & Funding Manager',
    bio: 'Connects AFACO with regional and international partners, donors, and government agencies.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    id: '4',
    name: 'Grace Kavira',
    role: 'Women in Agriculture Lead',
    bio: 'Dedicated to empowering women farmers through land rights advocacy and entrepreneurship programmes.',
    photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
  },
  {
    id: '5',
    name: 'Patrick Lukusa',
    role: 'Infrastructure Engineer',
    bio: 'Designs and oversees irrigation systems, storage facilities, and farm access road projects.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },
  {
    id: '6',
    name: 'Solange Maheshe',
    role: 'Community Outreach Coordinator',
    bio: 'Bridges AFACO programmes with local communities, cooperatives, and youth groups.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  },
]

/**
 * @returns {Promise<Array>}
 */
export async function getTeamMembers() {
  // TODO: replace with → return fetch('/api/team').then(r => r.json())
  return Promise.resolve(TEAM)
}
