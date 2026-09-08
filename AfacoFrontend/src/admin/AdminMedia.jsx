import React, { useState, useRef } from 'react'
import { useData } from '../store/DataContext'
import './AdminMedia.css'

const ALL_CATEGORIES = ['farmland', 'farmers', 'activities', 'harvest', 'infrastructure', 'community']

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-confirm-backdrop" role="dialog" aria-modal="true" aria-label="Confirm delete">
      <div className="adm-confirm-box">
        <h3>Confirm delete</h3>
        <p>{message}</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminMedia() {
  const { images, addImage, deleteImage, updateImage, reorderImages } = useData()

  const [filterCat,   setFilterCat]   = useState('All')
  const [toast,       setToast]       = useState(null)   // { type, msg }
  const [confirmId,   setConfirmId]   = useState(null)
  const fileInputRef                  = useRef(null)

  // ── Derived list ────────────────────────────────────────────────────────────
  const displayed = filterCat === 'All'
    ? images
    : images.filter((i) => i.category === filterCat)

  // Per-category lists for reorder (need absolute index in full array)
  const catImages = (cat) => images.filter((i) => i.category === cat)

  // ── Toast helper ────────────────────────────────────────────────────────────
  function showToast(type, msg) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Upload (mock) ────────────────────────────────────────────────────────────
  // NOTE: Real upload would POST multipart/form-data to /api/media.
  //       Server-side compression and resizing would happen there.
  //       Here we create a local object URL as a placeholder preview.
  function handleFileChange(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return

    files.forEach((file) => {
      const objectUrl = URL.createObjectURL(file)
      const newImage = {
        id:       `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url:      objectUrl,
        alt:      file.name.replace(/\.[^.]+$/, ''),
        category: 'farmland', // default; admin can change after upload
      }
      addImage(newImage)
    })

    showToast('success', `${files.length} image${files.length > 1 ? 's' : ''} added (mock — no server upload yet).`)
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  function handleDelete(id) { setConfirmId(id) }
  function confirmDelete() {
    deleteImage(confirmId)
    setConfirmId(null)
    showToast('success', 'Image deleted.')
  }

  // ── Category change ──────────────────────────────────────────────────────────
  function handleCategoryChange(id, cat) {
    updateImage(id, { category: cat })
    showToast('success', 'Category updated.')
  }

  // ── Alt text change ──────────────────────────────────────────────────────────
  function handleAltChange(id, alt) {
    updateImage(id, { alt })
  }

  // ── Reorder (up/down within category) ───────────────────────────────────────
  function handleMove(cat, idx, dir) {
    const list   = catImages(cat)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= list.length) return
    reorderImages(cat, idx, newIdx)
  }

  // ── Drag-and-drop reorder ────────────────────────────────────────────────────
  const dragSrc = useRef(null)

  function onDragStart(e, cat, idx) {
    dragSrc.current = { cat, idx }
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }

  function onDrop(e, cat, idx) {
    e.preventDefault()
    if (!dragSrc.current || dragSrc.current.cat !== cat) return
    if (dragSrc.current.idx === idx) return
    reorderImages(cat, dragSrc.current.idx, idx)
    dragSrc.current = null
  }

  // ── Grouped view ─────────────────────────────────────────────────────────────
  const usedCategories = [...new Set(images.map((i) => i.category))]
  const groupsToShow   = filterCat === 'All' ? usedCategories : [filterCat]

  return (
    <div className="adm-media">
      {/* Toast */}
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Media Manager</h1>
          <p className="adm-page__subtitle">{images.length} images · drag rows to reorder within a category</p>
        </div>
        <button
          className="adm-btn adm-btn--primary"
          onClick={() => fileInputRef.current?.click()}
        >
          + Upload images
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
        {['All', ...usedCategories].map((cat) => (
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

      {/* Grouped image grids */}
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
                  {/* Preview */}
                  <div className="adm-media__img-wrap">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="adm-media__img"
                      loading="lazy"
                    />
                    <div className="adm-media__img-overlay">
                      <div className="adm-media__reorder-btns">
                        <button
                          className="adm-media__reorder-btn"
                          onClick={() => handleMove(cat, idx, -1)}
                          disabled={idx === 0}
                          aria-label="Move left"
                          title="Move left"
                        >←</button>
                        <button
                          className="adm-media__reorder-btn"
                          onClick={() => handleMove(cat, idx, 1)}
                          disabled={idx === list.length - 1}
                          aria-label="Move right"
                          title="Move right"
                        >→</button>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="adm-media__controls">
                    <input
                      type="text"
                      className="adm-input adm-media__alt-input"
                      value={img.alt}
                      onChange={(e) => handleAltChange(img.id, e.target.value)}
                      placeholder="Alt text"
                      aria-label="Image alt text"
                    />
                    <select
                      className="adm-select adm-media__cat-select"
                      value={img.category}
                      onChange={(e) => handleCategoryChange(img.id, e.target.value)}
                      aria-label="Image category"
                    >
                      {ALL_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      className="adm-btn adm-btn--danger adm-btn--sm adm-media__delete-btn"
                      onClick={() => handleDelete(img.id)}
                      aria-label={`Delete image: ${img.alt}`}
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

      {images.length === 0 && (
        <div className="adm-media__empty">
          <p>No images yet. Click <strong>Upload images</strong> to add some.</p>
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmId && (
        <ConfirmDialog
          message="This image will be removed from the media library and will no longer appear on the public site."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
