'use client'

import React, { useEffect, useState } from 'react'
import { useAvatarOnboardingContext } from '@/components/avatar/AvatarOnboardingProvider'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardAvatarIntegrationProps {
  children: React.ReactNode
}

export function DashboardAvatarIntegration({ children }: DashboardAvatarIntegrationProps) {
  const { openOnboarding } = useAvatarOnboardingContext()
  const { user } = useAuth()
  const [hasCheckedAvatar, setHasCheckedAvatar] = useState(false)

  useEffect(() => {
    // Only check once when component mounts and user is available
    if (user && !hasCheckedAvatar) {
      setHasCheckedAvatar(true)
      
      // Check if user needs avatar setup
      const needsAvatar = !user.hasCompletedAvatarSetup || !user.avatar

      if (needsAvatar && !localStorage.getItem('avatar_onboarding_dismissed')) {
        // Small delay to let dashboard load first
        setTimeout(() => {
          openOnboarding()
        }, 2000)
      }
    }
  }, [user, hasCheckedAvatar, openOnboarding])

  return <>{children}</>
}

export default DashboardAvatarIntegration