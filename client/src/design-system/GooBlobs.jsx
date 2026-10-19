import React from 'react';
import './goo-blobs.css';

/**
 * GooBlobs
 * Renders ambient organic drifting blobs with liquid gooey SVG blending.
 *
 * @param {'sm'|'md'|'lg'} size - Dimensions scale
 * @param {number} opacity - Layer transparency (default 0.38)
 * @param {string} className - Optional positioning classes
 */
export function GooBlobs({
  size = 'md',
  opacity = 0.38,
  className = '',
  style = {},
  ...props
}) {
  return (
    <>
      {/* Shared Global Gooey Filter if not already rendered */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="hh-system-gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className={`hh-goo-blobs-container size-${size} ${className}`}
        style={{ opacity, ...style }}
        aria-hidden="true"
        {...props}
      >
        <div className="hh-goo-blob blob-emerald-1" />
        <div className="hh-goo-blob blob-gold" />
        <div className="hh-goo-blob blob-emerald-2" />
        <div className="hh-goo-blob blob-accent" />
      </div>
    </>
  );
}
