'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Header from '../Header'
import Sidebar from '../Sidebar'
import ClientLayout from '../ClientLayout'
import { User } from '@/types'

interface StandardLayoutProps {
  children: React.ReactNode
  user?: User
  shouldShowHeader: boolean
  shouldShowSidebar: boolean
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function StandardLayout({ 
  children, 
  user, 
  shouldShowHeader, 
  shouldShowSidebar, 
  sidebarCollapsed, 
  onToggleSidebar 
}: StandardLayoutProps) {
  const pathname = usePathname()

  return (
    <ClientLayout>
      <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Header - Fixed at top, spanning full width */}
        {shouldShowHeader && (
          <div className="fixed top-0 left-0 right-0 z-50 h-[72px]" data-header>
            <Header 
              hasSidebar={shouldShowSidebar}
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

        <div className={`flex h-full ${shouldShowHeader ? 'pt-[72px]' : ''}`}>
          {/* Sidebar - Fixed on left, full height with independent scroll */}
          {shouldShowSidebar && (
            <div className={`${sidebarCollapsed ? 'w-16 md:w-20' : 'w-[280px] lg:w-[320px]'} h-full flex-shrink-0 overflow-y-auto overflow-x-hidden`} data-sidebar>
              <Sidebar
                user={user ? {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  role: user.role,
                  department: user.department,
                  avatar: user.avatar,
                  level: user.stats?.level || 1,
                  progress: user.progress || 0,
                  streak: user.streak || 0
                } : undefined}
                collapsed={sidebarCollapsed}
                onToggle={onToggleSidebar}
              />
            </div>
          )}

          {/* Main Content Area - Independent scroll */}
          <div className="flex-1 h-full overflow-y-auto overflow-x-hidden">
            <main className="min-h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="min-h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {shouldShowSidebar && !sidebarCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggleSidebar}
          />
        )}
      </div>
    </ClientLayout>
  )
}