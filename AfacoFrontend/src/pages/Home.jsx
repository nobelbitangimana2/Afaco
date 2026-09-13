import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button     from '../components/Button'
import UpdateCard from '../components/UpdateCard'
import { useData } from '../store/DataContext'
import './Home.css'

const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80', alt: 'AFACO rice fields at sunrise' },
  { url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80', alt: 'Farmer working the fields' },
  { url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80', alt: 'Harvest season' },
]

const SUSTAINABILITY = [
  { icon: '💧', label: 'Water Management', desc: 'Solar-powered drip irrigation cuts water use by 40%.' },
  { icon: '🌿', label: 'Organic Farming',  desc: 'Composting and crop rotation keep our soils fertile.' },
  { icon: '👨‍🌾', label: 'Farmer Support',  desc: 'Quarterly training for 1,800+ cooperative members.' },
]

export default function Home() {
  const { updates, content, products } = useData()
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5500)
    return () => clearInterval(id)
  }, [])

  const latest        = [...updates].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,3)
  const featProducts  = products.slice(0, 2)

  return (
    <div className="home">

      {/* ══ HERO ══ */}
      <section className="h-hero" aria-label="Hero">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`h-hero__bg${i === slide ? ' h-hero__bg--active' : ''}`}
            style={{ backgroundImage: `url(${s.url})` }}
            aria-hidden={i !== slide}
          />
        ))}
        <div className="h-hero__overlay" />

        <div className="h-hero__content container">
          <p className="h-hero__eyebrow">Agricultural &amp; Farming Community Organisation</p>
          <h1 className="h-hero__title">
            <span className="h-hero__title--white">Nurturing</span><br />
            <span className="h-hero__title--gold">AFACO's Harvest</span>
          </h1>
          <p className="h-hero__sub">
            We grow premium rice and support 1,800+ smallholder farmers across Central Africa
            through training, irrigation, and direct market access.
          </p>
          <Button to="/products" size="lg">Explore our products</Button>
        </div>

        <div className="h-hero__dots">
          {SLIDES.map((_,i) => (
            <button
              key={i}
              className={`h-hero__dot${i===slide?' h-hero__dot--active':''}`}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i+1}`}
            />
          ))}
        </div>
      </section>

      {/* ══ ABOUT STRIP ══ */}
      <section className="h-about section--panel">
        <div className="container h-about__inner">
          <div className="h-about__photo-wrap">
            <img
              src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=900&q=80"
              alt="AFACO farmers"
              className="h-about__photo"
              loading="lazy"
            />
          </div>
          <div className="h-about__text">
            <span className="section__label">About AFACO</span>
            <h2 className="h-about__title">Growing food.<br />Empowering lives.</h2>
            <span className="gold-line gold-line--left" />
            <p>{content.mission || 'Loading…'}</p>
            <p>{content.vision  || ''}</p>
            <Button to="/about" variant="outline" className="h-about__btn">
              Our story
            </Button>
          </div>
        </div>
      </section>

      {/* ══ OUR PRODUCTS ══ */}
      <section className="h-products section--base" aria-label="Our products">
        <div className="container">
          <div className="section__header">
            <span className="section__label">From our farms</span>
            <h2 className="section__title">Our Products</h2>
            <span className="gold-line" />
          </div>

          {featProducts.length === 0 ? (
            <p style={{ textAlign:'center', color:'var(--text-muted)' }}>Loading products…</p>
          ) : (
            <div className="h-products__grid">
              {featProducts.map(p => <ProductFeatureCard key={p.id} product={p} />)}
            </div>
          )}

          <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
            <Button to="/products" variant="outline">View all products</Button>
          </div>
        </div>
      </section>

      {/* ══ SUSTAINABILITY ══ */}
      <section className="h-sustain section--panel" aria-label="Sustainability">
        <div className="container h-sustain__inner">
          <div className="h-sustain__photo-wrap">
            <img
              src="https://images.unsplash.com/photo-1561543818-e3b20f6d7011?w=900&q=80"
              alt="Irrigation system on AFACO farmland"
              className="h-sustain__photo"
              loading="lazy"
            />
          </div>
          <div className="h-sustain__text">
            <span className="section__label">Our Commitment</span>
            <h2 className="h-sustain__title">Built on sustainable<br />farming principles</h2>
            <span className="gold-line gold-line--left" />
            <p className="h-sustain__body">
              From solar-powered irrigation to composting programmes, AFACO embeds
              sustainable practices at every step of our agricultural operations.
            </p>
          </div>
        </div>

        {/* Circular icon badges */}
        <div className="container h-sustain__badges">
          {SUSTAINABILITY.map(({ icon, label, desc }) => (
            <div key={label} className="h-sustain__badge">
              <div className="h-sustain__badge-icon" aria-hidden="true">{icon}</div>
              <p className="h-sustain__badge-label">{label}</p>
              <p className="h-sustain__badge-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ LATEST UPDATES ══ */}
      <section className="h-news section--base" aria-label="Latest news">
        <div className="container">
          <div className="h-news__header">
            <div>
              <span className="section__label">News &amp; Updates</span>
              <h2 className="section__title">From the field</h2>
            </div>
            <Button to="/news" variant="outline" size="sm">All news</Button>
          </div>
          <div className="grid-3">
            {latest.length === 0
              ? <p style={{color:'var(--text-muted)',gridColumn:'1/-1',textAlign:'center',padding:'2rem 0'}}>Loading updates…</p>
              : latest.map(u => <UpdateCard key={u.id} {...u} dark />)
            }
          </div>
        </div>
      </section>

      {/* ══ ACTIVITIES BANNER ══ */}
      <section className="h-banner section--panel" aria-label="Activities">
        <div className="h-banner__photo">
          <img
            src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=80"
            alt="Rice packaging at AFACO"
            loading="lazy"
          />
        </div>
        <div className="h-banner__text">
          <span className="section__label">From our fields to your table</span>
          <h2 className="h-banner__title">
            Premium rice.<br />
            <span style={{ color:'var(--gold)' }}>Fair prices.</span>
          </h2>
          <p className="h-banner__sub">
            White Rice and Parboiled Rice available in 1 kg – 100 kg packaging for
            households, traders, and institutions across the region.
          </p>
          <div className="h-banner__actions">
            <Button to="/products" size="lg">Browse Products</Button>
            <Button to="/contact" variant="outline" size="lg">Request a Quote</Button>
          </div>
        </div>
      </section>

    </div>
  )
}

/* ── Product feature card ── */
function ProductFeatureCard({ product }) {
  const { name, description, imageUrl, sizes = [] } = product
  const displaySizes = sizes.map(s => s.size)

  return (
    <article className="h-prod-card">
      <div className="h-prod-card__photo-wrap">
        {imageUrl
          ? <img src={imageUrl} alt={name} className="h-prod-card__photo" loading="lazy" />
          : <div className="h-prod-card__photo-placeholder" aria-hidden="true">🌾</div>
        }
      </div>
      <div className="h-prod-card__body">
        <h3 className="h-prod-card__name">{name}</h3>
        <span className="h-prod-card__underline" />
        {description && <p className="h-prod-card__desc">{description}</p>}
        {displaySizes.length > 0 && (
          <div className="h-prod-card__sizes">
            {displaySizes.map(s => (
              <span key={s} className="h-prod-card__size">{s}</span>
            ))}
          </div>
        )}
        <Link to="/products" className="h-prod-card__link">
          View details →
        </Link>
      </div>
    </article>
  )
}
