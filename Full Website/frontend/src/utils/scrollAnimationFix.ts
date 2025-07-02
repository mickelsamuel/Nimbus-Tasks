/**
 * Utility to ensure animations continue during scroll
 */

export function ensureAnimationsContinueDuringScroll() {
  if (typeof window === 'undefined') return

  // Force all animations to keep running
  const forceAnimationsRunning = () => {
    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after {
        animation-play-state: running !important;
      }
      
      .animate-spin,
      .animate-pulse,
      .animate-bounce,
      .animate-slide-in-up,
      .animate-fade-in,
      .animate-scale-in,
      .animate-float {
        animation-play-state: running !important;
      }
    `
    document.head.appendChild(style)
  }

  // Apply the fix immediately
  forceAnimationsRunning()

  // Also apply on scroll events
  let scrollTimeout: NodeJS.Timeout
  const handleScroll = () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      // Ensure animations are still running after scroll
      document.querySelectorAll('*').forEach((element) => {
        const htmlElement = element as HTMLElement
        if (htmlElement.style) {
          htmlElement.style.animationPlayState = 'running'
        }
      })
    }, 50)
  }

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll)
    clearTimeout(scrollTimeout)
  }
}

// Auto-apply the fix on module load
if (typeof window !== 'undefined') {
  // Apply immediately when the module loads
  setTimeout(ensureAnimationsContinueDuringScroll, 100)
}