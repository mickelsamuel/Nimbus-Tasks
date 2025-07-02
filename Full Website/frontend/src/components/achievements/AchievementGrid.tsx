import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Lock, Award } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: string
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: string
  claimable?: boolean
}

interface AchievementGridProps {
  achievements: Achievement[]
  viewMode: 'grid' | 'list' | 'showcase'
  onSelectAchievement: (achievement: Achievement) => void
  onClaimAchievement: (achievementId: string) => void
}

export function AchievementGrid({ 
  achievements, 
  viewMode, 
  onSelectAchievement,
  onClaimAchievement 
}: AchievementGridProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-orange-400 to-orange-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50 dark:bg-gray-900/50'
      case 'rare': return 'bg-blue-50 dark:bg-blue-900/50'
      case 'epic': return 'bg-purple-50 dark:bg-purple-900/50'
      case 'legendary': return 'bg-orange-50 dark:bg-orange-900/50'
      default: return 'bg-gray-50 dark:bg-gray-900/50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return '📚'
      case 'performance': return '📈'
      case 'collaboration': return '🤝'
      case 'innovation': return '💡'
      case 'leadership': return '👑'
      default: return '🏆'
    }
  }

  if (viewMode === 'showcase') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <AnimatePresence mode="popLayout">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className={`relative group cursor-pointer ${getRarityBgColor(achievement.rarity)} rounded-2xl overflow-hidden`}
              onClick={() => onSelectAchievement(achievement)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)}`} />
              </div>

              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl">{getCategoryIcon(achievement.category)}</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{achievement.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{achievement.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-gray-900 dark:text-white">{achievement.points} XP</span>
                  </div>
                  {achievement.unlocked ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Award className="w-5 h-5" />
                      <span className="text-sm font-medium">Unlocked</span>
                    </div>
                  ) : achievement.claimable ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onClaimAchievement(achievement.id)
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                    >
                      Claim
                    </button>
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4 mb-12">
        <AnimatePresence mode="popLayout">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => onSelectAchievement(achievement)}
            >
              <div className="flex items-center gap-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${getRarityBgColor(achievement.rarity)} flex items-center justify-center text-3xl`}>
                  {getCategoryIcon(achievement.category)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity.toUpperCase()}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-gray-900 dark:text-white">{achievement.points}</span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">XP</span>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    {achievement.unlocked ? (
                      <Award className="w-8 h-8 text-green-500" />
                    ) : achievement.claimable ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onClaimAchievement(achievement.id)
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                      >
                        Claim
                      </button>
                    ) : (
                      <Lock className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  // Grid View (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      <AnimatePresence mode="popLayout">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative group cursor-pointer"
            onClick={() => onSelectAchievement(achievement)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(achievement.rarity)} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${getRarityBgColor(achievement.rarity)} flex items-center justify-center text-2xl`}>
                  {getCategoryIcon(achievement.category)}
                </div>
                {achievement.unlocked && (
                  <Award className="w-6 h-6 text-green-500" />
                )}
              </div>

              {/* Content */}
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{achievement.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{achievement.description}</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{achievement.points}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                  {achievement.rarity}
                </span>
              </div>

              {/* Claimable Button */}
              {achievement.claimable && !achievement.unlocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClaimAchievement(achievement.id)
                  }}
                  className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  Claim Reward
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}