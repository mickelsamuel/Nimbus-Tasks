'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, Trophy, Star, Medal, Crown, 
  ChevronRight, Sparkles,
  Target, BookOpen, Flame,
  Gift, Zap
} from 'lucide-react'
import { AchievementsBadgesModal } from '@/components/achievements/AchievementsBadgesModal'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  dateEarned: Date
  category: string
  points: number
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  category: string
}

interface DashboardAchievementsProps {
  recentAchievements: Achievement[]
  activeBadges: Badge[]
  totalAchievements: number
  totalBadges: number
}

export function DashboardAchievements({ 
  recentAchievements, 
  activeBadges, 
  totalAchievements, 
  totalBadges 
}: DashboardAchievementsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use real data from props - no fallback to mock data
  const achievements = recentAchievements || []
  const badges = activeBadges || []
  const achievementCount = totalAchievements || 0
  const badgeCount = totalBadges || 0
  
  // Show encouraging message when no achievements
  const hasNoAchievements = achievements.length === 0
  const hasNoBadges = badges.length === 0

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          bg: 'from-yellow-400 to-orange-500',
          border: 'border-yellow-300/30 dark:border-yellow-600/50',
          text: 'text-yellow-800 dark:text-yellow-200',
          cardBg: 'bg-yellow-50/80 dark:bg-yellow-900/20',
          glow: 'shadow-yellow-500/25'
        }
      case 'epic':
        return {
          bg: 'from-purple-400 to-pink-500',
          border: 'border-purple-300/30 dark:border-purple-600/50',
          text: 'text-purple-800 dark:text-purple-200',
          cardBg: 'bg-purple-50/80 dark:bg-purple-900/20',
          glow: 'shadow-purple-500/25'
        }
      case 'rare':
        return {
          bg: 'from-blue-400 to-indigo-500',
          border: 'border-blue-300/30 dark:border-blue-600/50',
          text: 'text-blue-800 dark:text-blue-200',
          cardBg: 'bg-blue-50/80 dark:bg-blue-900/20',
          glow: 'shadow-blue-500/25'
        }
      default:
        return {
          bg: 'from-gray-400 to-gray-500',
          border: 'border-gray-300/30 dark:border-gray-600/50',
          text: 'text-gray-800 dark:text-gray-200',
          cardBg: 'bg-gray-50/80 dark:bg-gray-900/20',
          glow: 'shadow-gray-500/25'
        }
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Trophy: <Trophy className="w-4 h-4" />,
      Award: <Award className="w-4 h-4" />,
      Star: <Star className="w-4 h-4" />,
      Medal: <Medal className="w-4 h-4" />,
      Crown: <Crown className="w-4 h-4" />,
      Target: <Target className="w-4 h-4" />,
      Zap: <Zap className="w-4 h-4" />,
      BookOpen: <BookOpen className="w-4 h-4" />,
      Flame: <Flame className="w-4 h-4" />
    }
    return iconMap[iconName] || <Award className="w-4 h-4" />
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card rounded-2xl p-4 lg:p-6 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-900/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-md flex-shrink-0"
          >
            <Trophy className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-lg lg:text-xl font-black text-gray-900 dark:text-white">
              Achievements & Badges
            </h2>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
              {achievementCount} achievements • {badgeCount} badges
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
          <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
            {achievements.length} New
          </span>
        </div>
      </div>

      {/* Horizontal Scrolling Layout */}
      <div className="space-y-4">
        {/* Recent Achievements - Horizontal Scroll */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {hasNoAchievements ? (
              <div className="w-64 p-4 rounded-xl border border-gray-200/60 dark:border-gray-600/60 bg-gray-50/80 dark:bg-gray-800/80 text-center">
                <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">No recent achievements</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Complete modules to earn achievements!</p>
              </div>
            ) : (
              achievements.slice(0, 5).map((achievement, index) => {
              const styles = getRarityStyles(achievement.rarity)
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`
                    group flex-shrink-0 w-64 p-3 rounded-xl border ${styles.border}
                    ${styles.cardBg} hover:shadow-lg ${styles.glow} transition-all duration-200 cursor-pointer
                    backdrop-blur-sm
                  `}
                >
                  <div className="flex items-start gap-3">
                    <motion.div 
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.4 }}
                      className={`p-2 rounded-lg bg-gradient-to-br ${styles.bg} text-white shadow-sm flex-shrink-0`}
                    >
                      {getIconComponent(achievement.icon)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {achievement.title}
                        </h4>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${styles.text} bg-white/90 dark:bg-gray-800/90 shadow-sm border border-gray-200/50 dark:border-gray-600/50 flex-shrink-0`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 mb-2 font-medium">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          +{achievement.points}
                        </span>
                        <span>•</span>
                        <span>{formatTimeAgo(achievement.dateEarned)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            }))}
          </div>
        </div>

        {/* Active Badges - Horizontal Scroll */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Medal className="w-4 h-4 text-indigo-500" />
            Active Badges
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {hasNoBadges ? (
              <div className="w-48 p-4 rounded-xl border border-gray-200/60 dark:border-gray-600/60 bg-gray-50/80 dark:bg-gray-800/80 text-center">
                <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">No active badges</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Work towards goals to earn badges!</p>
              </div>
            ) : (
              badges.slice(0, 6).map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group flex-shrink-0 w-48 p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl hover:bg-white dark:hover:bg-gray-700/80 transition-all duration-200 cursor-pointer border border-gray-200/60 dark:border-gray-600/60 shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <motion.div 
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                    className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white flex-shrink-0"
                  >
                    {getIconComponent(badge.icon)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {badge.category}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-3 line-clamp-2 font-medium">
                  {badge.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">Progress</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {badge.progress}/{badge.maxProgress}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center pt-2">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            <span>View All Achievements & Badges</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Achievements & Badges Modal */}
      <AchievementsBadgesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  )
}