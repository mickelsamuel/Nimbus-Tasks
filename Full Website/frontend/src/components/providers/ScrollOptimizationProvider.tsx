'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useScrollPerformance } from '@/hooks/usePerformance'

interface ScrollOptimizationContextType {
  isScrolling: boolean
  scrollVelocity: number
}

const ScrollOptimizationContext = createContext<ScrollOptimizationContextType>({
  isScrolling: false,
  scrollVelocity: 0
})

export const useScrollOptimization = () => useContext(ScrollOptimizationContext)

export default function ScrollOptimizationProvider({ children }: { children: ReactNode }) {
  const { isScrolling, scrollVelocity } = useScrollPerformance()

  useEffect(() => {
    // Add performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' || entry.entryType === 'largest-contentful-paint') {
            console.log(`${entry.name}: ${entry.startTime}ms`)
          }
        }
      })
      
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
      
      return () => observer.disconnect()
    }
  }, [])

  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]

    preloadLinks.forEach(({ rel, href, crossOrigin }) => {
      const link = document.createElement('link')
      link.rel = rel
      link.href = href
      if (crossOrigin) link.crossOrigin = crossOrigin
      document.head.appendChild(link)
    })
  }, [])

  return (
    <ScrollOptimizationContext.Provider value={{ isScrolling, scrollVelocity }}>
      {children}
    </ScrollOptimizationContext.Provider>
  )
}