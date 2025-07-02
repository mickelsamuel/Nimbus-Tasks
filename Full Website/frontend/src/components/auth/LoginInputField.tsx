'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface LoginInputFieldProps {
  id: string
  name: string
  type: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon: LucideIcon
  isAdminMode?: boolean
  autoComplete?: string
  required?: boolean
  error?: string
  showEncryptionIndicator?: boolean
  children?: React.ReactNode
}

export default function LoginInputField({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  isAdminMode = false,
  autoComplete,
  required = false,
  error,
  showEncryptionIndicator = false,
  children
}: LoginInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <motion.label 
        htmlFor={id} 
        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3"
        animate={{ 
          color: isFocused 
            ? (isAdminMode ? '#DC2626' : '#2563EB')
            : undefined
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </motion.label>
      
      <motion.div 
        className="relative group"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Icon with Enhanced Animation */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <motion.div
            animate={{ 
              scale: isFocused ? [1, 1.2, 1] : [1, 1.05, 1],
              rotate: isFocused ? [0, 5, -5, 0] : [0, 2, -2, 0],
              color: isFocused 
                ? (isAdminMode ? '#DC2626' : '#2563EB')
                : (isAdminMode ? '#EF4444' : '#3B82F6')
            }}
            transition={{ 
              duration: isFocused ? 0.6 : 2, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            <Icon className="h-5 w-5 transition-colors duration-200" />
          </motion.div>
        </div>

        {/* Enhanced Input Field */}
        <motion.input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            block w-full pl-12 pr-16 py-4 rounded-2xl text-base font-medium
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            border-2 transition-all duration-300 ease-out
            focus:outline-none focus:ring-0
            ${error 
              ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10' 
              : isFocused
                ? (isAdminMode 
                  ? 'border-red-500 dark:border-red-400 shadow-lg shadow-red-500/20 dark:shadow-red-400/20' 
                  : 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 dark:shadow-blue-400/20')
                : isHovered
                  ? 'border-gray-300 dark:border-gray-600 shadow-md'
                  : 'border-gray-200 dark:border-gray-700'
            }
          `}
          style={{
            boxShadow: isFocused 
              ? (isAdminMode 
                ? '0 0 0 4px rgba(220, 38, 38, 0.1), 0 8px 25px rgba(220, 38, 38, 0.15)' 
                : '0 0 0 4px rgba(37, 99, 235, 0.1), 0 8px 25px rgba(37, 99, 235, 0.15)')
              : value 
                ? '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)'
                : 'none'
          }}
          placeholder={placeholder}
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={error ? "true" : "false"}
        />

        {/* Enhanced Focus Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: isFocused 
              ? (isAdminMode 
                ? 'linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.05), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.05), transparent)')
              : 'transparent'
          }}
          animate={{
            opacity: isFocused ? [0, 1, 0] : 0
          }}
          transition={{
            duration: 2,
            repeat: isFocused ? Infinity : 0,
            ease: 'easeInOut'
          }}
        />
        
        {/* Enhanced Encryption Indicator */}
        {showEncryptionIndicator && value && (
          <motion.div
            className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'backOut' }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <motion.div 
                className={`w-2.5 h-2.5 rounded-full ${
                  isAdminMode ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Encrypted
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* Floating Label Effect */}
        {isFocused && (
          <motion.div
            className="absolute -top-2 left-3 px-2 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 rounded"
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {label}
          </motion.div>
        )}

        {/* Additional content (like password toggle) */}
        {children}

        {/* Shimmer Effect on Focus */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`absolute inset-0 ${
                isAdminMode 
                  ? 'bg-gradient-to-r from-transparent via-red-500/10 to-transparent'
                  : 'bg-gradient-to-r from-transparent via-blue-500/10 to-transparent'
              }`}
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Error Message */}
      {error && (
        <motion.div
          className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center space-x-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-1 h-1 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  )
}