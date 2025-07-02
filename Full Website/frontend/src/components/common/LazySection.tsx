'use client'

import React, { forwardRef } from 'react';
import { useLazySection } from '@/hooks/useLazySection';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  fallbackContent?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

export const LazySection = forwardRef<HTMLElement, LazySectionProps>(
  ({
    children,
    className = '',
    minHeight = 200,
    threshold = 0.1,
    rootMargin = '100px 0px',
    triggerOnce = true,
    fallbackContent = null,
    as = 'section',
    style = {},
    ...props
  }, ref) => {
    const { elementRef, isVisible, isLoaded, className: lazyClassName } = useLazySection({
      threshold,
      rootMargin,
      triggerOnce
    });

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      if (elementRef.current !== node) {
        (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref, elementRef]);

    const combinedStyle: React.CSSProperties = {
      containIntrinsicSize: `${minHeight}px`,
      contentVisibility: 'auto',
      ...style
    };

    const combinedClassName = `${lazyClassName} observe-target ${className}`.trim();

    return React.createElement(
      as,
      {
        ref: combinedRef,
        className: combinedClassName,
        style: combinedStyle,
        'data-loaded': isLoaded,
        ...props
      },
      isVisible ? (
        children
      ) : (
        fallbackContent || React.createElement('div', {
          className: 'skeleton-loading rounded-lg',
          style: { 
            height: minHeight,
            width: '100%'
          }
        })
      )
    );
  }
);

LazySection.displayName = 'LazySection';

// Specialized lazy sections for common use cases
export const LazyHeroSection = forwardRef<HTMLElement, Omit<LazySectionProps, 'minHeight' | 'as'>>(
  (props, ref) => (
    <LazySection
      {...props}
      ref={ref}
      as="section"
      minHeight={400}
      threshold={0.2}
      rootMargin="200px 0px"
      className={`hero-section ${props.className || ''}`.trim()}
    />
  )
);

LazyHeroSection.displayName = 'LazyHeroSection';

export const LazyCardGrid = forwardRef<HTMLElement, Omit<LazySectionProps, 'minHeight' | 'as'>>(
  (props, ref) => (
    <LazySection
      {...props}
      ref={ref}
      as="div"
      minHeight={300}
      threshold={0.1}
      rootMargin="150px 0px"
      className={`spaces-grid ${props.className || ''}`.trim()}
    />
  )
);

LazyCardGrid.displayName = 'LazyCardGrid';

export const LazyDashboardSection = forwardRef<HTMLElement, Omit<LazySectionProps, 'minHeight' | 'as'>>(
  (props, ref) => (
    <LazySection
      {...props}
      ref={ref}
      as="section"
      minHeight={250}
      threshold={0.15}
      rootMargin="100px 0px"
      className={`dashboard-section ${props.className || ''}`.trim()}
    />
  )
);

LazyDashboardSection.displayName = 'LazyDashboardSection';

// Higher-order component for lazy loading any component
export function withLazyLoading<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: Partial<LazySectionProps> = {}
) {
  const LazyWrappedComponent = forwardRef<HTMLElement, T>((props, ref) => (
    <LazySection {...options} ref={ref}>
      <WrappedComponent {...(props as T)} />
    </LazySection>
  ));

  LazyWrappedComponent.displayName = `withLazyLoading(${WrappedComponent.displayName || WrappedComponent.name})`;

  return LazyWrappedComponent;
}