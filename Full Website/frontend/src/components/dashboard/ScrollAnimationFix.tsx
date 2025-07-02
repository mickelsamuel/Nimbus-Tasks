'use client'

import { useEffect } from 'react'

export function ScrollAnimationFix() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // More aggressive approach - override browser behavior
    const script = document.createElement('script')
    script.textContent = `
      // Override the browser's scroll optimization
      (function() {
        let isScrolling = false;
        let scrollTimer;
        
        // Force CSS animations to continue
        function forceAnimations() {
          const style = document.getElementById('force-animations') || document.createElement('style');
          style.id = 'force-animations';
          style.textContent = \`
            *, *::before, *::after {
              animation-play-state: running !important;
              transition: none !important;
            }
            
            .animate-spin { 
              animation: spin 1s linear infinite !important;
              animation-play-state: running !important;
            }
            .animate-pulse { 
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
              animation-play-state: running !important;
            }
            .animate-bounce { 
              animation: bounce 1s infinite !important;
              animation-play-state: running !important;
            }
            
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            @keyframes bounce { 0%, 100% { transform: translateY(-25%); } 50% { transform: translateY(0); } }
          \`;
          
          if (!document.head.contains(style)) {
            document.head.appendChild(style);
          }
        }
        
        // Apply immediately
        forceAnimations();
        
        // Override scroll event handling
        let originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
          if (type === 'scroll') {
            const wrappedListener = function(e) {
              // Call original listener
              if (typeof listener === 'function') {
                listener.call(this, e);
              } else if (listener && typeof listener.handleEvent === 'function') {
                listener.handleEvent(e);
              }
              
              // Force animations to continue
              setTimeout(forceAnimations, 0);
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
          }
          return originalAddEventListener.call(this, type, listener, options);
        };
        
        // Continuous animation enforcement
        setInterval(forceAnimations, 50);
        
        // Force on scroll
        window.addEventListener('scroll', forceAnimations, { passive: true });
        window.addEventListener('touchmove', forceAnimations, { passive: true });
        window.addEventListener('wheel', forceAnimations, { passive: true });
      })();
    `
    
    document.head.appendChild(script)

    // Additional React-based monitoring
    const forceAnimationsContinuous = () => {
      // Get all elements with animations
      const elements = document.querySelectorAll(`
        [class*="animate-"],
        [style*="animation"],
        [data-framer-motion]
      `)
      
      elements.forEach((el) => {
        const element = el as HTMLElement
        if (element.style) {
          element.style.animationPlayState = 'running'
          
          // Force specific animation properties
          if (element.classList.contains('animate-spin')) {
            element.style.animation = 'spin 1s linear infinite'
          }
          if (element.classList.contains('animate-pulse')) {
            element.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }
          if (element.classList.contains('animate-bounce')) {
            element.style.animation = 'bounce 1s infinite'
          }
        }
      })
    }

    // Run continuously
    const interval = setInterval(forceAnimationsContinuous, 16) // 60fps
    
    // Run on events
    const events = ['scroll', 'touchmove', 'wheel', 'resize']
    const cleanup = events.map(event => {
      const handler = () => {
        forceAnimationsContinuous()
        setTimeout(forceAnimationsContinuous, 10)
        setTimeout(forceAnimationsContinuous, 50)
      }
      window.addEventListener(event, handler, { passive: true })
      return () => window.removeEventListener(event, handler)
    })

    return () => {
      clearInterval(interval)
      cleanup.forEach(fn => fn())
      script.remove()
      const style = document.getElementById('force-animations')
      if (style) style.remove()
    }
  }, [])

  return null
}