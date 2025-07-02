'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  frameDrops: number
  renderTime: number
  isScrolling: boolean
  isAnimationPaused: boolean
  memoryUsage: number
  cpuUsage: number
}

interface AnimationConfig {
  enableAnimations: boolean
  reducedMotion: boolean
  gpuAcceleration: boolean
  performanceMode: 'high' | 'balanced' | 'low'
  maxConcurrentAnimations: number
  scrollThrottleMs: number
}

const DEFAULT_CONFIG: AnimationConfig = {
  enableAnimations: true,
  reducedMotion: false,
  gpuAcceleration: true,
  performanceMode: 'balanced',
  maxConcurrentAnimations: 10,
  scrollThrottleMs: 16
}

export const useAnimationPerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameDrops: 0,
    renderTime: 0,
    isScrolling: false,
    isAnimationPaused: false,
    memoryUsage: 0,
    cpuUsage: 0
  })

  const [config, setConfig] = useState<AnimationConfig>(DEFAULT_CONFIG)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const activeAnimationsRef = useRef<Set<string>>(new Set())
  const performanceObserverRef = useRef<PerformanceObserver | null>(null)

  // Detect user preferences
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReducedMotion = () => {
      setConfig(prev => ({
        ...prev,
        reducedMotion: mediaQuery.matches,
        enableAnimations: !mediaQuery.matches
      }))
    }

    updateReducedMotion()
    mediaQuery.addEventListener('change', updateReducedMotion)

    // Detect hardware capabilities
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    const hasGPU = !!gl

    // Detect mobile/low-power devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4

    setConfig(prev => ({
      ...prev,
      gpuAcceleration: hasGPU,
      performanceMode: isMobile || isLowPower ? 'low' : 'balanced',
      maxConcurrentAnimations: isMobile ? 5 : 10
    }))

    return () => {
      mediaQuery.removeEventListener('change', updateReducedMotion)
    }
  }, [])

  // FPS monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    let animationId: number

    const measureFPS = () => {
      frameCountRef.current++
      const now = performance.now()
      const elapsed = now - lastTimeRef.current

      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed)
        setMetrics(prev => ({
          ...prev,
          fps,
          frameDrops: fps < 55 ? prev.frameDrops + 1 : prev.frameDrops
        }))

        frameCountRef.current = 0
        lastTimeRef.current = now
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      let totalRenderTime = 0

      entries.forEach(entry => {
        if (entry.entryType === 'measure') {
          totalRenderTime += entry.duration
        }
      })

      if (totalRenderTime > 0) {
        setMetrics(prev => ({
          ...prev,
          renderTime: totalRenderTime
        }))
      }
    })

    observer.observe({ entryTypes: ['measure'] })
    performanceObserverRef.current = observer

    return () => {
      observer.disconnect()
    }
  }, [])

  // Memory monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memoryUsage * 100)
        }))
      }
    }

    const interval = setInterval(checkMemory, 5000)
    checkMemory()

    return () => clearInterval(interval)
  }, [])

  // Scroll performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScrollStart = () => {
      setMetrics(prev => ({ ...prev, isScrolling: true }))
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Pause animations during scroll if performance is poor
      if (metrics.fps < 30 || metrics.memoryUsage > 80) {
        setMetrics(prev => ({ ...prev, isAnimationPaused: true }))
        document.body.classList.add('fast-scroll-mode')
      }
    }

    const handleScrollEnd = () => {
      scrollTimeoutRef.current = setTimeout(() => {
        setMetrics(prev => ({ 
          ...prev, 
          isScrolling: false,
          isAnimationPaused: false
        }))
        document.body.classList.remove('fast-scroll-mode')
      }, 150)
    }

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollStart()
          ticking = false
        })
        ticking = true
      }
      handleScrollEnd()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [metrics.fps, metrics.memoryUsage])

  // Animation registration system
  const registerAnimation = useCallback((id: string) => {
    if (activeAnimationsRef.current.size >= config.maxConcurrentAnimations) {
      return false // Reject if too many animations
    }
    activeAnimationsRef.current.add(id)
    return true
  }, [config.maxConcurrentAnimations])

  const unregisterAnimation = useCallback((id: string) => {
    activeAnimationsRef.current.delete(id)
  }, [])

  // Get optimized animation variants
  const getAnimationVariants = useCallback(() => {
    if (config.reducedMotion || !config.enableAnimations) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      }
    }

    const baseTransition = {
      duration: config.performanceMode === 'low' ? 0.2 : 
                config.performanceMode === 'balanced' ? 0.3 : 0.4,
      ease: 'easeOut'
    }

    return {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: baseTransition
      },
      slideUp: {
        initial: { opacity: 0, y: config.performanceMode === 'low' ? 10 : 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: config.performanceMode === 'low' ? -10 : -20 },
        transition: baseTransition
      },
      scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: baseTransition
      },
      stagger: {
        initial: { opacity: 0, y: config.performanceMode === 'low' ? 5 : 15 },
        animate: { opacity: 1, y: 0 },
        transition: {
          ...baseTransition,
          staggerChildren: config.performanceMode === 'low' ? 0.02 : 0.05
        }
      }
    }
  }, [config])

  // Performance-aware animation props
  const getOptimizedProps = useCallback(() => {
    const shouldAnimate = config.enableAnimations && 
                         !config.reducedMotion && 
                         !metrics.isAnimationPaused &&
                         metrics.fps > 24

    return {
      animate: shouldAnimate,
      initial: shouldAnimate,
      exit: shouldAnimate,
      layout: config.performanceMode === 'high' && !metrics.isScrolling,
      layoutDependency: false, // Disable layout animations during scroll
      transition: {
        duration: config.performanceMode === 'low' ? 0.15 : 0.3,
        ease: 'easeOut'
      }
    }
  }, [config, metrics])

  // Update performance mode based on metrics
  useEffect(() => {
    if (metrics.fps < 24 || metrics.memoryUsage > 90) {
      setConfig(prev => ({ ...prev, performanceMode: 'low' }))
    } else if (metrics.fps > 55 && metrics.memoryUsage < 60) {
      setConfig(prev => ({ ...prev, performanceMode: 'high' }))
    } else {
      setConfig(prev => ({ ...prev, performanceMode: 'balanced' }))
    }
  }, [metrics.fps, metrics.memoryUsage])

  return {
    metrics,
    config,
    setConfig,
    registerAnimation,
    unregisterAnimation,
    getAnimationVariants,
    getOptimizedProps,
    shouldAnimate: config.enableAnimations && !config.reducedMotion && !metrics.isAnimationPaused,
    activeAnimationsCount: activeAnimationsRef.current.size
  }
}

export default useAnimationPerformance