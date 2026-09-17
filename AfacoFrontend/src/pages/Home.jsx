import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button     from '../components/Button'
import UpdateCard from '../components/UpdateCard'
import { useData } from '../store/DataContext'
import './Home.css'

/* ── Hero slides ── */
const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80', alt: 'AFACO rice fields at sunrise' },
  { url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80', alt: 'Farmer working in the field' },
  { url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80', alt: 'Maize harvest season' },
]

/* ── Feature cards ── */
const FEATURES = [
  {
    icon: '🌾',
    color: '#5d3a29',
    panel: '#f1e3d7',
    title: 'Rice Production',
    desc:  'We cultivate high-yield White and Parboiled Rice across North Kivu, using improved seed varieties and climate-smart techniques to maximise output every season.',
    link:  '/products',
    label: 'Our products',
  },
  {
    icon: '👨‍🌾',
    color: '#6f4c39',
    panel: '#f4e8dc',
    title: 'Farmer Training',
    desc:  'AFACO runs quarterly workshops on soil health, irrigation, crop rotation, and cooperative management — equipping farmers with tools to grow their businesses.',
    link:  '/activities',
    label: 'Our activities',
  },
  {
    icon: '📦',
    color: '#7c4d31',
    panel: '#ead8c4',
    title: 'Packaging & Distribution',
    desc:  'From 1 kg household bags to 100 kg institutional sacks, our produce reaches local markets, traders, and institutions across the region.',
    link:  '/products',
    label: 'View sizes',
  },
]

/* ── Commitment values ── */
const VALUES = [
  { icon: '🌱', title: 'Sustainable Farming',  desc: 'Practices that protect land and water for the next generation.' },
  { icon: '🤝', title: 'Farmer Support',        desc: 'Training, inputs, and market links that put farmers first.' },
  { icon: '✅', title: 'Quality Assurance',     desc: 'Every batch is checked before it leaves our cooperative farms.' },
  { icon: '⚖️', title: 'Fair Value Chains',    desc: 'We cut out middlemen so farmers earn more for their harvest.' },
]

/* ── Stats ── */
const STATS = [
  { value: '2,400+', label: 'Hectares farmed'   },
  { value: '1,800+', label: 'Farmers supported' },
  { value: '14',     label: 'Active projects'   },
  { value: '8',      label: 'Districts reached' },
]

export default function Home() {
  const { updates, content } = useData()
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5500)
    return () => clearInterval(id)
  }, [])

  const latest = [...updates]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  return (
    <div className="home">

      {/* ══ HERO ══ */}
      <section className="hero" aria-label="Hero">
        {/* Background slides */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`hero__bg${i === slide ? ' hero__bg--active' : ''}`}
            style={{ backgroundImage: `url(${s.url})` }}
            aria-hidden={i !== slide}
          />
        ))}
        <div className="hero__overlay" aria-hidden="true" />

        <div className="hero__content container">
          <p className="hero__eyebrow">Agricultural &amp; Farming Community Organisation</p>
          <h1 className="hero__title">
            Growing Rice,<br />
            Feeding Communities,<br />
            Empowering Farmers
          </h1>
          <p className="hero__sub">
            AFACO cultivates high-quality rice and supports 1,800+ smallholder farmers across Central Africa
            with training, infrastructure, and direct market access.
          </p>
          <div className="hero__actions">
            <Button to="/products" size="lg">Our Products</Button>
            <Button to="/about" size="lg" variant="outline-white">About AFACO</Button>
          </div>
        </div>

        {/* Slide dots */}
        <div className="hero__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero__dot${i === slide ? ' hero__dot--active' : ''}`}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══ FEATURE CARDS ══ */}
      <section className="features section--white" aria-label="What we do">
        <div className="container">
          <div className="features__grid">
            {FEATURES.map(({ icon, color, panel, title, desc, link, label }) => (
              <div key={title} className="feat-card" style={{ background: panel }}>
                <div className="feat-card__icon" style={{ background: color }}>
                  <span aria-hidden="true">{icon}</span>
                </div>
                <h3 className="feat-card__title">{title}</h3>
                <p className="feat-card__desc">{desc}</p>
                <Link to={link} className="feat-card__link" style={{ color: color }}>
                  {label} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="stats-bar" aria-label="Key statistics">
        <div className="container stats-bar__grid">
          {STATS.map(({ value, label }) => (
            <div key={label} className="stats-bar__item">
              <span className="stats-bar__value">{value}</span>
              <span className="stats-bar__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ COMMITMENT ══ */}
      <section className="commitment section--cream" aria-label="Our commitment">
        <div className="container">
          <div className="commitment__top">
            <div className="commitment__text">
              <span className="section__label">Our Commitment</span>
              <h2 className="section__title">Built on trust,<br />grown with purpose</h2>
              <p className="commitment__intro">
                Every decision AFACO makes starts with the farmer. We hold ourselves to four
                principles that guide everything from seed selection to market partnerships.
              </p>
              <Button to="/about" variant="outline">Learn our story</Button>
            </div>
            <div className="commitment__photo-wrap">
              <img
                src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=900&q=80"
                alt="Women farmers working in the field"
                className="commitment__photo"
                loading="lazy"
              />
            </div>
          </div>

          <div className="commitment__values">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="val-item">
                <span className="val-item__icon" aria-hidden="true">{icon}</span>
                <div>
                  <p className="val-item__title">{title}</p>
                  <p className="val-item__desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LATEST UPDATES ══ */}
      <section className="updates-section section--green" aria-label="Latest updates">
        <div className="container">
          <div className="updates-section__header">
            <div>
              <span className="section__label">News &amp; Updates</span>
              <h2 className="section__title">From the field</h2>
            </div>
            <Button to="/news" variant="outline-white" size="sm">View all news</Button>
          </div>
          <div className="grid-3">
            {latest.length === 0
              ? <p className="updates-section__empty">Loading updates…</p>
              : latest.map(u => <UpdateCard key={u.id} {...u} dark />)
            }
          </div>
        </div>
      </section>

      {/* ══ PRODUCT BANNER ══ */}
      <section className="prod-banner" aria-label="Products banner">
        <div className="prod-banner__photo">
          <img
            src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=80"
            alt="Sacks of AFACO rice ready for distribution"
            loading="lazy"
          />
        </div>
        <div className="prod-banner__text">
          <span className="section__label" style={{ color: 'var(--green-light)' }}>
            Fresh from our farms
          </span>
          <h2 className="prod-banner__title">
            From our fields<br />to your table
          </h2>
          <p className="prod-banner__sub">
            White Rice and Parboiled Rice — available in 1 kg, 5 kg, 10 kg, 25 kg, 50 kg,
            and 100 kg packaging for households, traders, and institutions.
          </p>
          <div className="prod-banner__actions">
            <Button to="/products" size="lg">Browse Products</Button>
            <Button to="/contact" variant="outline-white" size="lg">Request a Quote</Button>
          </div>
        </div>
      </section>

    </div>
  )
}
