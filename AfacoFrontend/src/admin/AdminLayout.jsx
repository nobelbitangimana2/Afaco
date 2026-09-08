import React, { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import './AdminLayout.css'

const NAV_ITEMS = [
  { to: '/admin',         label: 'Dashboard', icon: '▦',  end: true },
  { to: '/admin/media',   label: 'Media',     icon: '🖼'            },
  { to: '/admin/updates', label: 'Updates',   icon: '📰'            },
  { to: '/admin/content', label: 'Content',   icon: '✏️'            },
  { to: '/admin/contact', label: 'Contact',   icon: '📋'            },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="adm-shell">
      {/* ── Top bar ── */}
      <header className="adm-topbar">
        <div className="adm-topbar__left">
          <button
            className="adm-topbar__menu-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            <span /><span /><span />
          </button>
          <Link to="/admin" className="adm-topbar__brand">
            <span className="adm-topbar__brand-icon" aria-hidden="true">🌿</span>
            <span>AFACO <em>Admin</em></span>
          </Link>
        </div>

        <div className="adm-topbar__right">
          <Link to="/" target="_blank" className="adm-topbar__site-link" title="View public site">
            ↗ Public site
          </Link>
          <div className="adm-topbar__user" title={`Logged in as ${user?.username}`}>
            <span className="adm-topbar__avatar" aria-hidden="true">
              {user?.username?.[0]?.toUpperCase() ?? 'A'}
            </span>
            <span className="adm-topbar__username">{user?.username}</span>
          </div>
          <button className="adm-topbar__logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <div className="adm-body">
        {/* ── Sidebar ── */}
        <aside
          className={`adm-sidebar${sidebarOpen ? ' adm-sidebar--open' : ''}`}
          aria-label="Admin navigation"
        >
          <nav className="adm-nav">
            {NAV_ITEMS.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  'adm-nav__item' + (isActive ? ' adm-nav__item--active' : '')
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="adm-nav__icon" aria-hidden="true">{icon}</span>
                <span className="adm-nav__label">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="adm-sidebar__footer">
            <button className="adm-sidebar__logout" onClick={handleLogout}>
              <span aria-hidden="true">⏻</span> Log out
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="adm-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Main content ── */}
        <main className="adm-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
