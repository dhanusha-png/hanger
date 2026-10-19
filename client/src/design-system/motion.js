/**
 * HangerHome Framer Motion Variants & Animation Utilities
 * Provides consistent spring curves, stagger configs, and entrance transitions.
 */

export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  smooth: {
    duration: 0.45,
    ease: [0.16, 1, 0.3, 1],
  },
  gentle: {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1],
  },
  fast: {
    duration: 0.22,
    ease: 'easeOut',
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
};

export const slideFromLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

export const slideFromRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.015,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

export const tapPress = {
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};
