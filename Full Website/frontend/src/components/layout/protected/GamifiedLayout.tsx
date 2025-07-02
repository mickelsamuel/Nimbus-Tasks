'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Header from '../Header'
import ClientLayout from '../ClientLayout'
import { User } from '@/types'

interface GamifiedLayoutProps {
  children: React.ReactNode
  user?: User
  shouldShowHeader: boolean
}

export default function GamifiedLayout({ children, user, shouldShowHeader }: GamifiedLayoutProps) {
  const pathname = usePathname()

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Header - Always visible and fixed in gamified mode */}
      {shouldShowHeader && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header 
            hasSidebar={false}
            user={user ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              department: user.department,
              avatar: user.avatar,
              stats: user.stats || {
                totalXP: 0,
                level: 1,
                coins: 0,
                tokens: 0
              }
            } : undefined} 
          />
        </div>
      )}

      {/* Page Content - Full width for gamified mode with proper top padding */}
      <main className={`${shouldShowHeader ? 'pt-[72px]' : ''} min-h-screen w-full`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      </div>
    </ClientLayout>
  )
}