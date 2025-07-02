import { motion } from 'framer-motion'
import { X, Trophy, Star, Calendar, Users, TrendingUp, Share2, Lock, CheckCircle } from 'lucide-react'

interface AchievementDetailModalProps {
  achievement: {
    id: string
    title: string
    description: string
    longDescription?: string
    icon: string
    category: string
    points: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    progress: number
    maxProgress: number
    unlocked: boolean
    unlockedAt?: string
    claimable?: boolean
    requirements?: string[]
    rewards?: Array<{ type: string; value: string | number }>
    unlockedBy?: number
    hint?: string
  }
  onClose: () => void
  onClaim?: () => void
}

export function AchievementDetailModal({ achievement, onClose, onClaim }: AchievementDetailModalProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-orange-400 to-orange-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/50'
      case 'rare': return 'shadow-blue-500/50'
      case 'epic': return 'shadow-purple-500/50'
      case 'legendary': return 'shadow-orange-500/50'
      default: return 'shadow-gray-500/50'
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative bg-gradient-to-br ${getRarityColor(achievement.rarity)} p-8 text-white`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Achievement Icon */}
          <div className="relative">
            <div className={`w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-6xl shadow-2xl ${getRarityGlow(achievement.rarity)}`}>
              {getCategoryIcon(achievement.category)}
            </div>
            {achievement.unlocked && (
              <div className="absolute top-0 right-1/2 transform translate-x-16 -translate-y-2">
                <CheckCircle className="w-8 h-8 text-green-400 fill-green-400" />
              </div>
            )}
          </div>

          {/* Title and Rarity */}
          <h2 className="text-3xl font-bold text-center mb-2">{achievement.title}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {achievement.rarity.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {achievement.longDescription || achievement.description}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {achievement.progress}/{achievement.maxProgress} ({Math.round((achievement.progress / achievement.maxProgress) * 100)}%)
              </span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                transition={{ duration: 1 }}
                className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
              />
            </div>
          </div>

          {/* Requirements */}
          {achievement.requirements && achievement.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
              <ul className="space-y-2">
                {achievement.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewards */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Rewards</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-2xl text-gray-900 dark:text-white">{achievement.points}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Achievement XP</span>
              </div>
              {achievement.rewards?.map((reward, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-purple-500" />
                    <span className="font-bold text-2xl text-gray-900 dark:text-white">{reward.value}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{reward.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {achievement.unlockedBy && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{achievement.unlockedBy}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">of players</div>
              </div>
            )}
            {achievement.unlockedAt && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">unlocked</div>
              </div>
            )}
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">#{achievement.id}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">achievement ID</div>
            </div>
          </div>

          {/* Hint */}
          {!achievement.unlocked && achievement.hint && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Hint:</strong> {achievement.hint}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {achievement.claimable && !achievement.unlocked && (
              <button
                onClick={onClaim}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                Claim Achievement
              </button>
            )}
            {achievement.unlocked && (
              <button className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Achievement
              </button>
            )}
            {!achievement.unlocked && !achievement.claimable && (
              <div className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-medium flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Locked
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}