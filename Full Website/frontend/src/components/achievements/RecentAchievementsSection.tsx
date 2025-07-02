import { motion } from 'framer-motion'
import { Award, Clock, Star, ChevronRight } from 'lucide-react'
import type { Achievement } from './hooks/useAchievementData'

interface RecentAchievementsSectionProps {
  achievements: Achievement[]
}

export function RecentAchievementsSection({ achievements }: RecentAchievementsSectionProps) {
  // Get recently unlocked achievements (last 5)
  const recentlyUnlocked = achievements
    .filter(a => a.unlocked && a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 4)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return `${Math.floor(diffInDays / 7)}w ago`
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500'
      case 'epic': return 'from-purple-400 to-pink-500'
      case 'rare': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'epic': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
      case 'rare': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  if (recentlyUnlocked.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Recent Achievements
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Start completing modules and challenges to unlock your first achievements!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Latest Achievements
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your recent accomplishments
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recentlyUnlocked.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className={`relative rounded-xl border p-4 transition-all cursor-pointer group ${getRarityBg(achievement.rarity)}`}
          >
            {/* Achievement Content */}
            <div className="flex items-start gap-3">
              {/* Icon with rarity glow */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {achievement.icon}
                </div>
                {/* Rarity glow effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-20 blur-lg scale-110`} />
              </div>

              {/* Achievement Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                    {achievement.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(achievement.unlockedAt!)}
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {achievement.description}
                </p>

                {/* Points and Rarity */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      +{achievement.points} XP
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Show message if less than 4 achievements */}
      {recentlyUnlocked.length < 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
        >
          <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
            Keep learning to unlock more achievements! 🚀
          </p>
        </motion.div>
      )}
    </div>
  )
}