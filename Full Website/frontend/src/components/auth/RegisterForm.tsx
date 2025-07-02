'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Building,
  AlertCircle, 
  CheckCircle,
  Loader2,
  ArrowRight,
  GraduationCap
} from 'lucide-react'

interface RegisterFormProps {
  onSwitchToLogin?: () => void
}

const departments = [
  'Customer Service',
  'Investment Banking',
  'Retail Banking',
  'Corporate Banking',
  'Risk Management',
  'Technology',
  'Human Resources',
  'Marketing',
  'Operations',
  'Compliance'
]

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    managerEmail: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        department: formData.department
      })
      
      if (result.success) {
        if (result.pendingApproval) {
          // Show success message for pending approval
          setError('') // Clear any errors
          alert(result.message || 'Registration submitted successfully. Your account is pending admin approval.')
          if (onSwitchToLogin) {
            onSwitchToLogin()
          } else {
            router.push('/login')
          }
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = 
    formData.firstName && 
    formData.lastName && 
    formData.email && 
    formData.password && 
    formData.confirmPassword &&
    formData.department &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 8

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak'

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Compact Header */}
      <div className="text-center mb-3">
        <motion.div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2 relative"
          style={{
            background: 'linear-gradient(145deg, #059669 0%, #047857 100%)',
            boxShadow: '0 8px 16px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
          whileHover={{ 
            scale: 1.05,
            rotateY: 5
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className="text-lg font-bold text-white tracking-wide">BNC</span>
          {/* Academy Badge */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600"
            animate={{ 
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GraduationCap className="h-2 w-2 text-white m-0.5" />
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="text-xl font-bold text-gray-900 dark:text-white mb-0.5"
          style={{ 
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '0.01em'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Create Account
        </motion.h1>
        
        <motion.p 
          className="text-green-600 dark:text-green-400 font-medium text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join the BNC Training Platform
        </motion.p>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="John"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Smith"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="john.smith@bnc.ca"
            />
          </div>
        </div>

        {/* Department Field */}
        <div>
          <label htmlFor="department" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Department
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-4 w-4 text-gray-400" />
            </div>
            <select
              id="department"
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none"
            >
              <option value="">Select your department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Manager Email Field */}
        <div>
          <label htmlFor="managerEmail" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Manager Email (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="managerEmail"
              name="managerEmail"
              type="email"
              value={formData.managerEmail}
              onChange={handleChange}
              className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="manager@bnc.ca"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter your manager&apos;s email if you know who your direct supervisor will be
          </p>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength === 'strong' ? 'bg-green-500 w-full' :
                      passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                      'bg-red-500 w-1/3'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength === 'strong' ? 'text-green-600 dark:text-green-400' :
                  passwordStrength === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {passwordStrength === 'strong' ? 'Strong' :
                   passwordStrength === 'medium' ? 'Medium' :
                   'Weak'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Repeat your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              )}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="mt-2 flex items-center gap-2">
              {formData.password === formData.confirmPassword ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">Passwords don&apos;t match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="terms" className="ml-2 text-xs text-gray-600 dark:text-gray-400">
            I agree to the{' '}
            <button type="button" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              Privacy Policy
            </button>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 text-sm
            ${isFormValid && !isSubmitting
              ? 'bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            }
          `}
          whileHover={isFormValid && !isSubmitting ? { scale: 1.02 } : {}}
          whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </form>

      {/* Login Link */}
      {onSwitchToLogin && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      )}
    </motion.div>
  )
}