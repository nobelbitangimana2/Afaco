import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import { getTeamMembers } from '../data/team'
import { useData } from '../store/DataContext'
import './About.css'

const TIMELINE = [
  { year: '2008', text: 'AFACO founded by a group of farmers in Bujumbura, Burundi, with a shared goal of improving rice yields and local food security.' },
  { year: '2011', text: 'First formal cooperative training programme launched, reaching farmers across multiple provinces of Burundi.' },
  { year: '2014', text: 'Expanded operations to additional provinces; opened the first AFACO demonstration farm.' },
  { year: '2017', text: 'Secured multilateral funding for irrigation infrastructure, benefiting over 500 farming families.' },
  { year: '2020', text: 'Launched Women in Agriculture Programme and Youth in Agribusiness initiative.' },
  { year: '2023', text: 'Reached 1,800+ enrolled farmers across 8 provinces; commissioned solar-powered drip irrigation.' },
  { year: '2026', text: 'Expanding the high-yield rice programme to new provinces with regional seed bank support.' },
]

const PARTNERS = [
  'Great Lakes Regional Seed Bank',
  'Ministry of Agriculture – Burundi',
  'FAO East Africa',
  'International Fund for Agricultural Development',
  'Local Farmers\' Cooperative Union',
  'Regional Agricultural University Network',
]

export default function About() {
  const { content } = useData()
  const [team, setTeam] = useState([])
  useEffect(() => { getTeamMembers().then(setTeam) }, [])

  return (
    <div className="about-page">

      {/* Hero */}
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">About AFACO</span>
          <h1 className="page-hero__title">Who We Are</h1>
          <p className="page-hero__sub">
            A farmer-led agricultural organisation committed to food security, quality produce,
            and sustainable livelihoods across Burundi.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="section section--cream">
        <div className="container">
          <div className="about__mv-grid">
            <div className="about__mv-card">
              <span className="about__mv-icon" aria-hidden="true">🎯</span>
              <h3>Our Mission</h3>
              <p>{content.mission || 'Loading…'}</p>
            </div>
            <div className="about__mv-card">
              <span className="about__mv-icon" aria-hidden="true">🌍</span>
              <h3>Our Vision</h3>
              <p>{content.vision || 'Loading…'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__label">What guides us</span>
            <h2 className="section__title">Core Values</h2>
          </div>
          <div className="about__values-grid">
            {[
              { icon: '🤝', title: 'Community First',   text: 'Every decision starts with the needs of the farming communities we serve.' },
              { icon: '🌱', title: 'Sustainability',     text: 'Practices that protect land, water, and ecosystems for future generations.' },
              { icon: '📊', title: 'Accountability',     text: 'Transparent about our impact, finances, and the outcomes we deliver.' },
              { icon: '⚖️', title: 'Equity',            text: 'Actively removing barriers for women, youth, and marginalised groups.' },
              { icon: '🔬', title: 'Evidence-Based',    text: 'Research and data guide the programmes we design and refine.' },
              { icon: '🌐', title: 'Collaboration',      text: 'Local, regional, and international partnerships multiply our reach.' },
            ].map(({ icon, title, text }) => (
              <div key={title} className="about__val-card">
                <span className="about__val-icon" aria-hidden="true">{icon}</span>
                <h4 className="about__val-title">{title}</h4>
                <p className="about__val-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Our journey</span>
            <h2 className="section__title">History &amp; Story</h2>
          </div>
          <div className="about__timeline">
            {TIMELINE.map(({ year, text }) => (
              <div key={year} className="about__tl-row">
                <div className="about__tl-year">{year}</div>
                <div className="about__tl-line"><div className="about__tl-dot" /></div>
                <div className="about__tl-text">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__label">The people behind the work</span>
            <h2 className="section__title">Our Team</h2>
          </div>
          <div className="about__team-grid">
            {team.map(({ id, name, role, bio, photoUrl }) => (
              <article key={id} className="about__team-card">
                <div className="about__team-photo-wrap">
                  <img src={photoUrl} alt={name} className="about__team-photo" loading="lazy" />
                </div>
                <div className="about__team-info">
                  <h3 className="about__team-name">{name}</h3>
                  <p className="about__team-role">{role}</p>
                  <p className="about__team-bio">{bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section section--green">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Working together</span>
            <h2 className="section__title">Our Partners</h2>
            <p className="section__subtitle">AFACO collaborates with regional and international organisations.</p>
          </div>
          <div className="about__partners">
            {PARTNERS.map(p => (
              <div key={p} className="about__partner-badge">{p}</div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Button to="/contact">Become a Partner</Button>
          </div>
        </div>
      </section>

    </div>
  )
}
