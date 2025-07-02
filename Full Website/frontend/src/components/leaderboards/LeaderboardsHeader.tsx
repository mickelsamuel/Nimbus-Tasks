'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Users, Zap, Crown, Star, Award, Sparkles } from 'lucide-react'
import { AnalyticsData } from '@/app/leaderboards/page'

interface LeaderboardsHeaderProps {
  timeframe: string
  onTimeframeChange: (timeframe: string) => void
  analyticsData?: AnalyticsData
}

const timeframeOptions = [
  { value: 'day', label: 'Today', icon: '📅' },
  { value: 'week', label: 'This Week', icon: '📊' },
  { value: 'month', label: 'This Month', icon: '🗓️' },
  { value: 'quarter', label: 'Quarter', icon: '📈' },
  { value: 'year', label: 'This Year', icon: '🏆' },
  { value: 'all', label: 'All Time', icon: '👑' }
]


export default function LeaderboardsHeader({
  timeframe,
  onTimeframeChange,
  analyticsData
}: LeaderboardsHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900"
          animate={{
            background: [
              "linear-gradient(135deg, rgb(239 246 255) 0%, rgb(238 242 255) 50%, rgb(250 245 255) 100%)",
              "linear-gradient(135deg, rgb(219 234 254) 0%, rgb(221 214 254) 50%, rgb(243 232 255) 100%)",
              "linear-gradient(135deg, rgb(239 246 255) 0%, rgb(238 242 255) 50%, rgb(250 245 255) 100%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Dark mode background */}
        <motion.div
          className="absolute inset-0 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 opacity-0 dark:opacity-100"
          animate={{
            background: [
              "linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59) 50%, rgb(49 46 129) 100%)",
              "linear-gradient(135deg, rgb(30 41 59) 0%, rgb(49 46 129) 50%, rgb(67 56 202) 100%)",
              "linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59) 50%, rgb(49 46 129) 100%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />


      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Crown Animation */}
            <motion.div
              className="relative inline-block mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 rounded-full blur-xl opacity-70"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-2xl">
                  <Crown className="h-12 w-12 text-white drop-shadow-lg" />
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.5)",
                    "0 0 30px rgba(251, 191, 36, 0.8)",
                    "0 0 20px rgba(251, 191, 36, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Leaderboards
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl sm:text-2xl lg:text-3xl text-slate-700 dark:text-slate-200 font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Where Legends Are Made
            </motion.p>

            {/* Live Activity Indicator */}
            <motion.div
              className="inline-flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full px-8 py-4 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              <motion.div
                className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.7)",
                    "0 0 0 8px rgba(34, 197, 94, 0)",
                    "0 0 0 0 rgba(34, 197, 94, 0.7)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-slate-700 dark:text-slate-200 font-semibold text-lg">
                Live Competition Active
              </span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-5 w-5 text-amber-500" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {/* Active Competitors */}
            <motion.div
              className="group relative"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Users className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.div
                      className="text-4xl font-black text-slate-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                    >
                      {analyticsData?.activeCompetitors?.toLocaleString() || '0'}
                    </motion.div>
                    <div className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                      Active Competitors
                    </div>
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{analyticsData?.competitorsTrend || 'No change'}</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Your Rank */}
            <motion.div
              className="group relative"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl"
                    animate={{
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Trophy className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.div
                      className="text-4xl font-black text-slate-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                    >
                      #{analyticsData?.userRank || '-'}
                    </motion.div>
                    <div className="text-purple-600 dark:text-purple-400 font-semibold text-lg">
                      Your Current Rank
                    </div>
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">{analyticsData?.userPercentile || 'Unranked'}</span>
                </motion.div>
              </div>
            </motion.div>

            {/* This Week Progress */}
            <motion.div
              className="group relative md:col-span-2 lg:col-span-1"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Star className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.div
                      className="text-4xl font-black text-slate-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                    >
                      +{((analyticsData as any)?.weeklyPoints as number) || 0}
                    </motion.div>
                    <div className="text-amber-600 dark:text-amber-400 font-semibold text-lg">
                      XP This Week
                    </div>
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{analyticsData?.weeklyTrend || 'Keep going!'}</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Time Period Selector */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-3 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
              <div className="flex flex-wrap gap-2">
                {timeframeOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    onClick={() => onTimeframeChange(option.value)}
                    className={`relative overflow-hidden px-6 py-3 rounded-2xl text-base font-semibold transition-all duration-300 ${
                      timeframe === option.value
                        ? 'text-white shadow-xl'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 + index * 0.1, duration: 0.5 }}
                  >
                    {timeframe === option.value && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                        layoutId="activeTimeframe"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}