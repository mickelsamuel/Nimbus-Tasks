'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
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

export function DashboardActivityFeed({ recentActivity, teamActivity }: DashboardActivityFeedProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'personal' | 'team'>('personal')
  const [showFilters, setShowFilters] = useState(false)

  const getActivityIcon = (type: string) => {
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
  }

  const getActivityColor = (type: string) => {
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
  }

  const formatTimeAgo = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const personalActivities = recentActivity.slice(0, 5)
  const teamActivities = teamActivity.slice(0, 5)

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
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="p-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl shadow-lg flex-shrink-0"
            >
              <ActivityIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 via-green-700 to-blue-700 dark:from-white dark:via-green-300 dark:to-blue-300 bg-clip-text text-transparent">
              Activity Feed
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl">
            Stay connected with your learning journey and team progress
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 flex-shrink-0"
        >
          <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-200">Filters</span>
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dashboard-card rounded-2xl p-6 lg:p-8 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-900/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl min-h-[600px]"
      >

        {/* Enhanced Tabs */}
        <div className="flex gap-1 p-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl mb-8 shadow-inner">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('personal')}
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
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('team')}
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
          </motion.button>
        </div>

        {/* Enhanced Activity List */}
        <div className="space-y-4 lg:space-y-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'personal' ? (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {personalActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden flex items-start gap-4 p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 shadow-sm hover:shadow-xl backdrop-blur-sm min-h-[100px]"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="h-full w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 blur-sm"
                      />
                    </div>

                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`
                        relative z-10 p-3 lg:p-4 rounded-xl bg-gradient-to-br ${getActivityColor(activity.type)} 
                        text-white shadow-lg group-hover:shadow-xl flex-shrink-0
                      `}
                    >
                      {getActivityIcon(activity.type)}
                    </motion.div>
                    <div className="relative z-10 flex-1 min-w-0 space-y-2">
                      <p className="text-sm lg:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                        {activity.title}
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
                    <motion.div
                      whileHover={{ scale: 1.1, x: 5 }}
                      className="relative z-10 p-2 lg:p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm group-hover:bg-white/70 dark:group-hover:bg-gray-700/70 transition-all shadow-sm flex-shrink-0"
                    >
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </motion.div>
                  </motion.div>
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
                {teamActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden flex items-start gap-4 p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 hover:from-green-50/80 hover:to-blue-50/80 dark:hover:from-green-900/20 dark:hover:to-blue-900/20 transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-600/50 hover:border-green-300/50 dark:hover:border-green-600/50 shadow-sm hover:shadow-xl backdrop-blur-sm min-h-[100px]"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="h-full w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 blur-sm"
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative z-10 flex-shrink-0"
                    >
                      <UserAvatar 
                        user={{ 
                          firstName: activity.user.split(' ')[0],
                          lastName: activity.user.split(' ')[1] || '',
                          avatar: activity.avatar 
                        }}
                        size="md"
                        className="w-12 h-12 lg:w-14 lg:h-14 border-2 border-white dark:border-gray-600 shadow-lg"
                      />
                    </motion.div>
                    <div className="relative z-10 flex-1 min-w-0 space-y-2">
                      <p className="text-sm lg:text-base">
                        <span className="font-bold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                          {activity.user}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1 font-medium">
                          {activity.action}
                        </span>
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
                    <motion.div
                      whileHover={{ scale: 1.1, x: 5 }}
                      className="relative z-10 p-2 lg:p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm group-hover:bg-white/70 dark:group-hover:bg-gray-700/70 transition-all shadow-sm flex-shrink-0"
                    >
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                    </motion.div>
                  </motion.div>
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
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}             onClick={() => router.push('/timeline')}
            className="group inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base"
          >
            <Brain className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform" />
            <span>View All Activity</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}