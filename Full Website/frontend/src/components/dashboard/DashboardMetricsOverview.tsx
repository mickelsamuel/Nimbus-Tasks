'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, ArrowRight, Zap, Trophy,
  Sparkles,
  Award, Crown, Target
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics'
import type { DashboardStats } from '@/types/dashboard'

interface DashboardMetricsOverviewProps {
  stats: DashboardStats
}

interface MetricData {
  id: string
  label: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  color: string
  bgGradient: string
  iconBg: string
  textColor: string
  glowColor: string
  format?: 'number' | 'percentage'
  suffix?: string
  subtitle?: string
  trendData?: number[]
}

export const DashboardMetricsOverview = React.memo(function DashboardMetricsOverview({ stats }: DashboardMetricsOverviewProps) {
  const router = useRouter()
  const { trends } = useDashboardMetrics()
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Enhanced animation for numbers
    const animateValue = (key: string, endValue: number, duration: number = 2000) => {
      const startTime = Date.now()
      const startValue = 0
      
      const animate = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Enhanced easing function for smoother animation
        const easeOutElastic = (t: number) => {
          const c4 = (2 * Math.PI) / 3
          return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
        }
        
        const currentValue = startValue + (endValue - startValue) * easeOutElastic(progress)
        
        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.floor(currentValue)
        }))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }

    // Staggered animations
    setTimeout(() => animateValue('completed', stats.completedModules, 1500), 200)
    setTimeout(() => animateValue('inProgress', stats.inProgressModules, 1700), 400)
    setTimeout(() => animateValue('streak', stats.streak, 1900), 600)
    setTimeout(() => animateValue('performance', stats.weeklyProgress, 2100), 800)
  }, [stats])

  const metrics: MetricData[] = [
    {
      id: 'completed',
      label: 'Modules Completed',
      value: animatedValues.completed || 0,
      change: stats.completedModules > 0 ? Math.min(25, Math.max(5, stats.completedModules * 2)) : 0,
      changeType: (stats.completedModules > 0 ? 'increase' : 'neutral') as 'increase' | 'decrease' | 'neutral',
      icon: <Trophy className="w-5 h-5 lg:w-6 lg:h-6" />,
      color: 'text-emerald-700 dark:text-emerald-300',
      bgGradient: 'from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/30',
      iconBg: 'from-emerald-500 to-green-600',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      glowColor: 'shadow-emerald-500/25',
      subtitle: 'Learning mastered',
      trendData: trends?.completedModules || [0, 0, 0, 0, 0, 0, 0]
    },
    {
      id: 'inProgress',
      label: 'Active Learning',
      value: animatedValues.inProgress || 0,
      change: stats.inProgressModules > 0 ? Math.min(15, Math.max(3, stats.inProgressModules * 3)) : 0,
      changeType: (stats.inProgressModules > 0 ? 'increase' : 'neutral') as 'increase' | 'decrease' | 'neutral',
      icon: <Target className="w-5 h-5 lg:w-6 lg:h-6" />,
      color: 'text-blue-700 dark:text-blue-300',
      bgGradient: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30',
      iconBg: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-700 dark:text-blue-300',
      glowColor: 'shadow-blue-500/25',
      subtitle: 'Currently studying',
      trendData: trends?.inProgressModules || [0, 0, 0, 0, 0, 0, 0]
    },
    {
      id: 'streak',
      label: 'Learning Streak',
      value: animatedValues.streak || 0,
      change: stats.streak > 0 ? Math.min(30, Math.max(5, stats.streak * 2)) : 0,
      changeType: (stats.streak > 0 ? 'increase' : 'neutral') as 'increase' | 'decrease' | 'neutral',
      icon: <Zap className="w-5 h-5 lg:w-6 lg:h-6" />,
      color: 'text-orange-700 dark:text-orange-300',
      bgGradient: 'from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-yellow-900/30',
      iconBg: 'from-orange-500 to-amber-600',
      textColor: 'text-orange-700 dark:text-orange-300',
      glowColor: 'shadow-orange-500/25',
      suffix: ' days',
      subtitle: stats.streak > 7 ? 'On fire! 🔥' : 'Keep going!',
      trendData: trends?.streak || [0, 0, 0, 0, 0, 0, 0]
    },
    {
      id: 'performance',
      label: 'Weekly Performance',
      value: animatedValues.performance || 0,
      change: stats.weeklyProgress > 0 ? Math.min(20, Math.max(5, Math.floor(stats.weeklyProgress / 5))) : 0,
      changeType: (stats.weeklyProgress > 0 ? 'increase' : 'neutral') as 'increase' | 'decrease' | 'neutral',
      icon: <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" />,
      color: 'text-purple-700 dark:text-purple-300',
      bgGradient: 'from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/30 dark:via-violet-900/20 dark:to-indigo-900/30',
      iconBg: 'from-purple-500 to-violet-600',
      textColor: 'text-purple-700 dark:text-purple-300',
      glowColor: 'shadow-purple-500/25',
      suffix: '%',
      subtitle: 'Excellent progress',
      trendData: trends?.weeklyProgress || [0, 0, 0, 0, 0, 0, 0]
    }
  ]

  const getChangeColor = (changeType: string) => {
    if (changeType === 'increase') return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    if (changeType === 'decrease') return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
    return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30'
  }

  const handleViewDetails = (metricId: string) => {
    switch(metricId) {
      case 'completed':
        router.push('/modules?filter=completed')
        break
      case 'inProgress':
        router.push('/modules?filter=in-progress')
        break
      case 'streak':
        router.push('/achievements')
        break
      case 'performance':
        router.push('/leaderboards')
        break
      default:
        router.push('/dashboard')
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dashboard-card p-6 rounded-2xl animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Enhanced Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg flex-shrink-0"
            >
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              Performance Metrics
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl">
            Track your learning journey with real-time insights and detailed analytics
          </p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center gap-2 dashboard-card p-3 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-200">Analytics</span>
        </motion.button>
      </motion.div>

      {/* Revolutionary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.15, 
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.02,
              y: -8,
              transition: { type: 'spring', stiffness: 400, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredMetric(metric.id)}
            onHoverEnd={() => setHoveredMetric(null)}
            className={`
              relative group cursor-pointer overflow-hidden
              rounded-2xl border border-white/50 dark:border-gray-700/50
              bg-gradient-to-br ${metric.bgGradient}
              p-4 lg:p-6 transition-all duration-700
              hover:shadow-2xl hover:${metric.glowColor}
              ${selectedMetric === metric.id ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''}
              min-h-[200px] lg:min-h-[240px]
            `}
            onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
          >
            {/* Animated Background Effects */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `linear-gradient(135deg, ${metric.iconBg.replace('from-', '').replace('to-', ', ')})`,
                opacity: 0.05
              }}
            />
            
            {/* Enhanced Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="h-full w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 blur-sm"
              />
            </div>

            {/* Optimized Floating Particles - Reduced count for performance */}
            {hoveredMetric === metric.id && Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${30 + i * 15}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}

            <div className="relative z-10 h-full flex flex-col">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className={`p-3 rounded-xl bg-gradient-to-r ${metric.iconBg} shadow-lg group-hover:shadow-xl flex-shrink-0`}
                >
                  <div className="text-white">
                    {metric.icon}
                  </div>
                </motion.div>
                
                <div className="flex items-center gap-2">
                  {/* Change Indicator */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${getChangeColor(metric.changeType)} flex-shrink-0`}
                  >
                    <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                    <span>+{metric.change}%</span>
                  </motion.div>
                  
                  {/* Status Indicator */}
                  <motion.div 
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full shadow-lg flex-shrink-0"
                  />
                </div>
              </div>

              {/* Main Value */}
              <div className="space-y-3 flex-1">
                <motion.div 
                  key={metric.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex items-baseline gap-1"
                >
                  <span className={`text-3xl sm:text-4xl lg:text-5xl font-black ${metric.textColor} leading-none`}>
                    {metric.value.toLocaleString()}
                  </span>
                  {metric.suffix && (
                    <span className={`text-lg sm:text-xl font-bold ${metric.textColor} opacity-80`}>
                      {metric.suffix}
                    </span>
                  )}
                </motion.div>
                
                <div className="space-y-2">
                  <p className="text-xs lg:text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {metric.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    {metric.subtitle}
                  </p>
                </div>
              </div>

              {/* Mini Trend Chart */}
              {metric.trendData && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">7-day trend</span>
                    <span className={`font-semibold ${metric.change > 0 ? 'text-green-600 dark:text-green-400' : metric.change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>\n                      {metric.change > 0 ? '↗ Growing' : metric.change < 0 ? '↘ Declining' : '→ Stable'}\n                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-8">
                    {metric.trendData.map((value, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(4, Math.min(100, isNaN(value) || !metric.trendData || metric.trendData.length === 0 ? 4 : (value / Math.max(...metric.trendData, 1)) * 100))}%` }}
                        transition={{ delay: index * 0.1 + i * 0.05, duration: 0.5 }}
                        className={`flex-1 bg-gradient-to-t ${metric.iconBg} rounded-sm opacity-60 hover:opacity-100 transition-opacity`}
                        style={{ minHeight: '4px' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <AnimatePresence>
                {selectedMetric === metric.id && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewDetails(metric.id)}
                    className="w-full flex items-center justify-center gap-2 mt-4 py-2 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="dashboard-card p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-slate-50/80 to-gray-50/80 dark:from-slate-800/80 dark:to-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 lg:gap-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-3 lg:p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0"
            >
              <Award className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1">
                Overall Performance Score
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                Based on your recent activity and progress
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="text-right">
              <motion.p 
                key={stats.weeklyProgress}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
              >
                {stats.weeklyProgress}/100
              </motion.p>
              <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 font-medium">
                Excellent rating
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="flex-shrink-0"
            >
              <Crown className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-500" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
})