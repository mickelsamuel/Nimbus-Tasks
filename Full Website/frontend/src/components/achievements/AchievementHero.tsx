import { motion } from 'framer-motion'
import { Trophy, Star, TrendingUp, Award } from 'lucide-react'

interface AchievementHeroProps {
  stats: {
    totalXP: number
    unlockedAchievements: number
    totalAchievements: number
    completionRate: number
    currentStreak: number
    rank: string
  }
}

export function AchievementHero({ stats }: AchievementHeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 2,
            }}
            style={{
              left: `${i * 20}%`,
              top: `${i % 2 === 0 ? 20 : 60}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Trophy className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Achievements & Badges
            </h1>
            <motion.div
              initial={{ rotate: 20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Trophy className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />
            </motion.div>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track your progress, unlock achievements, collect badges, and celebrate your accomplishments
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalXP?.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.unlockedAchievements}/{stats.totalAchievements}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Unlocked</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rank}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Rank</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}