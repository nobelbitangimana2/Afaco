import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useData } from '../store/DataContext'
import { getUpdateById, getUpdates } from '../data/updates'
import './UpdateDetail.css'

export default function UpdateDetail() {
  const { id }           = useParams()
  const navigate         = useNavigate()
  const { updates: liveUpdates } = useData()
  const [update, setUpdate]   = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getUpdateById(id, liveUpdates).then((data) => {
      if (!data) { navigate('/news', { replace: true }); return }
      setUpdate(data)
      setLoading(false)
    })
    getUpdates(liveUpdates).then((all) =>
      setRelated(all.filter((u) => u.id !== id).slice(0, 3))
    )
  }, [id, navigate, liveUpdates])

  if (loading) return <div className="ud__loading container">Loading…</div>
  if (!update)  return null

  const formatted = new Date(update.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="ud">
      {/* Hero image */}
      <div className="ud__hero">
        <img src={update.imageUrl} alt={update.title} className="ud__hero-img" />
        <div className="ud__hero-overlay" aria-hidden="true" />
        <div className="ud__hero-content container">
          {update.category && (
            <span className="ud__category">{update.category}</span>
          )}
          <h1 className="ud__title">{update.title}</h1>
          <time className="ud__date" dateTime={update.date}>{formatted}</time>
        </div>
      </div>

      {/* Article body */}
      <div className="container ud__body-wrap">
        <div className="ud__body">
          {/* Back link */}
          <nav aria-label="Breadcrumb" className="ud__breadcrumb">
            <Link to="/news">← Back to News</Link>
          </nav>

          {/* Body text */}
          <div className="ud__text">
            {update.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Share / back */}
          <div className="ud__actions">
            <Button to="/news" variant="outline">← All News</Button>
            <Button to="/contact">Get Involved</Button>
          </div>
        </div>

        {/* Related updates sidebar */}
        {related.length > 0 && (
          <aside className="ud__related" aria-label="Related updates">
            <h2 className="ud__related-heading">More Updates</h2>
            <div className="ud__related-list">
              {related.map((r) => {
                const relDate = new Date(r.date).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })
                return (
                  <Link key={r.id} to={`/news/${r.id}`} className="ud__related-card">
                    <img src={r.imageUrl} alt={r.title} className="ud__related-img" loading="lazy" />
                    <div className="ud__related-info">
                      <time className="ud__related-date">{relDate}</time>
                      <p className="ud__related-title">{r.title}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
