'use client'

import { useEffect } from 'react'

interface AnimationManagerProps {
  children: React.ReactNode
}

export function AnimationManager({ children }: AnimationManagerProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Aggressive animation preservation
    const preserveAnimations = () => {
      // Override any CSS that might pause animations
      const styleSheet = document.createElement('style')
      styleSheet.id = 'animation-manager'
      styleSheet.textContent = `
        /* Global animation preservation */
        * {
          animation-play-state: running !important;
        }
        
        /* Prevent scroll-triggered animation pausing */
        html, body {
          animation-play-state: running !important;
        }
        
        /* Specific overrides for common animation classes */
        .animate-spin { animation: spin 1s linear infinite !important; }
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite !important; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
        .animate-bounce { animation: bounce 1s infinite !important; }
        
        /* Ensure CSS animations continue */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
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
      
      // Remove existing if present
      const existing = document.getElementById('animation-manager')
      if (existing) existing.remove()
      
      document.head.appendChild(styleSheet)
    }

    // Force all elements to keep animating
    const forceAnimationState = () => {
      document.querySelectorAll('*').forEach((element) => {
        const el = element as HTMLElement
        if (el.style && el.style.animationPlayState !== undefined) {
          el.style.animationPlayState = 'running'
        }
      })
    }

    // Apply immediately
    preserveAnimations()
    forceAnimationState()

    // Reduced monitoring frequency for better performance
    const interval = setInterval(forceAnimationState, 1000) // Reduced from 100ms to 1000ms
    
    // Only monitor essential events
    const events = ['scroll']
    const handlers = events.map(event => {
      const handler = () => {
        setTimeout(forceAnimationState, 50) // Increased delay
      }
      window.addEventListener(event, handler, { passive: true })
      return () => window.removeEventListener(event, handler)
    })

    // Cleanup
    return () => {
      clearInterval(interval)
      handlers.forEach(cleanup => cleanup())
      const styleSheet = document.getElementById('animation-manager')
      if (styleSheet) styleSheet.remove()
    }
  }, [])

  return <>{children}</>
}