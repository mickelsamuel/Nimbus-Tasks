'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Achievement } from '@/types'
import { Share2, Sparkles } from 'lucide-react'
import { useAchievementStyles } from './hooks/useAchievementStyles'

interface AchievementCardProps {
  achievement: Achievement
  index: number
  isAnimated: boolean
  onViewDetails?: (achievement: Achievement) => void
  onShare?: (achievement: Achievement) => void
}

export const AchievementCard = ({ 
  achievement, 
  index, 
  isAnimated, 
  onViewDetails, 
  onShare 
}: AchievementCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { getRarityStyle } = useAchievementStyles()
  
  const rarityStyle = getRarityStyle(achievement.rarity)
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100
  const IconComponent = achievement.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: isAnimated ? index * 0.1 : 0,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl ${rarityStyle.bg} ${rarityStyle.border} border ${rarityStyle.glow} transition-all duration-500 cursor-pointer ${achievement.unlocked ? '' : 'grayscale opacity-60'}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-br ${rarityStyle.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Unlock Animation Effect */}
      {achievement.unlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10"
          initial={{ x: '-100%', skewX: -15 }}
          animate={{ x: '200%', skewX: -15 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Achievement Icon with Rarity Glow */}
            <div className="relative">
              <motion.div
                className={`p-3 rounded-xl bg-gradient-to-br ${rarityStyle.gradient} ${rarityStyle.glow} shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </motion.div>
              
              {/* Sparkles Effect for Unlocked Achievements */}
              {achievement.unlocked && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                </motion.div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {achievement.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${rarityStyle.bg} ${rarityStyle.border} border capitalize`}>
                  {achievement.rarity}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {achievement.category}
                </span>
              </div>
            </div>
          </div>

          {/* Points Badge */}
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            {achievement.points.toLocaleString()} XP
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
          {achievement.description}
        </p>

        {/* Progress Section */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Progress
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
            
            <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${rarityStyle.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
              
              {/* Progress Glow Effect */}
              <motion.div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${rarityStyle.gradient} rounded-full opacity-50 blur-sm`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex justify-between items-center pt-2">
            {achievement.unlocked && achievement.dateUnlocked && (
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <span>Unlocked {new Date(achievement.dateUnlocked).toLocaleDateString()}</span>
              </div>
            )}
            
            {achievement.streak && (
              <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                <span>{achievement.streak} day streak</span>
              </div>
            )}
            
            {!achievement.unlocked && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {Math.round(progressPercentage)}% complete
              </div>
            )}
          </div>
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-4 bottom-4 flex gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onShare?.(achievement)}
                className="flex-1 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200"
              >
                <Share2 className="h-4 w-4 mx-auto" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewDetails?.(achievement)}
                className="flex-1 bg-red-500/90 hover:bg-red-500 text-white rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
              >
                View Details
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}