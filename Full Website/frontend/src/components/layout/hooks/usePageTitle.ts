'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useCurrentPage } from './useCurrentPage'

export function usePageTitle() {
  const { t } = useTranslation()
  const { currentPageKey } = useCurrentPage()

  useEffect(() => {
    // Get the current page name
    const pageName = currentPageKey === 'dashboard' ? 'Dashboard' : 
                    currentPageKey === 'modules' ? 'Modules' :
                    currentPageKey === 'simulation' ? 'Simulation' :
                    currentPageKey === 'career' ? 'Career Map' :
                    currentPageKey === 'teams' ? 'Teams' :
                    currentPageKey === 'friends' ? 'Friends' :
                    currentPageKey === 'events' ? 'Events' :
                    currentPageKey === 'leaderboards' ? 'Leaderboards' :
                    currentPageKey === 'timeline' ? 'Timeline' :
                    currentPageKey === 'achievements' ? 'Achievements' :
                    currentPageKey === 'profile' ? 'Profile' :
                    currentPageKey === 'avatar' ? 'Avatar' :
                    currentPageKey === 'shop' ? 'Shop' :
                    currentPageKey === 'chat' ? 'Chat' :
                    currentPageKey === 'admin' ? 'Admin Panel' :
                    currentPageKey === 'settings' ? 'Settings' :
                    currentPageKey === 'manager' ? 'Manager Dashboard' :
                    currentPageKey === 'spaces' ? 'Virtual Spaces' :
                    currentPageKey === 'university' ? 'University' :
                    currentPageKey === 'help' ? 'Help & Support' :
                    currentPageKey === 'policy' ? 'Privacy Policy' :
                    currentPageKey === 'choose-mode' ? 'Choose Mode' :
                    'Dashboard'
    const appTitle = 'National Bank Training Platform'
    
    // Update the document title
    document.title = `${pageName} - ${appTitle}`
  }, [t, currentPageKey])

  return {
    getPageTitle: (pageKey?: string) => {
      const key = pageKey || currentPageKey
      const pageName = key === 'dashboard' ? 'Dashboard' : 
                      key === 'modules' ? 'Modules' :
                      key === 'simulation' ? 'Simulation' :
                      key === 'career' ? 'Career Map' :
                      key === 'teams' ? 'Teams' :
                      key === 'friends' ? 'Friends' :
                      key === 'events' ? 'Events' :
                      key === 'leaderboards' ? 'Leaderboards' :
                      key === 'timeline' ? 'Timeline' :
                      key === 'achievements' ? 'Achievements' :
                      key === 'profile' ? 'Profile' :
                      key === 'avatar' ? 'Avatar' :
                      key === 'shop' ? 'Shop' :
                      key === 'chat' ? 'Chat' :
                      key === 'admin' ? 'Admin Panel' :
                      key === 'settings' ? 'Settings' :
                      key === 'manager' ? 'Manager Dashboard' :
                      key === 'spaces' ? 'Virtual Spaces' :
                      key === 'university' ? 'University' :
                      key === 'help' ? 'Help & Support' :
                      key === 'policy' ? 'Privacy Policy' :
                      key === 'choose-mode' ? 'Choose Mode' :
                      'Dashboard'
      const appTitle = 'National Bank Training Platform'
      return `${pageName} - ${appTitle}`
    }
  }
}