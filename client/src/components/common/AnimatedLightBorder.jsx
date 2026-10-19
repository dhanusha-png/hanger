import React from 'react';

/**
 * AnimatedLightBorder
 * Reusable wrapper providing the luxury light-sweep perimeter beam effect.
 *
 * @param {'product'|'service'|'featured'|'button'|'final-cta'} variant - Preset timing & color palette
 * @param {1|2|3|4|5|6|number} phase - Staggered phase offset (1 through 6)
 * @param {string|React.ElementType} as - Component or tag to render (default 'div')
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Content inside the light border
 */
export function AnimatedLightBorder({
  as: Component = 'div',
  variant = 'product',
  phase = 1,
  className = '',
  children,
  ...props
}) {
  const isButton = variant === 'button' || variant === 'final-cta';
  const baseClass = isButton ? 'animated-light-button' : 'animated-light-border';
  const variantClass = variant === 'button'
    ? 'light-hero-btn'
    : variant === 'final-cta'
      ? 'light-final-cta'
      : `light-${variant}`;

  const normalizedPhase = ((Math.abs(Number(phase) - 1) % 6) + 1);
  const phaseClass = `light-phase-${normalizedPhase}`;

  return (
    <Component
      className={`${baseClass} ${variantClass} ${phaseClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default AnimatedLightBorder;
