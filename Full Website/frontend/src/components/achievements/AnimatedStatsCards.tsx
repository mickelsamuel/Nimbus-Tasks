import { motion } from 'framer-motion'
import { TrendingUp, Target, Users, Calendar, Trophy, Crown, Sparkles } from 'lucide-react'

interface AnimatedStatsCardsProps {
  stats: {
    weeklyProgress: number
    monthlyProgress: number
    averageCompletionTime: string
    mostActiveCategory: string
    teamRank: number
    globalRank: number
    pointsToNextRank: number
    recentAchievements: number
    currentStreak: number
    monthlyTarget: number
  }
}

export function AnimatedStatsCards({ stats }: AnimatedStatsCardsProps) {
  const statCards = [
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: `${stats.currentStreak}`,
      unit: 'days',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
      borderColor: 'border-emerald-200/50 dark:border-emerald-700/50',
      trend: '+2 days',
      trendUp: true,
      description: 'Learning consistency',
      particles: 'text-emerald-400'
    },
    {
      icon: Target,
      label: 'Monthly Goal',
      value: `${Math.round((stats.monthlyProgress / stats.monthlyTarget) * 100)}`,
      unit: '%',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200/50 dark:border-blue-700/50',
      trend: `${stats.monthlyProgress}/${stats.monthlyTarget}`,
      trendUp: stats.monthlyProgress > stats.monthlyTarget * 0.5,
      description: 'Progress this month',
      particles: 'text-blue-400'
    },
    {
      icon: Sparkles,
      label: 'Recent Unlocks',
      value: `${stats.recentAchievements}`,
      unit: 'this week',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
      borderColor: 'border-purple-200/50 dark:border-purple-700/50',
      trend: 'This week',
      trendUp: true,
      description: 'New achievements',
      particles: 'text-purple-400'
    },
    {
      icon: Crown,
      label: 'Global Rank',
      value: `#${stats.globalRank}`,
      unit: '',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      borderColor: 'border-amber-200/50 dark:border-amber-700/50',
      trend: '+5 positions',
      trendUp: true,
      description: 'Worldwide ranking',
      particles: 'text-amber-400'
    },
    {
      icon: Users,
      label: 'Team Rank',
      value: `#${stats.teamRank}`,
      unit: '',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
      borderColor: 'border-pink-200/50 dark:border-pink-700/50',
      trend: '+1 position',
      trendUp: true,
      description: 'Among teammates',
      particles: 'text-pink-400'
    },
    {
      icon: Calendar,
      label: 'Weekly Activity',
      value: `${stats.weeklyProgress}`,
      unit: '%',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
      borderColor: 'border-indigo-200/50 dark:border-indigo-700/50',
      trend: '+12%',
      trendUp: true,
      description: 'This week\'s progress',
      particles: 'text-indigo-400'
    }
  ]

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50/50 via-purple-50/20 to-blue-50/50 dark:from-gray-900/50 dark:via-purple-900/20 dark:to-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Your Progress at a Glance
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track your learning journey with detailed insights and achievements
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              {/* Floating Particles */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1.5 h-1.5 ${stat.particles} rounded-full opacity-0 group-hover:opacity-40`}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${10 + i * 20}%`,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              
              {/* Card */}
              <div className={`relative bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm rounded-3xl p-8 border ${stat.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                {/* Icon */}
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  {/* Trend Indicator */}
                  {stat.trend && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ 
                          y: stat.trendUp ? [0, -2, 0] : [0, 2, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <svg
                          className={`w-5 h-5 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={stat.trendUp ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'}
                          />
                        </svg>
                      </motion.div>
                      <span className={`text-sm font-semibold ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stat.trend}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Label */}
                <p className="text-gray-600 dark:text-gray-400 font-medium text-lg mb-2">
                  {stat.label}
                </p>

                {/* Value */}
                <div className="flex items-baseline gap-2 mb-3">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="text-4xl font-black text-gray-900 dark:text-white"
                  >
                    {stat.value}
                  </motion.span>
                  {stat.unit && (
                    <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                      {stat.unit}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {stat.description}
                </p>

                {/* Progress Bar for percentage values */}
                {(stat.label.includes('Goal') || stat.label.includes('Activity')) && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 bg-gradient-to-r ${stat.color} rounded-full relative overflow-hidden`}
                        initial={{ width: 0 }}
                        animate={{ width: `${parseInt(stat.value)}%` }}
                        transition={{ delay: index * 0.1 + 0.8, duration: 1, ease: "easeOut" }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Hover Effect Overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Trophy className="w-6 h-6" />
            View Detailed Analytics
            <Sparkles className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}