'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Achievement } from '@/types'
import { Share2, Sparkles, Award } from 'lucide-react'
import { useAchievementStyles } from './hooks/useAchievementStyles'

interface AchievementListItemProps {
  achievement: Achievement
  index: number
  onViewDetails?: (achievement: Achievement) => void
  onShare?: (achievement: Achievement) => void
}

export const AchievementListItem = ({ 
  achievement, 
  index, 
  onViewDetails, 
  onShare 
}: AchievementListItemProps) => {
  const [, setIsHovered] = useState(false)
  const { getRarityStyle } = useAchievementStyles()
  
  const rarityStyle = getRarityStyle(achievement.rarity)
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100
  const IconComponent = achievement.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ x: 8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 hover:border-red-500/30 transition-all duration-300 cursor-pointer ${achievement.unlocked ? '' : 'grayscale opacity-60'}`}
    >
      <div className="flex items-center gap-6">
        {/* Achievement Icon */}
        <div className="relative flex-shrink-0">
          <motion.div
            className={`p-4 rounded-xl bg-gradient-to-br ${rarityStyle.gradient} ${rarityStyle.glow} shadow-lg`}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <IconComponent className="h-8 w-8 text-white" />
          </motion.div>
          
          {achievement.unlocked && (
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </motion.div>
          )}
        </div>

        {/* Achievement Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {achievement.title}
              </h3>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${rarityStyle.bg} ${rarityStyle.border} border capitalize`}>
                  {achievement.rarity}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                  {achievement.category}
                </span>
                {achievement.unlocked && achievement.dateUnlocked && (
                  <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <Award className="h-4 w-4" />
                    {new Date(achievement.dateUnlocked).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Points */}
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              {achievement.points.toLocaleString()} XP
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            {achievement.description}
          </p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Progress: {achievement.progress}/{achievement.maxProgress}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            
            <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${rarityStyle.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: index * 0.05 }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onShare?.(achievement)}
            className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewDetails?.(achievement)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}