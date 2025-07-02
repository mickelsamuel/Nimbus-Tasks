'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, Sparkles, TrendingUp } from 'lucide-react'
import UserAvatar from '@/components/ui/UserAvatar'

interface UserProfileSectionProps {
  user: {
    id: number
    firstName: string
    lastName: string
    role: string
    department: string
    avatar: string
    avatar2D?: string
    avatar3D?: string
    level: number
    progress: number
    streak: number
    hasCompletedAvatarSetup?: boolean
  }
  isCollapsed: boolean
  className?: string
}

export default function UserProfileSection({ 
  user, 
  isCollapsed, 
  className = '' 
}: UserProfileSectionProps) {
  
  return (
    <motion.div 
      className={`mb-4 ${isCollapsed ? 'px-1' : 'px-3'} ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Premium glassmorphism card matching dashboard style */}
      <div className={`
        relative rounded-lg overflow-hidden group
        ${isCollapsed ? 'p-2' : 'p-3'}
        bg-white/80 dark:bg-slate-800/80
        backdrop-blur-xl backdrop-saturate-150
        border border-white/20 dark:border-slate-700/30
        shadow-lg shadow-black/5 dark:shadow-black/20
        hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30
        transition-all duration-300
      `}>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Main profile info */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <UserAvatar
                user={{
                  avatar: user.avatar,
                  avatar2D: user.avatar2D,
                  avatar3D: user.avatar3D,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  role: user.role,
                  level: user.level,
                  isOnline: true,
                  hasCompletedAvatarSetup: user.hasCompletedAvatarSetup
                }}
                size={isCollapsed ? 'md' : 'lg'}
                showStatus={true}
                showLevel={!isCollapsed}
                useApiAvatar={true}
                className="cursor-pointer"
              />
            </motion.div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <motion.h3 
                  className="font-semibold text-gray-900 dark:text-white truncate text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {user.firstName} {user.lastName}
                </motion.h3>
                <motion.p 
                  className="text-xs text-gray-600 dark:text-gray-300 truncate"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {user.level > 0 ? `Level ${user.level} • ` : ''}{user.role}
                </motion.p>
              </div>
            )}
          </div>

          {/* Compact progress section */}
          {!isCollapsed && (
            <motion.div 
              className="mt-3 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Progress
                  </span>
                  <span className="text-primary-600 dark:text-primary-400">{user.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-200/60 dark:bg-gray-700/60 overflow-hidden backdrop-blur-sm">
                  <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${user.progress}%` }}
                    transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              {/* Compact stats row */}
              <div className="flex items-center justify-between">
                {/* Streak indicator */}
                <div className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Target className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                  <span>{user.streak}</span>
                </div>

                {/* Level badge */}
                {user.level > 0 && (
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">
                      Level {user.level}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </motion.div>
  )
}