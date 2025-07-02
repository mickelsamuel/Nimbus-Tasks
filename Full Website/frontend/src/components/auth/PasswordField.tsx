'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isAdminMode?: boolean
  error?: string
}

export default function PasswordField({ value, onChange, isAdminMode = false, error }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {isAdminMode ? 'Command Access Key' : 'Executive Security Key'}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <motion.div
            animate={{ 
              scale: value ? [1, 1.1, 1] : 1,
              rotate: value ? [0, -5, 5, 0] : 0
            }}
            transition={{ duration: 1.5, repeat: value ? Infinity : 0, ease: 'easeInOut' }}
          >
            <Lock className={`h-5 w-5 ${
              value 
                ? (isAdminMode ? 'text-red-500' : 'text-green-500')
                : 'text-gray-400'
            }`} />
          </motion.div>
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={value}
          onChange={onChange}
          className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
            isAdminMode 
              ? 'border-red-300 dark:border-red-600 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-primary-300 dark:border-primary-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
          }`}
          style={{
            boxShadow: value ? (isAdminMode ? '0 0 0 1px rgba(139,0,0,0.1), 0 0 20px rgba(139,0,0,0.1)' : '0 0 0 1px rgba(224,26,26,0.1), 0 0 20px rgba(224,26,26,0.1)') : 'none'
          }}
          placeholder={isAdminMode ? "Enter command access key" : "Enter your security key"}
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={error ? "true" : "false"}
        />
        
        {/* Enhanced Show/Hide Toggle */}
        <motion.button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <motion.div
            animate={{ rotate: showPassword ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {showPassword ? (
              <EyeOff className={`h-5 w-5 ${isAdminMode ? 'text-red-500 hover:text-red-600' : 'text-primary-500 hover:text-primary-600'} transition-colors`} />
            ) : (
              <Eye className={`h-5 w-5 ${isAdminMode ? 'text-red-500 hover:text-red-600' : 'text-primary-500 hover:text-primary-600'} transition-colors`} />
            )}
          </motion.div>
        </motion.button>
        
        {/* Security Strength Indicator */}
        {value && (
          <motion.div
            className="absolute -bottom-1 left-0 right-0 flex justify-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1 h-1 rounded-full ${
                    value.length > i * 2 
                      ? (isAdminMode ? 'bg-red-500' : 'bg-green-500')
                      : 'bg-gray-300'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}