'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface FormState {
  password: string
  confirmPassword: string
  isSubmitting: boolean
  isSuccess: boolean
  error: string
  showPassword: boolean
  showConfirmPassword: boolean
}

interface ResetPasswordFormProps {
  formState: FormState
  onInputChange: (field: keyof FormState, value: string | boolean) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  passwordStrength: 'weak' | 'medium' | 'strong'
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  formState,
  onInputChange,
  onSubmit,
  passwordStrength
}) => {
  return (
    <div className="space-y-6">
      {/* Error Message */}
      <AnimatePresence>
        {formState.error && (
          <motion.div
            className="p-4 rounded-xl bg-red-50 border border-red-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{formState.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Executive Security Key
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <motion.div
                animate={{ 
                  scale: formState.password ? [1, 1.1, 1] : 1,
                  rotate: formState.password ? [0, -5, 5, 0] : 0
                }}
                transition={{ duration: 1.5, repeat: formState.password ? Infinity : 0, ease: 'easeInOut' }}
              >
                <Lock className={`h-5 w-5 ${
                  formState.password 
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`} />
              </motion.div>
            </div>
            <input
              id="password"
              name="password"
              type={formState.showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formState.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              className="block w-full pl-10 pr-12 py-3 sm:py-4 text-sm sm:text-base border border-primary-300 dark:border-primary-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
              style={{
                boxShadow: formState.password ? '0 0 0 1px rgba(224,26,26,0.1), 0 0 20px rgba(16,185,129,0.1)' : 'none'
              }}
              placeholder="Enter your new secure password"
              aria-describedby={formState.error ? "password-error" : "password-help"}
              aria-invalid={formState.error ? "true" : "false"}
            />
            
            {/* Show/Hide Toggle */}
            <motion.button
              type="button"
              onClick={() => onInputChange('showPassword', !formState.showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={formState.showPassword ? "Hide password" : "Show password"}
            >
              <motion.div
                animate={{ rotate: formState.showPassword ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {formState.showPassword ? (
                  <EyeOff className="h-5 w-5 text-primary-500 hover:text-primary-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-primary-500 hover:text-primary-600 transition-colors" />
                )}
              </motion.div>
            </motion.button>
            
            {/* Security Strength Indicator */}
            {formState.password && (
              <div className="absolute -bottom-1 left-0 right-0 flex justify-center">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full transition-colors duration-200 ${
                        formState.password.length > i * 2 
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Password Strength Indicator */}
          {formState.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength === 'strong' ? 'bg-green-500 w-full' :
                      passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                      'bg-red-500 w-1/3'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength === 'strong' ? 'text-green-600' :
                  passwordStrength === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {passwordStrength === 'strong' ? 'Strong' :
                   passwordStrength === 'medium' ? 'Medium' :
                   'Weak'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Confirm Security Key
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <motion.div
                animate={{ 
                  scale: formState.confirmPassword ? [1, 1.1, 1] : 1,
                  rotate: formState.confirmPassword ? [0, -5, 5, 0] : 0
                }}
                transition={{ duration: 1.5, repeat: formState.confirmPassword ? Infinity : 0, ease: 'easeInOut' }}
              >
                <Lock className={`h-5 w-5 ${
                  formState.confirmPassword && formState.password === formState.confirmPassword
                    ? 'text-green-500'
                    : formState.confirmPassword && formState.password !== formState.confirmPassword
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`} />
              </motion.div>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={formState.showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formState.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              className={`block w-full pl-10 pr-12 py-3 sm:py-4 text-sm sm:text-base border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                formState.confirmPassword && formState.password !== formState.confirmPassword
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-primary-300 dark:border-primary-600'
              }`}
              style={{
                boxShadow: formState.confirmPassword 
                  ? formState.password === formState.confirmPassword
                    ? '0 0 0 1px rgba(16,185,129,0.2), 0 0 20px rgba(16,185,129,0.1)'
                    : '0 0 0 1px rgba(239,68,68,0.2), 0 0 20px rgba(239,68,68,0.1)'
                  : 'none'
              }}
              placeholder="Confirm your new secure password"
              aria-describedby={formState.error ? "confirm-password-error" : "confirm-password-help"}
              aria-invalid={formState.confirmPassword && formState.password !== formState.confirmPassword ? "true" : "false"}
            />
            
            {/* Show/Hide Toggle */}
            <motion.button
              type="button"
              onClick={() => onInputChange('showConfirmPassword', !formState.showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={formState.showConfirmPassword ? "Hide password" : "Show password"}
            >
              <motion.div
                animate={{ rotate: formState.showConfirmPassword ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {formState.showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-primary-500 hover:text-primary-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-primary-500 hover:text-primary-600 transition-colors" />
                )}
              </motion.div>
            </motion.button>
          </div>
          
          {/* Password Match Indicator */}
          {formState.confirmPassword && (
            <div className="mt-2 flex items-center gap-2">
              {formState.password === formState.confirmPassword ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Passwords don&apos;t match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!formState.password || !formState.confirmPassword || formState.password !== formState.confirmPassword || formState.isSubmitting}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 sm:py-5 text-sm sm:text-base rounded-xl font-bold text-white transition-all duration-300 ${
            formState.password && formState.confirmPassword && formState.password === formState.confirmPassword && !formState.isSubmitting
              ? 'bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 hover:from-teal-700 hover:to-blue-800 shadow-lg hover:shadow-2xl transform hover:scale-[1.02]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          whileHover={formState.password && formState.confirmPassword && formState.password === formState.confirmPassword && !formState.isSubmitting ? { scale: 1.02 } : {}}
          whileTap={formState.password && formState.confirmPassword && formState.password === formState.confirmPassword && !formState.isSubmitting ? { scale: 0.98 } : {}}
        >
          {formState.isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <span>Update Password</span>
              <Shield className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}