import React from 'react';
import './skeleton.css';

/**
 * Skeleton
 * Shimmering gold placeholder loader for product cards, images, and content.
 *
 * @param {'rect'|'circle'|'text'} variant - Shape style
 * @param {string|number} width - Component width
 * @param {string|number} height - Component height
 * @param {string|number} borderRadius - Optional border radius
 */
export function Skeleton({
  variant = 'rect',
  width,
  height,
  borderRadius,
  className = '',
  style = {},
  ...props
}) {
  return (
    <span
      className={`hh-skeleton variant-${variant} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
