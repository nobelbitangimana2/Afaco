import React from 'react'
import { Link } from 'react-router-dom'
import './Button.css'

/**
 * Button / CTA component.
 * Renders as <a> (external), <Link> (internal route), or <button> depending on props.
 *
 * Props:
 *  variant   – 'primary' | 'secondary' | 'outline' | 'ghost'  (default: 'primary')
 *  size      – 'sm' | 'md' | 'lg'                             (default: 'md')
 *  to        – internal React Router path → renders as <Link>
 *  href      – external URL → renders as <a>
 *  type      – button type if rendered as <button>
 *  disabled
 *  fullWidth
 *  children
 *  ...rest   – passed to the underlying element
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    disabled  ? 'btn--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={cls} aria-disabled={disabled} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
