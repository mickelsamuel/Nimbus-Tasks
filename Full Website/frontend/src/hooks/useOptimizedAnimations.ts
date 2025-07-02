import { useMemo } from 'react'

export const useOptimizedAnimations = () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Optimized animation variants
  const animations = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        fadeIn: { opacity: 1, y: 0 },
        fadeOut: { opacity: 0, y: 0 },
        slideUp: { opacity: 1, y: 0 },
        scaleIn: { opacity: 1, scale: 1 },
        transition: { duration: 0 }
      }
    }

    return {
      fadeIn: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
      },
      slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      },
      scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
      },
      stagger: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: 'easeOut' }
      },
      hover: {
        whileHover: { y: -2 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 }
      },
      transition: {
        default: { duration: 0.3, ease: 'easeOut' },
        fast: { duration: 0.2, ease: 'easeOut' },
        slow: { duration: 0.5, ease: 'easeOut' }
      }
    }
  }, [prefersReducedMotion])

  return { animations, prefersReducedMotion }
}

export const OPTIMIZED_TRANSITIONS = {
  fast: { duration: 0.2, ease: 'easeOut' },
  default: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeOut' }
}

export const REDUCED_STAGGER = {
  staggerChildren: 0.05,
  delayChildren: 0.1
}