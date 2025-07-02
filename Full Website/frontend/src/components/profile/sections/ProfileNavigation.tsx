'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Bell, 
  Activity, 
  Accessibility,
  Sparkles
} from 'lucide-react'
import { ProfilePanel } from '../types'

interface ProfileNavigationProps {
  activePanel: ProfilePanel
  onPanelChange: (panel: ProfilePanel) => void
}

const navigationItems = [
  {
    id: 'personal' as ProfilePanel,
    label: 'Personal Info',
    icon: User,
    description: 'Basic information and contact details',
    gradient: 'from-blue-500 to-purple-600',
    bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
  },
  {
    id: 'security' as ProfilePanel,
    label: 'Security',
    icon: Shield,
    description: 'Password and account security',
    gradient: 'from-red-500 to-pink-600',
    bgGradient: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
  },
  {
    id: 'notifications' as ProfilePanel,
    label: 'Notifications',
    icon: Bell,
    description: 'Email and push notification preferences',
    gradient: 'from-yellow-500 to-orange-600',
    bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
  },
  {
    id: 'accessibility' as ProfilePanel,
    label: 'Accessibility',
    icon: Accessibility,
    description: 'Display and accessibility options',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
  },
  {
    id: 'activity' as ProfilePanel,
    label: 'Activity',
    icon: Activity,
    description: 'Account activity and sessions',
    gradient: 'from-indigo-500 to-cyan-600',
    bgGradient: 'from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20'
  }
]

export default function ProfileNavigation({ 
  activePanel, 
  onPanelChange 
}: ProfileNavigationProps) {
  return (
    <motion.div 
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/30"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
          Profile Settings
        </h3>
      </div>
      
      <nav className="space-y-3">
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activePanel === item.id
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onPanelChange(item.id)}
              className="w-full text-left group relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            >
              {/* Background */}
              <div className={`
                absolute inset-0 rounded-2xl transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-r ${item.bgGradient} border-2 border-white/30` 
                  : 'bg-gray-50/50 dark:bg-gray-700/20 border-2 border-transparent group-hover:bg-gray-100/70 dark:group-hover:bg-gray-600/30'
                }
              `} />

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${item.gradient} rounded-r-full`}
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Content */}
              <div className="relative p-4 flex items-start gap-4">
                <div className={`
                  p-3 rounded-xl transition-all duration-300 relative
                  ${isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                    : 'bg-gray-100/70 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200/70 dark:group-hover:bg-gray-500/50'
                  }
                `}>
                  <Icon className="w-6 h-6" />
                  
                  {/* Sparkle effect for active item */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`
                    font-semibold text-base mb-1 transition-colors
                    ${isActive 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                  `}>
                    {item.label}
                  </div>
                  <div className={`
                    text-sm leading-relaxed transition-colors
                    ${isActive 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }
                  `}>
                    {item.description}
                  </div>
                </div>

                {/* Arrow indicator */}
                <motion.div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                    ${isActive 
                      ? 'bg-white/20 text-gray-700 dark:text-gray-300' 
                      : 'bg-transparent text-gray-400 dark:text-gray-500 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-600/50'
                    }
                  `}
                  animate={{ 
                    x: isActive ? 3 : 0,
                    opacity: isActive ? 1 : 0.6
                  }}
                >
                  <div className="w-1.5 h-1.5 bg-current rounded-full" />
                </motion.div>
              </div>
            </motion.button>
          )
        })}
      </nav>
    </motion.div>
  )
}