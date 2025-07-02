'use client'

import React, { useState } from 'react'
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Zap, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react'

interface AnimationPerformanceMonitorProps {
  showInProduction?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  compact?: boolean
}

const AnimationPerformanceMonitor: React.FC<AnimationPerformanceMonitorProps> = ({
  showInProduction = false,
  position = 'bottom-right',
  compact = false
}) => {
  const { metrics, config, activeAnimationsCount } = useAnimationPerformance()
  const [isExpanded, setIsExpanded] = useState(!compact)

  // Only show in development unless explicitly enabled for production
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction

  if (!shouldShow) return null

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

  const getPerformanceStatus = () => {
    if (metrics.fps >= 55 && metrics.memoryUsage <= 70) {
      return { status: 'excellent', color: 'green', icon: CheckCircle }
    } else if (metrics.fps >= 30 && metrics.memoryUsage <= 85) {
      return { status: 'good', color: 'blue', icon: Activity }
    } else if (metrics.fps >= 20 && metrics.memoryUsage <= 90) {
      return { status: 'poor', color: 'yellow', icon: AlertTriangle }
    } else {
      return { status: 'critical', color: 'red', icon: AlertTriangle }
    }
  }

  const performanceStatus = getPerformanceStatus()
  const StatusIcon = performanceStatus.icon

  return (
    <motion.div
      className={`fixed z-50 ${getPositionClasses()}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/80 backdrop-blur-sm text-white rounded-lg shadow-lg border border-gray-700">
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-3 hover:bg-gray-800/50 transition-colors rounded-t-lg w-full text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatusIcon 
            className={`w-4 h-4 text-${performanceStatus.color}-500`} 
          />
          <span className="text-sm font-medium">
            {metrics.fps}fps
          </span>
          {compact && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </motion.div>
          )}
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-700"
            >
              <div className="p-3 space-y-3">
                {/* Performance Metrics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    Performance
                  </h4>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">FPS:</span>
                      <span className={`font-mono ${
                        metrics.fps >= 55 ? 'text-green-400' :
                        metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {metrics.fps}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Frame Drops:</span>
                      <span className={`font-mono ${
                        metrics.frameDrops <= 5 ? 'text-green-400' :
                        metrics.frameDrops <= 15 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {metrics.frameDrops}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Memory:</span>
                      <span className={`font-mono ${
                        metrics.memoryUsage <= 70 ? 'text-green-400' :
                        metrics.memoryUsage <= 85 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {metrics.memoryUsage}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Render Time:</span>
                      <span className={`font-mono ${
                        metrics.renderTime <= 16 ? 'text-green-400' :
                        metrics.renderTime <= 33 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {metrics.renderTime.toFixed(1)}ms
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animation Status */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    Animation Status
                  </h4>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active:</span>
                      <span className="font-mono text-blue-400">
                        {activeAnimationsCount}/{config.maxConcurrentAnimations}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Mode:</span>
                      <span className={`font-mono capitalize ${
                        config.performanceMode === 'high' ? 'text-green-400' :
                        config.performanceMode === 'balanced' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {config.performanceMode}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Enabled:</span>
                      <span className={`font-mono ${
                        config.enableAnimations ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {config.enableAnimations ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Reduced Motion:</span>
                      <span className={`font-mono ${
                        config.reducedMotion ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {config.reducedMotion ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* State Indicators */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    State
                  </h4>
                  
                  <div className="flex flex-wrap gap-1">
                    {metrics.isScrolling && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        <Activity className="w-3 h-3" />
                        Scrolling
                      </span>
                    )}
                    
                    {metrics.isAnimationPaused && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Paused
                      </span>
                    )}
                    
                    {config.gpuAcceleration && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                        <Zap className="w-3 h-3" />
                        GPU
                      </span>
                    )}
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Overall Performance</span>
                    <span className={`text-${performanceStatus.color}-400 capitalize`}>
                      {performanceStatus.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-${performanceStatus.color}-500`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, (metrics.fps / 60) * 100)}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default AnimationPerformanceMonitor