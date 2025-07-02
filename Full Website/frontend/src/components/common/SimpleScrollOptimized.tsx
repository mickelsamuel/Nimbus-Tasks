'use client'

import React from 'react';
import { motion, MotionProps } from 'framer-motion';

// Simple scroll-optimized components that extend Framer Motion
// with performance optimizations

interface OptimizedProps extends MotionProps {
  children?: React.ReactNode;
  className?: string;
}

export const ScrollOptimizedDiv = React.forwardRef<HTMLDivElement, OptimizedProps>(
  ({ children, className = '', style = {}, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={`${className} scroll-optimized`}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        contain: 'layout style paint',
        ...style
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

ScrollOptimizedDiv.displayName = 'ScrollOptimizedDiv';

export const ScrollOptimizedSection = React.forwardRef<HTMLElement, OptimizedProps>(
  ({ children, className = '', style = {}, ...props }, ref) => (
    <motion.section
      ref={ref}
      className={`${className} scroll-optimized`}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        contain: 'layout style paint',
        ...style
      }}
      {...props}
    >
      {children}
    </motion.section>
  )
);

ScrollOptimizedSection.displayName = 'ScrollOptimizedSection';

export const ScrollOptimizedButton = React.forwardRef<HTMLButtonElement, OptimizedProps & { onClick?: () => void }>(
  ({ children, className = '', style = {}, onClick, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={`${className} scroll-optimized`}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        ...style
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'tween', duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  )
);

ScrollOptimizedButton.displayName = 'ScrollOptimizedButton';

export const ScrollOptimizedContainer = React.forwardRef<HTMLDivElement, OptimizedProps & {
  staggerChildren?: number;
  delayChildren?: number;
}>(
  ({ children, className = '', style = {}, staggerChildren = 0.1, delayChildren = 0, ...props }, ref) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren,
          staggerChildren,
          type: 'tween',
          duration: 0.3
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        className={`${className} scroll-optimized`}
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          contain: 'layout style paint',
          ...style
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollOptimizedContainer.displayName = 'ScrollOptimizedContainer';

export const ScrollOptimizedItem = React.forwardRef<HTMLDivElement, OptimizedProps>(
  ({ children, className = '', style = {}, ...props }, ref) => {
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'tween',
          duration: 0.5
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        className={`${className} scroll-optimized`}
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          ...style
        }}
        variants={itemVariants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollOptimizedItem.displayName = 'ScrollOptimizedItem';