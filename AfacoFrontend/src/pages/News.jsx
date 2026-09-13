import React, { useState } from 'react'
import UpdateCard from '../components/UpdateCard'
import { useData } from '../store/DataContext'
import './News.css'

const CATS = ['All','agriculture','training','partnerships','community','infrastructure']

export default function News() {
  const { updates } = useData()
  const [filter, setFilter] = useState('All')

  const sorted    = [...updates].sort((a,b) => new Date(b.date) - new Date(a.date))
  const displayed = filter === 'All' ? sorted : sorted.filter(u => u.category === filter)

  return (
    <div className="news-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">News &amp; Updates</span>
          <h1 className="page-hero__title">Latest from AFACO</h1>
          <p className="page-hero__sub">
            Programme news, impact stories, and field updates from our teams across Central Africa.
          </p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container">
          <div className="news__filters" role="group" aria-label="Filter by category">
            {CATS.map(cat => (
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

          {updates.length === 0 ? (
            <p className="news__loading">Loading updates…</p>
          ) : (
            <div className="grid-3" aria-live="polite">
              {displayed.map(u => <UpdateCard key={u.id} {...u} />)}
            </div>
          )}

          {updates.length > 0 && displayed.length === 0 && (
            <p className="news__empty">No updates in this category.</p>
          )}
        </div>
      </section>

    </div>
  )
}
