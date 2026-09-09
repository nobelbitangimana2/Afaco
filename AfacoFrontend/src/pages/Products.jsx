import React from 'react'
import { Link } from 'react-router-dom'
import Section from '../components/Section'
import Button  from '../components/Button'
import { useData } from '../store/DataContext'
import './Products.css'

export default function Products() {
  const { products } = useData()

  return (
    <div className="products-page">
      {/* Hero */}
      <div className="page-hero page-hero--green">
        <div className="container page-hero__inner">
          <span className="page-hero__label">What we produce</span>
          <h1 className="page-hero__title">Our Products</h1>
          <p className="page-hero__sub">
            Quality agricultural produce grown and processed by AFACO member
            cooperatives. Available in multiple packaging sizes for households,
            traders, and institutions.
          </p>
        </div>
      </div>

      <Section id="products-list">
        {products.length === 0 ? (
          <p className="products__loading">Loading products…</p>
        ) : (
          <div className="products__grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="products__cta">
          <h2 className="products__cta-title">Looking to place a bulk order?</h2>
          <p className="products__cta-sub">
            Contact us for wholesale pricing, custom packaging, and delivery arrangements.
          </p>
          <Button to="/contact" size="lg">Get in Touch</Button>
        </div>
      </Section>
    </div>
  )
}

function ProductCard({ product }) {
  const { name, description, imageUrl, sizes = [] } = product

  return (
    <article className="prod-card">
      {/* Photo */}
      <div className="prod-card__img-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="prod-card__img" loading="lazy" />
        ) : (
          <div className="prod-card__img-placeholder" aria-hidden="true">🌾</div>
        )}
      </div>

      {/* Info */}
      <div className="prod-card__body">
        <h3 className="prod-card__name">{name}</h3>
        {description && <p className="prod-card__desc">{description}</p>}

        {/* Sizes table */}
        {sizes.length > 0 && (
          <div className="prod-card__sizes">
            <p className="prod-card__sizes-label">Available sizes &amp; pricing</p>
            <table className="prod-card__sizes-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map(({ size, price }) => (
                  <tr key={size}>
                    <td>
                      <span className="prod-card__size-badge">{size}</span>
                    </td>
                    <td className="prod-card__price">
                      {price && price > 0
                        ? `$${Number(price).toLocaleString()}`
                        : <span className="prod-card__price--contact">Contact us for pricing</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/contact" className="prod-card__enquire">
          Enquire about this product →
        </Link>
      </div>
    </article>
  )
}
