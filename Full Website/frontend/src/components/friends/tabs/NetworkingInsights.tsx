'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Calendar,
  Award,
  Clock,
  Building2,
  Target,
  Zap,
  Activity
} from 'lucide-react'
import { FriendsData } from '../types'
import { FriendsData as ApiFriendsData } from '@/lib/api/friends'
import { useFriends } from '@/hooks/useFriends'

interface DataStats {
  totalConnections?: number;
  weeklyGrowth?: number;
  onlineFriends?: number;
}

interface DataAnalytics {
  totalConnections?: number;
  connectionGrowth?: number;
}

interface NetworkingData {
  stats?: DataStats;
  analytics?: DataAnalytics;
}

interface NetworkingInsightsProps {
  data?: (FriendsData | ApiFriendsData) & NetworkingData
  isLoading?: boolean
  networkGrowth?: Array<{
    month: string
    connections: number
    meetings: number
    collaborations: number
  }>
  departmentBreakdown?: Array<{
    department: string
    connections: number
    growth: number
  }>
  collaborationData?: Array<{
    name: string
    department: string
    interactions: number
    projects: number
    responseTime: string
    collaborationScore: number
  }>
  networkingGoals?: Array<{
    title: string
    target: number
    current: number
    deadline: string
    status: string
  }>
}

export default function NetworkingInsights({ 
  data: propData, 
  isLoading: propIsLoading,
  networkGrowth = [],
  departmentBreakdown = [],
  collaborationData = [],
  networkingGoals = []
}: NetworkingInsightsProps) {
  // Use hook data if props are not provided
  const { data: hookData, loading: hookLoading } = useFriends()
  
  const data = propData || hookData
  const isLoading = propIsLoading ?? hookLoading

  // Handle null/undefined data
  if (!data && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Unable to load networking insights</p>
      </div>
    )
  }
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

  const dataWithNetworking = data as NetworkingData | undefined
  const professionalMetrics = {
    networkSize: dataWithNetworking?.stats?.totalConnections || dataWithNetworking?.analytics?.totalConnections || 0,
    growthRate: dataWithNetworking?.stats?.weeklyGrowth || dataWithNetworking?.analytics?.connectionGrowth || 0,
    activeConnections: dataWithNetworking?.stats?.onlineFriends || Math.floor((dataWithNetworking?.analytics?.totalConnections || 0) * 0.6) || 0,
    responseRate: (dataWithNetworking?.stats?.totalConnections || dataWithNetworking?.analytics?.totalConnections || 0) > 0 ? Math.min(98, Math.max(70, 80 + Math.floor((dataWithNetworking?.stats?.totalConnections || dataWithNetworking?.analytics?.totalConnections || 0) / 10))) : 0,
    meetingsPerMonth: (dataWithNetworking?.stats?.totalConnections || dataWithNetworking?.analytics?.totalConnections || 0) > 0 ? Math.floor((dataWithNetworking?.stats?.totalConnections || dataWithNetworking?.analytics?.totalConnections || 0) / 5) : 0,
    collaborationIndex: (dataWithNetworking?.stats?.onlineFriends || Math.floor((dataWithNetworking?.analytics?.totalConnections || 0) * 0.6) || 0) > 0 ? Math.min(95, Math.max(60, 70 + (dataWithNetworking?.stats?.onlineFriends || Math.floor((dataWithNetworking?.analytics?.totalConnections || 0) * 0.6) || 0))) : 0,
    departmentReach: departmentBreakdown.length || 0,
    industryConnections: Math.floor((dataWithNetworking?.stats?.totalConnections || dataWithNetworking?.analytics?.totalConnections || 0) * 0.3) || 0
  }



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Professional Networking Insights
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Analyze your professional network growth, collaboration patterns, and networking effectiveness
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
          <div className="text-3xl font-bold mb-1">{professionalMetrics.networkSize}</div>
          <div className="text-blue-100">Professional Network</div>
          <div className="text-sm text-blue-200 mt-2">
            +{professionalMetrics.growthRate}% this month
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
            <span className="text-green-200 text-sm">Active</span>
          </div>
          <div className="text-3xl font-bold mb-1">{professionalMetrics.activeConnections}</div>
          <div className="text-green-100">Regular Contacts</div>
          <div className="text-sm text-green-200 mt-2">
            {professionalMetrics.responseRate}% response rate
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8" />
            <Award className="h-5 w-5 text-purple-200" />
          </div>
          <div className="text-3xl font-bold mb-1">{professionalMetrics.meetingsPerMonth}</div>
          <div className="text-purple-100">Monthly Meetings</div>
          <div className="text-sm text-purple-200 mt-2">
            {professionalMetrics.collaborationIndex}% collaboration index
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Building2 className="h-8 w-8" />
            <span className="text-orange-200 text-sm">Reach</span>
          </div>
          <div className="text-3xl font-bold mb-1">{professionalMetrics.departmentReach}</div>
          <div className="text-orange-100">Department Reach</div>
          <div className="text-sm text-orange-200 mt-2">
            {professionalMetrics.industryConnections} industry contacts
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Network Growth Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Network Growth & Activity
          </h3>
          <div className="space-y-4">
            {networkGrowth.map((month, index) => (
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
                  {/* Meetings Bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 text-xs text-gray-500 dark:text-gray-400">Meetings</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(month.meetings / 25) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                        className="bg-green-500 h-2 rounded-full"
                      />
                    </div>
                    <div className="w-8 text-xs text-gray-600 dark:text-gray-300 text-right">
                      {month.meetings}
                    </div>
                  </div>
                  {/* Collaborations Bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 text-xs text-gray-500 dark:text-gray-400">Projects</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(month.collaborations / 20) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.9 }}
                        className="bg-purple-500 h-2 rounded-full"
                      />
                    </div>
                    <div className="w-8 text-xs text-gray-600 dark:text-gray-300 text-right">
                      {month.collaborations}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Network Distribution by Department
          </h3>
          <div className="space-y-4">
            {departmentBreakdown.map((dept, index) => (
              <motion.div
                key={dept.department}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dept.department}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {dept.connections} connections
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(dept.connections / 20) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="bg-blue-500 h-2 rounded-full"
                    />
                  </div>
                  <div className={`text-sm font-medium ${
                    dept.growth > 15 ? 'text-green-600 dark:text-green-400' : 
                    dept.growth > 10 ? 'text-blue-600 dark:text-blue-400' : 
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    +{dept.growth}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaboration Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Collaborators Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collaborationData.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
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
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {person.interactions}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Interactions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {person.projects}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Projects
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {person.responseTime}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Response
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {person.collaborationScore}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Collaboration Score
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Networking Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Networking Goals & Progress
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            <Target className="h-4 w-4" />
            Set New Goal
          </button>
        </div>
        
        <div className="space-y-4">
          {networkingGoals.map((goal, index) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {goal.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>Progress: {goal.current}/{goal.target}</div>
                    <div>Due: {new Date(goal.deadline).toLocaleDateString()}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  goal.status === 'ahead' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  goal.status === 'on-track' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {goal.status === 'ahead' ? 'Ahead of Schedule' :
                   goal.status === 'on-track' ? 'On Track' : 'Behind Schedule'}
                </span>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className={`h-2 rounded-full ${
                      goal.status === 'ahead' ? 'bg-green-500' :
                      goal.status === 'on-track' ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Networking Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {professionalMetrics.collaborationIndex}%
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Collaboration Effectiveness
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              18 mins
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Average Response Time
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              92%
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              Network Quality Score
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}