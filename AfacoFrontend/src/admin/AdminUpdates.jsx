import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import './AdminUpdates.css'

const CATEGORIES = ['agriculture', 'training', 'partnerships', 'community', 'infrastructure', 'general']

const EMPTY_FORM = {
  title: '', date: new Date().toISOString().slice(0, 10),
  excerpt: '', body: '', imageUrl: '', category: 'agriculture',
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
        <h3>Confirm delete</h3><p>{message}</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost"  onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUpdates() {
  const { updates, addUpdate, editUpdate, deleteUpdate, images } = useData()

  const [view,        setView]        = useState('list')
  const [editingId,   setEditingId]   = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [errors,      setErrors]      = useState({})
  const [touched,     setTouched]     = useState({})
  const [confirmId,   setConfirmId]   = useState(null)
  const [toast,       setToast]       = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [mediaPicker, setMediaPicker] = useState(false)

  const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date))

  function showToast(type, msg) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  function openNew() {
    setForm(EMPTY_FORM); setErrors({}); setTouched({}); setEditingId(null); setView('form')
  }

  function openEdit(u) {
    setForm({ title: u.title, date: u.date, excerpt: u.excerpt, body: u.body, imageUrl: u.imageUrl ?? '', category: u.category ?? 'agriculture' })
    setErrors({}); setTouched({}); setEditingId(u.id); setView('form')
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  function handleBlur(e) { setTouched((t) => ({ ...t, [e.target.name]: true })) }
  function fieldErr(n)   { return touched[n] && errors[n] ? errors[n] : '' }

  async function handlePublish() {
    const allTouched = Object.fromEntries(['title','date','excerpt','body'].map((k) => [k, true]))
    setTouched(allTouched)
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      if (editingId) {
        await editUpdate(editingId, form)
        showToast('success', 'Update saved.')
      } else {
        await addUpdate(form)
        showToast('success', 'Update published.')
      }
      setView('list')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    try {
      await deleteUpdate(confirmId)
      showToast('success', 'Update deleted.')
      if (editingId === confirmId) setView('list')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <div className="adm-updates">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      {/* ── List ── */}
      {view === 'list' && (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">Updates</h1>
              <p className="adm-page__subtitle">{updates.length} total</p>
            </div>
            <button className="adm-btn adm-btn--primary" onClick={openNew}>+ New update</button>
          </div>
          <div className="adm-card adm-table-wrap">
            {sorted.length === 0 ? (
              <p className="adm-updates__empty">No updates yet.</p>
            ) : (
              <table className="adm-table" aria-label="Updates list">
                <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {sorted.map((u) => (
                    <tr key={u.id}>
                      <td>{u.imageUrl && <img src={u.imageUrl} alt="" className="adm-updates__thumb" loading="lazy" />}</td>
                      <td>
                        <p className="adm-updates__row-title">{u.title}</p>
                        <p className="adm-updates__row-excerpt">{u.excerpt}</p>
                      </td>
                      <td><span className="adm-badge adm-badge--green">{u.category}</span></td>
                      <td className="adm-updates__date-cell">
                        {new Date(u.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                      </td>
                      <td>
                        <div className="adm-updates__actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(u)}>Edit</button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setConfirmId(u.id)}>Delete</button>
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

      {/* ── Form ── */}
      {view === 'form' && (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">{editingId ? 'Edit Update' : 'New Update'}</h1>
              <p className="adm-page__subtitle">{editingId ? 'Changes are live immediately.' : 'Fill required fields then publish.'}</p>
            </div>
            <button className="adm-btn adm-btn--ghost" onClick={() => setView('list')}>← Back</button>
          </div>

          <div className="adm-updates__form-grid">
            <div className="adm-card adm-form">
              {/* Title */}
              <div className={`adm-field${fieldErr('title') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="upd-title">Title <span className="adm-req">*</span></label>
                <input id="upd-title" name="title" className={`adm-input${fieldErr('title') ? ' adm-input--error' : ''}`} value={form.title} onChange={handleChange} onBlur={handleBlur} placeholder="Update headline" aria-required="true" />
                {fieldErr('title') && <p className="adm-field-error">{fieldErr('title')}</p>}
              </div>

              {/* Date + Category */}
              <div className="adm-updates__two-col">
                <div className={`adm-field${fieldErr('date') ? ' adm-field--err' : ''}`}>
                  <label className="adm-label" htmlFor="upd-date">Date <span className="adm-req">*</span></label>
                  <input id="upd-date" name="date" type="date" className={`adm-input${fieldErr('date') ? ' adm-input--error':''}`} value={form.date} onChange={handleChange} onBlur={handleBlur} aria-required="true" />
                  {fieldErr('date') && <p className="adm-field-error">{fieldErr('date')}</p>}
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="upd-cat">Category</label>
                  <select id="upd-cat" name="category" className="adm-select" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div className={`adm-field${fieldErr('excerpt') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="upd-excerpt">Excerpt <span className="adm-req">*</span></label>
                <textarea id="upd-excerpt" name="excerpt" className={`adm-textarea${fieldErr('excerpt') ? ' adm-input--error':''}`} style={{ minHeight: 72 }} value={form.excerpt} onChange={handleChange} onBlur={handleBlur} placeholder="Short preview text" aria-required="true" />
                {fieldErr('excerpt') && <p className="adm-field-error">{fieldErr('excerpt')}</p>}
              </div>

              {/* Body */}
              <div className={`adm-field${fieldErr('body') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="upd-body">Body text <span className="adm-req">*</span></label>
                <textarea id="upd-body" name="body" className={`adm-textarea${fieldErr('body') ? ' adm-input--error':''}`} style={{ minHeight: 220 }} value={form.body} onChange={handleChange} onBlur={handleBlur} placeholder="Full article. Separate paragraphs with a blank line." aria-required="true" />
                {fieldErr('body') && <p className="adm-field-error">{fieldErr('body')}</p>}
              </div>
            </div>

            {/* Sidebar */}
            <div className="adm-updates__sidebar">
              <div className="adm-card adm-form">
                <h3 className="adm-updates__sidebar-heading">Featured image</h3>
                {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="adm-updates__preview-img" />}
                <div className="adm-field">
                  <label className="adm-label" htmlFor="upd-imgurl">Image URL</label>
                  <input id="upd-imgurl" name="imageUrl" className="adm-input" value={form.imageUrl} onChange={handleChange} placeholder="https://…" />
                </div>
                <p className="adm-updates__or">— or pick from media library —</p>
                <button type="button" className="adm-btn adm-btn--outline adm-btn--sm" style={{ width:'100%' }} onClick={() => setMediaPicker(true)}>Browse media</button>
              </div>

              <div className="adm-card adm-form">
                <h3 className="adm-updates__sidebar-heading">Publish</h3>
                <button className="adm-btn adm-btn--primary" style={{ width:'100%' }} onClick={handlePublish} disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Publish update'}
                </button>
                {editingId && (
                  <button className="adm-btn adm-btn--danger" style={{ width:'100%', marginTop:'0.5rem' }} onClick={() => setConfirmId(editingId)}>Delete this update</button>
                )}
                <p className="adm-updates__publish-note">
                  {editingId ? 'Saves to the database and updates the public page.' : 'Creates a new record and adds it to the public news page.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Media picker modal */}
      {mediaPicker && (
        <div className="adm-confirm-backdrop" role="dialog" aria-modal="true" aria-label="Pick image" onClick={() => setMediaPicker(false)}>
          <div className="adm-updates__media-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-updates__media-modal-header">
              <h3>Media library</h3>
              <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setMediaPicker(false)}>✕ Close</button>
            </div>
            <div className="adm-updates__media-picker-grid">
              {images.map((img) => (
                <button key={img.id} className={`adm-updates__media-thumb${form.imageUrl === img.url ? ' adm-updates__media-thumb--selected' : ''}`}
                  onClick={() => { setForm((f) => ({ ...f, imageUrl: img.url })); setMediaPicker(false) }} title={img.alt}>
                  <img src={img.thumbnailUrl || img.url} alt={img.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {confirmId && (
        <ConfirmDialog
          message="This update will be permanently deleted from the database and removed from the public site."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
