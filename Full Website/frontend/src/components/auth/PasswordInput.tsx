'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { 
  validatePassword, 
  validatePasswordConfirmation,
  getPasswordStrengthColor,
  getPasswordStrengthBgColor,
  type PasswordRequirements,
  STANDARD_PASSWORD_REQUIREMENTS 
} from '@/utils/passwordValidation'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  placeholder?: string
  label?: string
  showStrengthMeter?: boolean
  showRequirements?: boolean
  requirements?: PasswordRequirements
  confirmValue?: string
  onConfirmChange?: (value: string) => void
  showConfirmation?: boolean
  disabled?: boolean
  className?: string
}

export function PasswordInput({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter password",
  label = "Password",
  showStrengthMeter = true,
  showRequirements = true,
  requirements = STANDARD_PASSWORD_REQUIREMENTS,
  confirmValue = '',
  onConfirmChange,
  showConfirmation = false,
  disabled = false,
  className = ''
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focused, setFocused] = useState(false)
  const [confirmFocused, setConfirmFocused] = useState(false)

  const validation = validatePassword(value, requirements)
  const confirmValidation = showConfirmation ? validatePasswordConfirmation(value, confirmValue) : { isValid: true }

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation.isValid && confirmValidation.isValid)
    }
  }, [validation.isValid, confirmValidation.isValid, onValidationChange])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Password Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200
              ${validation.isValid || value === '' 
                ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                : 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              }
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder:text-gray-400 dark:placeholder:text-gray-500
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:cursor-not-allowed"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Strength Meter */}
        {showStrengthMeter && value && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Password strength</span>
              <span className={`text-xs font-medium ${getPasswordStrengthColor(validation.strength)}`}>
                {validation.strength.charAt(0).toUpperCase() + validation.strength.slice(1)}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getPasswordStrengthBgColor(validation.strength)}`}
                style={{ width: `${(validation.score / 7) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Requirements List */}
        {showRequirements && (focused || value) && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password requirements:</p>
            <div className="space-y-1">
              <RequirementItem 
                met={value.length >= requirements.minLength}
                text={`At least ${requirements.minLength} characters`}
              />
              {requirements.requireUppercase && (
                <RequirementItem 
                  met={/[A-Z]/.test(value)}
                  text="One uppercase letter"
                />
              )}
              {requirements.requireLowercase && (
                <RequirementItem 
                  met={/[a-z]/.test(value)}
                  text="One lowercase letter"
                />
              )}
              {requirements.requireNumbers && (
                <RequirementItem 
                  met={/\d/.test(value)}
                  text="One number"
                />
              )}
              {requirements.requireSpecialChars && (
                <RequirementItem 
                  met={/[!@#$%^&*(),.?":{}|<>]/.test(value)}
                  text="One special character"
                />
              )}
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {value && !validation.isValid && (
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <p key={index} className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="h-3 w-3" />
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password Input */}
      {showConfirmation && onConfirmChange && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmValue}
              onChange={(e) => onConfirmChange(e.target.value)}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              placeholder="Confirm your password"
              disabled={disabled}
              className={`
                w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200
                ${confirmValidation.isValid || confirmValue === '' 
                  ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                  : 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                }
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                placeholder:text-gray-400 dark:placeholder:text-gray-500
              `}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:cursor-not-allowed"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirmation Validation */}
          {confirmValue && !confirmValidation.isValid && (
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <X className="h-3 w-3" />
              {confirmValidation.error}
            </p>
          )}

          {confirmValue && confirmValidation.isValid && value === confirmValue && (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Passwords match
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      <span>{text}</span>
    </div>
  )
}