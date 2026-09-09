import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './NavBar.css'

const NAV_LINKS = [
  { to: '/',           label: 'Home'       },
  { to: '/about',      label: 'About'      },
  { to: '/activities', label: 'Activities' },
  { to: '/products',   label: 'Products'   },
  { to: '/gallery',    label: 'Gallery'    },
  { to: '/news',       label: 'News'       },
  { to: '/contact',    label: 'Contact'    },
]

export default function NavBar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change (link click)
  const close = () => setOpen(false)

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={close} aria-label="AFACO Home">
          <span className="navbar__logo-icon" aria-hidden="true">🌿</span>
          <span className="navbar__logo-text">AFACO</span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <Link to="/contact" className="navbar__cta" onClick={close}>
          Get in Touch
        </Link>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${open ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        className={`navbar__mobile${open ? ' navbar__mobile--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              'navbar__mobile-link' + (isActive ? ' navbar__mobile-link--active' : '')
            }
            onClick={close}
          >
            {label}
          </NavLink>
        ))}
        <Link to="/contact" className="navbar__mobile-cta" onClick={close}>
          Get in Touch
        </Link>
      </nav>
    </header>
  )
}
