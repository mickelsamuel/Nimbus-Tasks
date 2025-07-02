import * as React from 'react';
import { rafThrottle } from './performance';

interface ScrollOptimizationOptions {
  enabledDuringScroll?: boolean;
  pauseThreshold?: number;
  resumeDelay?: number;
  animationSelector?: string;
}

class ScrollAnimationManager {
  private isScrolling = false;
  private scrollTimer: NodeJS.Timeout | null = null;
  private animationElements: Set<HTMLElement> = new Set();
  private originalStates: Map<HTMLElement, string> = new Map();
  private options: Required<ScrollOptimizationOptions>;

  constructor(options: ScrollOptimizationOptions = {}) {
    this.options = {
      enabledDuringScroll: false, // Completely disable animations during scroll
      pauseThreshold: 10, // Immediate detection
      resumeDelay: 200, // Longer resume delay
      animationSelector: '[data-animation], .motion-div, .framer-motion-div, motion\\:div, motion\\:section, motion\\:button, .animate-pulse-optimized, .animate-float-optimized, [class*="motion-"], [class*="animate-"]',
      ...options
    };

    this.init();
  }

  private init() {
    // Use passive scroll listener for maximum performance
    const optimizedScrollHandler = rafThrottle(() => {
      this.handleScroll();
    });

    window.addEventListener('scroll', optimizedScrollHandler, { 
      passive: true,
      capture: false 
    });

    // Register existing animation elements
    this.scanForAnimationElements();
    
    // Watch for new elements being added
    this.observeNewElements();
  }

  private handleScroll() {
    if (!this.isScrolling) {
      this.isScrolling = true;
      document.body.classList.add('fast-scroll-mode');
      if (!this.options.enabledDuringScroll) {
        this.pauseAnimations();
      }
    }

    // Clear existing timer
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    // Set timer to detect scroll end
    this.scrollTimer = setTimeout(() => {
      this.isScrolling = false;
      document.body.classList.remove('fast-scroll-mode');
      if (!this.options.enabledDuringScroll) {
        this.resumeAnimations();
      }
    }, this.options.resumeDelay);
  }

  private scanForAnimationElements() {
    const elements = document.querySelectorAll(this.options.animationSelector);
    elements.forEach(el => {
      this.registerAnimationElement(el as HTMLElement);
    });
  }

  private registerAnimationElement(element: HTMLElement) {
    if (this.animationElements.has(element)) return;

    this.animationElements.add(element);
    
    // Store original animation state
    const computedStyle = window.getComputedStyle(element);
    this.originalStates.set(element, computedStyle.animation);

    // Add GPU acceleration and optimization
    this.optimizeElement(element);
  }

  private optimizeElement(element: HTMLElement) {
    // Ensure GPU acceleration
    if (!element.style.transform) {
      element.style.transform = 'translateZ(0)';
    }
    
    // Add will-change for better performance
    if (!element.style.willChange) {
      element.style.willChange = 'transform, opacity';
    }

    // Add contain for better paint performance
    if (!element.style.contain) {
      element.style.contain = 'layout style paint';
    }
  }

  private pauseAnimations() {
    this.animationElements.forEach(element => {
      // Completely disable animations during scroll
      element.style.animationPlayState = 'paused';
      element.style.animationName = 'none';
      
      // Disable all transitions
      if (element.style.transition && element.style.transition !== 'none') {
        element.dataset.originalTransition = element.style.transition;
        element.style.transition = 'none';
      }
      
      // Disable transforms
      if (element.style.transform && element.style.transform !== 'none') {
        element.dataset.originalTransform = element.style.transform;
        element.style.transform = 'translateZ(0)'; // Keep GPU layer but no movement
      }
      
      // Pause all animations by adding class
      element.classList.add('scroll-paused', 'scroll-frozen');
      
      // Completely remove will-change during scroll
      if (element.style.willChange && element.style.willChange !== 'auto') {
        element.dataset.originalWillChange = element.style.willChange;
        element.style.willChange = 'auto';
      }
      
      // Reduce opacity for heavy elements
      if (element.classList.contains('blur-3xl') || element.classList.contains('backdrop-blur')) {
        element.style.opacity = '0';
        element.dataset.scrollHidden = 'true';
      }
    });
  }

  private resumeAnimations() {
    this.animationElements.forEach(element => {
      // Resume CSS animations
      element.style.animationPlayState = 'running';
      element.style.animationName = ''; // Restore original animation name
      
      // Remove scroll pause classes
      element.classList.remove('scroll-paused', 'scroll-frozen');
      
      // Restore transforms
      if (element.dataset.originalTransform) {
        element.style.transform = element.dataset.originalTransform;
        delete element.dataset.originalTransform;
      }
      
      // Restore will-change
      if (element.dataset.originalWillChange) {
        element.style.willChange = element.dataset.originalWillChange;
        delete element.dataset.originalWillChange;
      }
      
      // Restore opacity for hidden elements
      if (element.dataset.scrollHidden === 'true') {
        element.style.opacity = '';
        delete element.dataset.scrollHidden;
      }
      
      // Restore transitions with a delay to prevent jarring
      if (element.dataset.originalTransition) {
        setTimeout(() => {
          element.style.transition = element.dataset.originalTransition!;
          delete element.dataset.originalTransition;
        }, 100);
      }
    });
  }

  private observeNewElements() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Check if the element itself matches
            if (element.matches && element.matches(this.options.animationSelector)) {
              this.registerAnimationElement(element);
            }
            
            // Check for child elements that match
            const childElements = element.querySelectorAll?.(this.options.animationSelector);
            childElements?.forEach(child => {
              this.registerAnimationElement(child as HTMLElement);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Public methods for manual control
  public forceResumeAnimations() {
    this.resumeAnimations();
  }

  public addElement(element: HTMLElement) {
    this.registerAnimationElement(element);
  }

  public removeElement(element: HTMLElement) {
    this.animationElements.delete(element);
    this.originalStates.delete(element);
  }

  public getScrollState() {
    return {
      isScrolling: this.isScrolling,
      animationCount: this.animationElements.size
    };
  }
}

// Global scroll optimization instance
let scrollManager: ScrollAnimationManager | null = null;

export function initializeScrollOptimization(options?: ScrollOptimizationOptions) {
  if (typeof window === 'undefined') return;
  
  if (!scrollManager) {
    scrollManager = new ScrollAnimationManager({
      enabledDuringScroll: false, // Pause animations during scroll for better performance
      pauseThreshold: 30,
      resumeDelay: 100,
      ...options
    });
  }
  
  return scrollManager;
}

// Utility for Framer Motion components to use smooth scroll behavior
export function createScrollAwareMotionProps(baseProps: any = {}) {
  return {
    ...baseProps,
    style: {
      willChange: 'transform, opacity',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      ...baseProps.style
    },
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.3,
      ...baseProps.transition
    },
    // Reduce animation complexity during potential scroll events
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    initial: {
      opacity: 0,
      y: 20
    }
  };
}

// Hook for React components to register themselves for scroll optimization
export function useScrollOptimization(elementRef: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || !scrollManager) return;
    
    scrollManager.addElement(element);
    
    return () => {
      if (element && scrollManager) {
        scrollManager.removeElement(element);
      }
    };
  }, [elementRef]);
}

// CSS class utilities for scroll-optimized animations
export const scrollOptimizedClasses = {
  base: 'gpu-accelerated will-change-transform backface-hidden',
  smooth: 'transition-transform transition-opacity duration-300 ease-out',
  scrollSafe: 'motion-reduce:transition-none motion-reduce:animate-none',
  container: 'contain-layout contain-style contain-paint'
};

// Utility to wrap motion components with scroll optimization
export function withScrollOptimization<T extends Record<string, any>>(MotionComponent: React.ComponentType<T>) {
  const WrappedComponent = (props: T) => {
    const elementRef = React.useRef<HTMLElement>(null);
    
    const optimizedProps = createScrollAwareMotionProps(props);
    
    return React.createElement(MotionComponent, {
      ...optimizedProps,
      ref: elementRef,
      className: `${(props as any).className || ''} ${scrollOptimizedClasses.base} ${scrollOptimizedClasses.smooth} ${scrollOptimizedClasses.scrollSafe}`.trim()
    });
  };
  
  WrappedComponent.displayName = `withScrollOptimization(${MotionComponent.displayName || MotionComponent.name})`;
  
  return WrappedComponent;
}

export { scrollManager };