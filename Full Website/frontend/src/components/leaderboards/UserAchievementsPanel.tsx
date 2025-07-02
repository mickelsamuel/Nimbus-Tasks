'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Star, 
  ChevronRight,
  Sparkles,
  Clock,
  TrendingUp,
  Crown
} from 'lucide-react'
import { api } from '@/lib/api/client'

interface Achievement {
  id: string
  title: string
  description: string
  category: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  icon: string
  unlockedAt: Date
  points: number
  isRecent?: boolean
}

interface Badge {
  id: string
  name: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  earnedAt: Date
  category: string
}

interface UserAchievementsPanelProps {
  userId?: number
  className?: string
}

const getRarityConfig = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return {
        gradient: 'from-yellow-400 via-amber-500 to-orange-600',
        glow: 'shadow-2xl shadow-yellow-500/50',
        border: 'border-yellow-400/50',
        text: 'text-yellow-900 dark:text-yellow-100',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        icon: '👑'
      }
    case 'epic':
      return {
        gradient: 'from-purple-400 via-violet-500 to-indigo-600',
        glow: 'shadow-2xl shadow-purple-500/50',
        border: 'border-purple-400/50',
        text: 'text-purple-900 dark:text-purple-100',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        icon: '💎'
      }
    case 'rare':
      return {
        gradient: 'from-blue-400 via-cyan-500 to-teal-600',
        glow: 'shadow-xl shadow-blue-500/40',
        border: 'border-blue-400/50',
        text: 'text-blue-900 dark:text-blue-100',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: '💠'
      }
    case 'uncommon':
      return {
        gradient: 'from-green-400 via-emerald-500 to-teal-600',
        glow: 'shadow-lg shadow-green-500/30',
        border: 'border-green-400/50',
        text: 'text-green-900 dark:text-green-100',
        bg: 'bg-green-50 dark:bg-green-900/20',
        icon: '🌟'
      }
    default:
      return {
        gradient: 'from-slate-400 via-gray-500 to-slate-600',
        glow: 'shadow-md shadow-slate-500/20',
        border: 'border-slate-400/50',
        text: 'text-slate-900 dark:text-slate-100',
        bg: 'bg-slate-50 dark:bg-slate-900/20',
        icon: '⚪'
      }
  }
}



export default function UserAchievementsPanel({ 
  userId,
  className = ''
}: UserAchievementsPanelProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null)
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  useEffect(() => {
    // Fetch user achievements and badges
    const fetchData = async () => {
      try {
        // Fetch actual data from API
        const [achievementsResponse, badgesResponse] = await Promise.allSettled([
          api.get('/user/achievements'),
          api.get('/user/badges')
        ])
        
        // Handle achievements
        if (achievementsResponse.status === 'fulfilled') {
          setAchievements(achievementsResponse.value.data?.achievements || [])
        } else {
          console.error('Failed to fetch achievements')
          setAchievements([])
        }
        
        // Handle badges
        if (badgesResponse.status === 'fulfilled') {
          setBadges(badgesResponse.value.data?.badges || [])
        } else {
          console.error('Failed to fetch badges')
          setBadges([])
        }
      } catch (error) {
        console.error('Error fetching user achievements:', error)
        setAchievements([])
        setBadges([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  if (loading) {
    return (
      <motion.div 
        className={`relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
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
                    delay: i * 0.2
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
      </div>

      {/* Latest Achievements Section */}
      <div className="relative z-10 p-8 border-b border-slate-200 dark:border-slate-700">
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
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
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Latest Achievements
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Your recent victories
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-700"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-700 dark:text-amber-300 font-semibold text-sm">
              {achievements.length} recent
            </span>
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence>
            {achievements.slice(0, 3).map((achievement, index) => {
              const rarityConfig = getRarityConfig(achievement.rarity)
              
              return (
                <motion.div
                  key={achievement.id}
                  className={`group relative overflow-hidden rounded-2xl ${rarityConfig.glow} transition-all duration-500`}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.6 + index * 0.1,
                    type: "spring",
                    stiffness: 200 
                  }}
                  onHoverStart={() => setHoveredAchievement(achievement.id)}
                  onHoverEnd={() => setHoveredAchievement(null)}
                  whileHover={{ 
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Rarity Border */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${rarityConfig.gradient} p-0.5 rounded-2xl`}>
                    <div className={`bg-white dark:bg-slate-800 rounded-2xl h-full ${rarityConfig.bg}`} />
                  </div>

                  {/* Achievement Content */}
                  <div className="relative p-6">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`relative flex-shrink-0 w-16 h-16 bg-gradient-to-br ${rarityConfig.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
                        animate={hoveredAchievement === achievement.id ? {
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {achievement.icon}
                        
                        {achievement.rarity === 'legendary' && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Crown className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`text-lg font-bold truncate ${rarityConfig.text}`}>
                            {achievement.title}
                          </h4>
                          {achievement.isRecent && (
                            <motion.span
                              className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full"
                              animate={{
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  "0 0 0 0 rgba(16, 185, 129, 0.7)",
                                  "0 0 0 8px rgba(16, 185, 129, 0)",
                                  "0 0 0 0 rgba(16, 185, 129, 0.7)"
                                ]
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              NEW
                            </motion.span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                              {achievement.points} XP
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-500 dark:text-slate-400">
                              {formatTimeAgo(achievement.unlockedAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{rarityConfig.icon}</span>
                            <span className={`font-medium capitalize ${rarityConfig.text}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {achievements.length > 3 && (
          <motion.button
            className="w-full mt-6 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('Navigating to achievements page...')
              window.location.href = '/achievements'
            }}
          >
            <span className="font-medium">View all achievements</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>

      {/* Recent Badges Section */}
      <div className="relative z-10 p-8">
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl"
            animate={{
              rotate: [0, -5, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Medal className="h-8 w-8 text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Recent Badges
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Collected rewards
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-700 dark:text-purple-300 font-semibold text-sm">
              {badges.length} earned
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <AnimatePresence>
            {badges.slice(0, 6).map((badge, index) => {
              const rarityConfig = getRarityConfig(badge.rarity)
              
              return (
                <motion.div
                  key={badge.id}
                  className={`group relative cursor-pointer ${rarityConfig.glow} transition-all duration-300`}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.1 + index * 0.1,
                    type: "spring",
                    stiffness: 200 
                  }}
                  onHoverStart={() => setHoveredBadge(badge.id)}
                  onHoverEnd={() => setHoveredBadge(null)}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                  title={`${badge.name} - ${badge.category}`}
                >
                  {/* Badge Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.gradient} rounded-2xl p-0.5`}>
                    <div className={`bg-white dark:bg-slate-800 rounded-2xl h-full ${rarityConfig.bg}`} />
                  </div>

                  {/* Badge Content */}
                  <div className="relative p-4 text-center">
                    <motion.div
                      className="text-3xl mb-3"
                      animate={hoveredBadge === badge.id ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0]
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      {badge.icon}
                    </motion.div>
                    <div className={`text-sm font-bold truncate mb-1 ${rarityConfig.text}`}>
                      {badge.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {formatTimeAgo(badge.earnedAt)}
                    </div>
                    <div className="text-xs">
                      <span className="text-lg">{rarityConfig.icon}</span>
                    </div>
                  </div>

                  {/* Legendary Badge Crown */}
                  {badge.rarity === 'legendary' && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Crown className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {badges.length > 6 && (
          <motion.button
            className="w-full mt-6 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('Navigating to badges page...')
              window.location.href = '/achievements?tab=badges'
            }}
          >
            <span className="font-medium">View all badges</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}