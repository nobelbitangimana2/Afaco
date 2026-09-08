import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Slideshow  from '../components/Slideshow'
import Section    from '../components/Section'
import UpdateCard from '../components/UpdateCard'
import ImageGrid  from '../components/ImageGrid'
import Button     from '../components/Button'
import { getUpdates } from '../data/updates'
import { getImages  } from '../data/images'
import './Home.css'

const HERO_SLIDES = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80',
    imageAlt: 'Green farmland at sunrise',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=80',
    imageAlt: 'Farmer working in the field',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=80',
    imageAlt: 'Maize crop harvest season',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1400&q=80',
    imageAlt: 'Women farmers at work',
  },
]

const STATS = [
  { value: '2,400+', label: 'Hectares farmed'     },
  { value: '1,800+', label: 'Farmers supported'   },
  { value: '14',     label: 'Active projects'      },
  { value: '8',      label: 'Districts reached'    },
]

export default function Home() {
  const [updates, setUpdates] = useState([])
  const [images,  setImages]  = useState([])

  useEffect(() => {
    getUpdates().then((data) => setUpdates(data.slice(0, 3)))
    getImages().then((data)  => setImages(data.slice(0, 8)))
  }, [])

  return (
    <div className="home">
      {/* ── Hero ── */}
      <div className="home__hero" aria-label="Hero section">
        <Slideshow slides={HERO_SLIDES} interval={5500}>
          <div className="home__hero-content">
            <span className="home__hero-eyebrow">Agricultural &amp; Farming Community Organisation</span>
            <h1 className="home__hero-title">
              Empowering Farmers,<br />Growing Communities
            </h1>
            <p className="home__hero-sub">
              AFACO works alongside smallholder farmers in Central Africa to build
              resilient food systems through training, infrastructure, and market access.
            </p>
            <div className="home__hero-actions">
              <Button to="/activities" size="lg">Our Activities</Button>
              <Button to="/contact" variant="outline" size="lg" className="home__hero-outline">
                Get Involved
              </Button>
            </div>
          </div>
        </Slideshow>
      </div>

      {/* ── Mission & Vision ── */}
      <Section
        label="Who we are"
        title="Our Mission &amp; Vision"
        tinted
        id="mission"
      >
        <div className="home__mv-grid">
          <div className="home__mv-card">
            <div className="home__mv-icon" aria-hidden="true">🎯</div>
            <h3 className="home__mv-heading">Mission</h3>
            <p>
              To empower smallholder farmers across Central Africa with the knowledge,
              tools, and market connections they need to build sustainable livelihoods
              and contribute to regional food security.
            </p>
          </div>
          <div className="home__mv-card">
            <div className="home__mv-icon" aria-hidden="true">🌍</div>
            <h3 className="home__mv-heading">Vision</h3>
            <p>
              A Central Africa where every farming community has equitable access to
              resources, fair markets, and opportunities — so that no family goes
              hungry and no farmer is left behind.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Stats ── */}
      <section className="home__stats" aria-label="Key statistics">
        <div className="container home__stats-grid">
          {STATS.map(({ value, label }) => (
            <div key={label} className="home__stat">
              <span className="home__stat-value">{value}</span>
              <span className="home__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Latest Updates ── */}
      <Section
        label="What's happening"
        title="Latest Updates"
        subtitle="Stay informed about AFACO's work and impact across the region."
        id="updates"
      >
        <div className="grid-3">
          {updates.map((u) => (
            <UpdateCard key={u.id} {...u} />
          ))}
        </div>
        <div className="home__see-all">
          <Button to="/news" variant="outline">View All News</Button>
        </div>
      </Section>

      {/* ── Gallery Preview ── */}
      <Section
        label="In the field"
        title="Gallery"
        subtitle="A glimpse of our work and the communities we serve."
        tinted
        id="gallery-preview"
      >
        <ImageGrid images={images} columns={4} />
        <div className="home__see-all">
          <Button to="/gallery" variant="outline">View Full Gallery</Button>
        </div>
      </Section>

      {/* ── CTA Banner ── */}
      <section className="home__cta-banner" aria-label="Call to action">
        <div className="container home__cta-inner">
          <div>
            <h2 className="home__cta-title">Ready to make a difference?</h2>
            <p className="home__cta-sub">
              Partner with AFACO or support a farmer today.
            </p>
          </div>
          <div className="home__cta-actions">
            <Button to="/contact" size="lg">Contact Us</Button>
            <Button to="/about"   size="lg" variant="outline" className="home__cta-outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
