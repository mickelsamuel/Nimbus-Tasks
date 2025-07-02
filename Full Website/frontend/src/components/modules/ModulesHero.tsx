'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, TrendingUp, Award, Zap, 
  Calendar, Clock, ChevronRight, Sparkles,
  BarChart3, Star
} from 'lucide-react'

interface ModulesHeroProps {
  progress: number
  stats: {
    streak: number
    weeklyXP: number
    level: string
    modulesToNext: number
  }
}

export default function ModulesHero({ progress, stats }: ModulesHeroProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const formatTime = () => {
    if (!mounted) return '--:--'
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = () => {
    if (!mounted) return ''
    return currentTime.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const progressRadius = 45
  const progressCircumference = 2 * Math.PI * progressRadius
  const progressOffset = progressCircumference - (progress / 100) * progressCircumference

  return (
    <div className="relative overflow-hidden">
      {/* Main Hero Card */}
      <div className="dashboard-card rounded-3xl p-8 lg:p-10 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />
        
        {/* Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Section - Welcome & Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header with Time */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate()}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{formatTime()}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Learning in Progress</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
                  🚀 Your Learning
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Universe</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  ✨ Accelerate your professional development with our comprehensive training modules designed for the future
                </p>
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{progress}%</span>
                  </div>
                  <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold">
                    You&apos;re {progress}% through your <span className="font-bold">{stats.level}</span> certification track
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid - Reduced animations for performance */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Streak */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-5 border border-orange-200 dark:border-orange-800/50 group hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-500 rounded-lg group-hover:rotate-6 transition-transform duration-200">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.streak}
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">
                      Day Streak
                    </div>
                  </div>
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  {stats.streak} consecutive days
                </div>
              </div>

              {/* Weekly XP */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800/50 group hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500 rounded-lg group-hover:rotate-6 transition-transform duration-200">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      +{stats.weeklyXP}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Weekly XP
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  +{stats.weeklyXP} XP this week
                </div>
              </div>

              {/* Current Level */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800/50 group hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500 rounded-lg group-hover:rotate-6 transition-transform duration-200">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {stats.level}
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      Current Level
                    </div>
                  </div>
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  {stats.modulesToNext} modules to next level
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800/50 group hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500 rounded-lg group-hover:rotate-6 transition-transform duration-200">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {progress}%
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Overall Progress
                    </div>
                  </div>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Achievement Banner */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500 rounded-xl animate-pulse">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      🎉 {stats.weeklyXP > 500 ? 'Achievement Unlocked!' : stats.weeklyXP > 0 ? 'Great Progress!' : 'Welcome!'}
                    </p>
                    <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                      {stats.weeklyXP > 1000 ? 'High Achiever' : stats.weeklyXP > 500 ? 'Progress Master' : stats.weeklyXP > 0 ? 'Learning Champion' : 'Getting Started'}
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {stats.weeklyXP > 0 ? `+${Math.floor(stats.weeklyXP / 10)} XP bonus awarded` : 'Complete modules to earn XP'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Right Section - Progress Ring & Actions */}
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Large Progress Ring */}
            <div className="relative">
              <div className="w-56 h-56 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={progressRadius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={progressRadius}
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: progressCircumference,
                      strokeDashoffset: progressOffset,
                      transition: 'stroke-dashoffset 2s ease-in-out'
                    }}
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#E01A1A" />
                      <stop offset="25%" stopColor="#FF6B6B" />
                      <stop offset="50%" stopColor="#FF9800" />
                      <stop offset="75%" stopColor="#4CAF50" />
                      <stop offset="100%" stopColor="#2196F3" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {progress}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Complete
                    </div>
                    <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Expert Track</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating indicators */}
              <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                On Track!
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="text-center space-y-4">
              <button className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Continue Learning</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {progress > 0 ? `${Math.ceil((100 - progress) / 10)} modules remaining • ${stats.modulesToNext} to next level` : 'Start your learning journey today'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}