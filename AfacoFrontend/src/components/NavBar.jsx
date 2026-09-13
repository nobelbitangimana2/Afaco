import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './NavBar.css'

const NAV_LINKS = [
  { to: '/',           label: 'Home',       end: true },
  { to: '/about',      label: 'About'               },
  { to: '/products',   label: 'Products'            },
  { to: '/activities', label: 'Activities'          },
  { to: '/gallery',    label: 'Gallery'             },
  { to: '/contact',    label: 'Contact'             },
]

export default function NavBar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner container">

        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={close} aria-label="AFACO Home">
          <img src="/AfacoLogo.jpeg" alt="AFACO logo" className="navbar__logo-img" />
          <span className="navbar__logo-text">AFACO</span>
        </Link>

        {/* Desktop links */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="navbar__actions">
          <Link to="/news" className="navbar__cta" onClick={close}>
            Latest News
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${open ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        className={`navbar__mobile${open ? ' navbar__mobile--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              'navbar__mobile-link' + (isActive ? ' navbar__mobile-link--active' : '')
            }
            onClick={close}
          >
            {label}
          </NavLink>
        ))}
        <Link to="/news" className="navbar__mobile-cta" onClick={close}>
          Latest News
        </Link>
      </nav>
    </header>
  )
}
