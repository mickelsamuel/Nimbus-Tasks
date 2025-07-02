'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export function useCurrentPage() {
  const pathname = usePathname()

  const currentPageKey = useMemo(() => {
    // Remove leading slash and get the first segment
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0] || 'dashboard'
    
    // Map pathname to page keys
    const pathMap: Record<string, string> = {
      'dashboard': 'dashboard',
      'modules': 'modules',
      'simulation': 'simulation',
      'career': 'career',
      'spaces': 'spaces',
      'friends-teams': 'friends-teams',
      'events': 'events',
      'university': 'university',
      'leaderboards': 'leaderboards',
      'timeline': 'timeline',
      'achievements': 'achievements',
      'profile': 'profile',
      'avatar': 'avatar',
      'shop': 'shop',
      'chat': 'chat',
      'admin': 'admin',
      'settings': 'settings',
      'help': 'help',
      'policy': 'policy',
      'login': 'login',
      'choose-mode': 'choose-mode',
      'manager': 'manager'
    }
    
    return pathMap[firstSegment] || 'dashboard'
  }, [pathname])

  // Also return the translation key for components that need it
  const translationKey = useMemo(() => {
    return `pages.${currentPageKey}`
  }, [currentPageKey])

  return {
    pathname,
    currentPageKey,
    translationKey
  }
}