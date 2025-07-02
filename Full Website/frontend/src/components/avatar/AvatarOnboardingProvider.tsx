'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAvatarOnboarding } from '@/hooks/useAvatarOnboarding'
import AvatarOnboardingModal from './AvatarOnboardingModal'

interface AvatarOnboardingContextType {
  shouldShowOnboarding: boolean
  openOnboarding: () => void
  closeOnboarding: () => void
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    role: string
    avatar?: string
    hasCompletedAvatarSetup?: boolean
  } | null
}

const AvatarOnboardingContext = createContext<AvatarOnboardingContextType | null>(null)

export function useAvatarOnboardingContext() {
  const context = useContext(AvatarOnboardingContext)
  if (!context) {
    throw new Error('useAvatarOnboardingContext must be used within AvatarOnboardingProvider')
  }
  return context
}

interface AvatarOnboardingProviderProps {
  children: ReactNode
}

export default function AvatarOnboardingProvider({ children }: AvatarOnboardingProviderProps) {
  const {
    shouldShowOnboarding,
    isOnboardingOpen,
    openOnboarding,
    closeOnboarding,
    completeOnboarding,
    user
  } = useAvatarOnboarding()

  const contextValue = {
    shouldShowOnboarding,
    openOnboarding,
    closeOnboarding,
    user
  }

  return (
    <AvatarOnboardingContext.Provider value={contextValue}>
      {children}
      
      {/* Avatar Onboarding Modal */}
      <AvatarOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={closeOnboarding}
        onComplete={completeOnboarding}
        userRole={user?.role}
        userName={user ? `${user.firstName} ${user.lastName}` : 'User'}
      />
    </AvatarOnboardingContext.Provider>
  )
}