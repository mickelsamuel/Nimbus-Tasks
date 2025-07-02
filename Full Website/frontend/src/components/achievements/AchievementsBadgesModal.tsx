'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Trophy, Medal, Star, Search, 
  TrendingUp, Target, Award,
  Clock, Lock, CheckCircle
} from 'lucide-react'
import { useAchievementData } from './hooks/useAchievementData'
import { AchievementDetailModal } from './AchievementDetailModal'
import { BadgeDetailModal } from './BadgeDetailModal'

interface AchievementsBadgesModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
}

export function AchievementsBadgesModal({ isOpen, onClose }: AchievementsBadgesModalProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>('achievements')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  interface Achievement {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    icon: string;
    category: string;
    points: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    progress: number;
    maxProgress: number;
    unlocked: boolean;
    unlockedAt?: string;
    claimable?: boolean;
    requirements?: string[];
    rewards?: Array<{ type: string; value: string | number }>;
    unlockedBy?: number;
    hint?: string;
  }
  
  interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    earned: boolean;
    earnedAt?: string;
    color?: string;
    requirements?: string[];
  }
  
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  
  const { achievements, badges, loading, stats } = useAchievementData()

  // Categories
  const categories = [
    { id: 'all', name: 'All', icon: '✨' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'social', name: 'Social', icon: '🤝' },
    { id: 'progress', name: 'Progress', icon: '📈' },
    { id: 'leadership', name: 'Leadership', icon: '👑' },
    { id: 'innovation', name: 'Innovation', icon: '💡' }
  ]

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      const matchesSearch = achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [achievements, searchQuery, selectedCategory])

  // Filter badges
  const filteredBadges = useMemo(() => {
    return badges.filter(badge => {
      const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          badge.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [badges, searchQuery, selectedCategory])

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          bg: 'from-yellow-400 to-orange-500',
          border: 'border-yellow-300/30',
          text: 'text-yellow-700',
          glow: 'shadow-yellow-500/25'
        }
      case 'epic':
        return {
          bg: 'from-purple-400 to-pink-500',
          border: 'border-purple-300/30',
          text: 'text-purple-700',
          glow: 'shadow-purple-500/25'
        }
      case 'rare':
        return {
          bg: 'from-blue-400 to-indigo-500',
          border: 'border-blue-300/30',
          text: 'text-blue-700',
          glow: 'shadow-blue-500/25'
        }
      default:
        return {
          bg: 'from-gray-400 to-gray-500',
          border: 'border-gray-300/30',
          text: 'text-gray-700',
          glow: 'shadow-gray-500/25'
        }
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Trophy: <Trophy className="w-5 h-5" />,
      Award: <Award className="w-5 h-5" />,
      Star: <Star className="w-5 h-5" />,
      Medal: <Medal className="w-5 h-5" />,
      Target: <Target className="w-5 h-5" />,
      TrendingUp: <TrendingUp className="w-5 h-5" />,
      Clock: <Clock className="w-5 h-5" />
    }
    return iconMap[iconName] || <Award className="w-5 h-5" />
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
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
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                    >
                      <Trophy className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold">Achievements & Badges</h2>
                      <p className="text-white/80">Track your progress and unlock rewards</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-3xl font-bold">{stats?.totalUnlocked || 0}</div>
                    <div className="text-sm text-white/80">Unlocked</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-3xl font-bold">{stats?.totalPoints || 0}</div>
                    <div className="text-sm text-white/80">Total XP</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-3xl font-bold">{stats?.completionRate || 0}%</div>
                    <div className="text-sm text-white/80">Completion</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-3xl font-bold">{stats?.currentStreak || 0}</div>
                    <div className="text-sm text-white/80">Day Streak</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                      activeTab === 'achievements' 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
                    </span>
                    {activeTab === 'achievements' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('badges')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                      activeTab === 'badges' 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Medal className="w-5 h-5" />
                      Badges ({badges.filter(b => b.earned).length}/{badges.length})
                    </span>
                    {activeTab === 'badges' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Categories */}
                  <div className="flex gap-2 overflow-x-auto">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-380px)]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
                  </div>
                ) : (
                  <>
                    {activeTab === 'achievements' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAchievements.map(achievement => {
                          const styles = getRarityStyles(achievement.rarity)
                          return (
                            <motion.div
                              key={achievement.id}
                              whileHover={{ scale: 1.02, y: -4 }}
                              onClick={() => setSelectedAchievement(achievement)}
                              className={`
                                p-4 rounded-xl border ${styles.border} cursor-pointer
                                ${achievement.unlocked ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'}
                                hover:shadow-lg transition-all duration-200
                              `}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${styles.bg} text-white`}>
                                  {getIconComponent(achievement.icon)}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {achievement.title}
                                    {achievement.unlocked && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    {!achievement.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
                                  
                                  {/* Progress Bar */}
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                      <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full bg-gradient-to-r ${styles.bg}`}
                                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs font-medium ${styles.text}`}>
                                      {achievement.rarity.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-500" />
                                      {achievement.points} XP
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBadges.map(badge => (
                          <motion.div
                            key={badge.id}
                            whileHover={{ scale: 1.02, y: -4 }}
                            onClick={() => setSelectedBadge(badge)}
                            className={`
                              p-4 rounded-xl border cursor-pointer
                              ${badge.earned 
                                ? 'border-purple-300/30 bg-white dark:bg-gray-800' 
                                : 'border-gray-300/30 bg-gray-50 dark:bg-gray-900/50'
                              }
                              hover:shadow-lg transition-all duration-200
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${badge.earned ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gray-300 dark:bg-gray-600'} text-white`}>
                                <Medal className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                  {badge.name}
                                  {badge.earned && <CheckCircle className="w-4 h-4 text-green-500" />}
                                  {!badge.earned && <Lock className="w-4 h-4 text-gray-400" />}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{badge.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-xs font-medium ${badge.earned ? 'text-purple-700' : 'text-gray-500'}`}>
                                    {badge.category.toUpperCase()}
                                  </span>
                                  {badge.earned && badge.earnedAt && (
                                    <>
                                      <span className="text-xs text-gray-500">•</span>
                                      <span className="text-xs text-gray-600 dark:text-gray-400">
                                        Earned {new Date(badge.earnedAt).toLocaleDateString()}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modals */}
      <AnimatePresence>
        {selectedAchievement && (
          <AchievementDetailModal
            achievement={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailModal
            badge={selectedBadge}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}