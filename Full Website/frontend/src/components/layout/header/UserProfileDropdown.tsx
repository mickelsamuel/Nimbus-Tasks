'use client'

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, ChevronDown, ToggleLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import UserAvatar from '@/components/ui/UserAvatar'

interface UserData {
  id: number
  firstName: string
  lastName: string
  role: string
  department: string
  avatar: string
  avatar2D?: string
  avatar3D?: string
  avatarPortrait?: string
  stats: {
    xp: number
    level: number
    coins: number
    tokens: number
  }
  hasCompletedAvatarSetup?: boolean
}

interface UserProfileDropdownProps {
  user: UserData
  isOpen: boolean
  shouldShowOnboarding: boolean
  onToggle: () => void
  onLogout: () => void
  onOpenAvatarOnboarding: () => void
  className?: string
}

export default function UserProfileDropdown({
  user,
  isOpen,
  shouldShowOnboarding,
  onToggle,
  onLogout,
  onOpenAvatarOnboarding,
  className = ''
}: UserProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
        onToggle()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle])

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg bg-white/80 dark:bg-gray-800/80 p-2 transition-all hover:bg-white/90 dark:hover:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-gray-200 dark:border-gray-600"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {/* Enhanced Avatar with online status */}
        <div className="relative">
          <UserAvatar
            user={{
              avatar: user.avatar,
              avatar2D: user.avatar2D,
              avatar3D: user.avatar3D,
              avatarPortrait: user.avatarPortrait,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              level: user.stats.level,
              isOnline: true,
              hasCompletedAvatarSetup: user.hasCompletedAvatarSetup
            }}
            size="sm"
            showStatus={true}
            showLevel={true}
            showSetupPrompt={true}
            useApiAvatar={true}
            preferPortrait={true}
            className="cursor-pointer"
          />
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.role} • Level {user.stats.level}
          </p>
        </div>

        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </motion.button>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-12 w-64 rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            role="menu"
            aria-label="User profile menu"
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                <UserAvatar
                  user={{
                    avatar: user.avatar,
                    avatar2D: user.avatar2D,
                    avatar3D: user.avatar3D,
                    avatarPortrait: user.avatarPortrait,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    level: user.stats.level,
                    isOnline: true,
                    hasCompletedAvatarSetup: user.hasCompletedAvatarSetup
                  }}
                  size="lg"
                  useApiAvatar={true}
                  className="dropdown-avatar"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.department}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <button 
                  onClick={() => {
                    onToggle()
                    router.push('/profile')
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  View Profile
                </button>
                <button 
                  onClick={() => {
                    onToggle()
                    onOpenAvatarOnboarding()
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  {shouldShowOnboarding ? 'Create Avatar' : 'Change Avatar'}
                </button>
                <button 
                  onClick={() => {
                    onToggle()
                    router.push('/settings')
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button 
                  onClick={() => {
                    onToggle()
                    router.push('/choose-mode')
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ToggleLeft className="h-4 w-4" />
                  Switch Mode
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-600" />
                <button 
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}