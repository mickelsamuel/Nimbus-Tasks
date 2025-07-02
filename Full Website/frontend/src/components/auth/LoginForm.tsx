'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { AlertCircle, Mail } from 'lucide-react'
import LoginFormHeader from './LoginFormHeader'
import LoginInputField from './LoginInputField'
import PasswordField from './PasswordField'
import LoginSubmitButton from './LoginSubmitButton'

interface LoginFormProps {
  onSwitchToRegister?: () => void
  onSwitchToForgotPassword?: () => void
  isAdminMode?: boolean
}

export default function LoginForm({ onSwitchToRegister, onSwitchToForgotPassword, isAdminMode = false }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  // const [showPassword, setShowPassword] = useState(false) // Unused for now
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user starts typing
    if (error) setError('')
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Real-time validation
    if (name === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setValidationErrors({})
    
    // Client-side validation
    const errors: Record<string, string> = {}
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setIsSubmitting(true)

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe)
      
      if (!result.success) {
        setError(result.error || 'Login failed')
      }
      // Note: AuthContext handles successful login navigation
    } catch (error) {
      console.error('Login form error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = Boolean(
    formData.email && 
    formData.password && 
    Object.keys(validationErrors).length === 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  )

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="main"
      aria-label={isAdminMode ? "Administrative login form" : "Executive portal login form"}
    >
      {/* Executive Header */}
      <LoginFormHeader isAdminMode={isAdminMode} />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm text-red-700 dark:text-red-300" id="login-error">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        noValidate
        aria-label={isAdminMode ? "Administrative login form" : "Executive portal login form"}
      >
        {/* Executive Email Field */}
        <LoginInputField
          id="email"
          name="email"
          type="email"
          label={isAdminMode ? 'Administrative Email' : 'Executive Email Address'}
          placeholder={isAdminMode ? "admin.executive@bnc.ca" : "executive.name@bnc.ca"}
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          isAdminMode={isAdminMode}
          autoComplete="email"
          required
          error={error || validationErrors.email}
          showEncryptionIndicator
        />

        {/* Banking-Grade Password Field */}
        <PasswordField
          value={formData.password}
          onChange={handleChange}
          isAdminMode={isAdminMode}
          error={error || validationErrors.password}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              aria-describedby="remember-me-description"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400" id="remember-me-description">
              Remember me
            </span>
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/help')}
              className="text-sm text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors hover:underline"
              aria-label="Get help and support"
            >
              Need help?
            </button>
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors hover:underline"
              aria-label="Reset password"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Executive Submit Button */}
        <LoginSubmitButton
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          isAdminMode={isAdminMode}
          error={error}
        />
      </form>


      {/* Register Link */}
      {onSwitchToRegister && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
            >
              Create one here
            </button>
          </p>
        </div>
      )}
    </motion.div>
  )
}