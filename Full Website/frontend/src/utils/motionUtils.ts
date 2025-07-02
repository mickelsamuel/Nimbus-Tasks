// Motion utilities for performance optimization
export const getReducedMotionConfig = () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    // Reduced motion variants
    fadeIn: prefersReducedMotion 
      ? { opacity: 1 }
      : { 
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2, ease: "easeOut" }
        },
    
    slideIn: prefersReducedMotion
      ? { opacity: 1, y: 0 }
      : {
          initial: { opacity: 0, y: 5 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.15, ease: "easeOut" }
        },
    
    // Subtle hover effects that respect motion preferences
    hover: prefersReducedMotion
      ? {}
      : { scale: 1.02, transition: { duration: 0.1 } },
    
    // Container animations with stagger
    container: prefersReducedMotion
      ? { opacity: 1 }
      : {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { 
              staggerChildren: 0.03,
              delayChildren: 0.05
            }
          }
        }
  }
}

// Utility to disable animations entirely if needed
export const getMotionProps = (enableMotion = true) => {
  if (!enableMotion) {
    return {
      initial: false,
      animate: false,
      exit: false,
      transition: { duration: 0 }
    }
  }
  
  return getReducedMotionConfig()
}