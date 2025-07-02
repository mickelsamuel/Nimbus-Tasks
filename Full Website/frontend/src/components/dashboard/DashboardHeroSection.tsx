'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, Calendar, Award,
  Clock, ChevronRight, Activity,
  Crown, Flame, Gem, Rocket, Gift,
  Star, Target
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

export const DashboardHeroSection = React.memo(function DashboardHeroSection({ welcomeData, stats }: DashboardHeroSectionProps) {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [selectedStat, setSelectedStat] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Reduce timer frequency to improve performance
    const timer = setInterval(() => setCurrentTime(new Date()), 60000) // Update every minute instead of every second
    return () => clearInterval(timer)
  }, [])
  
  // Memoize expensive calculations
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
  
  const handleStatClick = useCallback((statId: string) => {
    setSelectedStat(prev => prev === statId ? null : statId)
  }, [])

  const timeOfDay = useMemo(() => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }, [currentTime])

  const statCards = [
    {
      id: 'streak',
      icon: Flame,
      label: 'Day Streak',
      value: stats.streak,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      glowColor: 'shadow-orange-500/25',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30',
      iconBg: 'from-orange-400 to-red-500',
      textColor: 'text-orange-700 dark:text-orange-300',
      subtitle: stats.streak > 7 ? 'On Fire! 🔥' : 'Keep Going!',
      sparkles: true
    },
    {
      id: 'level',
      icon: Crown,
      label: 'Current Level',
      value: stats.level,
      gradient: 'from-yellow-400 via-amber-500 to-orange-500',
      glowColor: 'shadow-yellow-500/25',
      bgGradient: 'from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30',
      iconBg: 'from-yellow-400 to-amber-500',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      subtitle: 'Elite Status'
    },
    {
      id: 'xp',
      icon: Gem,
      label: 'XP Earned',
      value: stats.xpEarned,
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      glowColor: 'shadow-purple-500/25',
      bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30',
      iconBg: 'from-purple-400 to-indigo-500',
      textColor: 'text-purple-700 dark:text-purple-300',
      subtitle: 'Experience'
    },
    {
      id: 'progress',
      icon: Rocket,
      label: 'Weekly Progress',
      value: `${stats.weeklyProgress}%`,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      glowColor: 'shadow-emerald-500/25',
      bgGradient: 'from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/30',
      iconBg: 'from-emerald-400 to-cyan-500',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      subtitle: stats.weeklyProgress >= 80 ? 'Excellent!' : 'Good Pace'
    }
  ]

  if (!mounted) {
    return (
      <div className="dashboard-card p-8 animate-pulse">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="relative rounded-3xl overflow-hidden scroll-safe-animations">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-indigo-50/80 dark:from-slate-950/80 dark:via-slate-900/60 dark:to-indigo-950/80 rounded-3xl" />
        
        {/* Simplified animated background - reduced particle count for performance */}
        <motion.div 
          animate={{ 
            background: [
              'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.10) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.10) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.10) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-3xl"
          style={{ animationPlayState: 'running' }}
        />

        {/* Reduced Floating Particles for better performance */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full w-2 h-2 bg-blue-400 opacity-30"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
              animationPlayState: 'running'
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-6 lg:p-10 rounded-3xl"
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Welcome & Time */}
            <div className="xl:col-span-2 space-y-8">
              {/* Enhanced Welcome Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Time & Date - Optimized */}
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
                
                {/* Greeting */}
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
                      <motion.span
                        animate={{ 
                          rotate: [0, 20, -20, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="text-yellow-500 text-4xl lg:text-5xl xl:text-6xl flex-shrink-0"
                      >
                        👋
                      </motion.span>
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

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.1 * index, 
                        type: 'spring',
                        stiffness: 200,
                        damping: 20
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                        transition: { type: 'spring', stiffness: 400, damping: 20 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative group cursor-pointer overflow-hidden
                        rounded-2xl border border-white/30 dark:border-gray-700/50
                        bg-gradient-to-br ${stat.bgGradient}
                        p-4 lg:p-6 transition-all duration-700
                        hover:shadow-2xl hover:${stat.glowColor}
                        ${selectedStat === stat.id ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''}
                        min-h-[140px] lg:min-h-[160px]
                      `}
                      onClick={() => handleStatClick(stat.id)}
                    >
                      {/* Animated Background Overlay */}
                      <motion.div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background: `linear-gradient(135deg, ${stat.gradient.replace(/from-|via-|to-/g, '').split(' ').join(', ')})`,
                          opacity: 0.1
                        }}
                      />
                      
                      {/* Enhanced Shimmer Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <motion.div 
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                          className="h-full w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 blur-sm"
                        />
                      </div>

                      {/* Optimized Sparkle Effects for Streak - Reduced count for performance */}
                      {stat.sparkles && Array.from({ length: 2 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                          style={{
                            left: `${25 + Math.random() * 50}%`,
                            top: `${25 + Math.random() * 50}%`,
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            rotate: [0, 180, 360]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                        />
                      ))}

                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-3 lg:mb-4">
                          <motion.div 
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className={`p-2 lg:p-3 rounded-xl bg-gradient-to-r ${stat.iconBg} shadow-lg group-hover:shadow-xl flex-shrink-0`}
                          >
                            <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                          </motion.div>
                          <motion.div 
                            animate={{ 
                              opacity: [0.6, 1, 0.6],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            className="w-2 h-2 bg-green-400 rounded-full shadow-lg flex-shrink-0"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <motion.p 
                            key={stat.value}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className={`text-2xl lg:text-3xl font-black ${stat.textColor} leading-none`}
                          >
                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                          </motion.p>
                          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                            {stat.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                            {stat.subtitle}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Enhanced Progress Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-200/60 dark:border-blue-700/60 p-4 lg:p-6 cursor-pointer backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <motion.div 
                      whileHover={{ rotate: 180, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl flex-shrink-0"
                    >
                      <Target className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.completedModules} of {stats.assignedModules} Modules Complete
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Activity className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{stats.inProgressModules} modules in progress</span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="group-hover:scale-110 transition-transform flex-shrink-0"
                  >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Achievement Banner */}
              {welcomeData.achievements.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-50/80 via-amber-50/80 to-orange-50/80 dark:from-yellow-900/40 dark:via-amber-900/40 dark:to-orange-900/40 border border-yellow-200/60 dark:border-yellow-700/60 p-4 lg:p-6 backdrop-blur-sm"
                >
                  {/* Celebration Particles */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: Math.random() * 6 + 2,
                        height: Math.random() * 6 + 2,
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        background: `linear-gradient(45deg, #fbbf24, #f59e0b)`
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.4, 1, 0.4],
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 3 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                  
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <motion.div 
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="p-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl shadow-lg group-hover:shadow-xl flex-shrink-0"
                    >
                      <Award className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          Latest Achievement
                        </p>
                        <motion.div
                          animate={{ 
                            rotate: [0, 20, -20, 0],
                            scale: [1, 1.3, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
                        </motion.div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 font-semibold text-base lg:text-lg break-words">
                        {welcomeData.achievements[0]}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Gift className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-700 dark:text-amber-300 font-semibold">
                          Achievement Unlocked!
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Enhanced Avatar */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-1 flex flex-col items-center justify-center space-y-6 lg:space-y-8"
            >
              {/* Revolutionary 3D Avatar */}
              <div className="relative flex justify-center">
                <motion.div 
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 10,
                    rotateX: 5
                  }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="perspective-1000 preserve-3d"
                >
                  <div className="relative w-40 h-40 lg:w-48 lg:h-48">
                    {/* Animated Orbital Rings */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-2 opacity-30"
                        style={{
                          borderColor: ['#60a5fa', '#a78bfa', '#34d399'][i],
                          transform: `scale(${1 + i * 0.15})`,
                          animationPlayState: 'running'
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 10 + i * 5,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                      />
                    ))}
                    
                    {/* Main Avatar Container */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1.5 shadow-2xl"
                      style={{ animationPlayState: 'running' }}
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
                              <motion.div
                                animate={{ 
                                  rotate: [0, 180, 360],
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                style={{ animationPlayState: 'running' }}
                              >
                                <Sparkles className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 dark:text-gray-500" />
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Enhanced Level Badge */}
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="absolute -bottom-2 -right-2 z-30"
                    >
                      <div className="px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black rounded-2xl shadow-xl border-4 border-white dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="text-sm lg:text-base">Lv. {stats.level}</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Enhanced Online Status */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 1, 0.8],
                        boxShadow: [
                          '0 0 10px rgba(34, 197, 94, 0.5)',
                          '0 0 20px rgba(34, 197, 94, 0.8)',
                          '0 0 10px rgba(34, 197, 94, 0.5)'
                        ]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-green-400 border-4 border-white dark:border-slate-800 rounded-full shadow-lg z-30"
                    />

                    {/* Floating Achievement Icons */}
                    {Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${Math.cos((i * Math.PI) / 2) * 80 + 50}%`,
                          top: `${Math.sin((i * Math.PI) / 2) * 80 + 50}%`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                      >
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg flex items-center justify-center">
                          {[Star, Gem, Award, Rocket][i % 4] && React.createElement([Star, Gem, Award, Rocket][i % 4], { 
                            className: "w-3 h-3 lg:w-4 lg:h-4 text-white" 
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Enhanced User Info */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center space-y-4 max-w-sm"
              >
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent break-words">
                  {user?.firstName} {user?.lastName}
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50">
                  <Star className="w-3 h-3 lg:w-4 lg:h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span className="text-xs lg:text-sm text-indigo-700 dark:text-indigo-300 font-bold capitalize">
                    Elite Learner
                  </span>
                </div>
              </motion.div>

              {/* Revolutionary Level Progress */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="w-full max-w-sm space-y-4"
              >
                <div className="flex justify-between text-xs lg:text-sm font-bold text-gray-700 dark:text-gray-200">
                  <span>Level {stats.level}</span>
                  <span>Level {stats.level + 1}</span>
                </div>
                
                <div className="relative">
                  <div className="w-full h-4 lg:h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.nextLevelProgress}%` }}
                      transition={{ duration: 2.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-full relative overflow-hidden shadow-lg"
                    >
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      />
                      <motion.div 
                        animate={{ 
                          background: [
                            'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f97316)',
                            'linear-gradient(90deg, #8b5cf6, #ec4899, #f97316, #3b82f6)',
                            'linear-gradient(90deg, #ec4899, #f97316, #3b82f6, #8b5cf6)',
                            'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f97316)'
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 opacity-80"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Floating Progress Indicator */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                      y: [0, -2, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-8 lg:-top-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs lg:text-sm font-bold px-2 py-1 lg:px-3 lg:py-1.5 rounded-full shadow-xl border-2 border-white dark:border-slate-800"
                    style={{ left: `${Math.min(stats.nextLevelProgress, 80)}%`, transform: 'translateX(-50%)' }}
                  >
                    {stats.nextLevelProgress}%
                  </motion.div>
                </div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-semibold"
                >
                  {100 - stats.nextLevelProgress}% to next level
                </motion.p>
              </motion.div>

              {/* Quick Stats Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-center space-y-3 p-4 lg:p-6 bg-gradient-to-r from-slate-50/80 to-gray-50/80 dark:from-slate-800/80 dark:to-gray-800/80 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 w-full max-w-sm"
              >
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">
                  Modules Completed
                </p>
                <motion.p 
                  key={stats.completedModules}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                >
                  {stats.completedModules}/{stats.assignedModules}
                </motion.p>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  assigned modules
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
})