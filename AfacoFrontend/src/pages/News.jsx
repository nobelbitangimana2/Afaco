import React, { useEffect, useState } from 'react'
import Section    from '../components/Section'
import UpdateCard from '../components/UpdateCard'
import { useData } from '../store/DataContext'
import { getUpdates } from '../data/updates'
import './News.css'

const CATEGORIES = ['All', 'agriculture', 'training', 'partnerships', 'community', 'infrastructure']

export default function News() {
  const { updates: liveUpdates } = useData()
  const [updates, setUpdates] = useState([])
  const [filter,  setFilter]  = useState('All')

  useEffect(() => {
    getUpdates(liveUpdates).then(setUpdates)
  }, [liveUpdates])

  const displayed =
    filter === 'All' ? updates : updates.filter((u) => u.category === filter)

  return (
    <div className="news-page">
      {/* Hero */}
      <div className="page-hero page-hero--green">
        <div className="container page-hero__inner">
          <span className="page-hero__label">News &amp; Updates</span>
          <h1 className="page-hero__title">Latest from AFACO</h1>
          <p className="page-hero__sub">
            Stay up to date with programme news, impact stories, and announcements
            from our teams in the field.
          </p>
        </div>
      </div>

      <Section id="news-list">
        {/* Filter */}
        <div className="news__filters" role="group" aria-label="Filter news by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`news__filter-btn${filter === cat ? ' news__filter-btn--active' : ''}`}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid-3" aria-live="polite">
          {displayed.map((u) => (
            <UpdateCard key={u.id} {...u} />
          ))}
        </div>

        {displayed.length === 0 && (
          <p className="news__empty">No updates found for this category.</p>
        )}
      </Section>
    </div>
  )
}
