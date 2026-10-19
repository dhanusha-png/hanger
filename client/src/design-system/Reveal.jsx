import React from 'react';
import { motion } from 'framer-motion';
import {
  fadeUp,
  fadeIn,
  scaleIn,
  slideFromLeft,
  slideFromRight,
  staggerContainer,
} from './motion';

const variantMap = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideLeft: slideFromLeft,
  slideRight: slideFromRight,
};

/**
 * Reveal
 * Viewport intersection reveal wrapper for smooth scroll entrances.
 *
 * @param {React.ReactNode} children - Target content
 * @param {'fadeUp'|'fadeIn'|'scaleIn'|'slideLeft'|'slideRight'} effect - Entrance animation style
 * @param {number} delay - Animation delay in seconds
 * @param {number} duration - Animation duration in seconds
 * @param {boolean} stagger - Whether children should stagger
 * @param {string} className - Optional class names
 */
export function Reveal({
  children,
  effect = 'fadeUp',
  delay = 0,
  duration,
  stagger = false,
  staggerDelay = 0.08,
  className = '',
  style = {},
  ...props
}) {
  const chosenVariant = stagger ? staggerContainer(staggerDelay, delay) : variantMap[effect] || fadeUp;

  const customTransition = duration
    ? { ...chosenVariant.visible.transition, duration, delay }
    : delay
    ? { ...chosenVariant.visible.transition, delay }
    : chosenVariant.visible?.transition;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: chosenVariant.hidden,
        visible: {
          ...chosenVariant.visible,
          transition: customTransition,
        },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
