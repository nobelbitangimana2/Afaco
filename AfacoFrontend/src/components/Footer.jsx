import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const QUICK_LINKS = [
  { to: '/',           label: 'Home'       },
  { to: '/about',      label: 'About'      },
  { to: '/activities', label: 'Activities' },
  { to: '/gallery',    label: 'Gallery'    },
  { to: '/news',       label: 'News'       },
  { to: '/contact',    label: 'Contact'    },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top container">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label="AFACO Home">
            <span aria-hidden="true">🌿</span> AFACO
          </Link>
          <p className="footer__tagline">
            Empowering farmers, growing communities, building a food-secure future in Central Africa.
          </p>
          <div className="footer__social" aria-label="Social media links">
            <a href="https://facebook.com/afaco"  target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <SocialIcon name="facebook" />
            </a>
            <a href="https://twitter.com/afaco"   target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
              <SocialIcon name="twitter" />
            </a>
            <a href="https://instagram.com/afaco" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <SocialIcon name="instagram" />
            </a>
            <a href="https://linkedin.com/company/afaco" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <SocialIcon name="linkedin" />
            </a>
            <a href="https://youtube.com/@afaco" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <SocialIcon name="youtube" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer__col">
          <h3 className="footer__heading">Quick Links</h3>
          <ul className="footer__links">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer__link">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h3 className="footer__heading">Contact</h3>
          <address className="footer__address">
            <p>12 Avenue Agricole</p>
            <p>Butembo, North Kivu</p>
            <p>Democratic Republic of Congo</p>
            <p className="footer__contact-item">
              <a href="tel:+243997123456">+243 997 123 456</a>
            </p>
            <p className="footer__contact-item">
              <a href="mailto:info@afaco.org">info@afaco.org</a>
            </p>
          </address>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>&copy; {year} AFACO. All rights reserved.</p>
        <p>Agricultural &amp; Farming Community Organisation</p>
      </div>
    </footer>
  )
}

function SocialIcon({ name }) {
  const icons = {
    facebook:  'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    twitter:   'M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43 1a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0C13.57 0 11.5 2.07 11.5 4.62c0 .36.04.71.11 1.05C7.69 5.48 4.07 3.64 1.64.9a4.63 4.63 0 0 0-.61 2.32c0 1.6.82 3.02 2.06 3.85a4.5 4.5 0 0 1-2.05-.57v.06c0 2.24 1.59 4.1 3.7 4.53a4.6 4.6 0 0 1-2.04.08c.57 1.8 2.24 3.1 4.22 3.13A9.05 9.05 0 0 1 0 19.54 12.77 12.77 0 0 0 6.92 21.5c8.3 0 12.84-6.88 12.84-12.85 0-.2 0-.39-.01-.58A9.17 9.17 0 0 0 22 5.92a9 9 0 0 1-2.6.71A4.52 4.52 0 0 0 21.46 3',
    instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z',
    linkedin:  'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    youtube:   'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95C1 8.12 1 12 1 12s0 3.88.46 5.58a2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95C23 15.88 23 12 23 12s0-3.88-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d={icons[name]} />
    </svg>
  )
}
