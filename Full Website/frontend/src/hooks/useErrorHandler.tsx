'use client'

import { useCallback } from 'react'
import { toast } from 'react-hot-toast'

interface ErrorDetails {
  message: string
  code?: string | number
  context?: string
  retryAction?: () => void
  silent?: boolean
}

interface APIError {
  message?: string
  error?: string
  errors?: Array<{ msg?: string; message?: string }>
  status?: number
  statusText?: string
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, details?: Partial<ErrorDetails>) => {
    console.error('Error caught:', error, details)

    // Extract error message
    let message = 'An unexpected error occurred'
    let code: string | number | undefined

    if (error && typeof error === 'object') {
      const apiError = error as APIError

      // Handle API response errors
      if (apiError.message) {
        message = apiError.message
      } else if (apiError.error) {
        message = apiError.error
      } else if (apiError.errors && Array.isArray(apiError.errors)) {
        message = apiError.errors
          .map(err => err.msg || err.message)
          .filter(Boolean)
          .join(', ') || message
      }

      // Extract status code
      if (apiError.status) {
        code = apiError.status
      }

      // Handle specific HTTP status codes
      switch (apiError.status) {
        case 401:
          message = 'You need to log in to access this feature'
          // Could trigger logout or redirect to login
          break
        case 403:
          message = 'You don\'t have permission to perform this action'
          break
        case 404:
          message = 'The requested resource was not found'
          break
        case 429:
          message = 'Too many requests. Please wait a moment and try again'
          break
        case 500:
          message = 'Server error. Please try again later'
          break
        case 503:
          message = 'Service temporarily unavailable'
          break
      }
    } else if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }

    // Use provided message if available
    if (details?.message) {
      message = details.message
    }

    // Add context if provided
    const finalMessage = details?.context 
      ? `${details.context}: ${message}`
      : message

    // Show toast notification unless silent
    if (!details?.silent) {
      const toastId = toast.error(finalMessage, {
        duration: 5000,
        style: {
          background: '#1F2937',
          color: '#F9FAFB',
          border: '1px solid #374151'
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#F9FAFB'
        }
      })

      // Add retry button if retry action provided
      if (details?.retryAction) {
        setTimeout(() => {
          toast.dismiss(toastId)
          toast((t) => (
            <div className="flex items-center gap-3">
              <span>{finalMessage}</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id)
                  details.retryAction?.()
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ), {
            duration: 8000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              border: '1px solid #374151'
            }
          })
        }, 100)
      }
    }

    // Report to error tracking service
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      try {
        fetch('/api/errors/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: finalMessage,
            originalError: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            code,
            context: details?.context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          })
        }).catch(() => {
          // Silently fail if error reporting fails
        })
      } catch {
        // Silently fail
      }
    }

    return {
      message: finalMessage,
      code,
      originalError: error
    }
  }, [])

  const handleNetworkError = useCallback((error: unknown) => {
    return handleError(error, {
      message: 'Network error. Please check your internet connection and try again.',
      context: 'Network'
    })
  }, [handleError])

  const handleAuthError = useCallback((error: unknown) => {
    return handleError(error, {
      message: 'Authentication failed. Please log in again.',
      context: 'Authentication'
    })
  }, [handleError])

  const handleValidationError = useCallback((error: unknown) => {
    return handleError(error, {
      context: 'Validation'
    })
  }, [handleError])

  const handleAPIError = useCallback((error: unknown, context?: string) => {
    return handleError(error, {
      context: context || 'API'
    })
  }, [handleError])

  return {
    handleError,
    handleNetworkError,
    handleAuthError,
    handleValidationError,
    handleAPIError
  }
}

export default useErrorHandler