'use client'

import { useState, useEffect } from 'react'

interface FormState {
  email: string
  isSubmitting: boolean
  isSuccess: boolean
  error: string
  step: 'email' | 'success'
  resendCountdown: number
}

export function useForgotPassword() {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    isSubmitting: false,
    isSuccess: false,
    error: '',
    step: 'email',
    resendCountdown: 0
  })

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (formState.resendCountdown > 0) {
      interval = setInterval(() => {
        setFormState(prev => ({ 
          ...prev, 
          resendCountdown: prev.resendCountdown - 1 
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [formState.resendCountdown])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.email) return

    setFormState(prev => ({ ...prev, isSubmitting: true, error: '' }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formState.email })
      })

      const data = await response.json()

      if (response.ok) {
        setFormState(prev => ({ 
          ...prev, 
          isSubmitting: false, 
          isSuccess: true, 
          step: 'success',
          resendCountdown: 45
        }))
      } else {
        setFormState(prev => ({ 
          ...prev, 
          isSubmitting: false, 
          error: data.message || 'Unable to process your request. Please try again.' 
        }))
      }
    } catch (error) {
      console.error('Password reset error:', error)
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: 'Network error. Please check your connection and try again.' 
      }))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ 
      ...prev, 
      email: e.target.value, 
      error: '' 
    }))
  }

  const handleResend = () => {
    if (formState.resendCountdown === 0) {
      setFormState(prev => ({ ...prev, resendCountdown: 45 }))
    }
  }

  return {
    formState,
    handleEmailSubmit,
    handleEmailChange,
    handleResend
  }
}