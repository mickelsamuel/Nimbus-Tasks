'use client'

import React, { useEffect, useState } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ScrollAwareMotionProps extends MotionProps {
  as?: keyof typeof motion;
  children: React.ReactNode;
  fallbackClassName?: string;
}

export function ScrollAwareMotion({ 
  as = 'div', 
  children, 
  fallbackClassName = '',
  ...motionProps 
}: ScrollAwareMotionProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  if (!isMounted) {
    // During SSR, render as a regular div
    return <div className={fallbackClassName}>{children}</div>;
  }

  if (isScrolling) {
    // During scroll, render as a static element for maximum performance
    return (
      <div 
        className={`${fallbackClassName} scroll-optimized-static`}
        style={{
          transform: 'translateZ(0)',
          willChange: 'auto',
          contain: 'layout style paint'
        }}
      >
        {children}
      </div>
    );
  }

  // When not scrolling, use full Framer Motion
  const MotionComponent = motion[as];
  return (
    <MotionComponent 
      {...motionProps}
      className={`${(motionProps as Record<string, unknown>).className as string || ''} scroll-optimized`}
      style={{
        ...motionProps.style,
        willChange: 'transform, opacity',
        contain: 'layout style paint',
        transform: 'translateZ(0)'
      }}
    >
      {children}
    </MotionComponent>
  );
}