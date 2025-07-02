import { motion, AnimatePresence } from 'framer-motion'
import { Star, Lock, Clock, Crown, Trophy, Award } from 'lucide-react'
import { useState } from 'react'
import type { Achievement } from './hooks/useAchievementData'

interface StunningAchievementGridProps {
  achievements: Achievement[]
  viewMode: 'grid' | 'list' | 'showcase'
  onSelectAchievement: (achievement: Achievement) => void
  onClaimAchievement: (achievementId: string) => void
}

export function StunningAchievementGrid({ 
  achievements, 
  viewMode, 
  onSelectAchievement, 
  onClaimAchievement 
}: StunningAchievementGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          gradient: 'from-amber-400 via-yellow-500 to-orange-600',
          glow: 'shadow-amber-500/50',
          border: 'border-amber-300/30 dark:border-amber-600/30',
          bg: 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20',
          icon: Crown,
          particles: 'text-amber-400',
          shimmer: 'from-amber-200/50 via-yellow-200/80 to-orange-200/50'
        }
      case 'epic':
        return {
          gradient: 'from-purple-500 via-violet-600 to-purple-700',
          glow: 'shadow-purple-500/50',
          border: 'border-purple-300/30 dark:border-purple-600/30',
          bg: 'bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-900/20 dark:to-violet-900/20',
          icon: Trophy,
          particles: 'text-purple-400',
          shimmer: 'from-purple-200/50 via-violet-200/80 to-purple-200/50'
        }
      case 'rare':
        return {
          gradient: 'from-blue-500 via-cyan-600 to-blue-700',
          glow: 'shadow-blue-500/50',
          border: 'border-blue-300/30 dark:border-blue-600/30',
          bg: 'bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20',
          icon: Star,
          particles: 'text-blue-400',
          shimmer: 'from-blue-200/50 via-cyan-200/80 to-blue-200/50'
        }
      default:
        return {
          gradient: 'from-gray-500 via-slate-600 to-gray-700',
          glow: 'shadow-gray-500/50',
          border: 'border-gray-300/30 dark:border-gray-600/30',
          bg: 'bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-gray-900/20 dark:to-slate-900/20',
          icon: Award,
          particles: 'text-gray-400',
          shimmer: 'from-gray-200/50 via-slate-200/80 to-gray-200/50'
        }
    }
  }

  const getGridCols = () => {
    switch (viewMode) {
      case 'showcase': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 'list': return 'grid-cols-1'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Achievement Collection
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore your accomplishments and discover new challenges to unlock
          </p>
        </motion.div>

        {/* Achievement Grid */}
        <div className={`grid ${getGridCols()} gap-6`}>
          <AnimatePresence mode="popLayout">
            {achievements.map((achievement, index) => {
              const config = getRarityConfig(achievement.rarity)
              const isUnlocked = achievement.unlocked
              const isHovered = hoveredIndex === index
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

              return (
                <motion.div
                  key={achievement.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="group relative cursor-pointer"
                  onClick={() => onSelectAchievement(achievement)}
                >
                  {/* Floating Particles */}
                  {isUnlocked && Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1.5 h-1.5 ${config.particles} rounded-full opacity-0 group-hover:opacity-60`}
                      style={{
                        left: `${15 + i * 25}%`,
                        top: `${10 + (i % 2) * 20}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.5, 1],
                        opacity: isHovered ? [0, 0.6, 0] : 0,
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}

                  {/* Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                    animate={{
                      opacity: isUnlocked ? (isHovered ? 0.3 : 0.1) : 0,
                    }}
                  />

                  {/* Main Card */}
                  <div className={`relative h-full ${config.bg} backdrop-blur-sm rounded-3xl border ${config.border} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${!isUnlocked ? 'opacity-60' : ''}`}>
                    
                    {/* Shimmer Effect for Unlocked Achievements */}
                    {isUnlocked && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${config.shimmer} opacity-0 group-hover:opacity-100 skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000`}
                        style={{ transform: 'translateX(-100%) skewX(12deg)' }}
                      />
                    )}

                    {/* Lock Overlay for Locked Achievements */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                          className="w-16 h-16 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Lock className="w-8 h-8 text-gray-300" />
                        </motion.div>
                      </div>
                    )}

                    <div className="p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        {/* Achievement Icon */}
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg ${config.glow}`}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: [0, -5, 5, 0],
                            transition: { duration: 0.4 }
                          }}
                        >
                          {achievement.icon}
                        </motion.div>

                        {/* Rarity Badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.3 }}
                          className={`px-3 py-1 bg-gradient-to-r ${config.gradient} text-white rounded-full text-xs font-bold shadow-md`}
                        >
                          {achievement.rarity.toUpperCase()}
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                          {achievement.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                          {achievement.description}
                        </p>

                        {/* Progress Bar */}
                        {!isUnlocked && achievement.maxProgress > 1 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Progress</span>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <motion.div
                                className={`h-2 bg-gradient-to-r ${config.gradient} rounded-full relative overflow-hidden`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ delay: index * 0.05 + 0.5, duration: 1, ease: "easeOut" }}
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
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        {/* Points */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {achievement.points} XP
                          </span>
                        </div>

                        {/* Status */}
                        {isUnlocked ? (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Unlocked
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                            <Clock className="w-4 h-4" />
                            Locked
                          </div>
                        )}
                      </div>

                      {/* Claim Button for Claimable Achievements */}
                      {achievement.claimable && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 + 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onClaimAchievement(achievement.id)
                          }}
                          className={`mt-4 w-full py-3 bg-gradient-to-r ${config.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all`}
                        >
                          Claim Reward
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Special Effects for Legendary */}
                  {achievement.rarity === 'legendary' && isUnlocked && (
                    <>
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-600 rounded-[2rem] opacity-20 blur-lg"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-amber-400 rounded-full"
                          style={{
                            left: `${10 + i * 15}%`,
                            top: `${5 + (i % 2) * 10}%`,
                          }}
                          animate={{
                            y: [0, -30, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {achievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-3xl flex items-center justify-center">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Achievements Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your filters to discover more achievements to unlock.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}