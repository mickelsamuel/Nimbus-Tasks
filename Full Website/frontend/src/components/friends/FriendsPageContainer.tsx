'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import FriendsHeader from './components/FriendsHeader'
import FriendsTabNavigation from './components/FriendsTabNavigation'
import ColleagueDirectory from './tabs/ColleagueDirectory'
import BusinessNetwork from './tabs/BusinessNetwork'
import ConnectionRequests from './tabs/ConnectionRequests'
import ProfessionalConnections from './tabs/ProfessionalConnections'
import WorkCommunication from './tabs/WorkCommunication'
import NetworkingInsights from './tabs/NetworkingInsights'
import FriendsPageStyles from './theme/FriendsPageStyles'
import { TabType, FriendsData } from './types'
import { useFriends } from '@/hooks/useFriends'
import { AlertTriangle, RefreshCw } from 'lucide-react'

// Mock data only used as fallback when API fails
const mockColleagueData: FriendsData = {
  stats: {
    totalConnections: 0,
    newRequests: 0,
    onlineFriends: 0,
    mutualConnections: 0,
    weeklyGrowth: 0
  },
  connections: [],
  pendingRequests: [],
  suggestedConnections: [],
  recentActivity: []
}

export default function FriendsPageContainer() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Use real API data
  const { data: apiData, loading: isLoading, error, refetch } = useFriends()
  
  // Transform API data to match component interface
  const colleagueData = apiData ? {
    stats: {
      totalConnections: apiData.colleagues.filter(c => c.isConnected).length,
      newRequests: apiData.connectionRequests.length,
      onlineFriends: apiData.colleagues.filter(c => c.isConnected && c.status === 'online').length,
      mutualConnections: apiData.colleagues.reduce((sum, c) => sum + (c.projectsInCommon || 0), 0),
      weeklyGrowth: apiData.analytics.connectionGrowth
    },
    connections: apiData.colleagues.filter(c => c.isConnected).map(colleague => ({
      id: colleague.id,
      firstName: colleague.firstName,
      lastName: colleague.lastName,
      role: colleague.role,
      department: colleague.department,
      avatar: colleague.avatar || '/avatars/default.jpg',
      status: colleague.status,
      lastActive: colleague.lastActive,
      mutualFriends: colleague.projectsInCommon,
      skills: colleague.skills,
      isOnline: colleague.status === 'online',
      connectionDate: colleague.joinedAt,
      messageCount: 0,
      collaborationScore: colleague.connectionStrength
    })),
    pendingRequests: apiData.connectionRequests.map(request => ({
      id: request.id,
      from: {
        id: request.from.id,
        firstName: request.from.firstName,
        lastName: request.from.lastName,
        role: request.from.role,
        department: request.from.department,
        avatar: request.from.avatar || '/avatars/default.jpg',
        status: request.from.status,
        lastActive: request.from.lastActive,
        mutualFriends: request.from.projectsInCommon,
        skills: request.from.skills,
        isOnline: request.from.status === 'online',
        connectionDate: '',
        messageCount: 0,
        collaborationScore: 0
      },
      message: request.message,
      timestamp: request.timestamp,
      mutualConnections: request.from.projectsInCommon
    })),
    suggestedConnections: apiData.recommendedConnections.map(colleague => ({
      id: colleague.id,
      firstName: colleague.firstName,
      lastName: colleague.lastName,
      role: colleague.role,
      department: colleague.department,
      avatar: colleague.avatar || '/avatars/default.jpg',
      status: colleague.status,
      lastActive: colleague.lastActive,
      mutualFriends: colleague.projectsInCommon,
      skills: colleague.skills,
      isOnline: colleague.status === 'online',
      connectionDate: '',
      messageCount: 0,
      collaborationScore: 0
    })),
    recentActivity: apiData.recentActivity.map(activity => ({
      id: activity.id,
      type: activity.type,
      user: activity.user || null,
      action: activity.action,
      timestamp: new Date(activity.timestamp).toLocaleString(),
      avatar: (() => {
        if (!activity.user || typeof activity.user !== 'object') return '/avatars/default.jpg'
        const user = activity.user as Record<string, unknown>
        return 'avatar' in user ? (user.avatar as string) || '/avatars/default.jpg' : '/avatars/default.jpg'
      })()
    }))
  } : mockColleagueData

  // Show error state if API fails
  if (error && !apiData) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
          <div className="container mx-auto px-4 lg:px-6 py-12">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-xl">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Unable to Load Network Data
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error} - Using offline content below.
                </p>
                <button 
                  onClick={refetch} 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  const renderActiveTab = () => {
    const tabProps = { data: colleagueData, isLoading }

    switch(activeTab) {
      case 'overview':
        return <ColleagueDirectory {...tabProps} />
      case 'find':
        return <BusinessNetwork {...tabProps} />
      case 'requests':
        return <ConnectionRequests {...tabProps} />
      case 'connections':
        return <ProfessionalConnections {...tabProps} />
      case 'chat':
        return <WorkCommunication {...tabProps} />
      case 'analytics':
        return <NetworkingInsights {...tabProps} />
      default:
        return <ColleagueDirectory {...tabProps} />
    }
  }

  return (
    <ProtectedLayout>
      <FriendsPageStyles />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 relative overflow-hidden">

        {/* Simplified Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-emerald-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-emerald-900/20" />

        {/* Header */}
        <div>
          <FriendsHeader stats={colleagueData.stats} />
        </div>
        
        {/* Tab Navigation */}
        <div>
          <FriendsTabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            pendingRequestsCount={colleagueData.pendingRequests.length}
          />
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ProtectedLayout>
  )
}