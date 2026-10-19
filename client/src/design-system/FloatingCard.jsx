import React from 'react';
import './floating-card.css';

/**
 * FloatingCard
 * Applies a smooth perpetual floating/bobbing micro-animation.
 *
 * @param {React.ReactNode} children - Target element
 * @param {number} distance - Bob distance in pixels (default 6)
 * @param {number} duration - Full cycle duration in seconds (default 6)
 * @param {number} delay - Animation start delay in seconds (default 0)
 * @param {'vertical'|'diagonal'} direction - Movement axis
 */
export function FloatingCard({
  children,
  distance = 6,
  duration = 6,
  delay = 0,
  direction = 'vertical',
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`hh-floating-card-wrapper dir-${direction} ${className}`}
      style={{
        '--hh-float-distance': `${distance}px`,
        '--hh-float-duration': `${duration}s`,
        '--hh-float-delay': `${delay}s`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
