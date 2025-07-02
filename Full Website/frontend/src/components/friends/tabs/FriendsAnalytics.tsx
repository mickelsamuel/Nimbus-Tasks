'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Calendar,
  Award,
  MapPin,
  Clock,
  Zap,
  Target
} from 'lucide-react'
import { FriendsData } from '../types'

interface FriendsAnalyticsProps {
  data: FriendsData
  isLoading: boolean
}

// Mock analytics data
const analyticsData = {
  networkGrowth: [
    { month: 'Jan', connections: 28, messages: 45, events: 3 },
    { month: 'Feb', connections: 32, messages: 67, events: 5 },
    { month: 'Mar', connections: 35, messages: 89, events: 4 },
    { month: 'Apr', connections: 38, messages: 123, events: 7 },
    { month: 'May', connections: 42, messages: 156, events: 6 },
    { month: 'Jun', connections: 42, messages: 178, events: 8 }
  ],
  departmentBreakdown: [
    { department: 'Engineering', count: 15, percentage: 35.7 },
    { department: 'Product', count: 8, percentage: 19.0 },
    { department: 'Design', count: 6, percentage: 14.3 },
    { department: 'Marketing', count: 5, percentage: 11.9 },
    { department: 'Sales', count: 4, percentage: 9.5 },
    { department: 'Analytics', count: 4, percentage: 9.5 }
  ],
  activityMetrics: {
    averageResponseTime: '12 minutes',
    messagesPerWeek: 24,
    meetingsPerMonth: 6,
    collaborationScore: 85,
    networkDiversity: 78,
    influenceScore: 92
  },
  topInteractions: [
    { name: 'Sarah Johnson', messages: 45, department: 'Engineering', score: 95 },
    { name: 'Michael Chen', messages: 32, department: 'Product', score: 88 },
    { name: 'Emily Rodriguez', messages: 28, department: 'Design', score: 82 },
    { name: 'Alex Thompson', messages: 21, department: 'Analytics', score: 76 }
  ]
}

export default function FriendsAnalytics({ data, isLoading }: FriendsAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Friends Analytics
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Insights into your social network and collaboration patterns
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <TrendingUp className="h-5 w-5 text-blue-200" />
          </div>
          <div className="text-3xl font-bold mb-1">{data.stats.totalConnections}</div>
          <div className="text-blue-100">Total Connections</div>
          <div className="text-sm text-blue-200 mt-2">
            +{data.stats.weeklyGrowth} this week
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="h-8 w-8" />
            <span className="text-green-200 text-sm">per week</span>
          </div>
          <div className="text-3xl font-bold mb-1">{analyticsData.activityMetrics.messagesPerWeek}</div>
          <div className="text-green-100">Messages Sent</div>
          <div className="text-sm text-green-200 mt-2">
            {analyticsData.activityMetrics.averageResponseTime} avg response
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-8 w-8" />
            <Award className="h-5 w-5 text-purple-200" />
          </div>
          <div className="text-3xl font-bold mb-1">{analyticsData.activityMetrics.collaborationScore}%</div>
          <div className="text-purple-100">Collaboration Score</div>
          <div className="text-sm text-purple-200 mt-2">
            Top 15% of users
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8" />
            <span className="text-orange-200 text-sm">influence</span>
          </div>
          <div className="text-3xl font-bold mb-1">{analyticsData.activityMetrics.influenceScore}%</div>
          <div className="text-orange-100">Network Influence</div>
          <div className="text-sm text-orange-200 mt-2">
            {analyticsData.activityMetrics.networkDiversity}% diversity
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Network Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Network Growth
          </h3>
          <div className="space-y-4">
            {analyticsData.networkGrowth.map((month, index) => (
              <motion.div
                key={month.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {month.month}
                </div>
                <div className="flex-1 space-y-2">
                  {/* Connections Bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 text-xs text-gray-500 dark:text-gray-400">Connections</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(month.connections / 50) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                    <div className="w-8 text-xs text-gray-600 dark:text-gray-300 text-right">
                      {month.connections}
                    </div>
                  </div>
                  {/* Messages Bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 text-xs text-gray-500 dark:text-gray-400">Messages</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(month.messages / 200) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                        className="bg-green-500 h-2 rounded-full"
                      />
                    </div>
                    <div className="w-8 text-xs text-gray-600 dark:text-gray-300 text-right">
                      {month.messages}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Connections by Department
          </h3>
          <div className="space-y-3">
            {analyticsData.departmentBreakdown.map((dept, index) => (
              <motion.div
                key={dept.department}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {dept.department}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {dept.count} people
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="bg-blue-500 h-2 rounded-full"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {dept.percentage}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Interactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Collaborators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData.topInteractions.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {person.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {person.department}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MessageCircle className="h-3 w-3" />
                    {person.messages} messages
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Zap className="h-3 w-3" />
                    {person.score}% synergy
                  </div>
                </div>
              </div>
              <div className="w-16 text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  #{index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {analyticsData.activityMetrics.meetingsPerMonth}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Meetings This Month
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {analyticsData.activityMetrics.averageResponseTime}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Avg Response Time
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {data.stats.onlineFriends}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              Active Now
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}