'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import ErrorDisplay from './ErrorDisplay'

interface RetryWrapperProps {
  children: React.ReactNode
  onRetry: () => Promise<void>
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
  fallback?: React.ReactNode
  errorMessage?: string
  showRetryButton?: boolean
  autoRetry?: boolean
  className?: string
}

const RetryWrapper: React.FC<RetryWrapperProps> = ({
  children,
  onRetry,
  maxRetries = 3,
  retryDelay = 1000,
  exponentialBackoff = true,
  fallback,
  errorMessage,
  showRetryButton = true,
  autoRetry = false,
  className = ''
}) => {
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [, setIsLoading] = useState(false)

  const calculateDelay = useCallback((attempt: number) => {
    if (!exponentialBackoff) return retryDelay
    return retryDelay * Math.pow(2, attempt)
  }, [retryDelay, exponentialBackoff])

  const handleRetry = useCallback(async (isAutoRetry = false) => {
    if (retryCount >= maxRetries) {
      return
    }

    setIsRetrying(true)
    setError(null)

    try {
      if (!isAutoRetry) {
        setIsLoading(true)
      }

      await onRetry()
      setRetryCount(0)
      setError(null)
    } catch (err) {
      const newRetryCount = retryCount + 1
      setRetryCount(newRetryCount)
      
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage || errorMsg)

      if (autoRetry && newRetryCount < maxRetries) {
        const delay = calculateDelay(newRetryCount - 1)
        setTimeout(() => {
          handleRetry(true)
        }, delay)
      }
    } finally {
      setIsRetrying(false)
      setIsLoading(false)
    }
  }, [retryCount, maxRetries, onRetry, errorMessage, autoRetry, calculateDelay])

  const reset = useCallback(() => {
    setError(null)
    setRetryCount(0)
    setIsRetrying(false)
    setIsLoading(false)
  }, [])

  // Auto-retry on mount if there's an error
  useEffect(() => {
    if (error && autoRetry && retryCount < maxRetries && !isRetrying) {
      const delay = calculateDelay(retryCount)
      const timeoutId = setTimeout(() => {
        handleRetry(true)
      }, delay)
      
      return () => clearTimeout(timeoutId)
    }
  }, [error, autoRetry, retryCount, maxRetries, isRetrying, calculateDelay, handleRetry])

  if (error) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className={`space-y-4 ${className}`}>
        <ErrorDisplay
          error={error}
          loading={isRetrying}
          retry={showRetryButton && retryCount < maxRetries ? () => handleRetry() : undefined}
          onDismiss={reset}
          variant="card"
        />

        {retryCount >= maxRetries && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium">
                  Maximum retry attempts reached
                </p>
                <p className="text-white/70 text-sm mt-1">
                  Please check your connection and try again later, or contact support if the problem persists.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Reset
              </motion.button>
            </div>
          </motion.div>
        )}

        {autoRetry && retryCount < maxRetries && isRetrying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
              <p className="text-white/80 text-sm">
                Retrying automatically... (Attempt {retryCount + 1}/{maxRetries})
              </p>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return <>{children}</>
}

export default RetryWrapper