import React, { useState, useEffect } from 'react'
import { useData } from '../store/DataContext'
import './AdminContactInfo.css'

const SOCIAL_PLATFORMS = [
  { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/yourpage' },
  { key: 'twitter',   label: 'X / Twitter', placeholder: 'https://twitter.com/yourhandle' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
  { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/company/yourcompany' },
  { key: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/@yourchannel' },
]

function toForm(contact) {
  return {
    address:     contact.address     ?? '',
    phone:       contact.phone       ?? '',
    email:       contact.email       ?? '',
    officeHours: contact.officeHours ?? '',
    facebook:    contact.socialLinks?.facebook  ?? '',
    twitter:     contact.socialLinks?.twitter   ?? '',
    instagram:   contact.socialLinks?.instagram ?? '',
    linkedin:    contact.socialLinks?.linkedin  ?? '',
    youtube:     contact.socialLinks?.youtube   ?? '',
  }
}

function validate(f) {
  const e = {}
  if (!f.address.trim()) e.address = 'Address is required.'
  if (!f.phone.trim())   e.phone   = 'Phone is required.'
  if (!f.email.trim())   e.email   = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = 'Enter a valid email address.'
  return e
}

export default function AdminContactInfo() {
  const { contact, saveContact } = useData()

  const [form,   setForm]   = useState(() => toForm(contact))
  const [errors, setErrors] = useState({})
  const [toast,  setToast]  = useState(null)
  const [dirty,  setDirty]  = useState(false)

  useEffect(() => {
    setForm(toForm(contact))
    setDirty(false)
  }, [contact])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setDirty(true)
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  function handleSave() {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    saveContact({
      address:     form.address,
      phone:       form.phone,
      email:       form.email,
      officeHours: form.officeHours,
      socialLinks: {
        facebook:  form.facebook,
        twitter:   form.twitter,
        instagram: form.instagram,
        linkedin:  form.linkedin,
        youtube:   form.youtube,
      },
    })
      .then(() => {
        setDirty(false)
        setToast({ type: 'success', msg: 'Contact info saved. Changes are live on the public site.' })
        setTimeout(() => setToast(null), 3500)
      })
      .catch((err) => {
        setToast({ type: 'error', msg: err.message || 'Save failed.' })
        setTimeout(() => setToast(null), 3500)
      })
  }

  function handleReset() {
    setForm(toForm(contact))
    setErrors({})
    setDirty(false)
  }

  function fieldErr(name) { return errors[name] ?? '' }

  return (
    <div className="adm-ci">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          ✓ {toast.msg}
        </div>
      )}

      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Contact Info</h1>
          <p className="adm-page__subtitle">
            Displayed on the public Contact page and in the site footer.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {dirty && (
            <button className="adm-btn adm-btn--ghost" onClick={handleReset}>
              Reset
            </button>
          )}
          <button className="adm-btn adm-btn--primary" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>

      <div className="adm-ci__grid">
        {/* ── Core info ── */}
        <div className="adm-card adm-form">
          <h2 className="adm-ci__section-title">
            <span aria-hidden="true">📍</span> Core details
          </h2>

          <div className={`adm-field${fieldErr('address') ? ' adm-field--err' : ''}`}>
            <label className="adm-label" htmlFor="ci-address">
              Address <span className="adm-req">*</span>
            </label>
            <textarea
              id="ci-address"
              name="address"
              className={`adm-textarea${fieldErr('address') ? ' adm-input--error' : ''}`}
              style={{ minHeight: 72 }}
              value={form.address}
              onChange={handleChange}
              placeholder="Street, City, Region, Country"
              aria-required="true"
            />
            {fieldErr('address') && <p className="adm-field-error">{fieldErr('address')}</p>}
          </div>

          <div className="adm-ci__two-col">
            <div className={`adm-field${fieldErr('phone') ? ' adm-field--err' : ''}`}>
              <label className="adm-label" htmlFor="ci-phone">
                Phone <span className="adm-req">*</span>
              </label>
              <input
                id="ci-phone"
                name="phone"
                type="tel"
                className={`adm-input${fieldErr('phone') ? ' adm-input--error' : ''}`}
                value={form.phone}
                onChange={handleChange}
                placeholder="+243 997 000 000"
                aria-required="true"
              />
              {fieldErr('phone') && <p className="adm-field-error">{fieldErr('phone')}</p>}
            </div>

            <div className={`adm-field${fieldErr('email') ? ' adm-field--err' : ''}`}>
              <label className="adm-label" htmlFor="ci-email">
                Email <span className="adm-req">*</span>
              </label>
              <input
                id="ci-email"
                name="email"
                type="email"
                className={`adm-input${fieldErr('email') ? ' adm-input--error' : ''}`}
                value={form.email}
                onChange={handleChange}
                placeholder="info@example.org"
                aria-required="true"
              />
              {fieldErr('email') && <p className="adm-field-error">{fieldErr('email')}</p>}
            </div>
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="ci-hours">Office hours</label>
            <input
              id="ci-hours"
              name="officeHours"
              className="adm-input"
              value={form.officeHours}
              onChange={handleChange}
              placeholder="Monday – Friday, 08:00 – 17:00 (CAT)"
            />
          </div>
        </div>

        {/* ── Social links ── */}
        <div className="adm-card adm-form">
          <h2 className="adm-ci__section-title">
            <span aria-hidden="true">🔗</span> Social links
          </h2>
          <p className="adm-ci__section-hint">
            Leave blank to hide a platform from the footer and Contact page.
          </p>

          {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
            <div className="adm-field" key={key}>
              <label className="adm-label" htmlFor={`ci-${key}`}>{label}</label>
              <input
                id={`ci-${key}`}
                name={key}
                type="url"
                className="adm-input"
                value={form[key]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div className="adm-card adm-ci__preview">
        <h3 className="adm-ci__preview-title">Live preview</h3>
        <div className="adm-ci__preview-grid">
          <PreviewItem label="Address"      value={form.address} />
          <PreviewItem label="Phone"        value={form.phone} />
          <PreviewItem label="Email"        value={form.email} />
          <PreviewItem label="Office hours" value={form.officeHours} />
          <div className="adm-ci__preview-social">
            <span className="adm-ci__preview-label">Social links</span>
            <div className="adm-ci__preview-social-pills">
              {SOCIAL_PLATFORMS.filter((p) => form[p.key]).map((p) => (
                <span key={p.key} className="adm-ci__preview-pill">{p.label}</span>
              ))}
              {SOCIAL_PLATFORMS.every((p) => !form[p.key]) && (
                <em className="adm-ci__preview-empty">None set</em>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewItem({ label, value }) {
  return (
    <div className="adm-ci__preview-item">
      <span className="adm-ci__preview-label">{label}</span>
      <span className="adm-ci__preview-value">
        {value || <em className="adm-ci__preview-empty">Not set</em>}
      </span>
    </div>
  )
}
