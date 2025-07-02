'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle,
  AlertTriangle,
  Users,
  Trophy,
  Settings,
  Info,
  AlertCircle
} from 'lucide-react'
import { ActivityItem } from '../types'
import { adminAPI } from '@/lib/api/admin'

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'completion': return CheckCircle
    case 'warning': return AlertTriangle
    case 'social': return Users
    case 'achievement': return Trophy
    case 'system': return Settings
    default: return Info
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'completion': return 'text-green-500'
    case 'warning': return 'text-yellow-500'
    case 'social': return 'text-blue-500'
    case 'achievement': return 'text-purple-500'
    case 'system': return 'text-gray-500'
    default: return 'text-slate-500'
  }
}

export const RecentActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch real activity data from analytics
        const analyticsData = await adminAPI.getAnalytics()
        
        if (analyticsData?.recentActivities) {
          setActivities(analyticsData.recentActivities as ActivityItem[])
        } else {
          // Fallback to empty state
          setActivities([])
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
        setError('Failed to load recent activities')
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Activity Feed</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Live</span>
        </div>
      </div>

      <div className="terminal-feed space-y-4 max-h-80 overflow-y-auto rounded-lg p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No recent activities</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type)
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/5 dark:bg-white/5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
              >
                <IconComponent className={`h-5 w-5 mt-0.5 ${getActivityColor(activity.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}