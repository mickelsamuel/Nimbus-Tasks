'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, Users, Building2, MessageSquare,
  Award, CheckCircle, UserPlus,
  AlertCircle, Zap, ArrowRight
} from 'lucide-react'
import { useFriends } from '@/hooks/useFriends'
import { useTeams } from '@/hooks/useTeams'
import { useAuth } from '@/contexts/AuthContext'

interface ActivityItem {
  id: string
  type: 'connection' | 'team' | 'message' | 'achievement' | 'deadline' | 'project'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  color: string
  actionable?: boolean
  actionText?: string
  priority?: 'low' | 'medium' | 'high'
}

export default function ActivityFeedView() {
  const [filterType, setFilterType] = useState<'all' | 'urgent' | 'teams' | 'network'>('all')
  
  const { } = useAuth()
  const { data: friendsData } = useFriends()
  const { myTeams } = useTeams()
  
  // Generate activity feed based on real data
  const activities: ActivityItem[] = [
    // Connection requests
    ...(friendsData?.connectionRequests?.slice(0, 3).map((request, index) => ({
      id: `request-${request.id}`,
      type: 'connection' as const,
      title: `New connection request`,
      description: `${request.name || 'Someone'} wants to connect with you`,
      timestamp: `${index + 1}h ago`,
      icon: <UserPlus className="h-4 w-4" />,
      color: 'blue',
      actionable: true,
      actionText: 'Review Request',
      priority: 'medium' as const
    })) || []),
    
    // Team updates
    ...(myTeams?.slice(0, 2).map((team, index) => ({
      id: `team-${team._id || team.id}-${index}`,
      type: 'team' as const,
      title: `Team Update: ${team.name}`,
      description: index === 0 ? 'New project milestone reached' : 'Weekly team meeting scheduled',
      timestamp: `${index + 2}h ago`,
      icon: <Building2 className="h-4 w-4" />,
      color: 'purple',
      actionable: true,
      actionText: 'View Team',
      priority: index === 0 ? 'high' as const : 'low' as const
    })) || []),
    
    // Static useful activities
    {
      id: 'deadline-1',
      type: 'deadline',
      title: 'Upcoming Deadline',
      description: 'Project proposal due tomorrow',
      timestamp: '4h ago',
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'red',
      actionable: true,
      actionText: 'View Details',
      priority: 'high'
    },
    {
      id: 'message-1',
      type: 'message',
      title: 'Unread Messages',
      description: 'You have 3 new messages from your team',
      timestamp: '5h ago',
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'green',
      actionable: true,
      actionText: 'Read Messages',
      priority: 'medium'
    },
    {
      id: 'achievement-1',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      description: 'Completed 10 collaborative projects',
      timestamp: '1d ago',
      icon: <Award className="h-4 w-4" />,
      color: 'yellow',
      actionable: false,
      priority: 'low'
    },
    {
      id: 'project-1',
      type: 'project',
      title: 'Project Status Update',
      description: 'Marketing campaign is 75% complete',
      timestamp: '1d ago',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'green',
      actionable: true,
      actionText: 'View Progress',
      priority: 'medium'
    }
  ]

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    switch (filterType) {
      case 'urgent':
        return activity.priority === 'high' || activity.actionable
      case 'teams':
        return activity.type === 'team' || activity.type === 'project'
      case 'network':
        return activity.type === 'connection' || activity.type === 'message'
      default:
        return true
    }
  })

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'purple':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      case 'red':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'green':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'yellow':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">Urgent</span>
      case 'medium':
        return <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Important</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Activity Feed
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay updated with your network and team activities
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {(['all', 'urgent', 'teams', 'network'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filterType === filter
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filter === 'urgent' && <Zap className="h-3 w-3 inline mr-1" />}
              {filter === 'teams' && <Building2 className="h-3 w-3 inline mr-1" />}
              {filter === 'network' && <Users className="h-3 w-3 inline mr-1" />}
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="dashboard-card rounded-xl p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl border ${getColorClasses(activity.color)}`}>
                  {activity.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {activity.priority && getPriorityBadge(activity.priority)}
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  {activity.actionable && (
                    <motion.button
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {activity.actionText}
                      <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 dashboard-card rounded-xl">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No activities found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filterType === 'all' 
                ? "You're all caught up! No new activities."
                : `No ${filterType} activities to show.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Find Connections</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Discover new people to connect with</p>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-lg text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Join a Team</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Find teams that match your interests</p>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Start Conversation</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Send a message to your network</p>
          </motion.button>
        </div>
      </div>
    </div>
  )
}