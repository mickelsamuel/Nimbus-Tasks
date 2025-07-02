'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  AuthPageLayout, 
  GamifiedLayout, 
  StandardLayout, 
  useLayoutLogic 
} from './protected'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const router = useRouter()
  
  // Adapt AuthContext User to layout User type
  const adaptedUser = user ? {
    ...user,
    level: user.stats?.level || 1,
    progress: user.progress || 0,
    streak: user.streak || 0,
    coins: user.stats?.coins,
    tokens: user.stats?.tokens,
    xp: user.stats?.totalXP,
    lastLogin: new Date(user.lastActive),
    isActive: true,
    stats: user.stats,
    selectedMode: user.selectedMode === null ? undefined : user.selectedMode
  } : undefined
  
  const {
    isAuthPage,
    isGamifiedMode,
    shouldShowHeader,
    shouldShowSidebar
  } = useLayoutLogic({ user: adaptedUser })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Skip loading screen - go directly to content or redirect

  // Don't render if not authenticated (prevents flash)
  if (!isAuthenticated) {
    return null
  }

  // If this is an auth page, render children directly without header/sidebar
  if (isAuthPage) {
    return <AuthPageLayout>{children}</AuthPageLayout>
  }

  // Gamified mode: Header only, no sidebar
  if (isGamifiedMode) {
    return (
      <GamifiedLayout 
        user={adaptedUser}
        shouldShowHeader={shouldShowHeader}
      >
        {children}
      </GamifiedLayout>
    )
  }

  // Standard mode: Header + Sidebar
  return (
    <StandardLayout
      user={adaptedUser}
      shouldShowHeader={shouldShowHeader}
      shouldShowSidebar={shouldShowSidebar}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
    >
      {children}
    </StandardLayout>
  )
}

// Higher-order component for pages that need protected layout
export function withProtectedLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ProtectedPage(props: P) {
    return (
      <ProtectedLayout>
        <WrappedComponent {...props} />
      </ProtectedLayout>
    )
  }
}