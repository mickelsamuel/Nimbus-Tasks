'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getTokenInfo, clearAuthTokens, debugAuthState } from '@/utils/authRecovery'

interface AuthRecoveryProps {
  error?: string
  onRetry?: () => void
}

export default function AuthRecovery({ error, onRetry }: AuthRecoveryProps) {
  const { logout } = useAuth()
  
  const handleClearTokens = () => {
    clearAuthTokens()
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  const handleDebugAuth = () => {
    debugAuthState()
    const tokenInfo = getTokenInfo()
    alert(`Token Info:\nPresent: ${!!tokenInfo.token}\nValid: ${tokenInfo.isValid}\nExpired: ${tokenInfo.isExpired}`)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Authentication Issue
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            {error || 'There seems to be an issue with your authentication. This usually happens when your session has expired.'}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleClearTokens}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Clear Cache & Retry
            </button>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 rounded-md transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Log In Again
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleDebugAuth}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/50 rounded-md transition-colors"
              >
                Debug Info
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 