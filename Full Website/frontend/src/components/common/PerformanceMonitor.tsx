'use client'

import React, { useState, useEffect } from 'react'
import { usePerformanceMonitor, useMemoryOptimization, useConnectionAware } from '@/hooks/usePerformance'

interface PerformanceMonitorProps {
  enabled?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showDetails?: boolean
}

export default function PerformanceMonitor({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  showDetails = false
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [expandedView, setExpandedView] = useState(showDetails)
  
  const { lcp, fcp, cls } = usePerformanceMonitor()
  const { memoryUsagePercentage, memoryInfo } = useMemoryOptimization()
  const { connectionInfo, shouldReduceQuality } = useConnectionAware()

  useEffect(() => {
    // Show monitor after initial load
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!enabled || !isVisible) return null

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
      default:
        return 'bottom-4 right-4'
    }
  }

  const getScoreColor = (score: number, thresholds: [number, number]) => {
    if (score <= thresholds[0]) return 'text-green-500'
    if (score <= thresholds[1]) return 'text-yellow-500'
    return 'text-red-500'
  }

  const formatMs = (ms: number) => `${Math.round(ms)}ms`
  const formatMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}MB`

  return (
    <div className={`fixed ${getPositionClasses()} z-[9999] font-mono text-xs`}>
      <div className="bg-black/80 text-white rounded-lg p-3 backdrop-blur-sm border border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Performance</span>
          <button
            onClick={() => setExpandedView(!expandedView)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {expandedView ? '−' : '+'}
          </button>
        </div>

        {/* Core Web Vitals */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={getScoreColor(lcp, [2500, 4000])}>
              {formatMs(lcp)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={getScoreColor(fcp, [1800, 3000])}>
              {formatMs(fcp)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={getScoreColor(cls * 1000, [100, 250])}>
              {cls.toFixed(3)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Memory:</span>
            <span className={getScoreColor(memoryUsagePercentage, [50, 80])}>
              {memoryUsagePercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {expandedView && (
          <div className="mt-3 pt-3 border-t border-gray-600 space-y-1">
            <div className="text-gray-300 font-semibold mb-2">Details</div>
            
            {/* Memory Details */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>JS Heap:</span>
                <span>{formatMB(memoryInfo.usedJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span>Heap Limit:</span>
                <span>{formatMB(memoryInfo.jsHeapSizeLimit)}</span>
              </div>
            </div>

            {/* Connection Info */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Connection:</span>
                <span className={shouldReduceQuality ? 'text-yellow-500' : 'text-green-500'}>
                  {connectionInfo.effectiveType?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Downlink:</span>
                <span>{connectionInfo.downlink} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span>RTT:</span>
                <span>{connectionInfo.rtt}ms</span>
              </div>
              {connectionInfo.saveData && (
                <div className="text-yellow-500 text-center">Data Saver ON</div>
              )}
            </div>

            {/* Performance Recommendations */}
            <div className="mt-2 space-y-1">
              {lcp > 4000 && (
                <div className="text-red-400 text-xs">⚠ Slow LCP detected</div>
              )}
              {cls > 0.25 && (
                <div className="text-red-400 text-xs">⚠ High layout shift</div>
              )}
              {memoryUsagePercentage > 80 && (
                <div className="text-red-400 text-xs">⚠ High memory usage</div>
              )}
              {shouldReduceQuality && (
                <div className="text-yellow-400 text-xs">ℹ Reduced quality mode</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Performance tracking utility
export const trackPerformance = (name: string, fn: () => void | Promise<void>) => {
  return async () => {
    const start = performance.now()
    
    try {
      await fn()
    } finally {
      const end = performance.now()
      const duration = end - start
      
      if (duration > 16.67) { // More than one frame at 60fps
        console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      // Mark the performance entry
      performance.mark(`${name}-start`)
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
  }
}

// React component performance wrapper
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    useEffect(() => {
      const startTime = performance.now()
      
      return () => {
        const endTime = performance.now()
        const renderTime = endTime - startTime
        
        if (renderTime > 100) {
          console.warn(`Slow component render: ${componentName} took ${renderTime.toFixed(2)}ms`)
        }
      }
    })

    return <Component {...props} />
  })
}