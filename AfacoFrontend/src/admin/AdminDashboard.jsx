import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useData } from '../store/DataContext'
import './AdminDashboard.css'

const QUICK_LINKS = [
  { to: '/admin/media',   icon: '🖼',  label: 'Media Manager',  desc: 'Upload, organise and delete images'      },
  { to: '/admin/updates', icon: '📰',  label: 'Updates',        desc: 'Create, edit and delete news updates'    },
  { to: '/admin/content', icon: '✏️',  label: 'Site Content',   desc: 'Edit mission and vision text'            },
  { to: '/admin/contact', icon: '📋',  label: 'Contact Info',   desc: 'Update address, phone and social links'  },
]

export default function AdminDashboard() {
  const { user }                        = useAuth()
  const { images, updates, content, contact } = useData()

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const recentUpdates = [...updates]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="adm-dash">
      {/* Greeting */}
      <div className="adm-dash__greeting">
        <div>
          <h1 className="adm-page__title">
            Welcome back, {user?.username} 👋
          </h1>
          <p className="adm-page__subtitle">{today}</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="adm-btn adm-btn--outline"
        >
          ↗ View public site
        </a>
      </div>

      {/* Stats strip */}
      <div className="adm-dash__stats">
        {[
          { value: images.length,  label: 'Images',         to: '/admin/media'   },
          { value: updates.length, label: 'News updates',   to: '/admin/updates' },
          { value: Object.keys(contact.socialLinks ?? {}).length, label: 'Social links', to: '/admin/contact' },
          { value: 1,              label: 'Active content', to: '/admin/content' },
        ].map(({ value, label, to }) => (
          <Link key={label} to={to} className="adm-dash__stat-card">
            <span className="adm-dash__stat-value">{value}</span>
            <span className="adm-dash__stat-label">{label}</span>
          </Link>
        ))}
      </div>

      <div className="adm-dash__grid">
        {/* Quick links */}
        <section className="adm-card adm-dash__quick" aria-labelledby="quick-heading">
          <h2 className="adm-dash__section-title" id="quick-heading">Quick Access</h2>
          <div className="adm-dash__quick-grid">
            {QUICK_LINKS.map(({ to, icon, label, desc }) => (
              <Link key={to} to={to} className="adm-dash__quick-card">
                <span className="adm-dash__quick-icon" aria-hidden="true">{icon}</span>
                <div>
                  <p className="adm-dash__quick-label">{label}</p>
                  <p className="adm-dash__quick-desc">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent updates */}
        <section className="adm-card adm-dash__recent" aria-labelledby="recent-heading">
          <div className="adm-dash__section-header">
            <h2 className="adm-dash__section-title" id="recent-heading">Recent Updates</h2>
            <Link to="/admin/updates" className="adm-btn adm-btn--ghost adm-btn--sm">
              View all
            </Link>
          </div>

          {recentUpdates.length === 0 ? (
            <p className="adm-dash__empty">No updates yet.</p>
          ) : (
            <ul className="adm-dash__update-list">
              {recentUpdates.map((u) => (
                <li key={u.id} className="adm-dash__update-item">
                  <div className="adm-dash__update-img-wrap">
                    <img
                      src={u.imageUrl}
                      alt=""
                      className="adm-dash__update-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="adm-dash__update-info">
                    <p className="adm-dash__update-title">{u.title}</p>
                    <time className="adm-dash__update-date" dateTime={u.date}>
                      {new Date(u.date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </time>
                  </div>
                  <Link
                    to="/admin/updates"
                    className="adm-btn adm-btn--ghost adm-btn--sm"
                    aria-label={`Edit ${u.title}`}
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
