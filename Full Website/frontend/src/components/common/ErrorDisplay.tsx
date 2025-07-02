'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw, X, Wifi, Server, Shield, Clock } from 'lucide-react'

interface ErrorDisplayProps {
  error?: string | null
  loading?: boolean
  retry?: () => void
  onDismiss?: () => void
  variant?: 'banner' | 'card' | 'inline' | 'toast'
  size?: 'sm' | 'md' | 'lg'
  type?: 'network' | 'auth' | 'server' | 'validation' | 'timeout' | 'generic'
  className?: string
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  loading = false,
  retry,
  onDismiss,
  variant = 'card',
  size = 'md',
  type = 'generic',
  className = ''
}) => {
  if (!error) return null

  const getIcon = () => {
    switch (type) {
      case 'network':
        return <Wifi className="w-5 h-5" />
      case 'auth':
        return <Shield className="w-5 h-5" />
      case 'server':
        return <Server className="w-5 h-5" />
      case 'timeout':
        return <Clock className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case 'network':
        return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30'
      case 'auth':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
      case 'server':
        return 'from-red-500/20 to-red-600/20 border-red-500/30'
      case 'timeout':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
      default:
        return 'from-red-500/20 to-red-600/20 border-red-500/30'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-3 text-sm'
      case 'lg':
        return 'p-6 text-base'
      default:
        return 'p-4 text-sm'
    }
  }

  const getVariantClasses = () => {
    const baseClasses = `bg-gradient-to-r ${getTypeColor()} backdrop-blur-xl border rounded-xl ${getSizeClasses()}`
    
    switch (variant) {
      case 'banner':
        return `${baseClasses} w-full rounded-none border-l-0 border-r-0`
      case 'inline':
        return `${baseClasses} border-l-4 border-l-red-500 bg-red-50/10`
      case 'toast':
        return `${baseClasses} shadow-lg max-w-sm`
      default:
        return baseClasses
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className={`${getVariantClasses()} ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-red-400 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium leading-relaxed">
              {error}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {retry && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={retry}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Retrying...' : 'Retry'}
              </motion.button>
            )}
            
            {onDismiss && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDismiss}
                className="p-1 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Specific error display components
export const NetworkErrorDisplay: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay {...props} type="network" />
)

export const AuthErrorDisplay: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay {...props} type="auth" />
)

export const ServerErrorDisplay: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay {...props} type="server" />
)

export const ValidationErrorDisplay: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay {...props} type="validation" />
)

export const TimeoutErrorDisplay: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay {...props} type="timeout" />
)

export default ErrorDisplay