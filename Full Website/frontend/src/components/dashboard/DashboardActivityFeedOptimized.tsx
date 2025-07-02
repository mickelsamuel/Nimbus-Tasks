'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity as ActivityIcon, Users, TrendingUp, Award,
  MessageSquare, BookOpen, Target, Zap,
  ChevronRight, Filter, Clock,
  Star, Trophy, Brain
} from 'lucide-react'
import UserAvatar from '@/components/ui/UserAvatar'
import type { Activity, TeamActivity } from '@/types/dashboard'

interface DashboardActivityFeedProps {
  recentActivity: Activity[]
  teamActivity: TeamActivity[]
}

// Optimized Activity Item Component with memo
const ActivityItem = React.memo(({ 
  activity, 
  index, 
  getActivityIcon, 
  getActivityColor, 
  formatTimeAgo,
  isPersonal = true 
}: {
  activity: Activity | TeamActivity
  index: number
  getActivityIcon: (type: string) => React.ReactNode
  getActivityColor: (type: string) => string
  formatTimeAgo: (timestamp: Date | string) => string
  isPersonal?: boolean
}) => {
  const isTeamActivity = 'user' in activity
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
      className={`
        group relative overflow-hidden flex items-start gap-4 p-4 lg:p-6 rounded-2xl 
        bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 
        hover:from-${isPersonal ? 'blue' : 'green'}-50/80 hover:to-${isPersonal ? 'indigo' : 'blue'}-50/80 
        dark:hover:from-${isPersonal ? 'blue' : 'green'}-900/20 dark:hover:to-${isPersonal ? 'indigo' : 'blue'}-900/20 
        transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-600/50 
        hover:border-${isPersonal ? 'blue' : 'green'}-300/50 dark:hover:border-${isPersonal ? 'blue' : 'green'}-600/50 
        shadow-sm hover:shadow-xl backdrop-blur-sm min-h-[100px]
      `}
    >
      {/* Simplified hover effect */}
      <div className={`absolute inset-0 bg-${isPersonal ? 'blue' : 'green'}-50/20 dark:bg-${isPersonal ? 'blue' : 'green'}-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {isTeamActivity ? (
        <div className="relative z-10 flex-shrink-0">
          <UserAvatar 
            user={{ 
              firstName: activity.user.split(' ')[0],
              lastName: activity.user.split(' ')[1] || '',
              avatar: activity.avatar 
            }}
            size="md"
            className="w-12 h-12 lg:w-14 lg:h-14 border-2 border-white dark:border-gray-600 shadow-lg"
          />
        </div>
      ) : (
        <div className={`
            relative z-10 p-3 lg:p-4 rounded-xl bg-gradient-to-br ${getActivityColor(activity.type)} 
            text-white shadow-lg group-hover:shadow-xl flex-shrink-0
          `}>
          {getActivityIcon(activity.type)}
        </div>
      )}
      
      <div className="relative z-10 flex-1 min-w-0 space-y-2">
        <p className="text-sm lg:text-base">
          {isTeamActivity ? (
            <>
              <span className={`font-bold text-gray-900 dark:text-white group-hover:text-${isPersonal ? 'blue' : 'green'}-700 dark:group-hover:text-${isPersonal ? 'blue' : 'green'}-300 transition-colors`}>
                {activity.user}
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-1 font-medium">
                {activity.action}
              </span>
            </>
          ) : (
            <span className={`font-bold text-gray-900 dark:text-white group-hover:text-${isPersonal ? 'blue' : 'green'}-700 dark:group-hover:text-${isPersonal ? 'blue' : 'green'}-300 transition-colors line-clamp-2`}>
              {activity.title}
            </span>
          )}
        </p>
        <div className="flex items-center gap-3 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
            <span className="font-medium">{formatTimeAgo(activity.timestamp)}</span>
          </div>
          {activity.points > 0 && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 lg:w-4 lg:h-4 text-green-500 flex-shrink-0" />
                <span className="font-bold text-green-600 dark:text-green-400">
                  +{activity.points} XP
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="relative z-10 p-2 lg:p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm group-hover:bg-white/70 dark:group-hover:bg-gray-700/70 transition-all shadow-sm flex-shrink-0">
        <ChevronRight className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-${isPersonal ? 'blue' : 'green'}-600 dark:group-hover:text-${isPersonal ? 'blue' : 'green'}-400`} />
      </div>
    </motion.div>
  )
})

ActivityItem.displayName = 'ActivityItem'

export function DashboardActivityFeed({ recentActivity, teamActivity }: DashboardActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'team'>('personal')
  const [, _setShowFilters] = useState(false)
  
  // Optimize activity processing with limited items for performance
  const processedPersonalActivities = useMemo(() => {
    return recentActivity.slice(0, 5).map(activity => ({
      ...activity,
      points: activity.points || activity.xp || 0
    }))
  }, [recentActivity])
  
  const processedTeamActivities = useMemo(() => {
    return teamActivity.slice(0, 5).map(activity => ({
      ...activity,
      points: activity.points || activity.xp || 0
    }))
  }, [teamActivity])
  
  const handleTabChange = useCallback((tab: 'personal' | 'team') => {
    setActiveTab(tab)
  }, [])
  
  const toggleFilters = useCallback(() => {
    _setShowFilters(prev => !prev)
  }, [])

  // Memoize icon and color mappings for performance
  const getActivityIcon = useCallback((type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      completion: <BookOpen className="w-4 h-4" />,
      achievement: <Award className="w-4 h-4" />,
      level_up: <TrendingUp className="w-4 h-4" />,
      streak: <Zap className="w-4 h-4" />,
      team_join: <Users className="w-4 h-4" />,
      message: <MessageSquare className="w-4 h-4" />,
      target: <Target className="w-4 h-4" />
    }
    return iconMap[type] || <ActivityIcon className="w-4 h-4" />
  }, [])

  const getActivityColor = useCallback((type: string) => {
    const colorMap: Record<string, string> = {
      completion: 'from-green-500 to-emerald-600',
      achievement: 'from-yellow-500 to-amber-600',
      level_up: 'from-purple-500 to-indigo-600',
      streak: 'from-orange-500 to-red-600',
      team_join: 'from-blue-500 to-cyan-600',
      message: 'from-gray-500 to-gray-600',
      target: 'from-pink-500 to-rose-600'
    }
    return colorMap[type] || 'from-gray-500 to-gray-600'
  }, [])

  // Memoize time formatting function
  const formatTimeAgo = useCallback((timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }, [])

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Enhanced Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl shadow-lg flex-shrink-0">
              <ActivityIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 via-green-700 to-blue-700 dark:from-white dark:via-green-300 dark:to-blue-300 bg-clip-text text-transparent">
              Activity Feed
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl">
            Stay connected with your learning journey and team progress
          </p>
        </div>
        
        <button
          onClick={toggleFilters}
          className="flex items-center gap-2 p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 flex-shrink-0"
        >
          <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-200">Filters</span>
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dashboard-card rounded-2xl p-6 lg:p-8 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-900/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl min-h-[500px]"
      >

        {/* Enhanced Tabs */}
        <div className="flex gap-1 p-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl mb-8 shadow-inner">
          <button
            onClick={() => handleTabChange('personal')}
            className={`
              relative flex-1 px-4 py-3 lg:px-6 lg:py-4 rounded-xl text-sm lg:text-base font-bold transition-all duration-300
              ${activeTab === 'personal' 
                ? 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-600' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <Star className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>My Activity</span>
            </div>
            {activeTab === 'personal' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => handleTabChange('team')}
            className={`
              relative flex-1 px-4 py-3 lg:px-6 lg:py-4 rounded-xl text-sm lg:text-base font-bold transition-all duration-300
              ${activeTab === 'team' 
                ? 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-600' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>Team Feed</span>
            </div>
            {activeTab === 'team' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Enhanced Activity List */}
        <div className="space-y-4 lg:space-y-6 min-h-[300px]">
          <AnimatePresence>
            {activeTab === 'personal' ? (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {processedPersonalActivities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    index={index}
                    getActivityIcon={getActivityIcon}
                    getActivityColor={getActivityColor}
                    formatTimeAgo={formatTimeAgo}
                    isPersonal={true}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="team"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {processedTeamActivities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    index={index}
                    getActivityIcon={getActivityIcon}
                    getActivityColor={getActivityColor}
                    formatTimeAgo={formatTimeAgo}
                    isPersonal={false}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced View All Link */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-6 border-t border-gray-200/50 dark:border-gray-600/50"
        >
          <button className="group inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base">
            <Brain className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform" />
            <span>View All Activity</span>
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}