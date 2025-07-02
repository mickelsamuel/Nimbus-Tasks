'use client'

import React, { useState, useMemo, memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { useScrollPerformance, useInViewport, useDebounce } from '@/hooks/usePerformance'
import {
  Users,
  Plus,
  Search,
  Grid3X3,
  List,
  Activity,
  Building2,
  Trophy,
  MessageSquare,
  Globe
} from 'lucide-react'

// Lazy load heavy components
const TeamCard = dynamic(() => import('./cards/TeamCard'), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
})

const CreateTeamModal = dynamic(() => import('./CreateTeamModal'), {
  loading: () => null
})

const TeamDiscovery = dynamic(() => import('./TeamDiscovery'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
})

const TeamCollaboration = dynamic(() => import('./TeamCollaboration').then(mod => ({ default: mod.TeamCollaboration })), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
})

const TeamPerformance = dynamic(() => import('./TeamPerformance').then(mod => ({ default: mod.TeamPerformance })), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
})

const TeamCommunication = dynamic(() => import('./TeamCommunication').then(mod => ({ default: mod.TeamCommunication })), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
})

import { useTeams } from '../../hooks/useTeams'
import { useAuth } from '../../contexts/AuthContext'
import { Team as TeamType } from '../../types/team'

interface TeamUIData {
  id: string
  name: string
  description: string
  memberCount: number
  maxMembers: number
  category: string
  status: 'active' | 'recruiting' | 'inactive'
  performance: number
  achievements: number
  avatar: string
  members: Array<{
    id: string
    name: string
    avatar: string
    role: string
    isOnline: boolean
  }>
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
  tags: string[]
  isJoined: boolean
  isOwner: boolean
}

import { transformTeamData } from '@/utils/iconMapping'

// Simplified team transformation using utility
const transformApiTeams = (apiTeams: TeamType[], currentUser: { id?: string | number } | null): TeamUIData[] => {
  return apiTeams.map(team => {
    const baseTransform = transformTeamData(team)
    
    return {
      ...baseTransform,
      id: team._id || team.id || '',
      maxMembers: team.settings?.maxMembers || 50,
      performance: Math.round((team.stats?.totalXP || 0) / 100) || 75,
      achievements: team.achievements?.length || 0,
      members: (team.members || []).map((member: Record<string, unknown>, index: number) => {
        const memberData = member.userId || member
        const userData = typeof memberData === 'object' ? memberData : {}
        return {
          id: (userData as any)._id || (userData as any).id || `member-${index}`,
          name: (userData as any).firstName && (userData as any).lastName 
            ? `${(userData as any).firstName} ${(userData as any).lastName}` 
            : (userData as any).name || `Team Member ${index + 1}`,
          avatar: (userData as any).avatar || '/avatars/default.jpg',
          role: (member as any).role || 'member',
          isOnline: (userData as any).isOnline || false
        }
      }),
      recentActivity: team.recentActivity || [],
      tags: team.focusAreas || ['Collaboration'],
      isJoined: team.members?.some((m: Record<string, unknown>) => {
        const memberData = m.userId || m
        const userId = (memberData as any)._id || (memberData as any).id || memberData
        return userId?.toString() === currentUser?.id?.toString()
      }) || false,
      isOwner: (() => {
        const leader = typeof team.leader === 'object' ? team.leader : {}
        const leaderId = leader._id || leader.id || team.leader
        return leaderId?.toString() === currentUser?.id?.toString()
      })() || false
    }
  })
}

interface Tab {
  id: string
  title: string
  icon: React.ReactNode
  badge?: number | string
  badgeType?: 'info' | 'success' | 'warning' | 'danger'
  description?: string
}

// Memoized team card component
const MemoizedTeamCard = memo(TeamCard)

// Memoized teams filters
const useTeamFilters = (teams: TeamUIData[], searchQuery: string) => {
  return useMemo(() => {
    const debouncedQuery = searchQuery.toLowerCase().trim()
    
    if (!debouncedQuery) return { myTeams: teams.filter(team => team.isJoined), availableTeams: teams.filter(team => !team.isJoined) }
    
    const filtered = teams.filter(team => 
      team.name.toLowerCase().includes(debouncedQuery) ||
      team.description.toLowerCase().includes(debouncedQuery) ||
      team.category.toLowerCase().includes(debouncedQuery) ||
      team.tags.some(tag => tag.toLowerCase().includes(debouncedQuery))
    )
    
    return {
      myTeams: filtered.filter(team => team.isJoined),
      availableTeams: filtered.filter(team => !team.isJoined)
    }
  }, [teams, searchQuery])
}

const TeamsPageContainer: React.FC = () => {
  const _router = useRouter()
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('my-teams')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Performance hooks
  const { isScrolling } = useScrollPerformance()
  const shouldReduceMotion = useReducedMotion()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  
  // Use real teams hook
  const { teams: apiTeams, loading, error, createTeam: createTeamAPI, joinTeam, leaveTeam } = useTeams()
  const { user, isAuthenticated } = useAuth()
  
  // Transform API teams to match our interface - memoize for performance
  const teams = useMemo(() => {
    return isAuthenticated && !loading && apiTeams.length > 0 ? transformApiTeams(apiTeams, user) : []
  }, [isAuthenticated, loading, apiTeams, user])

  // Use memoized filters
  const { myTeams, availableTeams } = useTeamFilters(teams, debouncedSearchQuery)
  
  // Memoized handlers
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    setSearchQuery('') // Clear search when switching tabs
  }, [])
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])
  
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
  }, [])

  const tabs: Tab[] = [
    { 
      id: 'my-teams', 
      title: 'My Teams', 
      icon: <Building2 className="h-4 w-4" />, 
      badge: myTeams.length, 
      badgeType: 'success',
      description: 'Teams you\'re part of'
    },
    { 
      id: 'discover', 
      title: 'Explore Teams', 
      icon: <Search className="h-4 w-4" />,
      badge: availableTeams.length,
      badgeType: 'info',
      description: 'Find teams to join'
    },
    { 
      id: 'collaboration', 
      title: 'Collaboration', 
      icon: <Globe className="h-4 w-4" />,
      description: 'Team collaboration tools'
    },
    { 
      id: 'performance', 
      title: 'Performance', 
      icon: <Trophy className="h-4 w-4" />,
      description: 'Team metrics and achievements'
    },
    { 
      id: 'communication', 
      title: 'Communication', 
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Team communication hub'
    }
  ]

  const filteredTabs = tabs.filter(tab => {
    const matchesSearch = tab.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const renderTabContent = () => {
    switch (activeTab) {
      case 'my-teams':
        return (
          <div className="space-y-6">
            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search your teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isAuthenticated && loading && (
              <div className="flex items-center justify-center py-20">
                <motion.div 
                  className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}

            {/* Error State */}
            {isAuthenticated && error && (
              <div className="text-center py-10 dashboard-card rounded-2xl border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/30">
                <p className="text-red-600 dark:text-red-400">Error loading teams: {error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Teams Display */}
            <div className={`transition-all duration-500 ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
            }`}>
              {myTeams.length > 0 ? (
                myTeams
                  .filter(team => 
                    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: "tween" }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group"
                    >
                      <TeamCard 
                        team={team}
                        isDark={isDark}
                        onJoin={async (teamId) => {
                          try {
                            await joinTeam(teamId)
                          } catch (error) {
                            console.error('Failed to join team:', error)
                          }
                        }}
                        onLeave={async (teamId) => {
                          try {
                            await leaveTeam(teamId)
                          } catch (error) {
                            console.error('Failed to leave team:', error)
                          }
                        }}
                        onView={(teamId) => {
                          _router.push(`/teams/${teamId}`)
                        }}
                      />
                    </motion.div>
                  ))
              ) : (
                <motion.div 
                  className="col-span-full text-center py-20 dashboard-card rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-flex p-6 rounded-full mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                  >
                    <Users className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-700 dark:text-gray-300">
                    Ready to Build Something Amazing?
                  </h3>
                  <p className="text-lg mb-8 max-w-md mx-auto text-gray-600 dark:text-gray-400">
                    Create your first team or discover existing ones to start collaborating with brilliant minds
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={24} />
                      Create Your First Team
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setActiveTab('discover')}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Search size={20} />
                      Explore Teams
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )
      case 'discover':
        return (
          <TeamDiscovery 
            teams={availableTeams}
            isDark={isDark}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )
      case 'collaboration':
        // Use the first team that the user is a member of
        const firstTeamId = myTeams.length > 0 ? myTeams[0].id : undefined
        return <TeamCollaboration teamId={firstTeamId} />
      case 'performance':
        return <TeamPerformance />
      case 'communication':
        return <TeamCommunication />
      default:
        return (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">Select a tab to view content</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Simple Background Elements */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tr from-purple-500/5 to-pink-500/5 rounded-full" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Team Collaboration Hub
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover, join, and collaborate with high-performing teams. Build something amazing together.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Building2,
              label: 'My Teams',
              value: myTeams.length,
              change: 'Active',
              color: 'purple',
              bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30'
            },
            {
              icon: Users,
              label: 'Total Members',
              value: myTeams.reduce((acc, team) => acc + team.memberCount, 0),
              change: 'Collaborating',
              color: 'blue',
              bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30'
            },
            {
              icon: Trophy,
              label: 'Achievements',
              value: myTeams.reduce((acc, team) => acc + team.achievements, 0),
              change: 'Earned',
              color: 'yellow',
              bgColor: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30'
            },
            {
              icon: Activity,
              label: 'Performance',
              value: Math.round(myTeams.reduce((acc, team) => acc + team.performance, 0) / (myTeams.length || 1)),
              change: 'Average',
              color: 'green',
              bgColor: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.label}
                className={`dashboard-card rounded-3xl p-6 bg-gradient-to-br ${stat.bgColor} border-2 ${
                  stat.color === 'purple' ? 'border-purple-200 dark:border-purple-800/50' :
                  stat.color === 'blue' ? 'border-blue-200 dark:border-blue-800/50' :
                  stat.color === 'yellow' ? 'border-yellow-200 dark:border-yellow-800/50' :
                  'border-green-200 dark:border-green-800/50'
                } hover:shadow-lg transition-colors duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'purple' ? 'bg-purple-500/20' :
                    stat.color === 'blue' ? 'bg-blue-500/20' :
                    stat.color === 'yellow' ? 'bg-yellow-500/20' :
                    'bg-green-500/20'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      stat.color === 'purple' ? 'text-purple-900 dark:text-purple-100' :
                      stat.color === 'blue' ? 'text-blue-900 dark:text-blue-100' :
                      stat.color === 'yellow' ? 'text-yellow-900 dark:text-yellow-100' :
                      'text-green-900 dark:text-green-100'
                    }`}>
                      {stat.value}{stat.label === 'Performance' ? '%' : ''}
                    </div>
                    <div className={`text-sm ${
                      stat.color === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                      stat.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                      stat.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                      'text-green-700 dark:text-green-300'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  stat.color === 'purple' ? 'text-purple-800 dark:text-purple-200' :
                  stat.color === 'blue' ? 'text-blue-800 dark:text-blue-200' :
                  stat.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' :
                  'text-green-800 dark:text-green-200'
                }`}>
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation & Controls */}
        <div className="dashboard-card rounded-3xl p-6 mb-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search teams, features, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Team</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative group flex flex-col items-center gap-3 p-4 rounded-xl font-medium text-sm transition-all duration-300 min-h-[100px] ${
                    isActive 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-xl' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {/* Icon Container */}
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white group-hover:shadow-lg'
                    }`}
                  >
                    {tab.icon}
                  </motion.div>
                  
                  {/* Title */}
                  <span className="text-center leading-tight">{tab.title}</span>
                  
                  {/* Badge */}
                  {tab.badge !== undefined && Number(tab.badge) > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-bold rounded-full shadow-lg ${
                        isActive 
                          ? 'bg-white text-gray-900' 
                          : tab.badgeType === 'info' ? 'bg-blue-500 text-white'
                          : tab.badgeType === 'success' ? 'bg-green-500 text-white'
                          : tab.badgeType === 'warning' ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {tab.badge}
                    </motion.span>
                  )}
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTeamTab"
                      className="absolute inset-0 rounded-xl border-2 border-white/50 pointer-events-none"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "tween" }}
          className="dashboard-card rounded-3xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[600px] p-6"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateTeamModal 
            isDark={false}
            onClose={() => setShowCreateModal(false)}
            onCreateTeam={async (teamData) => {
              try {
                // Transform modal data to API format
                const apiTeamData = {
                  name: teamData.name,
                  description: teamData.description,
                  department: teamData.category, // Use category as department
                  category: teamData.category,
                  isPublic: teamData.privacy === 'public',
                  maxMembers: teamData.maxMembers
                }
                await createTeamAPI(apiTeamData)
                setShowCreateModal(false)
              } catch (err) {
                console.error('Failed to create team:', err)
                // Modal will show error state
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default TeamsPageContainer