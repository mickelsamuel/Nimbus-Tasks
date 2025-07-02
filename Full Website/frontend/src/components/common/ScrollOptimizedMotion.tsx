'use client'

import * as React from 'react';
import { forwardRef, useRef, useMemo } from 'react';
import { motion, MotionProps, useReducedMotion } from 'framer-motion';
import { createScrollAwareMotionProps, scrollOptimizedClasses } from '@/utils/scrollOptimization';

interface ScrollOptimizedMotionProps extends Omit<MotionProps, 'children' | 'onClick'> {
  enableDuringScroll?: boolean;
  fallbackStatic?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  role?: string;
  style?: React.CSSProperties;
  id?: string;
}

interface ScrollOptimizedButtonProps extends Omit<MotionProps, 'children' | 'onClick'> {
  enableDuringScroll?: boolean;
  fallbackStatic?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  role?: string;
  style?: React.CSSProperties;
}

// Optimized motion.div that continues animating during scroll
export const ScrollOptimizedDiv = forwardRef<HTMLDivElement, ScrollOptimizedMotionProps>(
  ({ fallbackStatic = false, className = '', children, ...props }, ref) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();
    
    // Create optimized props for smooth scrolling
    const optimizedProps = useMemo(() => 
      createScrollAwareMotionProps(props), 
      [props]
    );

    // Combine classes for optimal performance
    const combinedClassName = useMemo(() => 
      `${className} ${scrollOptimizedClasses.base} ${scrollOptimizedClasses.smooth} ${scrollOptimizedClasses.scrollSafe}`.trim(),
      [className]
    );

    // If reduced motion is preferred or fallback is requested, render static div
    if (shouldReduceMotion && fallbackStatic) {
      return (
        <div 
          ref={ref || elementRef} 
          className={combinedClassName}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref || elementRef}
        {...optimizedProps}
        className={combinedClassName}
        // Enhanced animation props for scroll performance
        layout={false} // Disable layout animations during scroll
        layoutId={undefined} // Remove layout ID during scroll
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { 
            duration: 0.6, 
            ease: "easeOut",
            type: "tween" // Use tween instead of spring for better scroll performance
          }
        }}
        viewport={{ 
          once: true, // Only animate once when entering viewport
          margin: "0px 0px -100px 0px" // Start animation before element is fully visible
        }}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollOptimizedDiv.displayName = 'ScrollOptimizedDiv';

// Optimized motion.section for page sections
export const ScrollOptimizedSection = forwardRef<HTMLElement, ScrollOptimizedMotionProps>(
  ({ fallbackStatic = false, className = '', children, ...props }, ref) => {
    const elementRef = useRef<HTMLElement>(null);
    const shouldReduceMotion = useReducedMotion();
    
    const optimizedProps = useMemo(() => 
      createScrollAwareMotionProps(props), 
      [props]
    );

    const combinedClassName = useMemo(() => 
      `${className} ${scrollOptimizedClasses.base} ${scrollOptimizedClasses.container}`.trim(),
      [className]
    );

    if (shouldReduceMotion && fallbackStatic) {
      return (
        <section 
          ref={ref || elementRef} 
          className={combinedClassName}
        >
          {children}
        </section>
      );
    }

    return (
      <motion.section
        ref={ref || elementRef}
        {...optimizedProps}
        className={combinedClassName}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { 
            duration: 0.8, 
            ease: "easeOut",
            type: "tween"
          }
        }}
        viewport={{ 
          once: true,
          margin: "0px 0px -50px 0px"
        }}
      >
        {children}
      </motion.section>
    );
  }
);

ScrollOptimizedSection.displayName = 'ScrollOptimizedSection';

// Optimized motion.button for interactive elements
export const ScrollOptimizedButton = forwardRef<HTMLButtonElement, ScrollOptimizedButtonProps>(
  ({ fallbackStatic = false, className = '', onClick, children, ...props }, ref) => {
    const elementRef = useRef<HTMLButtonElement>(null);
    const shouldReduceMotion = useReducedMotion();
    
    const optimizedProps = useMemo(() => ({
      ...createScrollAwareMotionProps(props),
      whileHover: shouldReduceMotion ? {} : { 
        scale: 1.02, 
        transition: { duration: 0.2, type: "tween" } 
      },
      whileTap: shouldReduceMotion ? {} : { 
        scale: 0.98, 
        transition: { duration: 0.1, type: "tween" } 
      }
    }), [props, shouldReduceMotion]);

    const combinedClassName = useMemo(() => 
      `${className} ${scrollOptimizedClasses.base} ${scrollOptimizedClasses.smooth}`.trim(),
      [className]
    );

    if (shouldReduceMotion && fallbackStatic) {
      return (
        <button 
          ref={ref || elementRef} 
          className={combinedClassName}
          onClick={onClick}
        >
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref || elementRef}
        {...optimizedProps}
        className={combinedClassName}
        onClick={onClick}
      >
        {children}
      </motion.button>
    );
  }
);

ScrollOptimizedButton.displayName = 'ScrollOptimizedButton';

// Container component for grouping scroll-optimized animations
export const ScrollOptimizedContainer = forwardRef<HTMLDivElement, ScrollOptimizedMotionProps & {
  staggerChildren?: number;
  delayChildren?: number;
}>(
  ({ staggerChildren = 0.1, delayChildren = 0, className = '', children, ...props }, ref) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const containerVariants = useMemo(() => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          type: "tween" as const,
          duration: 0.3,
          delayChildren: delayChildren as number,
          staggerChildren: shouldReduceMotion ? 0 : (staggerChildren as number),
          ease: "easeOut" as const
        }
      }
    }), [delayChildren, staggerChildren, shouldReduceMotion]);

    const combinedClassName = useMemo(() => 
      `${className} ${scrollOptimizedClasses.base} ${scrollOptimizedClasses.container}`.trim(),
      [className]
    );

    if (shouldReduceMotion) {
      return (
        <div 
          ref={ref || elementRef} 
          className={combinedClassName}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref || elementRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ 
          once: true,
          margin: "0px 0px -100px 0px"
        }}
        className={combinedClassName}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollOptimizedContainer.displayName = 'ScrollOptimizedContainer';

// Item component for use within ScrollOptimizedContainer
export const ScrollOptimizedItem = forwardRef<HTMLDivElement, ScrollOptimizedMotionProps>(
  ({ className = '', children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    const itemVariants = useMemo(() => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "tween",
          duration: 0.5,
          ease: "easeOut"
        }
      }
    }), []);

    const combinedClassName = useMemo(() => 
      `${className} ${scrollOptimizedClasses.base} ${scrollOptimizedClasses.smooth}`.trim(),
      [className]
    );

    if (shouldReduceMotion) {
      return (
        <div 
          ref={ref} 
          className={combinedClassName}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        variants={itemVariants}
        className={combinedClassName}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollOptimizedItem.displayName = 'ScrollOptimizedItem';