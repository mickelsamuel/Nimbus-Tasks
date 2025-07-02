'use client'

import { useState, useCallback } from 'react'
import { 
  BookOpen, Clock, Star, Users, TrendingUp, Target,
  Eye, MessageCircle, Heart, Share2, CheckCircle2,
  PlayCircle, Bookmark, Zap, Award
} from 'lucide-react'
import { Module } from '@/types/modules'

interface ModuleCardProps {
  module: Module
  index: number
  onEnroll?: (moduleId: number) => void
  onStart?: (moduleId: number) => void
  onPreview?: (moduleId: number) => void
  onDiscuss?: (moduleId: number) => void
  onShare?: (moduleId: number) => void
  onBookmark?: (moduleId: number, bookmarked: boolean) => void
  onLike?: (moduleId: number, liked: boolean) => void
}

export default function ModuleCard({ module, index, onEnroll, onStart, onPreview, onDiscuss, onShare, onBookmark, onLike }: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(module.isBookmarked || false)
  const [isLiked, setIsLiked] = useState(false)
  
  const handleBookmarkToggle = useCallback(() => {
    const newBookmarked = !isBookmarked
    setIsBookmarked(newBookmarked)
    onBookmark?.(module.id, newBookmarked)
  }, [isBookmarked, module.id, onBookmark])
  
  const handleLikeToggle = useCallback(() => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    onLike?.(module.id, newLiked)
  }, [isLiked, module.id, onLike])

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          gradient: 'from-yellow-400 via-orange-500 to-red-500',
          bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
          borderColor: 'border-yellow-300 dark:border-yellow-600',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          icon: Award,
          label: 'Legendary',
          glow: 'shadow-yellow-500/25'
        }
      case 'epic':
        return {
          gradient: 'from-purple-500 to-pink-500',
          bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
          borderColor: 'border-purple-300 dark:border-purple-600',
          textColor: 'text-purple-800 dark:text-purple-200',
          icon: Target,
          label: 'Epic',
          glow: 'shadow-purple-500/25'
        }
      case 'rare':
        return {
          gradient: 'from-blue-500 to-indigo-500',
          bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          borderColor: 'border-blue-300 dark:border-blue-600',
          textColor: 'text-blue-800 dark:text-blue-200',
          icon: Star,
          label: 'Rare',
          glow: 'shadow-blue-500/25'
        }
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50',
          borderColor: 'border-gray-200 dark:border-gray-700',
          textColor: 'text-gray-700 dark:text-gray-300',
          icon: BookOpen,
          label: 'Common',
          glow: 'shadow-gray-500/25'
        }
    }
  }

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'Expert':
        return { color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' }
      case 'Advanced':
        return { color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' }
      case 'Intermediate':
        return { color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' }
      default:
        return { color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' }
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatLastAccessed = (date: string | null) => {
    if (!date) return 'Never accessed'
    return `Last accessed: ${new Date(date).toLocaleDateString()}`
  }

  const rarityConfig = getRarityConfig(module.rarity)
  const difficultyConfig = getDifficultyConfig(module.difficulty)
  const RarityIcon = rarityConfig.icon
  const isCompleted = module.userProgress?.progress === 100
  const hasProgress = module.userProgress && module.userProgress.progress > 0
  const progressPercentage = module.userProgress?.progress || 0

  return (
    <div
      className={`dashboard-card group relative overflow-hidden rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${rarityConfig.glow}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Animated Border for Rare+ Modules */}
      {module.rarity !== 'common' && (
        <div className="absolute inset-0 rounded-2xl p-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500">
          <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900" />
        </div>
      )}

      {/* Header Section */}
      <div className={`relative h-48 bg-gradient-to-br ${rarityConfig.bgGradient} border-b ${rarityConfig.borderColor}`}>
        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isCompleted && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed</span>
            </div>
          )}
          {module.rarity !== 'common' && (
            <div className={`flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${rarityConfig.gradient} text-white text-xs font-bold rounded-full shadow-lg`}>
              <RarityIcon className="w-3 h-3" />
              <span>{rarityConfig.label}</span>
            </div>
          )}
          {module.enrolled > 1000 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
              <TrendingUp className="w-3 h-3" />
              <span>Trending</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
              isBookmarked
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 dark:bg-gray-800/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            {module.rarity === 'legendary' && (
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-50 animate-ping" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {hasProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title and Description */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
              {module.title}
            </h3>
            {isCompleted && (
              <div className="flex-shrink-0 p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
            {module.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${difficultyConfig.color} transition-all duration-300 hover:scale-105`}>
            {module.difficulty}
          </span>
          <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105">
            {module.category}
          </span>
          {module.xp > 200 && (
            <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-105">
              <Zap className="w-3 h-3 inline mr-1" />
              +{module.xp} XP
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 justify-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{formatDuration(module.duration)}</span>
          </div>
          <div className="flex items-center gap-2 justify-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{module.rating}</span>
          </div>
          <div className="flex items-center gap-2 justify-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Users className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{module.enrolled > 999 ? `${Math.floor(module.enrolled/1000)}k` : module.enrolled}</span>
          </div>
        </div>

        {/* Progress Section */}
        {hasProgress && !isCompleted && (
          <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between text-sm">
              <span className="text-blue-600 dark:text-blue-400 font-medium">Learning Progress</span>
              <span className="font-bold text-blue-800 dark:text-blue-200">
                {progressPercentage}% complete
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {formatLastAccessed(module.userProgress?.lastAccessed || null)}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onPreview?.(module.id)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button 
              onClick={() => onDiscuss?.(module.id)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuss</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleLikeToggle}
              className={`p-2 rounded-lg transition-colors ${
                isLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => onShare?.(module.id)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => module.userProgress ? onStart?.(module.id) : onEnroll?.(module.id)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              {module.userProgress ? (
                <>
                  <PlayCircle className="w-5 h-5" />
                  <span>Continue</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  <span>Start</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hover Overlay with Quick Preview */}
      {isHovered && (
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Quick Preview
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span>+{module.xp} XP</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Estimated time: {formatDuration(module.duration)}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>{module.instructor}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>{module.enrolled.toLocaleString()} students enrolled</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => module.userProgress ? onStart?.(module.id) : onEnroll?.(module.id)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {module.userProgress ? 'Continue Learning' : 'Start Learning'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}