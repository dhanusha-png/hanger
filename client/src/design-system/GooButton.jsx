import React from 'react';
import { Link } from 'react-router-dom';
import './goo-button.css';

/**
 * GooButton
 * Polymorphic luxury button supporting router links, external hrefs, and standard buttons.
 *
 * @param {'primary'|'outline'|'soft'} variant - Visual theme
 * @param {'sm'|'md'|'lg'} size - Padding and font scale
 * @param {string} to - React Router path
 * @param {string} href - External URL
 * @param {boolean} loading - Loading spinner state
 * @param {React.ReactNode} icon - Icon component
 * @param {'left'|'right'} iconPosition - Icon side
 */
export function GooButton({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  loading = false,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  const combinedClasses = `hh-btn hh-btn-${variant} size-${size} ${loading ? 'is-loading' : ''} ${className}`;

  const content = (
    <>
      {loading ? (
        <span className="hh-btn-spinner" aria-hidden="true" />
      ) : (
        icon && iconPosition === 'left' && (
          <span className="hh-btn-icon-left">{icon}</span>
        )
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="hh-btn-icon-right">{icon}</span>
      )}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}
