'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, Calendar,
  Clock, Crown, Star, Gem
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import UserAvatar from '@/components/ui/UserAvatar'
import type { DashboardStats } from '@/types/dashboard'

interface DashboardHeroSectionProps {
  welcomeData: {
    greeting: string
    motivationalMessage: string
    weatherAware: boolean
    achievements: string[]
  }
  stats: DashboardStats
}


export function DashboardHeroSectionFixed({ welcomeData, stats }: DashboardHeroSectionProps) {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [selectedStat] = useState<string | null>(null)
  
  // Prevent ESLint warning for unused variable
  void selectedStat;

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])
  
  const timeFormatted = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }, [currentTime])
  
  const dateFormatted = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }, [currentTime])
  
  const timeOfDay = useMemo(() => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }, [currentTime])
  

  if (!mounted) {
    return (
      <div className="dashboard-card p-8">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative rounded-3xl overflow-hidden">
      {/* Simplified background with JavaScript animations */}
      <div className="absolute inset-0 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-indigo-50/80 dark:from-slate-950/80 dark:via-slate-900/60 dark:to-indigo-950/80 rounded-3xl" />
        
        {/* Static background gradient */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 60%)`,
            opacity: 0.8
          }}
        />

        {/* Static particles */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full w-1.5 h-1.5 bg-blue-400 opacity-20"
            style={{
              left: `${25 + (i * 20)}%`,
              top: `${25 + (i * 15)}%`
            }}
          />
        ))}
      </div>
      
      <div className="relative">
        <div className="relative border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-6 lg:p-10 rounded-3xl">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Welcome & Time */}
            <div className="xl:col-span-2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                    <span className="text-gray-700 dark:text-gray-200 font-semibold text-base lg:text-lg">
                      {timeFormatted}
                    </span>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium text-sm lg:text-base">
                      {dateFormatted}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight"
                  >
                    <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                      {timeOfDay},
                    </span>
                    <br />
                    <span className="inline-flex items-center gap-2 lg:gap-4 flex-wrap">
                      <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        {user?.firstName || 'Champion'}!
                      </span>
                      <span className="text-yellow-500 text-4xl lg:text-5xl xl:text-6xl flex-shrink-0 animate-wave">
                        👋
                      </span>
                    </span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed font-medium"
                  >
                    {welcomeData.motivationalMessage || "Ready to continue your extraordinary learning journey? Let's make today legendary!"}
                  </motion.p>
                </div>
              </motion.div>

              {/* Simple stats display */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
                  <div className="text-sm text-gray-500">Day Streak</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">Level {stats.level}</div>
                  <div className="text-sm text-gray-500">Current Level</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.pointsEarned}</div>
                  <div className="text-sm text-gray-500">XP Earned</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stats.weeklyProgress}%</div>
                  <div className="text-sm text-gray-500">Progress</div>
                </div>
              </div>
            </div>

            {/* Right Column - Enhanced Avatar with JavaScript animations */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-1 flex flex-col items-center justify-center space-y-6 lg:space-y-8"
            >
              <div className="relative flex justify-center">
                <div className="relative w-40 h-40 lg:w-48 lg:h-48">
                  {/* Static orbital rings */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 opacity-20"
                      style={{
                        borderColor: ['#60a5fa', '#a78bfa', '#34d399'][i],
                        transform: `scale(${1 + i * 0.15})`
                      }}
                    />
                  ))}
                  
                  {/* Main Avatar Container - no rotation */}
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1.5 shadow-2xl"
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-1">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-inner">
                        {user ? (
                          <UserAvatar 
                            user={user}
                            size="full"
                            className="w-full h-full object-cover"
                            fallbackType="initials"
                            useApiAvatar={true}
                            preferPortrait={true}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                            <Sparkles className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Level Badge */}
                  <div className="absolute -bottom-2 -right-2 z-30">
                    <div className="px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black rounded-2xl shadow-xl border-4 border-white dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="text-sm lg:text-base">Lv. {stats.level}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Static status indicator */}
                  <div 
                    className="absolute -top-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-green-400 border-4 border-white dark:border-slate-800 rounded-full shadow-lg z-30"
                  />

                  {/* Static achievement indicators */}
                  <div 
                    className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 rounded-lg shadow-lg flex items-center justify-center"
                  >
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  <div 
                    className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-lg shadow-lg flex items-center justify-center"
                  >
                    <Gem className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center space-y-4 max-w-sm">
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent break-words">
                  {user?.firstName} {user?.lastName}
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50">
                  <Star className="w-3 h-3 lg:w-4 lg:h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span className="text-xs lg:text-sm text-indigo-700 dark:text-indigo-300 font-bold capitalize">
                    Elite Learner
                  </span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-between text-xs lg:text-sm font-bold text-gray-700 dark:text-gray-200">
                  <span>Level {stats.level}</span>
                  <span>Level {stats.level + 1}</span>
                </div>
                
                <div className="relative">
                  <div className="w-full h-4 lg:h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-full relative overflow-hidden shadow-lg transition-all duration-1000"
                      style={{ width: `${stats.nextLevelProgress}%` }}
                    />
                  </div>
                  
                  <div 
                    className="absolute -top-8 lg:-top-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs lg:text-sm font-bold px-2 py-1 lg:px-3 lg:py-1.5 rounded-full shadow-xl border-2 border-white dark:border-slate-800"
                    style={{ 
                      left: `${Math.min(stats.nextLevelProgress, 80)}%`, 
                      transform: 'translateX(-50%)',
                      scale: 1
                    }}
                  >
                    {stats.nextLevelProgress}%
                  </div>
                </div>
                
                <p className="text-center text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-semibold">
                  {100 - stats.nextLevelProgress}% to next level
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}