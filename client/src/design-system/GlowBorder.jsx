import React from 'react';
import './glow-border.css';

/**
 * GlowBorder
 * Wraps any card or container with a rotating conic beam of gold or emerald light.
 *
 * @param {React.ReactNode} children - Target content
 * @param {string} className - Optional container classes
 * @param {number|string} borderRadius - Border radius (e.g. 18, '22px')
 * @param {number} duration - Full rotation duration in seconds (default 4.5)
 * @param {'gold'|'emerald'} variant - Glow color scheme
 * @param {boolean} active - Whether the rotating beam is enabled
 */
export function GlowBorder({
  children,
  className = '',
  borderRadius = 20,
  duration = 4.5,
  variant = 'gold',
  active = true,
  style = {},
  ...props
}) {
  const radiusValue = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  return (
    <div
      className={`hh-glow-border-wrapper ${variant === 'emerald' ? 'hh-glow-border-emerald' : ''} ${className}`}
      style={{
        '--hh-border-radius': radiusValue,
        '--hh-glow-duration': `${duration}s`,
        ...style,
      }}
      {...props}
    >
      {active && <div className="hh-glow-border-conic" aria-hidden="true" />}
      <div className="hh-glow-border-inner">{children}</div>
    </div>
  );
}
