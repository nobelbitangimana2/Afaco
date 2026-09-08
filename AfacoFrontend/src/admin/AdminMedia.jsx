import React, { useState, useRef } from 'react'
import { useData } from '../store/DataContext'
import './AdminMedia.css'

const ALL_CATEGORIES = ['farmland', 'farmers', 'activities', 'harvest', 'infrastructure', 'community', 'general']

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-confirm-backdrop" role="dialog" aria-modal="true" aria-label="Confirm delete">
      <div className="adm-confirm-box">
        <h3>Confirm delete</h3>
        <p>{message}</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost"  onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminMedia() {
  const { images, addImage, deleteImage, updateImage, reorderImages } = useData()

  const [filterCat,  setFilterCat]  = useState('All')
  const [toast,      setToast]      = useState(null)
  const [confirmId,  setConfirmId]  = useState(null)
  const [uploading,  setUploading]  = useState(false)
  const fileInputRef                = useRef(null)
  const dragSrc                     = useRef(null)

  const catImages    = (cat) => images.filter((i) => i.category === cat)
  const usedCats     = [...new Set(images.map((i) => i.category))]
  const groupsToShow = filterCat === 'All' ? usedCats : [filterCat]

  function showToast(type, msg) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Upload — real multipart POST via DataContext.addImage ─────────────────
  async function handleFileChange(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    let ok = 0, fail = 0
    for (const file of files) {
      try {
        await addImage(file, 'general', file.name.replace(/\.[^.]+$/, ''))
        ok++
      } catch (err) {
        console.error(err)
        fail++
      }
    }
    setUploading(false)
    e.target.value = ''
    if (fail === 0) {
      showToast('success', `${ok} image${ok !== 1 ? 's' : ''} uploaded and compressed.`)
    } else {
      showToast('error', `${ok} uploaded, ${fail} failed.`)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    try {
      await deleteImage(confirmId)
      showToast('success', 'Image deleted.')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setConfirmId(null)
    }
  }

  // ── Category / alt update ──────────────────────────────────────────────────
  async function handleCategoryChange(id, category) {
    try {
      await updateImage(id, { category })
      showToast('success', 'Category updated.')
    } catch (err) {
      showToast('error', err.message)
    }
  }

  function handleAltChange(id, alt) {
    // Optimistic local update only; blur triggers save
    updateImage(id, { alt }).catch((err) => showToast('error', err.message))
  }

  // ── Reorder ────────────────────────────────────────────────────────────────
  function handleMove(cat, idx, dir) {
    const list   = catImages(cat)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= list.length) return
    reorderImages(cat, idx, newIdx).catch((err) => showToast('error', err.message))
  }

  function onDragStart(e, cat, idx) {
    dragSrc.current = { cat, idx }
    e.dataTransfer.effectAllowed = 'move'
  }
  function onDragOver(e)        { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  function onDrop(e, cat, idx) {
    e.preventDefault()
    if (!dragSrc.current || dragSrc.current.cat !== cat || dragSrc.current.idx === idx) return
    reorderImages(cat, dragSrc.current.idx, idx).catch((err) => showToast('error', err.message))
    dragSrc.current = null
  }

  return (
    <div className="adm-media">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Media Manager</h1>
          <p className="adm-page__subtitle">
            {images.length} images · images are compressed to WebP on upload
          </p>
        </div>
        <button
          className="adm-btn adm-btn--primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : '+ Upload images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="adm-media__file-input"
          onChange={handleFileChange}
          aria-label="Upload images"
        />
      </div>

      {/* Filter tabs */}
      <div className="adm-media__filters" role="group" aria-label="Filter by category">
        {['All', ...usedCats].map((cat) => (
          <button
            key={cat}
            className={`adm-media__filter-btn${filterCat === cat ? ' adm-media__filter-btn--active' : ''}`}
            onClick={() => setFilterCat(cat)}
            aria-pressed={filterCat === cat}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
            <span className="adm-media__filter-count">
              {cat === 'All' ? images.length : images.filter((i) => i.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grouped grids */}
      {groupsToShow.map((cat) => {
        const list = catImages(cat)
        if (!list.length) return null
        return (
          <section key={cat} className="adm-media__group" aria-labelledby={`cat-${cat}`}>
            <h2 className="adm-media__group-title" id={`cat-${cat}`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              <span className="adm-media__group-count">{list.length}</span>
            </h2>
            <div className="adm-media__grid">
              {list.map((img, idx) => (
                <div
                  key={img.id}
                  className="adm-media__card"
                  draggable
                  onDragStart={(e) => onDragStart(e, cat, idx)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, cat, idx)}
                  title="Drag to reorder"
                >
                  <div className="adm-media__img-wrap">
                    <img
                      src={img.thumbnailUrl || img.url}
                      alt={img.alt}
                      className="adm-media__img"
                      loading="lazy"
                    />
                    <div className="adm-media__img-overlay">
                      <div className="adm-media__reorder-btns">
                        <button className="adm-media__reorder-btn" onClick={() => handleMove(cat, idx, -1)} disabled={idx === 0} aria-label="Move left">←</button>
                        <button className="adm-media__reorder-btn" onClick={() => handleMove(cat, idx, 1)} disabled={idx === list.length - 1} aria-label="Move right">→</button>
                      </div>
                    </div>
                  </div>
                  <div className="adm-media__controls">
                    <input
                      type="text"
                      className="adm-input adm-media__alt-input"
                      defaultValue={img.alt}
                      onBlur={(e) => handleAltChange(img.id, e.target.value)}
                      placeholder="Alt text"
                      aria-label="Image alt text"
                    />
                    <select
                      className="adm-select adm-media__cat-select"
                      value={img.category}
                      onChange={(e) => handleCategoryChange(img.id, e.target.value)}
                      aria-label="Image category"
                    >
                      {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                      className="adm-btn adm-btn--danger adm-btn--sm adm-media__delete-btn"
                      onClick={() => setConfirmId(img.id)}
                      aria-label={`Delete: ${img.alt}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {images.length === 0 && !uploading && (
        <div className="adm-media__empty">
          <p>No images yet. Click <strong>Upload images</strong> to add some.</p>
        </div>
      )}

      {confirmId && (
        <ConfirmDialog
          message="This image will be deleted from the server and removed from the public gallery."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
