import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { ErrorState } from '../types'

interface ErrorNotificationProps {
  error: ErrorState
  onRetry: () => void
  retryText: string
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onRetry,
  retryText
}) => {
  return (
    <AnimatePresence>
      {error.hasError && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div 
            className="rounded-2xl p-6 backdrop-blur-lg border"
            style={{
              background: 'linear-gradient(145deg, rgba(220,38,38,0.95) 0%, rgba(153,27,27,0.90) 100%)',
              border: '1px solid rgba(220,38,38,0.5)',
              boxShadow: '0 20px 40px rgba(220,38,38,0.3)'
            }}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Connection Error</h3>
                <p className="text-white/90 text-sm mb-4">{error.message}</p>
                <motion.button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Retry connection"
                >
                  <RefreshCw className="h-4 w-4" />
                  {retryText}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}