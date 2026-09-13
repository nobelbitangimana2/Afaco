import React, { useEffect, useState } from 'react'
import Button  from '../components/Button'
import { useData } from '../store/DataContext'
import { getContactInfo, submitContactForm } from '../data/contact'
import './Contact.css'

const INIT = { name: '', email: '', message: '' }

function validate(f) {
  const e = {}
  if (!f.name.trim())    e.name    = 'Name is required.'
  if (!f.email.trim())   e.email   = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email.'
  if (!f.message.trim()) e.message = 'Message is required.'
  return e
}

export default function Contact() {
  const { contact: liveContact } = useData()
  const [info,    setInfo]    = useState(null)
  const [fields,  setFields]  = useState(INIT)
  const [errors,  setErrors]  = useState({})
  const [touched, setTouched] = useState({})
  const [status,  setStatus]  = useState('idle')

  useEffect(() => { getContactInfo(liveContact).then(setInfo) }, [liveContact])

  const handleChange = e => {
    const { name, value } = e.target
    setFields(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }
  const handleBlur = e => setTouched(t => ({ ...t, [e.target.name]: true }))
  const fieldErr   = n => touched[n] && errors[n] ? errors[n] : ''

  const handleSubmit = async e => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('submitting')
    try {
      await submitContactForm(fields)
      setStatus('success')
      setFields(INIT)
      setTouched({})
      setErrors({})
    } catch (err) {
      console.error('Contact form error:', err.message)
      setStatus('error')
    }
  }

  return (
    <div className="contact-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">Contact</span>
          <h1 className="page-hero__title">Get in Touch</h1>
          <p className="page-hero__sub">
            Whether you want to partner with us, place a bulk order, or just learn more —
            we'd love to hear from you.
          </p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container contact__grid">

          {/* Info */}
          <div className="contact__info">
            <h2 className="contact__heading">Contact Information</h2>
            {info && (
              <>
                <div className="contact__items">
                  {[
                    { icon: '📍', label: 'Address',      value: info.address     },
                    { icon: '📞', label: 'Phone',        value: info.phone,  href: `tel:${(info.phone||'').replace(/\s/g,'')}` },
                    { icon: '✉️', label: 'Email',        value: info.email,  href: `mailto:${info.email}` },
                    { icon: '🕐', label: 'Office Hours', value: info.officeHours },
                  ].filter(x => x.value).map(({ icon, label, value, href }) => (
                    <div key={label} className="contact__item">
                      <span className="contact__item-icon" aria-hidden="true">{icon}</span>
                      <div>
                        <p className="contact__item-label">{label}</p>
                        <div className="contact__item-value">
                          {href ? <a href={href}>{value}</a> : value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {info.socialLinks && (
                  <div className="contact__social">
                    <p className="contact__social-label">Follow us</p>
                    <div className="contact__social-pills">
                      {Object.entries(info.socialLinks).map(([p, url]) =>
                        url ? (
                          <a key={p} href={url} target="_blank" rel="noopener noreferrer"
                            className="contact__social-pill">
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </a>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Map */}
            <div className="contact__map">
              <iframe
                title="AFACO location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=29.27%2C0.13%2C29.30%2C0.16&layer=mapnik"
                width="100%" height="220"
                style={{ border: 'none', borderRadius: 'var(--radius)' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="contact__form-wrap">
            <h2 className="contact__heading">Send a Message</h2>

            {status === 'success' ? (
              <div className="contact__success" role="alert">
                <span className="contact__success-icon" aria-hidden="true">✅</span>
                <h3>Message sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 2–3 business days.</p>
                <Button variant="outline" onClick={() => setStatus('idle')}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                {[
                  { id: 'name',    label: 'Full Name',      type: 'text',  autoComplete: 'name',  placeholder: 'Your full name'  },
                  { id: 'email',   label: 'Email Address',  type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
                ].map(({ id, label, type, autoComplete, placeholder }) => (
                  <div key={id} className={`cform-field${fieldErr(id) ? ' cform-field--error' : ''}`}>
                    <label htmlFor={id} className="cform-label">{label} <span aria-hidden="true">*</span></label>
                    <input
                      id={id} name={id} type={type}
                      className="cform-input"
                      value={fields[id]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      aria-required="true"
                      disabled={status === 'submitting'}
                    />
                    {fieldErr(id) && <p className="cform-error" role="alert">{fieldErr(id)}</p>}
                  </div>
                ))}

                <div className={`cform-field${fieldErr('message') ? ' cform-field--error' : ''}`}>
                  <label htmlFor="message" className="cform-label">Message <span aria-hidden="true">*</span></label>
                  <textarea
                    id="message" name="message"
                    className="cform-input cform-textarea"
                    value={fields.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={6}
                    placeholder="How can we help you?"
                    aria-required="true"
                    disabled={status === 'submitting'}
                  />
                  {fieldErr('message') && <p className="cform-error" role="alert">{fieldErr('message')}</p>}
                </div>

                {status === 'error' && (
                  <p className="cform-submit-error" role="alert">
                    Something went wrong. Please try again.
                  </p>
                )}

                <Button type="submit" size="lg" fullWidth disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
