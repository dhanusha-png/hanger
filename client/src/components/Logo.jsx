import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon128 from '../assets/brand/logo-icon-128.png';
import logoIcon256 from '../assets/brand/logo-icon-256.png';
import logoIcon512 from '../assets/brand/logo-icon-512.png';
import logoIcon1024 from '../assets/brand/logo-icon-1024.png';
import './logo.css';

/**
 * Reusable HangerHome Brand Logo Component
 * 
 * @param {'icon'|'lockup'|'stacked'} variant - Display variant
 * @param {number|string} height - Height of the icon in pixels (default 44)
 * @param {number|string} size - Alias for height
 * @param {string|false|null} link - Target link route (default '/')
 * @param {boolean} isNavbar - Whether this is the main navbar logo
 * @param {string} alt - Override alt text
 * @param {string} className - Additional CSS class name
 * @param {Function} onClick - Optional click handler
 */
export function Logo({
  variant = 'lockup',
  height,
  size,
  link = '/',
  isNavbar = false,
  alt,
  className = '',
  onClick,
  style = {},
  ...props
}) {
  const iconHeight = Number(height || size || (variant === 'stacked' ? 56 : 44));
  const showText = variant !== 'icon' && iconHeight >= 28;

  // Rule: alt="HangerHome" on navbar logo only, decorative repeats use alt=""
  const altText = alt !== undefined ? alt : (isNavbar ? 'HangerHome' : '');
  const loadingMode = isNavbar ? 'eager' : 'lazy';

  const iconElement = (
    <img
      src={logoIcon512}
      srcSet={`${logoIcon128} 128w, ${logoIcon256} 256w, ${logoIcon512} 512w, ${logoIcon1024} 1024w`}
      sizes={`${iconHeight}px`}
      width={iconHeight}
      height={iconHeight}
      alt={altText}
      decoding="async"
      loading={loadingMode}
      className="hh-logo-img"
      style={{
        width: `${iconHeight}px`,
        height: `${iconHeight}px`,
        minWidth: `${iconHeight}px`,
        minHeight: `${iconHeight}px`,
      }}
    />
  );

  const textElement = showText ? (
    <span className="hh-logo-text" aria-hidden="true">
      <span className="hh-logo-hanger">HANGER</span>
      <span className="hh-logo-home">HOME</span>
    </span>
  ) : null;

  const variantClass = !showText
    ? 'hh-logo-icon-only'
    : variant === 'stacked'
    ? 'hh-logo-stacked'
    : 'hh-logo-lockup';

  const combinedClass = `hh-logo ${variantClass} ${isNavbar ? 'hh-navbar-logo' : ''} ${className}`.trim();

  const content = (
    <>
      {iconElement}
      {textElement}
    </>
  );

  if (link) {
    return (
      <Link
        to={link}
        className={combinedClass}
        onClick={onClick}
        aria-label={isNavbar ? 'HangerHome home' : undefined}
        style={style}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={combinedClass}
      onClick={onClick}
      style={style}
      {...props}
    >
      {content}
    </div>
  );
}

export default Logo;
