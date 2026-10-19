import React from 'react';
import { GlowBorder } from './GlowBorder';
import './glass-card.css';

/**
 * GlassCard
 * Standard dark luxury glass panel with backdrop blur and gold borders.
 *
 * @param {React.ReactNode} children - Card content
 * @param {'none'|'sm'|'md'|'lg'} padding - Internal padding scale
 * @param {boolean} hoverable - Whether to apply 6px lift and gold glow on hover
 * @param {boolean} glow - Whether to wrap with continuous rotating conic GlowBorder
 * @param {number|string} borderRadius - Border radius override
 * @param {string} className - Optional custom classes
 */
export function GlassCard({
  children,
  padding = 'md',
  hoverable = true,
  glow = false,
  glowVariant = 'gold',
  borderRadius = 18,
  className = '',
  style = {},
  ...props
}) {
  const cardElement = (
    <div
      className={`hh-glass-card pad-${padding} ${hoverable ? 'is-hoverable' : ''} ${className}`}
      style={{
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );

  if (glow) {
    return (
      <GlowBorder
        borderRadius={borderRadius}
        variant={glowVariant}
        className={className}
      >
        {cardElement}
      </GlowBorder>
    );
  }

  return cardElement;
}
