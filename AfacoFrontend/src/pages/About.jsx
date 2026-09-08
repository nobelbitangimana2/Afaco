import React, { useEffect, useState } from 'react'
import Section from '../components/Section'
import Card    from '../components/Card'
import Button  from '../components/Button'
import { getTeamMembers } from '../data/team'
import './About.css'

const TIMELINE = [
  { year: '2008', text: 'AFACO founded by a group of 12 farmers in Butembo with a shared goal of improving crop yields and market access.' },
  { year: '2011', text: 'First formal cooperative training programme launched, reaching 200 farmers across North Kivu.' },
  { year: '2014', text: 'Expanded operations to Lubero and Masisi districts; opened the first AFACO demonstration farm.' },
  { year: '2017', text: 'Secured multilateral funding for irrigation infrastructure, benefiting over 500 farming families.' },
  { year: '2020', text: 'Launched Women in Agriculture Programme and Youth in Agribusiness initiative amid pandemic recovery efforts.' },
  { year: '2023', text: 'Reached 1,800+ enrolled farmers across 8 districts; commissioned solar-powered drip irrigation network.' },
  { year: '2026', text: 'Ongoing expansion of the high-yield rice programme to three new districts with support from the Great Lakes Regional Seed Bank.' },
]

export default function About() {
  const [team, setTeam] = useState([])

  useEffect(() => {
    getTeamMembers().then(setTeam)
  }, [])

  return (
    <div className="about">
      {/* ── Page Hero ── */}
      <div className="page-hero page-hero--green">
        <div className="container page-hero__inner">
          <span className="page-hero__label">About Us</span>
          <h1 className="page-hero__title">Who We Are</h1>
          <p className="page-hero__sub">
            AFACO is an agricultural enterprise committed to building food security
            and economic resilience for smallholder farming communities in Central Africa.
          </p>
        </div>
      </div>

      {/* ── Mission & Vision full text ── */}
      <Section label="Purpose" title="Mission &amp; Vision" id="mission" tinted>
        <div className="about__mv">
          <div className="about__mv-block">
            <div className="about__mv-icon" aria-hidden="true">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To empower smallholder farmers across Central Africa with the knowledge,
              tools, infrastructure, and market connections they need to build sustainable
              livelihoods, strengthen local food systems, and contribute to long-term
              regional food security. We do this through hands-on training, cooperative
              development, climate-smart agricultural practice, and strategic partnerships
              with governments, NGOs, and the private sector.
            </p>
          </div>
          <div className="about__mv-block">
            <div className="about__mv-icon" aria-hidden="true">🌍</div>
            <h3>Our Vision</h3>
            <p>
              A Central Africa where every farming community — regardless of geography,
              gender, or economic status — has equitable access to quality inputs,
              modern techniques, fair markets, and the social infrastructure needed to
              thrive. We envision a region free from seasonal hunger, where agriculture
              is a dignified and prosperous livelihood, and where farmers are respected
              contributors to national economies.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Values ── */}
      <Section label="What guides us" title="Our Core Values" id="values">
        <div className="about__values">
          {[
            { icon: '🤝', title: 'Community First',    text: 'Every decision starts with the needs and voices of the farming communities we serve.' },
            { icon: '🌱', title: 'Sustainability',      text: 'We promote practices that protect the land, water, and ecosystems for future generations.' },
            { icon: '📊', title: 'Accountability',      text: 'We are transparent about our impact, finances, and the outcomes we deliver.' },
            { icon: '⚖️', title: 'Equity',              text: 'We actively work to remove barriers for women, youth, and marginalised groups.' },
            { icon: '🔬', title: 'Evidence-Based',      text: 'We apply research and data to select and refine the programmes we run.' },
            { icon: '🌐', title: 'Collaboration',       text: 'We build partnerships — local, regional, and international — to multiply our reach.' },
          ].map(({ icon, title, text }) => (
            <div key={title} className="about__value-card">
              <span className="about__value-icon" aria-hidden="true">{icon}</span>
              <h4 className="about__value-title">{title}</h4>
              <p className="about__value-text">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── History / Timeline ── */}
      <Section label="Our journey" title="History &amp; Story" id="history" tinted>
        <div className="about__timeline">
          {TIMELINE.map(({ year, text }, i) => (
            <div key={year} className={`about__tl-item${i % 2 === 0 ? '' : ' about__tl-item--right'}`}>
              <div className="about__tl-year">{year}</div>
              <div className="about__tl-dot" aria-hidden="true" />
              <div className="about__tl-text">{text}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Team ── */}
      <Section label="The people behind the work" title="Our Team" id="team">
        <div className="grid-3">
          {team.map(({ id, name, role, bio, photoUrl }) => (
            <article key={id} className="about__team-card">
              <div className="about__team-photo-wrap">
                <img src={photoUrl} alt={name} className="about__team-photo" loading="lazy" />
              </div>
              <div className="about__team-info">
                <h3 className="about__team-name">{name}</h3>
                <p  className="about__team-role">{role}</p>
                <p  className="about__team-bio">{bio}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Partners ── */}
      <Section label="Working together" title="Our Partners" id="partners" tinted
        subtitle="AFACO collaborates with a wide range of regional and international organisations.">
        <div className="about__partners">
          {[
            'Great Lakes Regional Seed Bank',
            'Ministry of Agriculture – DRC',
            'FAO Central Africa',
            'International Fund for Agricultural Development',
            'Local Farmers\' Cooperative Union',
            'Regional Agricultural University Network',
          ].map((p) => (
            <div key={p} className="about__partner-badge">{p}</div>
          ))}
        </div>
        <div className="text-center mt-3">
          <Button to="/contact">Become a Partner</Button>
        </div>
      </Section>
    </div>
  )
}
