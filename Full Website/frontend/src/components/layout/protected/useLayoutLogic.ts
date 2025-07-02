'use client'

import { usePathname } from 'next/navigation'
import { User } from '@/types'

interface UseLayoutLogicProps {
  user?: User | null
}

export function useLayoutLogic({ user }: UseLayoutLogicProps) {
  const pathname = usePathname()

  // Determine if this is an auth-related page that shouldn't have header/sidebar
  const isAuthPage = ['/login', '/policy', '/choose-mode', '/forgot-password', '/reset-password'].includes(pathname)
  
  // Determine layout based on user's selected mode
  const isGamifiedMode = user?.selectedMode === 'gamified'
  const isStandardMode = user?.selectedMode === 'standard'
  
  // Header visibility logic:
  // - ALWAYS visible in gamified mode (unless auth page)
  // - ALWAYS visible in standard mode (unless auth page)
  // - Default to showing header if no mode selected (fallback to standard)
  const shouldShowHeader = !isAuthPage && (isGamifiedMode || isStandardMode || !user?.selectedMode)
  
  // Sidebar visibility logic:
  // - NEVER visible in gamified mode
  // - ALWAYS visible in standard mode (unless auth page)
  // - Default to showing sidebar if no mode selected (fallback to standard)
  const shouldShowSidebar = !isAuthPage && !isGamifiedMode && (isStandardMode || !user?.selectedMode)

  return {
    isAuthPage,
    isGamifiedMode,
    isStandardMode,
    shouldShowHeader,
    shouldShowSidebar
  }
}