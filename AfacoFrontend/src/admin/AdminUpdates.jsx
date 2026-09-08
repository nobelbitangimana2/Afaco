import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import './AdminUpdates.css'

const CATEGORIES = ['agriculture', 'training', 'partnerships', 'community', 'infrastructure']

const EMPTY_FORM = {
  title:    '',
  date:     new Date().toISOString().slice(0, 10),
  excerpt:  '',
  body:     '',
  imageUrl: '',
  category: 'agriculture',
}

function validate(f) {
  const e = {}
  if (!f.title.trim())   e.title   = 'Title is required.'
  if (!f.date)           e.date    = 'Date is required.'
  if (!f.excerpt.trim()) e.excerpt = 'Excerpt is required.'
  if (!f.body.trim())    e.body    = 'Body text is required.'
  return e
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-confirm-backdrop" role="dialog" aria-modal="true">
      <div className="adm-confirm-box">
        <h3>Confirm delete</h3>
        <p>{message}</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost"   onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn--danger"  onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUpdates() {
  const { updates, addUpdate, editUpdate, deleteUpdate, images } = useData()

  const [view,      setView]      = useState('list')   // 'list' | 'form'
  const [editingId, setEditingId] = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [errors,    setErrors]    = useState({})
  const [touched,   setTouched]   = useState({})
  const [confirmId, setConfirmId] = useState(null)
  const [toast,     setToast]     = useState(null)
  const [mediaPicker, setMediaPicker] = useState(false)

  const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date))

  // ── Toast ──────────────────────────────────────────────────────────────────
  function showToast(type, msg) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Open new form ──────────────────────────────────────────────────────────
  function openNew() {
    setForm(EMPTY_FORM)
    setErrors({})
    setTouched({})
    setEditingId(null)
    setView('form')
  }

  // ── Open edit form ─────────────────────────────────────────────────────────
  function openEdit(update) {
    setForm({
      title:    update.title,
      date:     update.date,
      excerpt:  update.excerpt,
      body:     update.body,
      imageUrl: update.imageUrl ?? '',
      category: update.category ?? 'agriculture',
    })
    setErrors({})
    setTouched({})
    setEditingId(update.id)
    setView('form')
  }

  // ── Field change ───────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  function handleBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  function fieldErr(name) {
    return touched[name] && errors[name] ? errors[name] : ''
  }

  // ── Publish / Save ─────────────────────────────────────────────────────────
  function handlePublish() {
    const allTouched = Object.fromEntries(
      ['title', 'date', 'excerpt', 'body'].map((k) => [k, true])
    )
    setTouched(allTouched)
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    if (editingId) {
      editUpdate(editingId, form)
      showToast('success', 'Update saved.')
    } else {
      addUpdate({
        ...form,
        id: `u-${Date.now()}`,
      })
      showToast('success', 'Update published.')
    }
    setView('list')
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  function confirmDelete() {
    deleteUpdate(confirmId)
    setConfirmId(null)
    showToast('success', 'Update deleted.')
    if (editingId === confirmId) setView('list')
  }

  return (
    <div className="adm-updates">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      {/* ── List view ── */}
      {view === 'list' && (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">Updates</h1>
              <p className="adm-page__subtitle">{updates.length} total updates</p>
            </div>
            <button className="adm-btn adm-btn--primary" onClick={openNew}>
              + New update
            </button>
          </div>

          <div className="adm-card adm-table-wrap">
            {sorted.length === 0 ? (
              <p className="adm-updates__empty">No updates yet. Click <strong>New update</strong> to create one.</p>
            ) : (
              <table className="adm-table" aria-label="Updates list">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((u) => (
                    <tr key={u.id}>
                      <td>
                        {u.imageUrl && (
                          <img
                            src={u.imageUrl}
                            alt=""
                            className="adm-updates__thumb"
                            loading="lazy"
                          />
                        )}
                      </td>
                      <td>
                        <p className="adm-updates__row-title">{u.title}</p>
                        <p className="adm-updates__row-excerpt">{u.excerpt}</p>
                      </td>
                      <td>
                        <span className="adm-badge adm-badge--green">{u.category}</span>
                      </td>
                      <td className="adm-updates__date-cell">
                        {new Date(u.date).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td>
                        <div className="adm-updates__actions">
                          <button
                            className="adm-btn adm-btn--ghost adm-btn--sm"
                            onClick={() => openEdit(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => setConfirmId(u.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── Form view ── */}
      {view === 'form' && (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">
                {editingId ? 'Edit Update' : 'New Update'}
              </h1>
              <p className="adm-page__subtitle">
                {editingId ? 'Changes are saved immediately to the public site.' : 'Fill in all required fields then click Publish.'}
              </p>
            </div>
            <button className="adm-btn adm-btn--ghost" onClick={() => setView('list')}>
              ← Back to list
            </button>
          </div>

          <div className="adm-updates__form-grid">
            {/* Main fields */}
            <div className="adm-card adm-form">
              {/* Title */}
              <div className={`adm-field${fieldErr('title') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="upd-title">
                  Title <span aria-hidden="true" className="adm-req">*</span>
                </label>
                <input
                  id="upd-title"
                  name="title"
                  className={`adm-input${fieldErr('title') ? ' adm-input--error' : ''}`}
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Update headline"
                  aria-required="true"
                  aria-describedby={fieldErr('title') ? 'upd-title-err' : undefined}
                />
                {fieldErr('title') && <p id="upd-title-err" className="adm-field-error">{fieldErr('title')}</p>}
              </div>

              {/* Date + Category */}
              <div className="adm-updates__two-col">
                <div className={`adm-field${fieldErr('date') ? ' adm-field--err' : ''}`}>
                  <label className="adm-label" htmlFor="upd-date">
                    Date <span aria-hidden="true" className="adm-req">*</span>
                  </label>
                  <input
                    id="upd-date"
                    name="date"
                    type="date"
                    className={`adm-input${fieldErr('date') ? ' adm-input--error' : ''}`}
                    value={form.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-required="true"
                  />
                  {fieldErr('date') && <p className="adm-field-error">{fieldErr('date')}</p>}
                </div>

                <div className="adm-field">
                  <label className="adm-label" htmlFor="upd-cat">Category</label>
                  <select
                    id="upd-cat"
                    name="category"
                    className="adm-select"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div className={`adm-field${fieldErr('excerpt') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="upd-excerpt">
                  Short excerpt <span aria-hidden="true" className="adm-req">*</span>
                </label>
                <textarea
                  id="upd-excerpt"
                  name="excerpt"
                  className={`adm-textarea${fieldErr('excerpt') ? ' adm-input--error' : ''}`}
                  style={{ minHeight: 72 }}
                  value={form.excerpt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="One or two sentences shown in news card previews"
                  aria-required="true"
                  aria-describedby={fieldErr('excerpt') ? 'upd-excerpt-err' : undefined}
                />
                {fieldErr('excerpt') && <p id="upd-excerpt-err" className="adm-field-error">{fieldErr('excerpt')}</p>}
              </div>

              {/* Body */}
              <div className={`adm-field${fieldErr('body') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="upd-body">
                  Full body text <span aria-hidden="true" className="adm-req">*</span>
                </label>
                <textarea
                  id="upd-body"
                  name="body"
                  className={`adm-textarea${fieldErr('body') ? ' adm-input--error' : ''}`}
                  style={{ minHeight: 220 }}
                  value={form.body}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Full article text. Separate paragraphs with a blank line."
                  aria-required="true"
                  aria-describedby={fieldErr('body') ? 'upd-body-err' : undefined}
                />
                {fieldErr('body') && <p id="upd-body-err" className="adm-field-error">{fieldErr('body')}</p>}
              </div>
            </div>

            {/* Sidebar — image picker + actions */}
            <div className="adm-updates__sidebar">
              {/* Image */}
              <div className="adm-card adm-form">
                <h3 className="adm-updates__sidebar-heading">Featured image</h3>

                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Featured preview"
                    className="adm-updates__preview-img"
                  />
                )}

                <div className="adm-field">
                  <label className="adm-label" htmlFor="upd-imgurl">Image URL</label>
                  <input
                    id="upd-imgurl"
                    name="imageUrl"
                    className="adm-input"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://…"
                  />
                </div>

                <p className="adm-updates__or">— or pick from media library —</p>

                <button
                  type="button"
                  className="adm-btn adm-btn--outline adm-btn--sm"
                  style={{ width: '100%' }}
                  onClick={() => setMediaPicker(true)}
                >
                  Browse media
                </button>
              </div>

              {/* Publish / delete actions */}
              <div className="adm-card adm-form">
                <h3 className="adm-updates__sidebar-heading">Publish</h3>
                <button
                  className="adm-btn adm-btn--primary"
                  style={{ width: '100%' }}
                  onClick={handlePublish}
                >
                  {editingId ? 'Save changes' : 'Publish update'}
                </button>
                {editingId && (
                  <button
                    className="adm-btn adm-btn--danger"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => setConfirmId(editingId)}
                  >
                    Delete this update
                  </button>
                )}
                <p className="adm-updates__publish-note">
                  {editingId
                    ? 'Saving will immediately update the public news page.'
                    : 'Publishing will add this to the public news page immediately.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Media picker modal ── */}
      {mediaPicker && (
        <div
          className="adm-confirm-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Pick an image from media library"
          onClick={() => setMediaPicker(false)}
        >
          <div
            className="adm-updates__media-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-updates__media-modal-header">
              <h3>Media library</h3>
              <button
                className="adm-btn adm-btn--ghost adm-btn--sm"
                onClick={() => setMediaPicker(false)}
              >
                ✕ Close
              </button>
            </div>
            <div className="adm-updates__media-picker-grid">
              {images.map((img) => (
                <button
                  key={img.id}
                  className={`adm-updates__media-thumb${form.imageUrl === img.url ? ' adm-updates__media-thumb--selected' : ''}`}
                  onClick={() => {
                    setForm((f) => ({ ...f, imageUrl: img.url }))
                    setMediaPicker(false)
                  }}
                  title={img.alt}
                >
                  <img src={img.url} alt={img.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm delete ── */}
      {confirmId && (
        <ConfirmDialog
          message="This update will be permanently removed from the news page."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
