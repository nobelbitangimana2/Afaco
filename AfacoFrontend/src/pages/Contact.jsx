import React, { useEffect, useState } from 'react'
import Section from '../components/Section'
import Button  from '../components/Button'
import { useData } from '../store/DataContext'
import { getContactInfo, submitContactForm } from '../data/contact'
import './Contact.css'

const INITIAL = { name: '', email: '', message: '' }

function validate(fields) {
  const errors = {}
  if (!fields.name.trim())    errors.name    = 'Name is required.'
  if (!fields.email.trim())   errors.email   = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Please enter a valid email address.'
  if (!fields.message.trim()) errors.message = 'Message is required.'
  return errors
}

export default function Contact() {
  const { contact: liveContact } = useData()
  const [info,    setInfo]    = useState(null)
  const [fields,  setFields]  = useState(INITIAL)
  const [errors,  setErrors]  = useState({})
  const [status,  setStatus]  = useState('idle')
  const [touched, setTouched] = useState({})

  useEffect(() => {
    getContactInfo(liveContact).then(setInfo)
  }, [liveContact])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((f) => ({ ...f, [name]: value }))
    // Clear error on edit
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
  }

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = { name: true, email: true, message: true }
    setTouched(allTouched)
    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('submitting')
    try {
      await submitContactForm(fields)
      setStatus('success')
      setFields(INITIAL)
      setTouched({})
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  const fieldError = (name) => (touched[name] && errors[name]) ? errors[name] : ''

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="page-hero page-hero--green">
        <div className="container page-hero__inner">
          <span className="page-hero__label">Contact</span>
          <h1 className="page-hero__title">Get in Touch</h1>
          <p className="page-hero__sub">
            Whether you want to partner with us, support our work, or just learn more —
            we'd love to hear from you.
          </p>
        </div>
      </div>

      <Section id="contact">
        <div className="contact__grid">
          {/* Info panel */}
          <div className="contact__info">
            <h2 className="contact__info-heading">Contact Information</h2>

            {info && (
              <>
                <div className="contact__info-items">
                  <ContactInfoItem icon="📍" label="Address">
                    {info.address}
                  </ContactInfoItem>
                  <ContactInfoItem icon="📞" label="Phone">
                    <a href={`tel:${info.phone.replace(/\s/g,'')}`}>{info.phone}</a>
                  </ContactInfoItem>
                  <ContactInfoItem icon="✉️" label="Email">
                    <a href={`mailto:${info.email}`}>{info.email}</a>
                  </ContactInfoItem>
                  <ContactInfoItem icon="🕐" label="Office Hours">
                    {info.officeHours}
                  </ContactInfoItem>
                </div>

                {/* Social links */}
                <div className="contact__social">
                  <p className="contact__social-label">Follow us</p>
                  <div className="contact__social-links">
                    {Object.entries(info.socialLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact__social-link"
                        aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Map embed */}
            <div className="contact__map" aria-label="Map showing AFACO location">
              <iframe
                title="AFACO location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=29.27%2C0.13%2C29.30%2C0.16&layer=mapnik"
                width="100%"
                height="220"
                style={{ border: 'none', borderRadius: 'var(--radius)' }}
                loading="lazy"
                aria-label="OpenStreetMap embed showing Butembo area"
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="contact__form-wrap">
            <h2 className="contact__form-heading">Send a Message</h2>

            {status === 'success' ? (
              <div className="contact__success" role="alert">
                <span className="contact__success-icon" aria-hidden="true">✅</span>
                <h3>Message sent!</h3>
                <p>
                  Thank you for reaching out. A member of the AFACO team will get back
                  to you within 2–3 business days.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setStatus('idle')}
                  className="contact__success-btn"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                className="contact__form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >
                {/* Name */}
                <div className={`form-field${fieldError('name') ? ' form-field--error' : ''}`}>
                  <label htmlFor="name" className="form-label">
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={fields.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="name"
                    aria-required="true"
                    aria-describedby={fieldError('name') ? 'name-error' : undefined}
                    placeholder="Your full name"
                  />
                  {fieldError('name') && (
                    <p id="name-error" className="form-error" role="alert">{fieldError('name')}</p>
                  )}
                </div>

                {/* Email */}
                <div className={`form-field${fieldError('email') ? ' form-field--error' : ''}`}>
                  <label htmlFor="email" className="form-label">
                    Email Address <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={fields.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                    aria-required="true"
                    aria-describedby={fieldError('email') ? 'email-error' : undefined}
                    placeholder="you@example.com"
                  />
                  {fieldError('email') && (
                    <p id="email-error" className="form-error" role="alert">{fieldError('email')}</p>
                  )}
                </div>

                {/* Message */}
                <div className={`form-field${fieldError('message') ? ' form-field--error' : ''}`}>
                  <label htmlFor="message" className="form-label">
                    Message <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-input form-textarea"
                    value={fields.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={6}
                    aria-required="true"
                    aria-describedby={fieldError('message') ? 'message-error' : undefined}
                    placeholder="How can we help you?"
                  />
                  {fieldError('message') && (
                    <p id="message-error" className="form-error" role="alert">{fieldError('message')}</p>
                  )}
                </div>

                {status === 'error' && (
                  <p className="form-submit-error" role="alert">
                    Something went wrong. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </Button>

                <p className="form-note">
                  Fields marked <span aria-hidden="true">*</span> are required.
                </p>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}

function ContactInfoItem({ icon, label, children }) {
  return (
    <div className="cii">
      <span className="cii__icon" aria-hidden="true">{icon}</span>
      <div>
        <p className="cii__label">{label}</p>
        <div className="cii__value">{children}</div>
      </div>
    </div>
  )
}
