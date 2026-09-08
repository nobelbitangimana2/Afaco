/**
 * Mock data – Updates / News
 * Shape mirrors a MongoDB document.
 * Replace getUpdates() and getUpdateById() bodies with real fetch() calls later.
 */

const UPDATES = [
  {
    id: '1',
    title: 'AFACO Expands Rice Cultivation to New Districts',
    date: '2026-08-20',
    excerpt:
      'Following a successful pilot season, AFACO has extended its high-yield rice programme to three additional districts, benefiting over 400 smallholder families.',
    body: `Following a successful pilot season in Butembo and Lubero, AFACO has extended its high-yield rice cultivation programme to three additional districts: Masisi, Rutshuru, and Walikale.

The expansion is part of our five-year food security strategy and comes after pilot farms recorded an average 38 % yield increase compared to traditional methods. AFACO field agronomists have been deployed to each site to provide hands-on training in soil preparation, seed selection, and irrigation management.

Over 400 smallholder families are expected to benefit directly in the first growing cycle, with additional support in post-harvest storage and market linkage. AFACO is grateful to its partners and donor organisations whose continued support makes this scale-up possible.`,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    category: 'agriculture',
  },
  {
    id: '2',
    title: 'Farmer Training Workshop Concludes in Goma',
    date: '2026-07-14',
    excerpt:
      'A two-week intensive training on modern farming techniques wrapped up with 120 participants receiving certificates of completion.',
    body: `A two-week intensive training workshop on modern and sustainable farming techniques concluded successfully in Goma on 14 July 2026. The workshop was attended by 120 participants drawn from farming cooperatives across North Kivu.

Topics covered included integrated pest management, composting and soil health, climate-smart agriculture, and basic financial record-keeping for farm enterprises. Facilitators from the AFACO agronomy team were joined by guest instructors from regional agricultural universities.

All 120 participants received certificates of completion and a starter kit including improved seed varieties and basic testing equipment. AFACO plans to conduct quarterly follow-up visits to each cooperative to monitor progress and provide ongoing mentorship.`,
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    category: 'training',
  },
  {
    id: '3',
    title: 'Partnership Signed with Regional Seed Bank',
    date: '2026-06-30',
    excerpt:
      'AFACO has formalised a partnership with the Great Lakes Regional Seed Bank to improve access to drought-resistant seed varieties.',
    body: `AFACO has signed a formal memorandum of understanding with the Great Lakes Regional Seed Bank (GLRSB) to improve smallholder access to high-quality, drought-resistant, and disease-tolerant seed varieties.

Under the agreement, AFACO member cooperatives will receive priority access to certified seeds at subsidised rates during each planting season. The GLRSB will also establish a satellite storage facility at AFACO's main demonstration farm, reducing logistics costs for rural farmers.

This partnership is a significant step toward building resilient local food systems that can withstand increasingly unpredictable weather patterns in the region. The first seed distribution under the new agreement is scheduled for September 2026.`,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    category: 'partnerships',
  },
  {
    id: '4',
    title: 'Harvest Festival Celebrates Record Maize Output',
    date: '2026-05-10',
    excerpt:
      'AFACO member cooperatives celebrated a record maize harvest this season, with total output up 45 % year on year.',
    body: `AFACO member cooperatives celebrated a landmark harvest season with total maize output reaching a record high — up 45 % compared to the same period last year. The achievement was marked with a community harvest festival attended by farmers, local officials, and AFACO staff.

The record output is attributed to the widespread adoption of improved seed varieties introduced through AFACO's seed subsidy scheme, combined with better irrigation infrastructure developed over the past two growing seasons. Farmers also credited the training workshops on spacing, fertiliser use, and crop rotation.

The surplus harvest has enabled several cooperatives to build emergency grain reserves for the first time, a key food security milestone for communities that have historically faced seasonal hunger.`,
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    category: 'agriculture',
  },
  {
    id: '5',
    title: 'Women in Agriculture Programme Launches',
    date: '2026-04-08',
    excerpt:
      'A new programme dedicated to empowering women farmers with land rights support, business skills, and leadership training has been officially launched.',
    body: `AFACO officially launched its Women in Agriculture Programme on International Women's Day, April 2026. The programme addresses the structural barriers that limit women's participation in and benefit from agricultural value chains in the region.

Three pillars define the programme: land rights advocacy (working with local authorities to formalise land access for women-headed households), business and financial literacy training, and leadership development within cooperative governance structures.

The inaugural cohort consists of 80 women from five cooperatives. Participants will receive 12 months of structured mentorship alongside their farming activities. AFACO is partnering with a regional legal aid organisation to support land titling efforts.`,
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
    category: 'community',
  },
  {
    id: '6',
    title: 'New Irrigation Infrastructure Commissioned',
    date: '2026-03-22',
    excerpt:
      'A solar-powered drip irrigation network serving 250 hectares was officially commissioned, cutting water usage by 40 %.',
    body: `A solar-powered drip irrigation network serving 250 hectares across three farming zones was officially commissioned on World Water Day, 22 March 2026. The infrastructure project, funded through a multilateral development grant, took 14 months to complete.

The system uses photovoltaic panels to pump water from a natural spring into a network of gravity-fed drip lines, eliminating the need for fuel-powered pumps and reducing water consumption by an estimated 40 % compared to traditional flood irrigation.

Farmers in the zones have already reported healthier crops and reduced labour during dry months. AFACO's technical team will manage ongoing maintenance and train community technicians to handle routine upkeep, ensuring long-term sustainability of the investment.`,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    category: 'infrastructure',
  },
]

/**
 * Get all updates, sorted newest first.
 * @returns {Promise<Array>}
 */
export async function getUpdates() {
  // TODO: replace with → return fetch('/api/updates').then(r => r.json())
  return Promise.resolve([...UPDATES].sort((a, b) => new Date(b.date) - new Date(a.date)))
}

/**
 * Get a single update by id.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getUpdateById(id) {
  // TODO: replace with → return fetch(`/api/updates/${id}`).then(r => r.json())
  return Promise.resolve(UPDATES.find((u) => u.id === id) ?? null)
}
