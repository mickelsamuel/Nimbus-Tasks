'use client'

import React, { Suspense } from 'react'
import { useResetPassword } from '@/hooks/useResetPassword'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { 
  LoadingState, 
  InvalidTokenState, 
  SuccessState,
  BackToLoginButton 
} from '@/components/auth/ResetPasswordStates'
import { ResetPasswordLayout } from '@/components/auth/ResetPasswordLayout'

function ResetPasswordContent() {
  const {
    formState,
    isTokenValid,
    handleInputChange,
    handleSubmit,
    getPasswordStrength,
    redirectToLogin
  } = useResetPassword()

  // Loading state - checking token validity
  if (isTokenValid === null) {
    return <LoadingState />
  }

  // Invalid token state
  if (isTokenValid === false) {
    return (
      <InvalidTokenState 
        onRequestNewLink={() => redirectToLogin()} 
      />
    )
  }

  // Success state - password reset completed
  if (formState.isSuccess) {
    return <SuccessState />
  }

  // Main form state
  return (
    <ResetPasswordLayout>
      <ResetPasswordForm
        formState={formState}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        passwordStrength={getPasswordStrength()}
      />
      
      <BackToLoginButton 
        onClick={redirectToLogin}
      />
    </ResetPasswordLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordContent />
    </Suspense>
  )
}