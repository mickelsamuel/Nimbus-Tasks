import { motion } from 'framer-motion'
import { Award, Clock, Star, ChevronRight, Sparkles, Crown, Trophy } from 'lucide-react'
import { useState } from 'react'
import type { Achievement } from './hooks/useAchievementData'

interface BeautifulRecentAchievementsProps {
  achievements: Achievement[]
}

export function BeautifulRecentAchievements({ achievements }: BeautifulRecentAchievementsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  // Get recently unlocked achievements (last 6)
  const recentlyUnlocked = achievements
    .filter(a => a.unlocked && a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 6)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just earned'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return `${Math.floor(diffInDays / 7)}w ago`
  }

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          gradient: 'from-amber-400 via-yellow-500 to-orange-600',
          glow: 'shadow-amber-500/50',
          border: 'border-amber-300/50 dark:border-amber-600/50',
          bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
          icon: Crown,
          particles: 'text-amber-400'
        }
      case 'epic':
        return {
          gradient: 'from-purple-500 via-violet-600 to-purple-700',
          glow: 'shadow-purple-500/50',
          border: 'border-purple-300/50 dark:border-purple-600/50',
          bg: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
          icon: Trophy,
          particles: 'text-purple-400'
        }
      case 'rare':
        return {
          gradient: 'from-blue-500 via-cyan-600 to-blue-700',
          glow: 'shadow-blue-500/50',
          border: 'border-blue-300/50 dark:border-blue-600/50',
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
          icon: Star,
          particles: 'text-blue-400'
        }
      default:
        return {
          gradient: 'from-gray-500 via-slate-600 to-gray-700',
          glow: 'shadow-gray-500/50',
          border: 'border-gray-300/50 dark:border-gray-600/50',
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
          icon: Award,
          particles: 'text-gray-400'
        }
    }
  }

  if (recentlyUnlocked.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-blue-500/20" />
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center shadow-lg"
            >
              <Award className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ready for Your First Achievement?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
              Complete modules and challenges to start unlocking amazing achievements and earning rewards!
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  const selectedAchievement = recentlyUnlocked[selectedIndex]
  const rarityConfig = getRarityConfig(selectedAchievement.rarity)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-blue-500/10" />
      
      {/* Floating Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 ${rarityConfig.particles} rounded-full opacity-20`}
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                  Latest Achievements
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Your recent accomplishments
                </p>
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Main Achievement Display */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Achievement */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.gradient} rounded-3xl blur-xl opacity-20`} />
              <div className={`relative ${rarityConfig.bg} rounded-3xl p-8 border ${rarityConfig.border} backdrop-blur-sm shadow-xl`}>
                {/* Achievement Icon & Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-br ${rarityConfig.gradient} rounded-3xl flex items-center justify-center text-3xl shadow-2xl ${rarityConfig.glow}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {selectedAchievement.icon}
                    </motion.div>
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.gradient} rounded-3xl blur-lg opacity-50`}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="text-right">
                    <motion.div
                      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${rarityConfig.gradient} text-white rounded-full text-sm font-bold shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <rarityConfig.icon className="w-4 h-4" />
                      {selectedAchievement.rarity.toUpperCase()}
                    </motion.div>
                    <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatTimeAgo(selectedAchievement.unlockedAt!)}</span>
                    </div>
                  </div>
                </div>

                {/* Achievement Details */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedAchievement.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {selectedAchievement.description}
                  </p>
                  
                  {/* Points */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-xl text-gray-900 dark:text-white">
                        +{selectedAchievement.points} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievement List */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Unlocks
              </h3>
              {recentlyUnlocked.map((achievement, index) => {
                const config = getRarityConfig(achievement.rarity)
                const isSelected = index === selectedIndex
                
                return (
                  <motion.button
                    key={achievement.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? `${config.bg} ${config.border} shadow-lg`
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center text-lg shadow-md`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {achievement.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            +{achievement.points} XP
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r ${config.gradient} text-white`}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(achievement.unlockedAt!)}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}