'use client'

import { Zap, Calendar, Trophy, User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export type EventTabType = 'live' | 'upcoming' | 'past' | 'my'

interface EventTab {
  id: EventTabType
  label: string
  icon: React.ComponentType<{ className?: string }>
  count: number
  color: string
}

interface EventTabsProps {
  activeTab: EventTabType
  onTabChange: (tab: EventTabType) => void
  tabCounts?: {
    live: number
    upcoming: number
    past: number
    my: number
  }
}

export default function EventTabs({ 
  activeTab, 
  onTabChange, 
  tabCounts = {
    live: 0,
    upcoming: 0,
    past: 0,
    my: 0
  }
}: EventTabsProps) {
  const tabs: EventTab[] = [
    { id: 'live', label: 'Live Events', icon: Zap, count: tabCounts.live, color: 'red' },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: tabCounts.upcoming, color: 'blue' },
    { id: 'past', label: 'Past Events', icon: Trophy, count: tabCounts.past, color: 'yellow' },
    { id: 'my', label: 'My Events', icon: User, count: tabCounts.my, color: 'green' }
  ]

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 sm:gap-4 p-2">
        {tabs.map((tab, index) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
              className={`relative group flex-1 min-w-[140px] sm:min-w-[180px] px-6 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl shadow-red-500/30' 
                  : 'backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-200 border border-white/30 dark:border-slate-700/50 hover:border-white/50 dark:hover:border-slate-600/70 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Active tab background animation */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"
                  style={{ borderRadius: '1rem' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Animated background elements */}
              {!isActive && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20" />
                </div>
              )}
              
              <div className="relative z-10 flex items-center space-x-3">
                <motion.div 
                  animate={isActive ? {
                    scale: [1, 1.2, 1],
                    rotate: tab.id === 'live' ? [0, 360] : [0, 10, -10, 0]
                  } : {}}
                  transition={{ 
                    duration: tab.id === 'live' ? 2 : 1.5, 
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className={`p-2 rounded-xl ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </motion.div>
                
                <div className="flex-1 text-left">
                  <div className={`font-bold text-sm sm:text-base ${
                    isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'
                  }`}>
                    {tab.label}
                  </div>
                  
                  <motion.div 
                    animate={isActive && tab.id === 'live' ? {
                      boxShadow: [
                        '0 0 0 0 rgba(255, 255, 255, 0.4)',
                        '0 0 0 8px rgba(255, 255, 255, 0)',
                        '0 0 0 0 rgba(255, 255, 255, 0)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                      isActive 
                        ? 'bg-white/30 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {tab.count}
                    {tab.id === 'live' && isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="ml-1"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                {/* Special effects for active tab */}
                {isActive && (
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute top-2 right-2 text-white/50"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}