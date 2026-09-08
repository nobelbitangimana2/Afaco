import React, { useEffect, useState } from 'react'
import Section from '../components/Section'
import Button  from '../components/Button'
import { getActivities, getActivityCategories } from '../data/activities'
import './Activities.css'

const STATUS_LABEL = { active: 'Active', upcoming: 'Upcoming', completed: 'Completed' }
const STATUS_COLOR = { active: 'green', upcoming: 'amber', completed: 'grey' }

export default function Activities() {
  const [activities,  setActivities]  = useState([])
  const [categories,  setCategories]  = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    getActivities().then(setActivities)
    getActivityCategories().then((cats) => setCategories(['All', ...cats]))
  }, [])

  const filtered =
    activeFilter === 'All'
      ? activities
      : activities.filter((a) => a.category === activeFilter)

  return (
    <div className="activities">
      {/* Hero */}
      <div className="page-hero page-hero--green">
        <div className="container page-hero__inner">
          <span className="page-hero__label">What we do</span>
          <h1 className="page-hero__title">Activities &amp; Projects</h1>
          <p className="page-hero__sub">
            From crop production and irrigation to training and market linkage —
            explore the programmes driving change on the ground.
          </p>
        </div>
      </div>

      {/* Filter + Grid */}
      <Section id="activities-list">
        {/* Category filter */}
        <div className="activities__filters" role="group" aria-label="Filter activities by category">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`activities__filter-btn${activeFilter === cat ? ' activities__filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid-3 activities__grid">
          {filtered.map((a) => (
            <article key={a.id} className="act-card">
              <div className="act-card__img-wrap">
                <img src={a.imageUrl} alt={a.title} className="act-card__img" loading="lazy" />
                <span className={`act-card__status act-card__status--${STATUS_COLOR[a.status]}`}>
                  {STATUS_LABEL[a.status] || a.status}
                </span>
              </div>
              <div className="act-card__body">
                <span className="act-card__category">{a.category}</span>
                <h3 className="act-card__title">{a.title}</h3>
                <p className="act-card__desc">{a.description}</p>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="activities__empty">No activities found for this category.</p>
        )}
      </Section>

      {/* CTA */}
      <section className="activities__cta">
        <div className="container activities__cta-inner">
          <h2>Interested in supporting our work?</h2>
          <p>Get in touch to learn how you can partner with or fund AFACO programmes.</p>
          <Button to="/contact" size="lg">Contact AFACO</Button>
        </div>
      </section>
    </div>
  )
}
