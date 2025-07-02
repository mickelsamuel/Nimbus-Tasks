'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Calendar,
  ArrowRight,
  Zap,
  Heart,
  Star
} from 'lucide-react'
import { FriendsData } from '../types'
import UserCard from '../components/UserCard'

interface FriendsOverviewProps {
  data: FriendsData
  isLoading: boolean
}

export default function FriendsOverview({ data, isLoading }: FriendsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Active Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-blue-200 text-sm">+{data.stats.weeklyGrowth} this week</span>
          </div>
          <div className="text-3xl font-bold mb-1">{data.stats.totalConnections}</div>
          <div className="text-blue-100">Total Connections</div>
        </motion.div>

        {/* Online Friends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-green-200 text-sm">Online now</span>
          </div>
          <div className="text-3xl font-bold mb-1">{data.stats.onlineFriends}</div>
          <div className="text-green-100">Friends Online</div>
        </motion.div>

        {/* Pending Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="h-8 w-8" />
            <span className="text-orange-200 text-sm">New</span>
          </div>
          <div className="text-3xl font-bold mb-1">{data.stats.newRequests}</div>
          <div className="text-orange-100">Pending Requests</div>
        </motion.div>

        {/* Network Strength */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-8 w-8" />
            <TrendingUp className="h-5 w-5 text-purple-200" />
          </div>
          <div className="text-3xl font-bold mb-1">{data.stats.mutualConnections}</div>
          <div className="text-purple-100">Mutual Friends</div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Online Friends */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Friends Online
              </h2>
              <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.connections.filter(user => user.isOnline).slice(0, 4).map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  variant="default"
                  onMessage={(userId) => console.log('Message user:', userId)}
                />
              ))}
            </div>
            
            {data.connections.filter(user => user.isOnline).length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No friends are currently online</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.type === 'connection' && (
                      <Heart className="h-4 w-4 text-red-500" />
                    )}
                    {activity.type === 'message' && (
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                    )}
                    {activity.type === 'collaboration' && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-4 text-left rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/70 transition-colors border border-blue-200 dark:border-blue-800"
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Find New Friends</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-4 text-left rounded-lg bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/70 transition-colors border border-green-200 dark:border-green-800"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Start a Chat</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-4 text-left rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/70 transition-colors border border-purple-200 dark:border-purple-800"
              >
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Schedule Meetup</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            People You May Know
          </h2>
          <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            See All
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.suggestedConnections.slice(0, 3).map((user) => (
            <UserCard
              key={user.id}
              user={user}
              variant="suggested"
              onConnect={(userId) => console.log('Connect to user:', userId)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}