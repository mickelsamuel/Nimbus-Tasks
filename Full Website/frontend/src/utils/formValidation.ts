export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  email?: boolean
  phone?: boolean
  url?: boolean
  min?: number
  max?: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FormValidationSchema {
  [fieldName: string]: ValidationRule
}

export interface FormErrors {
  [fieldName: string]: string[]
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z\s]+$/,
  numeric: /^\d+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
}

// Common validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must not exceed ${max}`,
  pattern: 'Invalid format',
  strongPassword: 'Password must contain uppercase, lowercase, number and special character'
}

/**
 * Validates a single field value against its validation rules
 */
export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = []

  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push(VALIDATION_MESSAGES.required)
    return { isValid: false, errors }
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: true, errors: [] }
  }

  const stringValue = String(value).trim()

  // Length validations for strings
  if (typeof value === 'string') {
    if (rules.minLength && stringValue.length < rules.minLength) {
      errors.push(VALIDATION_MESSAGES.minLength(rules.minLength))
    }
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      errors.push(VALIDATION_MESSAGES.maxLength(rules.maxLength))
    }
  }

  // Numeric validations
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value)
    if (rules.min !== undefined && numValue < rules.min) {
      errors.push(VALIDATION_MESSAGES.min(rules.min))
    }
    if (rules.max !== undefined && numValue > rules.max) {
      errors.push(VALIDATION_MESSAGES.max(rules.max))
    }
  }

  // Email validation
  if (rules.email && !VALIDATION_PATTERNS.email.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.email)
  }

  // Phone validation
  if (rules.phone && !VALIDATION_PATTERNS.phone.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.phone)
  }

  // URL validation
  if (rules.url && !VALIDATION_PATTERNS.url.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.url)
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.pattern)
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value)
    if (customError) {
      errors.push(customError)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates an entire form object against a schema
 */
export function validateForm(formData: Record<string, any>, schema: FormValidationSchema): {
  isValid: boolean
  errors: FormErrors
} {
  const formErrors: FormErrors = {}
  let isFormValid = true

  for (const [fieldName, rules] of Object.entries(schema)) {
    const fieldValue = formData[fieldName]
    const fieldValidation = validateField(fieldValue, rules)
    
    if (!fieldValidation.isValid) {
      formErrors[fieldName] = fieldValidation.errors
      isFormValid = false
    }
  }

  return {
    isValid: isFormValid,
    errors: formErrors
  }
}

/**
 * Real-time validation hook for individual fields
 */
export function validateFieldRealtime(
  value: any, 
  rules: ValidationRule,
  debounceMs: number = 300
): ValidationResult {
  // This would be used with a debounce hook in React
  return validateField(value, rules)
}

/**
 * Pre-defined validation schemas for common forms
 */
export const COMMON_SCHEMAS = {
  login: {
    email: { required: true, email: true },
    password: { required: true, minLength: 6 }
  },
  signup: {
    firstName: { required: true, minLength: 2, maxLength: 50, pattern: VALIDATION_PATTERNS.alphabetic },
    lastName: { required: true, minLength: 2, maxLength: 50, pattern: VALIDATION_PATTERNS.alphabetic },
    email: { required: true, email: true },
    password: { required: true, minLength: 8, pattern: VALIDATION_PATTERNS.strongPassword }
  },
  profile: {
    firstName: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, email: true },
    phone: { phone: true },
    website: { url: true }
  },
  booking: {
    title: { required: true, minLength: 3, maxLength: 100 },
    startTime: { required: true },
    endTime: { required: true },
    attendees: { min: 1, max: 20 }
  },
  contact: {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, email: true },
    subject: { required: true, minLength: 5, maxLength: 200 },
    message: { required: true, minLength: 10, maxLength: 1000 }
  }
}

/**
 * Helper function to format validation errors for display
 */
export function formatValidationErrors(errors: FormErrors): string[] {
  const allErrors: string[] = []
  
  for (const [fieldName, fieldErrors] of Object.entries(errors)) {
    for (const error of fieldErrors) {
      allErrors.push(`${fieldName}: ${error}`)
    }
  }
  
  return allErrors
}

/**
 * Helper function to get first error for a field
 */
export function getFirstFieldError(errors: FormErrors, fieldName: string): string | null {
  return errors[fieldName]?.[0] || null
}

/**
 * Helper function to check if a specific field has errors
 */
export function hasFieldError(errors: FormErrors, fieldName: string): boolean {
  return errors[fieldName] && errors[fieldName].length > 0
}

/**
 * Sanitize form input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Validate file upload
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    maxFiles?: number
  } = {}
): ValidationResult {
  const errors: string[] = []
  
  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`File size must not exceed ${Math.round(options.maxSize / 1024 / 1024)}MB`)
  }
  
  // Check file type
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}