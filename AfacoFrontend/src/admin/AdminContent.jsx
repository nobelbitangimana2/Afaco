import React, { useState, useEffect } from 'react'
import { useData } from '../store/DataContext'
import './AdminContent.css'

function normalizePartner(partner) {
  return typeof partner === 'string'
    ? { name: partner, description: '', imageUrl: '' }
    : { name: partner?.name || '', description: partner?.description || '', imageUrl: partner?.imageUrl || '' }
}

export default function AdminContent() {
  const { content, saveContent, addImage } = useData()

  const [mission, setMission] = useState(content.mission)
  const [vision,  setVision]  = useState(content.vision)
  const [partners, setPartners] = useState((content.partners || []).map(normalizePartner))
  const [errors,  setErrors]  = useState({})
  const [toast,   setToast]   = useState(null)
  const [dirty,   setDirty]   = useState(false)
  const [uploadingPartner, setUploadingPartner] = useState(null)

  // Keep local state in sync if context resets (e.g. future SSR hydration)
  useEffect(() => {
    setMission(content.mission)
    setVision(content.vision)
    setPartners((content.partners || []).map(normalizePartner))
    setDirty(false)
  }, [content.mission, content.vision, content.partners])

  function handleChange(field, value) {
    if (field === 'mission') { setMission(value) }
    else                     { setVision(value)  }
    setDirty(true)
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!mission.trim()) e.mission = 'Mission text is required.'
    if (!vision.trim())  e.vision  = 'Vision text is required.'
    if (partners.some((partner) => !partner.name.trim())) e.partners = 'Partner names cannot be empty.'
    return e
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    saveContent({
      mission,
      vision,
      partners: partners.map((partner) => ({
        name: partner.name.trim(),
        description: partner.description.trim(),
        imageUrl: partner.imageUrl.trim(),
      })),
    })
      .then(() => {
        setDirty(false)
        setToast({ type: 'success', msg: 'Mission & Vision saved. Changes are live on the public site.' })
        setTimeout(() => setToast(null), 3500)
      })
      .catch((err) => {
        setToast({ type: 'error', msg: err.message || 'Save failed.' })
        setTimeout(() => setToast(null), 3500)
      })
  }

  function handleReset() {
    setMission(content.mission)
    setVision(content.vision)
    setPartners((content.partners || []).map(normalizePartner))
    setErrors({})
    setDirty(false)
  }

  function updatePartner(index, field, value) {
    setPartners((current) => current.map((partner, i) => i === index ? { ...partner, [field]: value } : partner))
    setDirty(true)
    if (errors.partners) setErrors((current) => ({ ...current, partners: '' }))
  }

  function addPartner() {
    setPartners((current) => [...current, { name: '', description: '', imageUrl: '' }])
    setDirty(true)
  }

  function removePartner(index) {
    setPartners((current) => current.filter((_, i) => i !== index))
    setDirty(true)
  }

  async function handlePartnerImage(index, file) {
    if (!file) return
    setUploadingPartner(index)
    try {
      const image = await addImage(file, 'partners', `${partners[index].name || 'partner'} logo`)
      updatePartner(index, 'imageUrl', image.url)
      setToast({ type: 'success', msg: 'Partner image uploaded. Save changes to publish it.' })
      setTimeout(() => setToast(null), 3500)
    } catch (err) {
      setToast({ type: 'error', msg: err.message || 'Image upload failed.' })
      setTimeout(() => setToast(null), 3500)
    } finally {
      setUploadingPartner(null)
    }
  }

  return (
    <div className="adm-content">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          ✓ {toast.msg}
        </div>
      )}

      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Site Content</h1>          <p className="adm-page__subtitle">
            Mission and Vision text shown on the Home and About pages.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {dirty && (
            <button className="adm-btn adm-btn--ghost" onClick={handleReset}>
              Reset
            </button>
          )}
          <button
            className="adm-btn adm-btn--primary"
            onClick={handleSave}
          >
            Save changes
          </button>
        </div>
      </div>

      <div className="adm-content__grid">
        {/* Mission */}
        <div className="adm-card adm-form">
          <div className="adm-content__field-header">
            <span className="adm-content__icon" aria-hidden="true">🎯</span>
            <div>
              <h2 className="adm-content__field-title">Mission</h2>
              <p className="adm-content__field-hint">
                Describes what AFACO does and who it serves.
                Shown in the Home hero section and About page.
              </p>
            </div>
          </div>
          <div className={`adm-field${errors.mission ? ' adm-field--err' : ''}`}>
            <label htmlFor="content-mission" className="adm-label">
              Mission text <span className="adm-req">*</span>
            </label>
            <textarea
              id="content-mission"
              className={`adm-textarea${errors.mission ? ' adm-input--error' : ''}`}
              style={{ minHeight: 160 }}
              value={mission}
              onChange={(e) => handleChange('mission', e.target.value)}
              aria-required="true"
              aria-describedby={errors.mission ? 'mission-err' : undefined}
            />
            {errors.mission && (
              <p id="mission-err" className="adm-field-error">{errors.mission}</p>
            )}
            <p className="adm-content__char-count">{mission.length} characters</p>
          </div>
        </div>

        {/* Vision */}
        <div className="adm-card adm-form">
          <div className="adm-content__field-header">
            <span className="adm-content__icon" aria-hidden="true">🌍</span>
            <div>
              <h2 className="adm-content__field-title">Vision</h2>
              <p className="adm-content__field-hint">
                Describes the future AFACO is working toward.
                Shown on the Home and About pages alongside the Mission.
              </p>
            </div>
          </div>
          <div className={`adm-field${errors.vision ? ' adm-field--err' : ''}`}>
            <label htmlFor="content-vision" className="adm-label">
              Vision text <span className="adm-req">*</span>
            </label>
            <textarea
              id="content-vision"
              className={`adm-textarea${errors.vision ? ' adm-input--error' : ''}`}
              style={{ minHeight: 160 }}
              value={vision}
              onChange={(e) => handleChange('vision', e.target.value)}
              aria-required="true"
              aria-describedby={errors.vision ? 'vision-err' : undefined}
            />
            {errors.vision && (
              <p id="vision-err" className="adm-field-error">{errors.vision}</p>
            )}
            <p className="adm-content__char-count">{vision.length} characters</p>
          </div>
        </div>
      </div>

      <div className="adm-card adm-form adm-content__partners">
        <div className="adm-content__field-header">
          <span className="adm-content__icon" aria-hidden="true">🤝</span>
          <div>
            <h2 className="adm-content__field-title">Partners</h2>
            <p className="adm-content__field-hint">
              Add and manage the organisations shown in the Our Partners section on the About page.
            </p>
          </div>
          <button type="button" className="adm-btn adm-btn--ghost adm-content__add-partner" onClick={addPartner}>
            + Add partner
          </button>
        </div>

        <div className="adm-content__partners-list">
          {partners.map((partner, index) => (
            <div key={index} className={`adm-content__partner-row${errors.partners ? ' adm-field--err' : ''}`}>
              {partner.imageUrl && (
                <img src={partner.imageUrl} alt="" className="adm-content__partner-image" />
              )}
              <div className="adm-content__partner-fields">
                <label htmlFor={`content-partner-${index}`} className="adm-sr-only">Partner {index + 1} name</label>
              <input
                id={`content-partner-${index}`}
                className="adm-input"
                value={partner.name}
                onChange={(event) => updatePartner(index, 'name', event.target.value)}
                placeholder="Partner organisation name"
              />
              <label htmlFor={`content-partner-description-${index}`} className="adm-sr-only">Partner {index + 1} description</label>
              <textarea
                id={`content-partner-description-${index}`}
                className="adm-textarea"
                value={partner.description}
                onChange={(event) => updatePartner(index, 'description', event.target.value)}
                placeholder="Who they are and how they work with AFACO"
                rows="2"
              />
              <input
                className="adm-input"
                value={partner.imageUrl}
                onChange={(event) => updatePartner(index, 'imageUrl', event.target.value)}
                placeholder="Image URL (optional)"
                aria-label={`Image URL for partner ${index + 1}`}
              />
              <label className="adm-btn adm-btn--outline adm-btn--sm adm-content__upload-partner">
                {uploadingPartner === index ? 'Uploading…' : 'Upload image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handlePartnerImage(index, event.target.files[0])}
                  disabled={uploadingPartner !== null}
                  className="adm-content__file-input"
                />
              </label>
              </div>
              <button
                type="button"
                className="adm-btn adm-btn--danger adm-content__remove-partner"
                onClick={() => removePartner(index)}
                aria-label={`Remove partner ${index + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
          {!partners.length && <p className="adm-content__empty">No partners added yet.</p>}
        </div>
        {errors.partners && <p className="adm-field-error">{errors.partners}</p>}
      </div>

      {/* Live preview */}
      <div className="adm-card adm-content__preview">
        <h3 className="adm-content__preview-title">Live preview</h3>
        <div className="adm-content__preview-grid">
          <div className="adm-content__preview-block">
            <span className="adm-content__preview-label">Mission</span>
            <p>{mission || <em className="adm-content__preview-empty">Empty</em>}</p>
          </div>
          <div className="adm-content__preview-block">
            <span className="adm-content__preview-label">Vision</span>
            <p>{vision || <em className="adm-content__preview-empty">Empty</em>}</p>
          </div>
          <div className="adm-content__preview-block">
            <span className="adm-content__preview-label">Partners</span>
            <p>{partners.length ? partners.map((partner) => partner.name).join(' · ') : <em className="adm-content__preview-empty">None added</em>}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
