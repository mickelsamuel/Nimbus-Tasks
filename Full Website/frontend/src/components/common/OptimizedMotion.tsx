'use client'

import React, { forwardRef, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion, MotionProps } from 'framer-motion'
import { useInViewport } from '@/hooks/usePerformance'

// Performance-optimized motion variants
export const optimizedVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }
}

interface OptimizedMotionProps extends MotionProps {
  variant?: keyof typeof optimizedVariants
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
  threshold?: number
}

// Main optimized motion component
export const OptimizedMotion = forwardRef<HTMLDivElement, OptimizedMotionProps>(
  ({ variant = 'fadeIn', children, className, delay = 0, once = true, threshold = 0.1, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    const { ref: inViewRef, isInView, hasBeenInView } = useInViewport({ threshold }, once)

    const motionProps = useMemo(() => {
      if (shouldReduceMotion) {
        return {
          initial: {},
          animate: {},
          variants: {}
        }
      }

      const variantConfig = optimizedVariants[variant]
      
      return {
        initial: "hidden",
        animate: (isInView || hasBeenInView) ? "visible" : "hidden",
        variants: variantConfig,
        transition: { delay },
        ...props
      }
    }, [shouldReduceMotion, variant, isInView, hasBeenInView, delay, props])

    return (
      <motion.div
        ref={(el) => {
          inViewRef.current = el
          if (typeof ref === 'function') ref(el)
          else if (ref) ref.current = el
        }}
        className={`perf-isolated ${className || ''}`}
        {...motionProps}
      >
        {children}
      </motion.div>
    )
  }
)

OptimizedMotion.displayName = 'OptimizedMotion'

// Specialized components for common use cases
export const FadeIn = ({ children, className, delay, ...props }: Omit<OptimizedMotionProps, 'variant'>) => (
  <OptimizedMotion variant="fadeIn" className={className} delay={delay} {...props}>
    {children}
  </OptimizedMotion>
)

export const SlideUp = ({ children, className, delay, ...props }: Omit<OptimizedMotionProps, 'variant'>) => (
  <OptimizedMotion variant="slideUp" className={className} delay={delay} {...props}>
    {children}
  </OptimizedMotion>
)

export const SlideDown = ({ children, className, delay, ...props }: Omit<OptimizedMotionProps, 'variant'>) => (
  <OptimizedMotion variant="slideDown" className={className} delay={delay} {...props}>
    {children}
  </OptimizedMotion>
)

export const SlideLeft = ({ children, className, delay, ...props }: Omit<OptimizedMotionProps, 'variant'>) => (
  <OptimizedMotion variant="slideLeft" className={className} delay={delay} {...props}>
    {children}
  </OptimizedMotion>
)

export const SlideRight = ({ children, className, delay, ...props }: Omit<OptimizedMotionProps, 'variant'>) => (
  <OptimizedMotion variant="slideRight" className={className} delay={delay} {...props}>
    {children}
  </OptimizedMotion>
)

export const ScaleIn = ({ children, className, delay, ...props }: Omit<OptimizedMotionProps, 'variant'>) => (
  <OptimizedMotion variant="scaleIn" className={className} delay={delay} {...props}>
    {children}
  </OptimizedMotion>
)

// Stagger container for multiple items
export const StaggerContainer = ({ 
  children, 
  className, 
  delay = 0,
  ...props 
}: Omit<OptimizedMotionProps, 'variant'>) => {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={`perf-isolated ${className || ''}`}
      initial="hidden"
      animate="visible"
      variants={optimizedVariants.stagger}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Optimized AnimatePresence wrapper
export const OptimizedAnimatePresence = ({ 
  children, 
  mode = 'wait',
  ...props 
}: {
  children: React.ReactNode
  mode?: 'sync' | 'wait' | 'popLayout'
}) => {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode={mode} {...props}>
      {children}
    </AnimatePresence>
  )
}

// Performance-aware hover animations
export const HoverScale = ({ 
  children, 
  scale = 1.05, 
  className,
  ...props 
}: {
  children: React.ReactNode
  scale?: number
  className?: string
}) => {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={`perf-hover ${className || ''}`}
      whileHover={{ scale }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Optimized loading spinner
export const OptimizedSpinner = ({ size = 24, className }: { size?: number; className?: string }) => {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return (
      <div 
        className={`inline-block border-2 border-gray-300 border-t-blue-500 rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <motion.div
      className={`inline-block border-2 border-gray-300 border-t-blue-500 rounded-full ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}