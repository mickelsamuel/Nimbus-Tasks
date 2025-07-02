import { useEffect, useRef, useCallback, useState } from 'react'

// Hook for detecting fast scroll and disabling animations
export function useScrollPerformance() {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeout = useRef<NodeJS.Timeout>()
  const lastScrollY = useRef(0)
  const scrollVelocity = useRef(0)

  useEffect(() => {
    let rafId: number

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = Math.abs(currentScrollY - lastScrollY.current)
      
      // Calculate scroll velocity
      scrollVelocity.current = delta
      lastScrollY.current = currentScrollY

      // If scrolling fast, disable animations
      if (delta > 50) {
        document.body.classList.add('is-scrolling')
        setIsScrolling(true)
      }

      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Re-enable animations after scroll stops
      scrollTimeout.current = setTimeout(() => {
        document.body.classList.remove('is-scrolling')
        setIsScrolling(false)
        scrollVelocity.current = 0
      }, 150)
    }

    const throttledScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          handleScroll()
          rafId = 0
        })
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      if (rafId) cancelAnimationFrame(rafId)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [])

  return { isScrolling, scrollVelocity: scrollVelocity.current }
}

// Hook for intersection observer with performance optimizations
export function useInViewport(
  options: IntersectionObserverInit = {},
  once = true
) {
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const inView = entry.isIntersecting
        setIsInView(inView)
        
        if (inView && !hasBeenInView) {
          setHasBeenInView(true)
          if (once) {
            observer.unobserve(element)
          }
        }
      })
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '50px',
      ...options
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [once, hasBeenInView, options])

  return { ref: elementRef, isInView, hasBeenInView }
}

// Hook for lazy loading images
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = new Image()
            image.src = src
            image.onload = () => {
              setImageSrc(src)
              setIsLoaded(true)
            }
            observer.unobserve(img)
          }
        })
      },
      { threshold: 0.01, rootMargin: '50px' }
    )

    observer.observe(img)

    return () => {
      observer.disconnect()
    }
  }, [src])

  return { ref: imgRef, src: imageSrc, isLoaded }
}

// Hook for debouncing expensive operations
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for throttling expensive operations
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now())
  const timeout = useRef<NodeJS.Timeout>()

  return useCallback(
    ((...args) => {
      const now = Date.now()
      const timeSinceLastRun = now - lastRun.current

      if (timeSinceLastRun >= delay) {
        lastRun.current = now
        return callback(...args)
      } else {
        if (timeout.current) clearTimeout(timeout.current)
        
        timeout.current = setTimeout(() => {
          lastRun.current = Date.now()
          callback(...args)
        }, delay - timeSinceLastRun)
      }
    }) as T,
    [callback, delay]
  )
}

// Hook for managing animation performance
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [callback])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])
}

// Hook for reducing motion based on user preference
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Hook for optimizing list rendering
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 3
) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  }
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0
  })

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          }
        })
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        setMetrics(prev => ({ ...prev, cls: clsValue }))
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      return () => {
        lcpObserver.disconnect()
        fcpObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  return metrics
}

// Hook for optimizing image loading
export function useImageOptimization() {
  const [supportedFormats, setSupportedFormats] = useState({
    webp: false,
    avif: false
  })

  useEffect(() => {
    const checkWebP = () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      return canvas.toDataURL('image/webp').indexOf('image/webp') === 5
    }

    const checkAVIF = async () => {
      try {
        const avif = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
        const img = new Image()
        img.src = avif
        await new Promise((resolve) => {
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
        })
        return img.width === 2
      } catch {
        return false
      }
    }

    const detectFormats = async () => {
      const webp = checkWebP()
      const avif = await checkAVIF()
      setSupportedFormats({ webp, avif })
    }

    detectFormats()
  }, [])

  const getOptimalFormat = useCallback((originalSrc: string) => {
    if (supportedFormats.avif) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif')
    }
    if (supportedFormats.webp) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    }
    return originalSrc
  }, [supportedFormats])

  return { supportedFormats, getOptimalFormat }
}

// Hook for managing memory usage
export function useMemoryOptimization() {
  const [memoryInfo, setMemoryInfo] = useState({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  })

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        })
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000)

    return () => clearInterval(interval)
  }, [])

  const memoryUsagePercentage = memoryInfo.jsHeapSizeLimit > 0 
    ? (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100 
    : 0

  return { memoryInfo, memoryUsagePercentage }
}

// Hook for connection-aware loading
export function useConnectionAware() {
  const [connectionInfo, setConnectionInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false
  })

  useEffect(() => {
    const updateConnection = () => {
      if ('connection' in navigator) {
        const conn = (navigator as any).connection
        setConnectionInfo({
          effectiveType: conn.effectiveType || '4g',
          downlink: conn.downlink || 10,
          rtt: conn.rtt || 100,
          saveData: conn.saveData || false
        })
      }
    }

    updateConnection()
    
    if ('connection' in navigator) {
      const conn = (navigator as any).connection
      conn.addEventListener('change', updateConnection)
      
      return () => {
        conn.removeEventListener('change', updateConnection)
      }
    }
  }, [])

  const shouldReduceQuality = connectionInfo.effectiveType === '2g' || 
                             connectionInfo.effectiveType === '3g' ||
                             connectionInfo.saveData ||
                             connectionInfo.downlink < 1

  return { connectionInfo, shouldReduceQuality }
}