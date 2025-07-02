import { useState, useCallback, useEffect } from 'react'
import {
  validateForm,
  validateField,
  FormValidationSchema,
  FormErrors,
  ValidationRule,
  sanitizeInput,
  COMMON_SCHEMAS
} from '@/utils/formValidation'

interface UseFormValidationOptions {
  schema: FormValidationSchema
  initialData?: Record<string, any>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  sanitizeInputs?: boolean
  onSubmit?: (data: Record<string, any>) => void | Promise<void>
}

interface UseFormValidationReturn {
  data: Record<string, any>
  errors: FormErrors
  isValid: boolean
  isSubmitting: boolean
  touched: Record<string, boolean>
  
  // Form control functions
  setValue: (field: string, value: any) => void
  setError: (field: string, error: string) => void
  clearError: (field: string) => void
  clearAllErrors: () => void
  handleChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (field: string) => () => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  validate: (field?: string) => boolean
  reset: (newData?: Record<string, any>) => void
  
  // Helper functions
  getFieldError: (field: string) => string | null
  hasFieldError: (field: string) => boolean
  isFieldTouched: (field: string) => boolean
}

export function useFormValidation({
  schema,
  initialData = {},
  validateOnChange = true,
  validateOnBlur = true,
  sanitizeInputs = true,
  onSubmit
}: UseFormValidationOptions): UseFormValidationReturn {
  
  const [data, setData] = useState<Record<string, any>>(initialData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate if form is valid
  const isValid = Object.keys(errors).length === 0

  // Set field value
  const setValue = useCallback((field: string, value: any) => {
    const processedValue = sanitizeInputs && typeof value === 'string' ? sanitizeInput(value) : value
    
    setData(prev => ({
      ...prev,
      [field]: processedValue
    }))

    // Validate on change if enabled
    if (validateOnChange && schema[field]) {
      const fieldValidation = validateField(processedValue, schema[field])
      if (fieldValidation.isValid) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      } else {
        setErrors(prev => ({
          ...prev,
          [field]: fieldValidation.errors
        }))
      }
    }
  }, [schema, validateOnChange, sanitizeInputs])

  // Set field error manually
  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: [error]
    }))
  }, [])

  // Clear field error
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  // Handle input change
  const handleChange = useCallback((field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : e.target.value
      setValue(field, value)
    }
  }, [setValue])

  // Handle input blur
  const handleBlur = useCallback((field: string) => {
    return () => {
      setTouched(prev => ({
        ...prev,
        [field]: true
      }))

      // Validate on blur if enabled
      if (validateOnBlur && schema[field]) {
        const fieldValidation = validateField(data[field], schema[field])
        if (!fieldValidation.isValid) {
          setErrors(prev => ({
            ...prev,
            [field]: fieldValidation.errors
          }))
        }
      }
    }
  }, [data, schema, validateOnBlur])

  // Validate specific field or entire form
  const validate = useCallback((field?: string) => {
    if (field) {
      // Validate single field
      if (schema[field]) {
        const fieldValidation = validateField(data[field], schema[field])
        if (fieldValidation.isValid) {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
          return true
        } else {
          setErrors(prev => ({
            ...prev,
            [field]: fieldValidation.errors
          }))
          return false
        }
      }
      return true
    } else {
      // Validate entire form
      const formValidation = validateForm(data, schema)
      setErrors(formValidation.errors)
      return formValidation.isValid
    }
  }, [data, schema])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched = Object.keys(schema).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {})
    setTouched(allTouched)

    // Validate entire form
    const isFormValid = validate()
    
    if (!isFormValid || !onSubmit) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [data, schema, validate, onSubmit])

  // Reset form
  const reset = useCallback((newData?: Record<string, any>) => {
    setData(newData || initialData)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialData])

  // Helper functions
  const getFieldError = useCallback((field: string): string | null => {
    return errors[field]?.[0] || null
  }, [errors])

  const hasFieldError = useCallback((field: string): boolean => {
    return Boolean(errors[field] && errors[field].length > 0)
  }, [errors])

  const isFieldTouched = useCallback((field: string): boolean => {
    return Boolean(touched[field])
  }, [touched])

  return {
    data,
    errors,
    isValid,
    isSubmitting,
    touched,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    getFieldError,
    hasFieldError,
    isFieldTouched
  }
}

// Pre-configured hooks for common forms
export function useLoginValidation(onSubmit?: (data: Record<string, any>) => void | Promise<void>) {
  return useFormValidation({
    schema: COMMON_SCHEMAS.login,
    onSubmit
  })
}

export function useSignupValidation(onSubmit?: (data: Record<string, any>) => void | Promise<void>) {
  return useFormValidation({
    schema: COMMON_SCHEMAS.signup,
    onSubmit
  })
}

export function useProfileValidation(
  initialData?: Record<string, any>,
  onSubmit?: (data: Record<string, any>) => void | Promise<void>
) {
  return useFormValidation({
    schema: COMMON_SCHEMAS.profile,
    initialData,
    onSubmit
  })
}

export function useBookingValidation(onSubmit?: (data: Record<string, any>) => void | Promise<void>) {
  return useFormValidation({
    schema: COMMON_SCHEMAS.booking,
    onSubmit
  })
}

export function useContactValidation(onSubmit?: (data: Record<string, any>) => void | Promise<void>) {
  return useFormValidation({
    schema: COMMON_SCHEMAS.contact,
    onSubmit
  })
}