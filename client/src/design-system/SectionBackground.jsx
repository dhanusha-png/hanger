import React from 'react';
import './section-background.css';

/**
 * SectionBackground
 * Provides an ambient dark luxury background with radial emerald/gold lighting.
 *
 * @param {React.ReactNode} children - Section inner contents
 * @param {boolean} showRadial - Whether to render centered ambient radial spotlight
 * @param {string} className - Optional custom classes
 */
export function SectionBackground({
  children,
  showRadial = true,
  className = '',
  style = {},
  ...props
}) {
  return (
    <section className={`hh-section-bg-wrapper ${className}`} style={style} {...props}>
      <div className="hh-section-bg-overlay" aria-hidden="true">
        {showRadial && <div className="hh-section-bg-radial" />}
      </div>
      <div className="hh-section-bg-content">{children}</div>
    </section>
  );
}
