'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'

interface LoadingStateProps {
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className = "" }) => (
  <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-teal-600 ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
)

interface InvalidTokenStateProps {
  onRequestNewLink: () => void
  className?: string
}

export const InvalidTokenState: React.FC<InvalidTokenStateProps> = ({ 
  onRequestNewLink,
  className = ""
}) => (
  <div className={`min-h-screen flex items-center justify-center px-4 ${className}`} style={{
    background: 'linear-gradient(135deg, #0A1628 0%, #1E40AF 50%, #DC2626 100%)'
  }}>
    <motion.div
      className="text-center max-w-md mx-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Invalid Reset Link</h1>
      <p className="text-white/80 mb-8">
        This password reset link is invalid or has expired. Please request a new password reset.
      </p>
      <button
        onClick={onRequestNewLink}
        className="bg-white text-gray-900 px-6 py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Request New Reset Link
      </button>
    </motion.div>
  </div>
)

interface SuccessStateProps {
  className?: string
}

export const SuccessState: React.FC<SuccessStateProps> = ({ className = "" }) => (
  <div className={`min-h-screen flex items-center justify-center px-4 ${className}`} style={{
    background: 'linear-gradient(135deg, #0A1628 0%, #1E40AF 50%, #059669 100%)'
  }}>
    <motion.div
      className="text-center max-w-md mx-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
      >
        <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
      </motion.div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Password Reset Successful!</h1>
      <p className="text-white/80 mb-8">
        Your password has been successfully updated. You will be redirected to the login page shortly.
      </p>
      <div className="bg-white/10 rounded-lg p-4">
        <p className="text-white/90 text-sm">Redirecting to login...</p>
      </div>
    </motion.div>
  </div>
)

interface BackToLoginButtonProps {
  onClick: () => void
  className?: string
}

export const BackToLoginButton: React.FC<BackToLoginButtonProps> = ({ 
  onClick,
  className = ""
}) => (
  <motion.button
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-300 mt-6 ${className}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    aria-label="Return to login page"
  >
    <ArrowLeft className="h-4 w-4" />
    Return to Secure Login
  </motion.button>
)