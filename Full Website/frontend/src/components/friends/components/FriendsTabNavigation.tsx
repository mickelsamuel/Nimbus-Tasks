'use client'

import React from 'react'
import { 
  MessageCircle, 
  Network,
  Users,
  Search,
  UserPlus,
  BarChart3
} from 'lucide-react'
import { TabType } from '../types'

interface FriendsTabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  pendingRequestsCount: number
}

const tabs = [
  {
    id: 'overview' as TabType,
    label: 'Overview',
    icon: Users,
  },
  {
    id: 'find' as TabType,
    label: 'Discover',
    icon: Search,
  },
  {
    id: 'requests' as TabType,
    label: 'Invitations',
    icon: UserPlus,
    showBadge: true
  },
  {
    id: 'connections' as TabType,
    label: 'Connections',
    icon: Network,
  },
  {
    id: 'chat' as TabType,
    label: 'Messages',
    icon: MessageCircle,
  },
  {
    id: 'analytics' as TabType,
    label: 'Analytics',
    icon: BarChart3,
  }
]

export default function FriendsTabNavigation({ 
  activeTab, 
  onTabChange, 
  pendingRequestsCount 
}: FriendsTabNavigationProps) {
  return (
    <div className="mx-4 sm:mx-6 mt-6 mb-8">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            const showBadge = tab.showBadge && pendingRequestsCount > 0

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mb-2" />
                <span className="text-sm">{tab.label}</span>
                
                {showBadge && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}