'use client'

import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps, SVGMotionProps } from 'framer-motion'
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance'

// Type definitions for accessible motion components
type AccessibleMotionProps = HTMLMotionProps<'div'> & {
  respectMotionPreference?: boolean
  fallbackComponent?: React.ComponentType<Record<string, unknown>>
  performanceOptimized?: boolean
  critical?: boolean // For critical animations that should never be disabled
}

type AccessibleMotionSpanProps = HTMLMotionProps<'span'> & {
  respectMotionPreference?: boolean
  fallbackComponent?: React.ComponentType<Record<string, unknown>>
  performanceOptimized?: boolean
  critical?: boolean // For critical animations that should never be disabled
}

type AccessibleMotionSVGProps = SVGMotionProps<SVGSVGElement> & {
  respectMotionPreference?: boolean
  performanceOptimized?: boolean
  critical?: boolean
}

// Main accessible motion div component
export const AccessibleMotionDiv = forwardRef<HTMLDivElement, AccessibleMotionProps>(
  ({ 
    children, 
    respectMotionPreference = true, 
    performanceOptimized = true,
    critical = false,
    animate,
    initial,
    exit,
    transition,
    variants,
    ...props 
  }, ref) => {
    const { shouldAnimate, getOptimizedProps, config } = useAnimationPerformance()
    
    // Determine if we should show animations
    const enableAnimations = critical || (shouldAnimate && (respectMotionPreference ? !config.reducedMotion : true))
    
    if (!enableAnimations) {
      // Return a regular div if animations are disabled
      const { 
        animate, 
        initial, 
        exit, 
        transition,
        variants,
        whileHover,
        whileTap,
        whileFocus,
        whileInView,
        ...restProps 
      } = props as Record<string, unknown>
      
      // Prevent ESLint warnings for unused variables
      void animate; void initial; void exit; void transition; void variants; void whileHover; void whileTap; void whileFocus; void whileInView;
      
      return (
        <div ref={ref} {...restProps}>
          {children as React.ReactNode}
        </div>
      )
    }

    // Get optimized props if performance optimization is enabled
    const rawOptimizedProps = performanceOptimized ? getOptimizedProps() : {} as Record<string, unknown>
    const optimizedProps = {
      ...rawOptimizedProps,
      // Convert boolean values to proper motion types
      animate: (rawOptimizedProps as Record<string, unknown>).animate === true ? {} : (rawOptimizedProps as Record<string, unknown>).animate || animate,
      initial: (rawOptimizedProps as Record<string, unknown>).initial === true ? {} : (rawOptimizedProps as Record<string, unknown>).initial !== false ? initial : false,
      exit: (rawOptimizedProps as Record<string, unknown>).exit === true ? {} : (rawOptimizedProps as Record<string, unknown>).exit || exit,
      transition: (rawOptimizedProps as Record<string, unknown>).transition || transition
    }
    
    // Merge props with performance optimizations
    const motionProps = {
      ref,
      ...optimizedProps,
      ...props,
      animate: animate || optimizedProps.animate,
      initial: initial !== false ? (initial || optimizedProps.initial) : false,
      exit: exit || optimizedProps.exit,
      transition: transition || optimizedProps.transition,
      variants
    }

    return (
      <motion.div {...motionProps}>
        {children as React.ReactNode}
      </motion.div>
    )
  }
)

AccessibleMotionDiv.displayName = 'AccessibleMotionDiv'

// Accessible motion span component
export const AccessibleMotionSpan = forwardRef<HTMLSpanElement, AccessibleMotionSpanProps>(
  ({ 
    children, 
    respectMotionPreference = true, 
    performanceOptimized = true,
    critical = false,
    ...props 
  }, ref) => {
    const { shouldAnimate, getOptimizedProps, config } = useAnimationPerformance()
    
    const enableAnimations = critical || (shouldAnimate && (respectMotionPreference ? !config.reducedMotion : true))
    
    if (!enableAnimations) {
      // For non-animated spans, filter out ALL framer-motion specific props
      const safeProps = Object.fromEntries(
        Object.entries(props).filter(([key, value]) => {
          // Remove all framer-motion specific props
          if (['animate', 'initial', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileFocus', 'whileInView'].includes(key)) return false
          if (key.startsWith('on') && typeof value === 'function') {
            // Only keep standard HTML event handlers
            const standardEvents = ['onClick', 'onMouseEnter', 'onMouseLeave', 'onKeyDown', 'onKeyUp', 'onKeyPress']
            return standardEvents.includes(key)
          }
          if (key === 'style' && value && typeof value === 'object') {
            // Filter style object
            return true // We'll handle this separately
          }
          return true
        })
      )
      
      // Filter style separately
      const filteredStyle = props.style ? Object.fromEntries(
        Object.entries(props.style).filter(([, value]) => {
          if (typeof value === 'object' && value !== null && 'set' in value) return false // MotionValue
          return typeof value === 'string' || typeof value === 'number'
        })
      ) : undefined
      
      return (
        <span ref={ref} {...safeProps} style={filteredStyle}>
          {children as React.ReactNode}
        </span>
      )
    }

    const rawOptimizedProps = performanceOptimized ? getOptimizedProps() : {} as Record<string, unknown>
    const optimizedProps = {
      ...rawOptimizedProps,
      // Convert boolean values to proper motion types
      animate: (rawOptimizedProps as Record<string, unknown>).animate === true ? {} : (rawOptimizedProps as Record<string, unknown>).animate,
      initial: (rawOptimizedProps as Record<string, unknown>).initial === true ? {} : (rawOptimizedProps as Record<string, unknown>).initial !== false ? (rawOptimizedProps as Record<string, unknown>).initial : false,
      exit: (rawOptimizedProps as Record<string, unknown>).exit === true ? {} : (rawOptimizedProps as Record<string, unknown>).exit,
      transition: (rawOptimizedProps as Record<string, unknown>).transition
    }
    
    return (
      <motion.span ref={ref} {...optimizedProps} {...props}>
        {children as React.ReactNode}
      </motion.span>
    )
  }
)

AccessibleMotionSpan.displayName = 'AccessibleMotionSpan'

// Accessible motion button component
export const AccessibleMotionButton = forwardRef<HTMLButtonElement, AccessibleMotionProps>(
  ({ 
    children, 
    respectMotionPreference = true, 
    performanceOptimized = true,
    critical = false,
    ...props 
  }, ref) => {
    const { shouldAnimate, getOptimizedProps, config } = useAnimationPerformance()
    
    const enableAnimations = critical || (shouldAnimate && (respectMotionPreference ? !config.reducedMotion : true))
    
    if (!enableAnimations) {
      // For non-animated buttons, filter out ALL framer-motion specific props
      const safeProps = Object.fromEntries(
        Object.entries(props).filter(([key, value]) => {
          // Remove all framer-motion specific props
          if (['animate', 'initial', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileFocus', 'whileInView'].includes(key)) return false
          if (key.startsWith('on') && typeof value === 'function') {
            // Only keep standard HTML event handlers
            const standardEvents = ['onClick', 'onMouseEnter', 'onMouseLeave', 'onKeyDown', 'onKeyUp', 'onKeyPress', 'onFocus', 'onBlur']
            return standardEvents.includes(key)
          }
          if (key === 'style' && value && typeof value === 'object') {
            return true // We'll handle this separately
          }
          return true
        })
      )
      
      // Filter style separately
      const filteredStyle = props.style ? Object.fromEntries(
        Object.entries(props.style).filter(([, value]) => {
          if (typeof value === 'object' && value !== null && 'set' in value) return false // MotionValue
          return typeof value === 'string' || typeof value === 'number'
        })
      ) : undefined
      
      return (
        <button ref={ref} {...safeProps} style={filteredStyle}>
          {children as React.ReactNode}
        </button>
      )
    }

    const rawOptimizedProps = performanceOptimized ? getOptimizedProps() : {} as Record<string, unknown>
    const optimizedProps = {
      ...rawOptimizedProps,
      // Convert boolean values to proper motion types
      animate: (rawOptimizedProps as Record<string, unknown>).animate === true ? {} : (rawOptimizedProps as Record<string, unknown>).animate,
      initial: (rawOptimizedProps as Record<string, unknown>).initial === true ? {} : (rawOptimizedProps as Record<string, unknown>).initial !== false ? (rawOptimizedProps as Record<string, unknown>).initial : false,
      exit: (rawOptimizedProps as Record<string, unknown>).exit === true ? {} : (rawOptimizedProps as Record<string, unknown>).exit,
      transition: (rawOptimizedProps as Record<string, unknown>).transition
    }
    
    // Enhanced button-specific animations
    const buttonAnimations = {
      whileHover: props.whileHover || { scale: 1.02 },
      whileTap: props.whileTap || { scale: 0.98 },
      whileFocus: props.whileFocus || { scale: 1.01 },
      transition: { duration: 0.2, ease: 'easeOut' }
    }
    
    // Filter out ALL problematic event handlers for motion.button
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([key, value]) => {
        // Keep only safe event handlers and standard props
        if (key.startsWith('on') && typeof value === 'function') {
          const safeEvents = ['onClick', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyUp']
          return safeEvents.includes(key)
        }
        return true
      })
    )
    
    return (
      <motion.button 
        ref={ref} 
        {...optimizedProps} 
        {...buttonAnimations}
        {...filteredProps}
      >
        {children as React.ReactNode}
      </motion.button>
    )
  }
)

AccessibleMotionButton.displayName = 'AccessibleMotionButton'

// Accessible motion SVG component
export const AccessibleMotionSVG = forwardRef<SVGSVGElement, AccessibleMotionSVGProps>(
  ({ 
    children, 
    respectMotionPreference = true, 
    performanceOptimized = true,
    critical = false,
    ...props 
  }, ref) => {
    const { shouldAnimate, getOptimizedProps, config } = useAnimationPerformance()
    
    const enableAnimations = critical || (shouldAnimate && (respectMotionPreference ? !config.reducedMotion : true))
    
    if (!enableAnimations) {
      // For non-animated SVGs, filter out ALL framer-motion specific props
      const safeProps = Object.fromEntries(
        Object.entries(props).filter(([key, value]) => {
          // Remove all framer-motion specific props
          if (['animate', 'initial', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileFocus', 'whileInView'].includes(key)) return false
          if (key.startsWith('on') && typeof value === 'function') {
            // Only keep standard HTML event handlers
            const standardEvents = ['onClick', 'onMouseEnter', 'onMouseLeave']
            return standardEvents.includes(key)
          }
          // Filter out MotionValue types
          if (typeof value === 'object' && value !== null && 'set' in value) return false
          // Keep only string/number values for attributes
          if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean' && value !== undefined) return false
          return true
        })
      )
      
      return (
        <svg ref={ref} {...safeProps}>
          {children as React.ReactNode}
        </svg>
      )
    }

    const rawOptimizedProps = performanceOptimized ? getOptimizedProps() : {} as Record<string, unknown>
    const optimizedProps = {
      ...rawOptimizedProps,
      // Convert boolean values to proper motion types
      animate: (rawOptimizedProps as Record<string, unknown>).animate === true ? {} : (rawOptimizedProps as Record<string, unknown>).animate,
      initial: (rawOptimizedProps as Record<string, unknown>).initial === true ? {} : (rawOptimizedProps as Record<string, unknown>).initial !== false ? (rawOptimizedProps as Record<string, unknown>).initial : false,
      exit: (rawOptimizedProps as Record<string, unknown>).exit === true ? {} : (rawOptimizedProps as Record<string, unknown>).exit,
      transition: (rawOptimizedProps as Record<string, unknown>).transition
    }
    
    return (
      <motion.svg ref={ref} {...optimizedProps} {...props}>
        {children as React.ReactNode}
      </motion.svg>
    )
  }
)

AccessibleMotionSVG.displayName = 'AccessibleMotionSVG'

// Higher-order component for making any component accessible
export function withAccessibleMotion<P extends object>(
  Component: React.ComponentType<P>,
  defaultProps?: Partial<AccessibleMotionProps>
) {
  const WrappedComponent = forwardRef<HTMLElement, P & AccessibleMotionProps>((props, ref) => {
    const { shouldAnimate, config } = useAnimationPerformance()
    const { respectMotionPreference = true, critical = false, ...restProps } = props
    
    const enableAnimations = critical || (shouldAnimate && (respectMotionPreference ? !config.reducedMotion : true))
    
    if (!enableAnimations) {
      return <Component ref={ref} {...(restProps as P)} />
    }
    
    return <Component ref={ref} {...defaultProps} {...(restProps as P)} />
  })
  
  WrappedComponent.displayName = `withAccessibleMotion(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Utility hook for creating accessible variants
export function useAccessibleVariants() {
  const { config, getAnimationVariants } = useAnimationPerformance()
  
  return React.useMemo(() => {
    if (config.reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      }
    }
    
    return getAnimationVariants()
  }, [config.reducedMotion, getAnimationVariants])
}

// Preset accessible animations
export const accessibleVariants = {
  // Gentle fade that respects reduced motion
  gentleFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  
  // Subtle slide that becomes fade in reduced motion
  subtleSlide: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  
  // Scale animation that becomes fade in reduced motion
  gentleScale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  
  // Container with stagger
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  },
  
  // Items for stagger container
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }
}

export default AccessibleMotionDiv