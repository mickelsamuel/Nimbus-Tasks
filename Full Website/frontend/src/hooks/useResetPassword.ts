import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FormState {
  password: string
  confirmPassword: string
  isSubmitting: boolean
  isSuccess: boolean
  error: string
  showPassword: boolean
  showConfirmPassword: boolean
}

interface UseResetPasswordReturn {
  formState: FormState
  token: string | null
  isTokenValid: boolean | null
  handleInputChange: (field: keyof FormState, value: string | boolean) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  getPasswordStrength: () => 'weak' | 'medium' | 'strong'
  redirectToLogin: () => void
}

export const useResetPassword = (): UseResetPasswordReturn => {
  const [formState, setFormState] = useState<FormState>({
    password: '',
    confirmPassword: '',
    isSubmitting: false,
    isSuccess: false,
    error: '',
    showPassword: false,
    showConfirmPassword: false
  })
  const [token, setToken] = useState<string | null>(null)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const resetToken = searchParams.get('token')
    if (resetToken) {
      setToken(resetToken)
      validateToken(resetToken)
    } else {
      setIsTokenValid(false)
    }
  }, [searchParams])

  const validateToken = async (resetToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/validate-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: resetToken })
      })

      if (response.ok) {
        setIsTokenValid(true)
      } else {
        setIsTokenValid(false)
      }
    } catch (error) {
      console.error('Token validation error:', error)
      setIsTokenValid(false)
    }
  }

  const handleInputChange = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      error: field === 'password' || field === 'confirmPassword' ? '' : prev.error
    }))
  }

  const getPasswordStrength = (): 'weak' | 'medium' | 'strong' => {
    const { password } = formState
    if (password.length < 6) return 'weak'
    if (password.length < 8) return 'medium'
    
    // Check for at least 2 of these: lowercase, uppercase, number, special char
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[@$!%*?&]/.test(password)
    const criteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length
    
    if (password.length >= 12 && criteriaCount >= 3) return 'strong'
    if (password.length >= 8 && criteriaCount >= 2) return 'strong'
    return 'medium'
  }

  const validateForm = (): string | null => {
    if (!token) return 'Invalid reset token'
    if (formState.password !== formState.confirmPassword) return 'Passwords do not match'
    if (formState.password.length < 8) return 'Password must be at least 8 characters long'
    
    // Check for at least 2 criteria instead of all 4
    const hasLower = /[a-z]/.test(formState.password)
    const hasUpper = /[A-Z]/.test(formState.password)
    const hasNumber = /\d/.test(formState.password)
    const hasSpecial = /[@$!%*?&]/.test(formState.password)
    const criteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length
    
    if (criteriaCount < 2) {
      return 'Password must contain at least 2 of the following: lowercase letter, uppercase letter, number, or special character'
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setFormState(prev => ({ ...prev, error: validationError }))
      return
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, error: '' }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password: formState.password 
        })
      })

      const data = await response.json()

      if (response.ok) {
        setFormState(prev => ({ 
          ...prev, 
          isSubmitting: false, 
          isSuccess: true
        }))
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setFormState(prev => ({ 
          ...prev, 
          isSubmitting: false, 
          error: data.message || 'Failed to reset password. Please try again.' 
        }))
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: 'Network error. Please check your connection and try again.' 
      }))
    }
  }

  const redirectToLogin = () => {
    router.push('/login')
  }

  return {
    formState,
    token,
    isTokenValid,
    handleInputChange,
    handleSubmit,
    getPasswordStrength,
    redirectToLogin
  }
}