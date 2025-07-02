import { motion } from 'framer-motion'
import { TrendingUp, Target, Award, Users } from 'lucide-react'

interface AchievementStatsProps {
  stats: {
    currentStreak: number
    monthlyProgress: number
    monthlyTarget: number
    recentAchievements: number
    globalRank: number
  }
}

export function AchievementStats({ stats }: AchievementStatsProps) {
  const statCards = [
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: '+2 days',
      trendUp: true
    },
    {
      icon: Target,
      label: 'Monthly Goal',
      value: `${Math.round((stats.monthlyProgress / stats.monthlyTarget) * 100)}%`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: `${stats.monthlyProgress}/${stats.monthlyTarget}`,
      trendUp: stats.monthlyProgress > stats.monthlyTarget * 0.5
    },
    {
      icon: Award,
      label: 'Recent Unlocks',
      value: `${stats.recentAchievements}`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: 'This week',
      trendUp: true
    },
    {
      icon: Users,
      label: 'Global Rank',
      value: `#${stats.globalRank}`,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      trend: '+5 positions',
      trendUp: true
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            
            {stat.trend && (
              <div className="flex items-center mt-2">
                <svg
                  className={`w-4 h-4 mr-1 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}
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
                <span className={`text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}