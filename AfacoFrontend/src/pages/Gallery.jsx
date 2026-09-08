import React, { useState, useMemo } from 'react'
import Section   from '../components/Section'
import ImageGrid from '../components/ImageGrid'
import { useData } from '../store/DataContext'
import './Gallery.css'

export default function Gallery() {
  const { images } = useData()
  const [active, setActive] = useState('All')

  const categories = useMemo(
    () => ['All', ...[...new Set(images.map((i) => i.category))]],
    [images]
  )

  const displayed = active === 'All' ? images : images.filter((i) => i.category === active)

  return (
    <div className="gallery-page">
      <div className="page-hero page-hero--green">
        <div className="container page-hero__inner">
          <span className="page-hero__label">Photo Gallery</span>
          <h1 className="page-hero__title">Life on the Farm</h1>
          <p className="page-hero__sub">
            A visual record of AFACO's activities, communities, and landscapes across Central Africa.
            Click any photo to view it full size.
          </p>
        </div>
      </div>

      <Section id="gallery">
        <div className="gallery__tabs" role="tablist" aria-label="Filter photos by category">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={active === cat}
              className={`gallery__tab${active === cat ? ' gallery__tab--active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <p className="gallery__count" aria-live="polite">
          {displayed.length} {displayed.length === 1 ? 'photo' : 'photos'}
          {active !== 'All' ? ` · ${active}` : ''}
        </p>

        {images.length === 0 ? (
          <p className="gallery__loading">Loading gallery…</p>
        ) : (
          <ImageGrid images={displayed} columns={4} />
        )}

        {images.length > 0 && displayed.length === 0 && (
          <p className="gallery__empty">No photos in this category yet.</p>
        )}
      </Section>
    </div>
  )
}
