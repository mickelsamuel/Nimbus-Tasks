'use client'

import React from 'react'
import { 
  BookOpen, User, Clock, CheckCircle2, Bookmark, 
  Compass, TrendingUp, Star, Sparkles, Calendar
} from 'lucide-react'

interface ModulesTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  stats: {
    assigned: number
    inProgress: number
    completed: number
    bookmarked: number
  }
}

export default function ModulesTabs({ activeTab, onTabChange, stats }: ModulesTabsProps) {

  const tabs = [
    {
      id: 'my-modules',
      label: 'My Modules',
      icon: User,
      color: 'blue',
      subTabs: [
        {
          id: 'assigned',
          label: 'Assigned',
          count: stats.assigned,
          icon: Calendar,
          color: 'blue'
        },
        {
          id: 'in-progress',
          label: 'In Progress',
          count: stats.inProgress,
          icon: Clock,
          color: 'orange'
        },
        {
          id: 'completed',
          label: 'Completed',
          count: stats.completed,
          icon: CheckCircle2,
          color: 'green'
        },
        {
          id: 'bookmarked',
          label: 'Bookmarked',
          count: stats.bookmarked,
          icon: Bookmark,
          color: 'yellow'
        }
      ]
    },
    {
      id: 'discover',
      label: 'Discover',
      icon: Compass,
      color: 'purple',
      subTabs: [
        {
          id: 'all-modules',
          label: 'All Modules',
          icon: BookOpen,
          color: 'gray'
        },
        {
          id: 'recommended',
          label: 'Recommended',
          icon: Sparkles,
          color: 'purple'
        },
        {
          id: 'trending',
          label: 'Trending',
          icon: TrendingUp,
          color: 'green'
        },
        {
          id: 'newest',
          label: 'Newest',
          icon: Star,
          color: 'blue'
        }
      ]
    }
  ]

  const getActiveMainTab = () => {
    for (const tab of tabs) {
      if (tab.subTabs?.some(subTab => subTab.id === activeTab)) {
        return tab.id
      }
      if (tab.id === activeTab) {
        return tab.id
      }
    }
    return tabs[0].id
  }

  const activeMainTab = getActiveMainTab()
  const currentMainTab = tabs.find(tab => tab.id === activeMainTab)

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: {
        bg: isActive ? 'bg-blue-500' : 'bg-blue-100 dark:bg-blue-900/30',
        text: isActive ? 'text-white' : 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-700',
        hover: 'hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      purple: {
        bg: isActive ? 'bg-purple-500' : 'bg-purple-100 dark:bg-purple-900/30',
        text: isActive ? 'text-white' : 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-700',
        hover: 'hover:bg-purple-200 dark:hover:bg-purple-800/50'
      },
      orange: {
        bg: isActive ? 'bg-orange-500' : 'bg-orange-100 dark:bg-orange-900/30',
        text: isActive ? 'text-white' : 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-700',
        hover: 'hover:bg-orange-200 dark:hover:bg-orange-800/50'
      },
      green: {
        bg: isActive ? 'bg-green-500' : 'bg-green-100 dark:bg-green-900/30',
        text: isActive ? 'text-white' : 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-700',
        hover: 'hover:bg-green-200 dark:hover:bg-green-800/50'
      },
      yellow: {
        bg: isActive ? 'bg-yellow-500' : 'bg-yellow-100 dark:bg-yellow-900/30',
        text: isActive ? 'text-white' : 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-700',
        hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-800/50'
      },
      gray: {
        bg: isActive ? 'bg-gray-500' : 'bg-gray-100 dark:bg-gray-900/30',
        text: isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-700',
        hover: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  return (
    <div className="space-y-6">
      {/* Main Tabs */}
      <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeMainTab
          const colors = getColorClasses(tab.color, isActive)
          const IconComponent = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.subTabs && tab.subTabs.length > 0) {
                  onTabChange(tab.subTabs[0].id)
                } else {
                  onTabChange(tab.id)
                }
              }}
              className={`group relative flex items-center gap-4 px-6 lg:px-8 py-4 rounded-2xl border-2 transition-all duration-500 transform hover:scale-110 whitespace-nowrap shadow-lg hover:shadow-2xl ${
                colors.bg
              } ${colors.text} ${colors.border} ${!isActive ? colors.hover : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background glow effect */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
              )}
              
              <div className="relative flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-transform duration-300 group-hover:rotate-12 ${
                  isActive ? 'bg-white/20' : 'bg-current/10'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">{tab.label}</div>
                  <div className={`text-sm opacity-70 ${
                    isActive ? 'text-white/80' : 'text-current'
                  }`}>
                    {tab.id === 'my-modules' ? 'Your personal modules' : 'Explore new content'}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Sub Tabs */}
      {currentMainTab?.subTabs && (
        <div className="dashboard-card rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/50 dark:to-purple-900/50 border-2 border-blue-200/50 dark:border-blue-800/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentMainTab.subTabs.map((subTab, index) => {
              const isActive = subTab.id === activeTab
              const colors = getColorClasses(subTab.color, isActive)
              const IconComponent = subTab.icon

              return (
                <button
                  key={subTab.id}
                  onClick={() => onTabChange(subTab.id)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-2xl ${
                    colors.bg
                  } ${colors.text} ${colors.border} ${!isActive ? colors.hover : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${colors.bg.includes('bg-') ? 'from-white/20 to-transparent' : 'from-current/10 to-transparent'} rounded-full blur-xl`} />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:rotate-12 ${
                        isActive ? 'bg-white/20' : 'bg-current/10'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {'count' in subTab && subTab.count !== undefined && (
                        <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${
                          isActive ? 'bg-white/20 text-white' : 'bg-current/10 text-current'
                        }`}>
                          {'count' in subTab ? subTab.count : ''}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg mb-2">{subTab.label}</div>
                      {'count' in subTab && subTab.count !== undefined && (
                        <div className={`text-sm ${
                          isActive ? 'text-white/80' : 'text-current/70'
                        }`}>
                          {'count' in subTab && subTab.count === 1 ? 'module' : 'modules'}
                        </div>
                      )}
                      {!('count' in subTab) && (
                        <div className={`text-sm ${
                          isActive ? 'text-white/80' : 'text-current/70'
                        }`}>
                          Explore content
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}