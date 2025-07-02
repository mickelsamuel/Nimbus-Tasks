'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface UseAvatarOnboardingReturn {
  shouldShowOnboarding: boolean
  isOnboardingOpen: boolean
  openOnboarding: () => void
  closeOnboarding: () => void
  completeOnboarding: (avatarUrl: string) => Promise<void>
  user: ReturnType<typeof useAuth>['user']
}

export function useAvatarOnboarding(): UseAvatarOnboardingReturn {
  const { user, completeAvatarSetup } = useAuth()
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)

  // Check if user needs avatar onboarding
  useEffect(() => {
    const checkAvatarStatus = () => {
      if (!user) return

      // Check if user needs avatar onboarding
      const needsOnboarding = !user.avatar || 
                             user.avatar === 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb' ||
                             user.avatar === '' ||
                             !user.hasCompletedAvatarSetup

      setShouldShowOnboarding(needsOnboarding)

      // Auto-open onboarding for new users
      if (needsOnboarding && !localStorage.getItem('avatar_onboarding_dismissed')) {
        setTimeout(() => {
          setIsOnboardingOpen(true)
        }, 1500) // Delay to allow page to load
      }
    }

    if (user) {
      checkAvatarStatus()
    }
  }, [user])


  const openOnboarding = () => {
    setIsOnboardingOpen(true)
  }

  const closeOnboarding = () => {
    setIsOnboardingOpen(false)
    // Mark as dismissed so it doesn't auto-open again
    localStorage.setItem('avatar_onboarding_dismissed', 'true')
  }

  const completeOnboarding = async (avatarUrl: string) => {
    try {
      // Use the auth context function to complete avatar setup
      const result = await completeAvatarSetup(avatarUrl)

      if (result.success) {
        // Hide onboarding
        setShouldShowOnboarding(false)
        setIsOnboardingOpen(false)
        
        // Mark as completed
        localStorage.setItem('avatar_onboarding_dismissed', 'true')
        localStorage.setItem('avatar_onboarding_completed', 'true')

        // Trigger page refresh or update other components
        window.dispatchEvent(new CustomEvent('avatarUpdated', { 
          detail: { avatarUrl } 
        }))
      } else {
        console.error('Avatar setup failed:', result.error)
        // Still complete locally for demo
        setShouldShowOnboarding(false)
        setIsOnboardingOpen(false)
        localStorage.setItem('avatar_onboarding_dismissed', 'true')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      
      // Complete locally even if API fails
      setShouldShowOnboarding(false)
      setIsOnboardingOpen(false)
      localStorage.setItem('avatar_onboarding_dismissed', 'true')
      
      window.dispatchEvent(new CustomEvent('avatarUpdated', { 
        detail: { avatarUrl } 
      }))
    }
  }

  return {
    shouldShowOnboarding,
    isOnboardingOpen,
    openOnboarding,
    closeOnboarding,
    completeOnboarding,
    user
  }
}