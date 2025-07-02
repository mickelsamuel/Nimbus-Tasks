'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Crown,
  Medal,
  Award,
  Star,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Trophy,
  Target
} from 'lucide-react'

interface LeaderboardUser {
  id: number
  name: string
  department: string
  avatar: string
  score: number
  rank: number
  previousRank: number
  achievements: number
  streak: number
  completedModules: number
  averageScore: number
  trend: 'up' | 'down' | 'stable'
  badges: string[]
  country?: string
  team?: string
}

interface LeaderboardsTableProps {
  users: LeaderboardUser[]
  loading?: boolean
  maxRows?: number
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />
    default:
      return null
  }
}

const getRankChangeIndicator = (rank: number, previousRank: number) => {
  if (rank === previousRank) return <Minus className="h-4 w-4 text-slate-400" />
  if (rank < previousRank) return <ChevronUp className="h-4 w-4 text-emerald-500" />
  return <ChevronDown className="h-4 w-4 text-red-500" />
}

const getTrendIndicator = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-emerald-500" />
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />
    default:
      return <Minus className="h-4 w-4 text-slate-400" />
  }
}

const getRankStyling = (rank: number) => {
  if (rank <= 3) {
    return {
      bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
      borderColor: 'border-amber-200 dark:border-amber-700',
      glowClass: 'shadow-xl shadow-amber-500/25',
      textColor: 'text-amber-900 dark:text-amber-100'
    }
  } else if (rank <= 10) {
    return {
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      glowClass: 'shadow-lg shadow-blue-500/20',
      textColor: 'text-blue-900 dark:text-blue-100'
    }
  } else {
    return {
      bgGradient: 'from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50',
      borderColor: 'border-slate-200 dark:border-slate-700',
      glowClass: 'shadow-md shadow-slate-500/10',
      textColor: 'text-slate-900 dark:text-slate-100'
    }
  }
}


export default function LeaderboardsTable({ 
  users, 
  loading = false, 
  maxRows = 50 
}: LeaderboardsTableProps) {
  const [hoveredUser, setHoveredUser] = useState<number | null>(null)
  
  if (loading) {
    return (
      <motion.div
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="p-8">
          <div className="space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-20 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-2xl"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.1
                }}
                style={{ backgroundSize: '200% 200%' }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  const displayUsers = users.slice(0, maxRows)

  return (
    <motion.div
      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 px-8 py-6 border-b border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Global Rankings
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Live competition results
              </p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="w-3 h-3 bg-emerald-500 rounded-full"
              animate={{
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
              {displayUsers.length} Active
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Table Content */}
      <div className="max-h-[700px] overflow-y-auto">
        <AnimatePresence>
          {displayUsers.map((user, index) => {
            const styling = getRankStyling(user.rank)
            
            return (
              <motion.div
                key={user.id}
                className={`relative group transition-all duration-500 border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${styling.glowClass}`}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.7 + index * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
                onHoverStart={() => setHoveredUser(user.id)}
                onHoverEnd={() => setHoveredUser(null)}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                
                <motion.div
                  className={`bg-gradient-to-r ${styling.bgGradient} border-l-4 ${styling.borderColor} px-6 py-6`}
                  animate={{
                    backgroundColor: hoveredUser === user.id ? 
                      'rgba(255, 255, 255, 0.9)' : 
                      'rgba(255, 255, 255, 0.7)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank Section */}
                    <motion.div
                      className="flex-shrink-0 text-center min-w-[80px]"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="relative">
                        <motion.div
                          className={`text-3xl font-black ${styling.textColor} mb-2`}
                          animate={user.rank <= 3 ? {
                            textShadow: [
                              "0 0 10px rgba(251, 191, 36, 0.5)",
                              "0 0 20px rgba(251, 191, 36, 0.8)",
                              "0 0 10px rgba(251, 191, 36, 0.5)"
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {user.rank}
                        </motion.div>
                        <div className="flex items-center justify-center gap-1">
                          {getRankIcon(user.rank)}
                          {getRankChangeIndicator(user.rank, user.previousRank)}
                        </div>
                        
                        {user.rank <= 3 && (
                          <motion.div
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Sparkles className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Avatar and Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <motion.div
                        className="relative flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className={`w-16 h-16 rounded-full overflow-hidden border-3 ${
                          user.rank <= 3 ? 'border-amber-400' : 
                          user.rank <= 10 ? 'border-blue-400' : 'border-slate-300 dark:border-slate-600'
                        } shadow-lg`}>
                          <Image
                            src={user.avatar || '/avatars/default.jpg'}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {user.rank <= 3 && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 180, 360]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                          >
                            <Star className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <motion.div
                          className="text-xl font-bold text-slate-900 dark:text-white mb-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                        >
                          {user.name}
                        </motion.div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {user.department}
                        </div>
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.05 }}
                        >
                          {user.badges.slice(0, 4).map((badge, i) => (
                            <motion.span
                              key={i}
                              className="text-lg"
                              whileHover={{ scale: 1.3, rotate: 15 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              {badge}
                            </motion.span>
                          ))}
                          {user.badges.length > 4 && (
                            <motion.span
                              className="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full"
                              whileHover={{ scale: 1.1 }}
                            >
                              +{user.badges.length - 4}
                            </motion.span>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {/* Score Section */}
                    <motion.div
                      className="text-center min-w-[120px]"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="text-3xl font-black text-slate-900 dark:text-white mb-1"
                        animate={user.rank <= 10 ? {
                          scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {user.score.toLocaleString()}
                      </motion.div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        XP
                      </div>
                    </motion.div>

                    {/* Activity Section */}
                    <div className="flex items-center gap-6 min-w-[200px]">
                      <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 360]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Award className="h-5 w-5 text-purple-500" />
                        </motion.div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {user.achievements}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            achievements
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Flame className={`h-5 w-5 ${
                            user.streak > 7 ? 'text-orange-500' : 
                            user.streak > 3 ? 'text-amber-500' : 'text-slate-400'
                          }`} />
                        </motion.div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {user.streak}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            day streak
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 15 }}
                      >
                        {getTrendIndicator(user.trend)}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 px-8 py-6 text-center border-t border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Target className="h-5 w-5 text-slate-500" />
          </motion.div>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Showing {displayUsers.length} of {users.length} competitors
          </span>
          <motion.div
            className="w-2 h-2 bg-emerald-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}