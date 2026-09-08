import React from 'react'
import { Link } from 'react-router-dom'
import './UpdateCard.css'

/**
 * Card specifically for news/update items.
 * Props match the update data shape: { id, title, date, excerpt, imageUrl, category }
 */
export default function UpdateCard({ id, title, date, excerpt, imageUrl, category }) {
  const formatted = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="update-card">
      <Link to={`/news/${id}`} className="update-card__img-link" tabIndex="-1" aria-hidden="true">
        <div className="update-card__img-wrap">
          <img src={imageUrl} alt={title} className="update-card__img" loading="lazy" />
          {category && <span className="update-card__badge">{category}</span>}
        </div>
      </Link>

      <div className="update-card__body">
        <time className="update-card__date" dateTime={date}>{formatted}</time>
        <h3 className="update-card__title">
          <Link to={`/news/${id}`} className="update-card__title-link">{title}</Link>
        </h3>
        <p className="update-card__excerpt">{excerpt}</p>
        <Link to={`/news/${id}`} className="update-card__more" aria-label={`Read more: ${title}`}>
          Read more →
        </Link>
      </div>
    </article>
  )
}
