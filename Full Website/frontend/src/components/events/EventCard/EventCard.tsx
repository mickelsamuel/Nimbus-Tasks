'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Calendar, Clock, Users, Star, Crown,
  Play, ChevronRight, Timer, Bell, Target, Medal,
  Sparkles, TrendingUp
} from 'lucide-react'
import UserAvatar from '@/components/ui/UserAvatar'
import Image from 'next/image'
import { Event, ChallengeDifficulty } from '../types/event.types'

interface EventCardProps {
  event: Event
  index: number
  viewMode?: 'grid' | 'list'
  onJoin?: (eventId: number) => void
  onNotify?: (eventId: number) => void
}

export default function EventCard({ event, viewMode = 'grid', onJoin, onNotify }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const getDifficultyColor = (difficulty: ChallengeDifficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'hard': return 'text-orange-400 bg-orange-400/20'
      case 'expert': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    if (diff <= 0) return 'Event ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  const getStatusBadge = (status: Event['status']) => {
    switch (status) {
      case 'live':
        return (
          <div className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500 flex items-center space-x-1 animate-pulse shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <span>LIVE</span>
          </div>
        )
      case 'upcoming':
        return (
          <div className="px-3 py-1 rounded-full text-xs font-bold text-blue-800 dark:text-blue-200 bg-blue-200 dark:bg-blue-800 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>UPCOMING</span>
          </div>
        )
      case 'featured':
        return (
          <div className="px-3 py-1 rounded-full text-xs font-bold text-yellow-800 dark:text-yellow-200 bg-yellow-200 dark:bg-yellow-800 flex items-center space-x-1">
            <Crown className="w-3 h-3" />
            <span>FEATURED</span>
          </div>
        )
      case 'ended':
        return (
          <div className="px-3 py-1 rounded-full text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700">
            ENDED
          </div>
        )
      default:
        return null
    }
  }

  const getCategoryColor = (category: Event['category']) => {
    switch (category) {
      case 'training':
        return 'from-blue-500 to-blue-600'
      case 'competition':
        return 'from-red-500 to-orange-500'
      case 'team':
        return 'from-green-500 to-emerald-500'
      case 'special':
        return 'from-purple-500 to-pink-500'
      case 'certification':
        return 'from-yellow-500 to-orange-400'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const handleJoin = () => {
    onJoin?.(event.id)
  }

  const handleNotify = () => {
    onNotify?.(event.id)
  }

  return (
    <motion.div 
      className={`group relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/30 shadow-2xl shadow-black/5 dark:shadow-black/20 ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        rotateX: 2,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Animated Background Glow */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          background: [
            `linear-gradient(45deg, ${getCategoryColor(event.category).replace('from-', '').replace('to-', '').split(' ')[0]}20, transparent)`,
            `linear-gradient(135deg, transparent, ${getCategoryColor(event.category).replace('from-', '').replace('to-', '').split(' ')[1]}20)`,
            `linear-gradient(225deg, ${getCategoryColor(event.category).replace('from-', '').replace('to-', '').split(' ')[0]}20, transparent)`
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Cover Image with Dynamic Overlays */}
      <div className="relative h-56 overflow-hidden rounded-t-3xl">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
        </motion.div>
        
        {/* Multiple gradient overlays for depth */}
        <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(event.category)} opacity-40`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
        
        {/* Animated sparkles */}
        <motion.div
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute top-4 right-16 text-yellow-400"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        
        {/* Status Badge with enhanced styling */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          className="absolute top-4 left-4"
        >
          {getStatusBadge(event.status)}
        </motion.div>
        
        {/* Time Remaining for Live Events with pulse effect */}
        {event.status === 'live' && (
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0 rgba(239, 68, 68, 0.4)',
                '0 0 0 10px rgba(239, 68, 68, 0)',
                '0 0 0 0 rgba(239, 68, 68, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-2xl text-xs font-bold text-white flex items-center space-x-2 border border-white/20"
          >
            <Timer className="w-4 h-4 text-red-400" />
            <span>{getTimeRemaining(event.endDate)}</span>
          </motion.div>
        )}
        
        {/* Enhanced Participant Counter */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-2xl text-sm font-semibold text-white flex items-center space-x-2 border border-white/20"
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>{event.participants}/{event.maxParticipants}</span>
          <motion.div
            animate={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
          />
        </motion.div>
        
        {/* Trending indicator for popular events */}
        {event.participants > event.maxParticipants * 0.8 && (
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
            className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-full"
          >
            <TrendingUp className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      {/* Event Information Panel with enhanced styling */}
      <div className="p-8 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent dark:from-slate-700/30" />
        </div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <motion.h3 
              whileHover={{ 
                scale: 1.02,
                color: event.status === 'live' ? '#ef4444' : '#3b82f6'
              }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-3 cursor-pointer line-clamp-2"
            >
              {event.title}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              className="text-gray-600 dark:text-gray-400 text-base leading-relaxed line-clamp-3"
            >
              {event.description}
            </motion.p>
          </div>

          {/* Enhanced Event Stats Grid with glassmorphism */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-sm bg-gradient-to-r from-white/60 to-blue-50/60 dark:from-slate-700/60 dark:to-slate-600/40 rounded-2xl p-6 mb-6 border border-white/30 dark:border-slate-600/30"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center justify-center px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-lg"
              >
                <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                <span className="truncate">{event.startDate.toLocaleDateString()}</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center justify-center px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-lg"
              >
                <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
                <span className="truncate">{event.rewards.coins} coins</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center justify-center px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-lg"
              >
                <Star className="w-5 h-5 mr-3 text-purple-500" />
                <span className="truncate">{event.rewards.experience} XP</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Expandable Challenge System */}
          <div className="mb-6">
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between text-gray-900 dark:text-white font-bold py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 transition-all duration-300"
            >
              <span className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Target className="w-5 h-5 text-blue-500" />
                </motion.div>
                <span>Challenge Showcase ({event.challenges.length})</span>
                <div className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                  {event.challenges.length}
                </div>
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-4 max-h-80 overflow-y-auto"
                >
                  {event.challenges.map((challenge, idx) => (
                    <motion.div 
                      key={challenge.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="backdrop-blur-sm bg-white/70 dark:bg-slate-700/70 border border-white/40 dark:border-slate-600/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-gray-900 dark:text-white text-base flex-1 pr-2">{challenge.title}</h4>
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)} border border-current/20`}
                        >
                          {challenge.difficulty.toUpperCase()}
                        </motion.span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{challenge.description}</p>
                      
                      {challenge.progress !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Progress</span>
                            <span className="text-blue-500 dark:text-blue-400 font-bold">{challenge.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${challenge.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 h-3 rounded-full shadow-sm"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        {/* Leaderboard Integration */}
        {event.leaderboard && (
          <div className="mb-6">
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="w-full flex items-center justify-between text-gray-900 dark:text-white font-semibold py-2 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Medal className="w-4 h-4" />
                <span>Championship Leaderboard</span>
              </span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showLeaderboard ? 'rotate-90' : ''}`} />
            </button>
            
            {showLeaderboard && (
              <div className="mt-4 space-y-2">
                {event.leaderboard.slice(0, 3).map((entry) => (
                  <div key={entry.rank} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    entry.rank === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
                    entry.rank === 2 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                    'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-600/30'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      'bg-orange-600 text-white'
                    }`}>
                      {entry.rank}
                    </div>
                    <UserAvatar
                      user={{
                        avatar: entry.avatar,
                        firstName: entry.user.split(' ')[0],
                        lastName: entry.user.split(' ')[1] || '',
                        role: 'Competitor',
                        level: Math.floor(entry.score / 1000),
                        isOnline: true
                      }}
                      size="sm"
                      showStatus={false}
                      showLevel={false}
                      animationType={entry.rank === 1 ? 'glow' : 'none'}
                    />
                    <div className="flex-1">
                      <div className="text-white text-sm font-semibold">{entry.user}</div>
                      <div className="text-gray-400 text-xs">{entry.score.toLocaleString()} points</div>
                    </div>
                    {entry.rank <= 3 && (
                      <Trophy className={`w-4 h-4 ${
                        entry.rank === 1 ? 'text-yellow-500' :
                        entry.rank === 2 ? 'text-gray-400' :
                        'text-orange-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

          {/* Enhanced Action Buttons */}
          <div className="flex space-x-4">
            <motion.button 
              onClick={handleJoin}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group"
            >
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Play className="w-5 h-5" />
              </motion.div>
              <span className="relative z-10">Join Event</span>
              
              {/* Particle effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                    "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
            
            <motion.button 
              onClick={handleNotify}
              whileHover={{ 
                scale: 1.1,
                rotate: 10,
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.9 }}
              className="px-6 py-4 rounded-2xl border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 shadow-lg hover:shadow-xl"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3 
                }}
              >
                <Bell className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>

          {/* Enhanced Reward Badges with animations */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            {event.rewards.badges.map((badge, idx) => (
              <motion.span 
                key={idx}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: idx * 0.1, 
                  type: "spring", 
                  stiffness: 300 
                }}
                whileHover={{ 
                  scale: 1.15, 
                  rotate: 5,
                  y: -2
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-full border-2 border-purple-200/50 dark:border-purple-700/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-sm"
              >
                <motion.span
                  animate={{ 
                    textShadow: [
                      "0 0 0px rgba(147, 51, 234, 0)",
                      "0 0 10px rgba(147, 51, 234, 0.5)",
                      "0 0 0px rgba(147, 51, 234, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                >
                  ✨ {badge}
                </motion.span>
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}