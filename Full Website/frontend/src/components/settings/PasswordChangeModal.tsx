'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Key } from 'lucide-react'

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  passwordForm: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  setPasswordForm: (form: (prev: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => void
  passwordErrors: Record<string, string>
  isLoading: boolean
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  passwordForm,
  setPasswordForm,
  passwordErrors,
  isLoading
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 w-full max-w-md shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Key className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Secure your account with a new password</p>
              </div>
            </div>
            
            {passwordErrors.general && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {passwordErrors.general}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder-gray-400 dark:placeholder-gray-400"
                  placeholder="Enter your current password"
                  disabled={isLoading}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder-gray-400 dark:placeholder-gray-400"
                  placeholder="Enter your new password"
                  disabled={isLoading}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{passwordErrors.newPassword}</p>
                )}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 6 characters long
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder-gray-400 dark:placeholder-gray-400"
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Changing...
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PasswordChangeModal