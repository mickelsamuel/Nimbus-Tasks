'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Bell, Users, Award, BookOpen, MessageSquare, 
  TrendingUp, Target, ChevronDown,
  Zap, Star, Trophy, Heart, Share2,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface ActivityItem {
  id: string
  type: 'achievement' | 'module_completion' | 'team_join' | 'message' | 'ranking' | 'challenge' | 'collaboration' | 'milestone' | 'system'
  title: string
  description: string
  timestamp: string
  user: {
    id: string
    name: string
    avatar: string
    department?: string
  }
  metadata?: {
    moduleId?: string
    moduleName?: string
    teamId?: string
    teamName?: string
    achievementId?: string
    achievementName?: string
    points?: number
    oldRank?: number
    newRank?: number
    challengeId?: string
    challengeName?: string
    completionRate?: number
    xpGained?: number
    level?: number
    collaborators?: string[]
    milestoneType?: string
    category?: string
  }
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  reactions?: {
    emoji: string
    count: number
    users: string[]
  }[]
  canInteract: boolean
}

interface ActivityFeedProps {
  feedType?: 'global' | 'team' | 'personal' | 'department'
  teamId?: string
  userId?: string
  department?: string
  maxItems?: number
  showFilters?: boolean
  showHeader?: boolean
  height?: string
  enableRealtime?: boolean
  className?: string
}

export function ActivityFeed({
  feedType = 'global',
  teamId,
  userId,
  department,
  maxItems = 50,
  showFilters = true,
  showHeader = true,
  height = '600px',
  enableRealtime = true,
  className = ''
}: ActivityFeedProps) {
  const { user } = useAuth()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('week')
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set())
  const lastFetchTime = useRef<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout>()

  const fetchActivities = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const params = new URLSearchParams({
        type: feedType,
        filter,
        timeRange,
        limit: maxItems.toString(),
        ...(teamId && { teamId }),
        ...(userId && { userId }),
        ...(department && { department }),
        ...(isRefresh && { since: lastFetchTime.current.toISOString() })
      })

      const response = await fetch(`/api/activity/feed?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        if (isRefresh) {
          // Add new activities to the top
          setActivities(prev => [...data.activities, ...prev].slice(0, maxItems))
        } else {
          setActivities(data.activities || [])
        }
        
        lastFetchTime.current = new Date()
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [feedType, teamId, userId, department, filter, timeRange, maxItems])

  useEffect(() => {
    fetchActivities()
    
    if (enableRealtime) {
      // Set up real-time polling every 30 seconds
      intervalRef.current = setInterval(() => {
        fetchActivities(true)
      }, 30000)
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [feedType, teamId, userId, department, filter, timeRange, enableRealtime, fetchActivities])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return Award
      case 'module_completion':
        return BookOpen
      case 'team_join':
        return Users
      case 'message':
        return MessageSquare
      case 'ranking':
        return TrendingUp
      case 'challenge':
        return Target
      case 'collaboration':
        return Heart
      case 'milestone':
        return Star
      case 'system':
        return Bell
      default:
        return Zap
    }
  }

  const getActivityColor = (type: string, priority: string) => {
    const baseColors = {
      achievement: 'from-yellow-500 to-orange-500',
      module_completion: 'from-blue-500 to-indigo-500',
      team_join: 'from-green-500 to-emerald-500',
      message: 'from-purple-500 to-pink-500',
      ranking: 'from-red-500 to-rose-500',
      challenge: 'from-cyan-500 to-blue-500',
      collaboration: 'from-pink-500 to-rose-500',
      milestone: 'from-amber-500 to-yellow-500',
      system: 'from-gray-500 to-slate-500'
    }

    if (priority === 'urgent') {
      return 'from-red-600 to-red-500 animate-pulse'
    }
    
    return baseColors[type as keyof typeof baseColors] || 'from-gray-500 to-slate-500'
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const toggleExpanded = (activityId: string) => {
    setExpandedActivities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
  }

  const addReaction = async (activityId: string, emoji: string) => {
    try {
      await fetch(`/api/activity/${activityId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ emoji })
      })
      
      // Refresh activities to show updated reactions
      fetchActivities(true)
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  const markAsRead = async (activityId: string) => {
    if (!user) return
    
    try {
      await fetch(`/api/activity/${activityId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, isRead: true }
            : activity
        )
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const shareActivity = async (activity: ActivityItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: activity.description,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(`${activity.title}\n${activity.description}\n${window.location.href}`)
    }
  }

  const renderActivityMetadata = (activity: ActivityItem) => {
    const { metadata } = activity
    if (!metadata) return null

    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {metadata.points && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">
            <Star className="h-3 w-3" />
            {metadata.points} XP
          </span>
        )}
        {metadata.level && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-xs">
            <Trophy className="h-3 w-3" />
            Level {metadata.level}
          </span>
        )}
        {metadata.completionRate && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs">
            <Target className="h-3 w-3" />
            {metadata.completionRate}% Complete
          </span>
        )}
        {metadata.oldRank && metadata.newRank && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
            <TrendingUp className="h-3 w-3" />
            #{metadata.oldRank} → #{metadata.newRank}
          </span>
        )}
        {metadata.category && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
            {metadata.category}
          </span>
        )}
      </div>
    )
  }

  if (loading && activities.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading activity feed...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col ${className}`} style={{ height }}>
      {showHeader && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Activity Feed
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feedType === 'global' ? 'Platform-wide activities' :
                   feedType === 'team' ? 'Team activities' :
                   feedType === 'personal' ? 'Your activities' :
                   'Department activities'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchActivities(true)}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Activities</option>
                <option value="achievement">Achievements</option>
                <option value="module_completion">Modules</option>
                <option value="team_join">Teams</option>
                <option value="ranking">Rankings</option>
                <option value="challenge">Challenges</option>
              </select>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hour">Last Hour</option>
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {refreshing && activities.length > 0 && (
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Checking for new activities...
            </div>
          </div>
        )}

        <AnimatePresence>
          {activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type)
            const isExpanded = expandedActivities.has(activity.id)
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group ${
                  !activity.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-50 dark:bg-gray-700/30'
                } rounded-lg p-4 border ${
                  !activity.isRead ? 'border-blue-200 dark:border-blue-800' : 'border-gray-200 dark:border-gray-600'
                } hover:shadow-md transition-all duration-200`}
                onClick={() => !activity.isRead && markAsRead(activity.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getActivityColor(activity.type, activity.priority)} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {activity.title}
                          </h4>
                          {!activity.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                          {activity.priority === 'urgent' && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-medium">
                              URGENT
                            </span>
                          )}
                        </div>
                        
                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${
                          isExpanded ? '' : 'line-clamp-2'
                        }`}>
                          {activity.description}
                        </p>
                        
                        {renderActivityMetadata(activity)}
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <Image
                              src={activity.user.avatar || '/avatars/default.jpg'}
                              alt={activity.user.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.user.name}
                            </span>
                            {activity.user.department && (
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                • {activity.user.department}
                              </span>
                            )}
                          </div>
                          
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                        
                        {activity.reactions && activity.reactions.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            {activity.reactions.map((reaction, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addReaction(activity.id, reaction.emoji)
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-full text-xs transition-colors"
                              >
                                <span>{reaction.emoji}</span>
                                <span>{reaction.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {activity.canInteract && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                addReaction(activity.id, '👍')
                              }}
                              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Heart className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                shareActivity(activity)
                              }}
                              className="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {activity.description.length > 100 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpanded(activity.id)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {activities.length === 0 && !loading && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Activities Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feedType === 'personal' 
                ? "You haven't completed any activities yet. Start learning to see your progress here!"
                : "No recent activities found. Check back later for updates."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}