'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BookOpen, TrendingUp, Users, Trophy, 
  MessageSquare, Target, Calendar, Sparkles,
  ArrowRight, Clock,
  Rocket, Crown, Flame, Brain,
  Coffee, Compass
} from 'lucide-react'
import type { QuickAction } from '@/types/dashboard'

interface DashboardQuickActionsProps {
  quickActions: QuickAction[]
}

export const DashboardQuickActions = React.memo(function DashboardQuickActions({ quickActions }: DashboardQuickActionsProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getIconComponent = (iconName: string, size: string = "w-5 h-5 lg:w-6 lg:h-6") => {
    const iconMap: Record<string, React.ReactNode> = {
      BookOpen: <BookOpen className={size} />,
      TrendingUp: <TrendingUp className={size} />,
      Users: <Users className={size} />,
      Trophy: <Trophy className={size} />,
      MessageSquare: <MessageSquare className={size} />,
      Target: <Target className={size} />,
      Calendar: <Calendar className={size} />,
      Rocket: <Rocket className={size} />,
      Brain: <Brain className={size} />,
      Crown: <Crown className={size} />,
      Flame: <Flame className={size} />
    }
    return iconMap[iconName] || <Sparkles className={size} />
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          badge: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400',
          iconBg: 'from-red-500 via-pink-500 to-rose-600',
          bgGradient: 'from-red-50 via-pink-50 to-rose-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-rose-900/20',
          glow: 'shadow-red-500/25',
          border: 'border-red-200/50 dark:border-red-700/50'
        }
      case 'medium':
        return {
          badge: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400',
          iconBg: 'from-amber-500 via-yellow-500 to-orange-600',
          bgGradient: 'from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20',
          glow: 'shadow-amber-500/25',
          border: 'border-amber-200/50 dark:border-amber-700/50'
        }
      default:
        return {
          badge: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400',
          iconBg: 'from-blue-500 via-indigo-500 to-purple-600',
          bgGradient: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20',
          glow: 'shadow-blue-500/25',
          border: 'border-blue-200/50 dark:border-blue-700/50'
        }
    }
  }

  // Default actions with valid routes
  const defaultActions: QuickAction[] = [
    {
      id: 1,
      title: "Continue Learning Path",
      subtitle: "View and continue your assigned modules",
      icon: "Brain",
      href: "/modules",
      priority: "high",
      badge: "In Progress",
      progress: 0
    },
    {
      id: 2,
      title: "View Leaderboards",
      subtitle: "Check your ranking and compete with peers",
      icon: "Trophy",
      href: "/leaderboards",
      priority: "high",
      badge: "Updated"
    },
    {
      id: 3,
      title: "Join Team Activities",
      subtitle: "Collaborate with your team members",
      icon: "Users",
      href: "/friends-teams",
      priority: "medium",
      participants: 0
    },
    {
      id: 4,
      title: "Upcoming Events",
      subtitle: "View and register for upcoming events",
      icon: "Calendar",
      href: "/events",
      priority: "medium"
    },
    {
      id: 5,
      title: "Practice Trading",
      subtitle: "Access the trading simulation platform",
      icon: "TrendingUp",
      href: "/simulation",
      priority: "low",
      badge: "Practice"
    }
  ]

  // Use provided actions or defaults
  const actionsToShow = quickActions.length > 0 ? quickActions : defaultActions

  // Sort actions by priority
  const sortedActions = [...actionsToShow].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
  })

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="p-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl shadow-lg flex-shrink-0"
            >
              <Rocket className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-700 to-pink-700 dark:from-white dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
              Quick Actions
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl">
            Jump into what matters most - AI-curated based on your progress
          </p>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 px-3 py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-red-900/30 rounded-full border border-purple-200/50 dark:border-purple-700/50 flex-shrink-0"
        >
          <motion.div
            animate={{ 
              rotate: [0, 20, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <span className="text-xs lg:text-sm font-bold text-purple-700 dark:text-purple-300">
            AI Recommended
          </span>
        </motion.div>
      </motion.div>

      {/* Revolutionary Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {sortedActions.slice(0, 6).map((action, index) => {
          const styles = getPriorityStyles(action.priority)
          const isHovered = hoveredCard === action.id

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1, 
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
              onHoverStart={() => setHoveredCard(action.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Link
                href={action.href}
                className={`
                  group relative overflow-hidden block
                  rounded-2xl border ${styles.border}
                  bg-gradient-to-br ${styles.bgGradient}
                  p-4 lg:p-6 transition-all duration-700
                  hover:shadow-2xl hover:${styles.glow}
                  backdrop-blur-sm
                  min-h-[200px] lg:min-h-[220px]
                `}
              >
                {/* Animated Background Effects */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(135deg, ${styles.iconBg.replace(/from-|via-|to-/g, '').split(' ').join(', ')})`,
                    opacity: 0.05
                  }}
                />
                
                {/* Enhanced Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    className="h-full w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 blur-sm"
                  />
                </div>

                {/* Optimized Floating Particles for High Priority - Reduced count */}
                {action.priority === 'high' && isHovered && Array.from({ length: 2 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-red-400 rounded-full"
                    style={{
                      left: `${40 + i * 20}%`,
                      top: `${40 + i * 10}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.8, type: "spring" }}
                      className={`p-3 rounded-xl bg-gradient-to-r ${styles.iconBg} shadow-lg group-hover:shadow-xl flex-shrink-0`}
                    >
                      <div className="text-white">
                        {getIconComponent(action.icon)}
                      </div>
                    </motion.div>
                    
                    {action.badge && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-bold ${styles.badge} shadow-sm flex-shrink-0`}
                      >
                        {action.badge}
                      </motion.span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3 min-h-0">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {action.subtitle}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between">
                    {action.progress !== undefined ? (
                      <div className="flex-1 mr-4 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            Progress
                          </span>
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            {action.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${action.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${styles.iconBg} rounded-full relative overflow-hidden`}
                          >
                            <motion.div 
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                          </motion.div>
                        </div>
                      </div>
                    ) : action.participants ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium flex-1 min-w-0">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{action.participants} active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium flex-1 min-w-0">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>2 min read</span>
                      </div>
                    )}
                    
                    <motion.div 
                      whileHover={{ scale: 1.1, x: 5 }}
                      className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm group-hover:bg-white/70 dark:group-hover:bg-gray-700/70 transition-all shadow-sm flex-shrink-0"
                    >
                      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Enhanced AI Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50/80 via-indigo-50/80 to-blue-50/80 dark:from-purple-900/40 dark:via-indigo-900/40 dark:to-blue-900/40 border border-purple-200/50 dark:border-purple-700/50 p-6 lg:p-8 backdrop-blur-sm"
      >
        {/* Background Animation */}
        <motion.div 
          animate={{ 
            background: [
              'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 60%)',
              'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
              'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 60%)',
              'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 60%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        <div className="relative z-10 flex flex-col xl:flex-row items-start gap-6">
          {/* Header */}
          <div className="flex items-start gap-4 xl:min-w-[300px] flex-shrink-0">
            <motion.div 
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity }
              }}
              className="p-3 lg:p-4 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-2xl text-white shadow-xl flex-shrink-0"
            >
              <Brain className="w-6 h-6 lg:w-8 lg:h-8" />
            </motion.div>
            <div className="min-w-0">
              <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-white mb-2">
                AI Smart Suggestions
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Personalized recommendations based on your learning patterns and goals
              </p>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              {
                icon: <Coffee className="w-4 h-4 lg:w-5 lg:h-5" />,
                title: "Continue Learning",
                subtitle: "View your learning modules",
                color: "from-green-500 to-emerald-600",
                bgColor: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
                textColor: "text-green-700 dark:text-green-300",
                href: "/modules"
              },
              {
                icon: <Compass className="w-4 h-4 lg:w-5 lg:h-5" />,
                title: "Explore New",
                subtitle: "Discover innovation challenges",
                color: "from-blue-500 to-indigo-600",
                bgColor: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
                textColor: "text-blue-700 dark:text-blue-300",
                href: "/innovation-lab"
              }
            ].map((rec, index) => (
              <Link
                key={index}
                href={rec.href}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`bg-gradient-to-br ${rec.bgColor} rounded-xl p-4 shadow-sm border border-white/50 dark:border-gray-700/50 cursor-pointer group min-h-[100px]`}
                >
                <div className="flex items-start gap-3 h-full">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-2 rounded-lg bg-gradient-to-r ${rec.color} text-white shadow-md flex-shrink-0`}
                  >
                    {rec.icon}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm lg:text-base ${rec.textColor} mb-1 group-hover:scale-105 transition-transform line-clamp-1`}>
                      {rec.title}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {rec.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
})