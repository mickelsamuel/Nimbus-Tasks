'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Activity,
  Clock,
  ArrowUp,
  Crown,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { AnalyticsData } from '@/app/leaderboards/page'

interface LeaderboardsAnalyticsProps {
  data?: AnalyticsData
  loading?: boolean
}



export default function LeaderboardsAnalytics({ 
  data, 
  loading = false 
}: LeaderboardsAnalyticsProps) {
  const router = useRouter()
  const analyticsData = data || {}

  if (loading) {
    return (
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <motion.div 
            key={i} 
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8"
            animate={{
              background: [
                "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 50%, rgba(255,255,255,0.9) 100%)",
                "linear-gradient(90deg, rgba(248,250,252,0.9) 0%, rgba(255,255,255,0.9) 50%, rgba(248,250,252,0.9) 100%)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="space-y-6">
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl" />
              <div className="space-y-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-2xl" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      {/* Your Performance Dashboard */}
      <motion.div
        className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        whileHover={{ scale: 1.02, y: -5 }}
      >

        <motion.div
          className="relative z-10 p-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Activity className="h-8 w-8 text-white" />
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-3 w-3 text-white" />
              </motion.div>
            </motion.div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Your Performance
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Personal analytics
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Current Rank */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-500 p-0.5 rounded-2xl">
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl h-full" />
              </div>
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </motion.div>
                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Current Rank</span>
                  </div>
                  <div className="text-right">
                    <motion.div
                      className="text-3xl font-black text-slate-900 dark:text-white"
                      animate={{
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      #{data?.userRank || '-'}
                    </motion.div>
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                      in global leaderboard
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 p-0.5 rounded-2xl">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl h-full" />
              </div>
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </motion.div>
                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Weekly Progress</span>
                  </div>
                  <div className="text-right">
                    <motion.div
                      className="text-3xl font-black text-slate-900 dark:text-white"
                      animate={{
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      +{typeof data?.weeklyPoints === 'number' ? data.weeklyPoints : 0}
                    </motion.div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                      <ArrowUp className="h-3 w-3" />
                      <span className="font-medium">XP earned</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Active Competitors */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 p-0.5 rounded-2xl">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl h-full" />
              </div>
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Competitors</span>
                  </div>
                  <div className="text-right">
                    <motion.div
                      className="text-3xl font-black text-slate-900 dark:text-white"
                      animate={{
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {((analyticsData as Record<string, unknown>).activeCompetitors as number || 0).toLocaleString()}
                    </motion.div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">currently active</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Live Activity Feed */}
      <motion.div
        className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        whileHover={{ scale: 1.02, y: -5 }}
      >

        <motion.div
          className="relative z-10 p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl"
              animate={{
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Clock className="h-8 w-8 text-white" />
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-3 w-3 text-white" />
              </motion.div>
            </motion.div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Live Activity
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Real-time updates
              </p>
            </div>
            <motion.div
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-700"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-3 h-3 bg-emerald-500 rounded-full"
                animate={{
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                Live
              </span>
            </motion.div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {(Array.isArray((analyticsData as AnalyticsData)?.recentActivities) ? (analyticsData as AnalyticsData).recentActivities : []).map((activity, index: number) => (
                <motion.div
                  key={activity.id as string}
                  className="group flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-2xl transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  layout
                >
                  <motion.div
                    className="text-3xl flex-shrink-0"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {activity.icon as React.ReactNode}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.div
                      className="text-base font-bold text-slate-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                    >
                      <span className="text-emerald-600 dark:text-emerald-400">{activity.user as string}</span>
                      {' '}{activity.action as string}
                    </motion.div>
                    <motion.div
                      className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                    >
                      <Clock className="h-3 w-3" />
                      {activity.time as string}
                    </motion.div>
                  </div>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ rotate: 15 }}
                  >
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <motion.button
              className="w-full flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                console.log('Navigating to activity feed...')
                router.push('/timeline')
              }}
            >
              <span className="font-medium">View all activity</span>
              <motion.div
                className="group-hover:translate-x-1 transition-transform"
                animate={{
                  x: [0, 3, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}