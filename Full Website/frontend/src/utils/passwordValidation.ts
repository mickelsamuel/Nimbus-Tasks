export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'fair' | 'good' | 'strong'
  score: number
}

export interface PasswordRequirements {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  maxLength?: number
}

// Standard password requirements for all forms
export const STANDARD_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128
}

// Login form requirements (more lenient for existing accounts)
export const LOGIN_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 6,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSpecialChars: false,
  maxLength: 128
}

export function validatePassword(password: string, requirements: PasswordRequirements = STANDARD_PASSWORD_REQUIREMENTS): PasswordValidationResult {
  const errors: string[] = []
  let score = 0

  // Check minimum length
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`)
  } else {
    score += 1
  }

  // Check maximum length
  if (requirements.maxLength && password.length > requirements.maxLength) {
    errors.push(`Password must be no more than ${requirements.maxLength} characters long`)
  }

  // Check for uppercase letters
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else if (/[A-Z]/.test(password)) {
    score += 1
  }

  // Check for lowercase letters
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else if (/[a-z]/.test(password)) {
    score += 1
  }

  // Check for numbers
  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else if (/\d/.test(password)) {
    score += 1
  }

  // Check for special characters
  if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)')
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  }

  // Additional strength checks
  if (password.length >= 12) score += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password) && password.length >= 10) score += 1

  // Determine strength
  let strength: 'weak' | 'fair' | 'good' | 'strong'
  if (score <= 2) {
    strength = 'weak'
  } else if (score <= 4) {
    strength = 'fair'
  } else if (score <= 5) {
    strength = 'good'
  } else {
    strength = 'strong'
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score
  }
}

export function validatePasswordConfirmation(password: string, confirmPassword: string): { isValid: boolean; error?: string } {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    }
  }
  return { isValid: true }
}

export function getPasswordStrengthColor(strength: 'weak' | 'fair' | 'good' | 'strong'): string {
  switch (strength) {
    case 'weak':
      return 'text-red-600 dark:text-red-400'
    case 'fair':
      return 'text-orange-600 dark:text-orange-400'
    case 'good':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'strong':
      return 'text-green-600 dark:text-green-400'
  }
}

export function getPasswordStrengthBgColor(strength: 'weak' | 'fair' | 'good' | 'strong'): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500'
    case 'fair':
      return 'bg-orange-500'
    case 'good':
      return 'bg-yellow-500'
    case 'strong':
      return 'bg-green-500'
  }
}