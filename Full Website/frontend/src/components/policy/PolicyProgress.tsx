'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Eye, Scroll, Sparkles } from 'lucide-react'
import { throttle } from '@/utils/performance'

interface PolicyProgressProps {
  hasScrolledToBottom: boolean
  className?: string
}

export const PolicyProgress: React.FC<PolicyProgressProps> = ({ 
  hasScrolledToBottom, 
  className = '' 
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.scrollY
      const progress = Math.min((scrollTop / scrollHeight) * 100, 100)
      setScrollProgress(progress)
    }, 16) // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    
    // Delay visibility for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 600)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`mt-12 relative overflow-hidden ${className}`}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        >
          {/* Enhanced Glassmorphism Container */}
          <div className="relative rounded-3xl overflow-hidden backdrop-blur-3xl bg-white/95 dark:bg-gray-900/95 border border-white/30 dark:border-gray-700/30 shadow-2xl dark:shadow-indigo-500/10">
            {/* Animated Background */}
            <motion.div 
              className="absolute inset-0 opacity-20"
              style={{
                background: hasScrolledToBottom 
                  ? 'linear-gradient(135deg, #3B82F6, #1D4ED8, #1E40AF)'
                  : 'linear-gradient(135deg, #6B7280, #4B5563, #374151)'
              }}
              animate={{
                background: hasScrolledToBottom
                  ? [
                      'linear-gradient(135deg, #3B82F6, #1D4ED8, #1E40AF)',
                      'linear-gradient(135deg, #1D4ED8, #1E40AF, #3B82F6)',
                      'linear-gradient(135deg, #3B82F6, #1D4ED8, #1E40AF)'
                    ]
                  : 'linear-gradient(135deg, #6B7280, #4B5563, #374151)'
              }}
              transition={{
                duration: 4,
                repeat: hasScrolledToBottom ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            {/* Success Particles */}
            <AnimatePresence>
              {hasScrolledToBottom && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                      initial={{ opacity: 0, scale: 0, rotate: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [0, -60],
                        x: [0, Math.random() * 40 - 20]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.15,
                        ease: "easeOut"
                      }}
                    >
                      <Sparkles className="h-3 w-3 text-blue-400" />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
            
            <div className="relative z-10 p-6 md:p-8">
              {/* Enhanced Header */}
              <motion.div 
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      hasScrolledToBottom 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}
                    animate={{
                      scale: hasScrolledToBottom ? [1, 1.1, 1] : 1,
                      boxShadow: hasScrolledToBottom 
                        ? [
                            '0 4px 20px rgba(59, 130, 246, 0.3)',
                            '0 8px 30px rgba(59, 130, 246, 0.5)',
                            '0 4px 20px rgba(59, 130, 246, 0.3)'
                          ]
                        : '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}
                    transition={{
                      duration: 2,
                      repeat: hasScrolledToBottom ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.15 }}
                  >
                    {hasScrolledToBottom ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-white" />
                    )}
                  </motion.div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reading Progress</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Document review verification</p>
                  </div>
                </div>
                
                <motion.div 
                  className="text-right"
                  animate={{
                    scale: hasScrolledToBottom ? [1, 1.05, 1] : 1
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: hasScrolledToBottom ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <motion.p 
                    className={`text-lg font-bold ${
                      hasScrolledToBottom 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    animate={{
                      color: hasScrolledToBottom 
                        ? ['#2563EB', '#3B82F6', '#2563EB']
                        : '#6B7280'
                    }}
                    transition={{
                      duration: 2,
                      repeat: hasScrolledToBottom ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {hasScrolledToBottom ? '✓ Complete' : `${Math.round(scrollProgress)}%`}
                  </motion.p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {hasScrolledToBottom ? 'Ready to proceed' : 'Keep scrolling'}
                  </p>
                </motion.div>
              </motion.div>
      
              {/* Enhanced Progress Bar */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Progress Bar Container */}
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner overflow-hidden">
                    {/* Animated Background Track */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Main Progress Bar */}
                    <motion.div
                      className={`relative h-full rounded-full transition-all duration-700 overflow-hidden ${
                        hasScrolledToBottom 
                          ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700' 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}
                      animate={{
                        width: `${scrollProgress}%`
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        animate={{
                          x: scrollProgress > 0 ? ['-100%', '200%'] : '-100%'
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: scrollProgress > 0 ? Infinity : 0,
                          repeatDelay: 1,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Completion Glow */}
                      {hasScrolledToBottom && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full"
                          animate={{
                            opacity: [0.3, 0.7, 0.3],
                            scale: [1, 1.02, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Progress Percentage Badge */}
                  <AnimatePresence>
                    {scrollProgress > 10 && (
                      <motion.div
                        className="absolute -top-8 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        style={{
                          left: `calc(${Math.min(scrollProgress, 95)}% - 20px)`
                        }}
                        initial={{ opacity: 0, scale: 0, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {Math.round(scrollProgress)}%
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Status Indicators */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Scroll className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Scroll to review all content</span>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {hasScrolledToBottom ? (
                      <motion.div
                        key="complete"
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-semibold">Review Complete!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="progress"
                        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <motion.div
                          className="w-3 h-3 bg-gray-400 rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <span>Continue reading...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PolicyProgress