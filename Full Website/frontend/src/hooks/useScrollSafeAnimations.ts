'use client'

import { useEffect } from 'react'

export function useScrollSafeAnimations() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create a style element to override animation pausing
    const style = document.createElement('style')
    style.id = 'scroll-safe-animations'
    style.textContent = `
      /* Force all animations to continue during scroll */
      *, *::before, *::after {
        animation-play-state: running !important;
      }
      
      /* Specific animation classes */
      .animate-spin,
      .animate-pulse,
      .animate-bounce,
      .animate-slide-in-up,
      .animate-fade-in,
      .animate-scale-in,
      .animate-float {
        animation-play-state: running !important;
      }
      
      /* Framer Motion specific */
      [data-framer-motion] {
        animation-play-state: running !important;
      }
      
      /* CSS keyframe animations */
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes bounce {
        0%, 100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
    `
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('scroll-safe-animations')
    if (existingStyle) {
      existingStyle.remove()
    }
    
    // Add the new style
    document.head.appendChild(style)
    
    // Function to ensure animations stay running
    const maintainAnimations = () => {
      // Query all elements with animations
      const animatedElements = document.querySelectorAll(`
        .animate-spin,
        .animate-pulse,
        .animate-bounce,
        .animate-slide-in-up,
        .animate-fade-in,
        .animate-scale-in,
        .animate-float,
        [data-framer-motion],
        [style*="animation"]
      `)
      
      animatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement
        if (htmlElement.style) {
          htmlElement.style.animationPlayState = 'running'
        }
      })
    }
    
    // Maintain animations on scroll
    let scrollTimer: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(maintainAnimations, 16) // ~60fps
    }
    
    // Maintain animations on resize
    const handleResize = () => {
      maintainAnimations()
    }
    
    // Apply immediately
    maintainAnimations()
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    
    // Use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      maintainAnimations()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })
    
    // Cleanup function
    return () => {
      clearTimeout(scrollTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      style.remove()
    }
  }, [])
}