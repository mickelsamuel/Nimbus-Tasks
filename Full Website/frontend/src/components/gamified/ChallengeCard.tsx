'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Lock } from 'lucide-react'

interface Challenge {
  id: number
  name: string
  description: string
  status: string
  timeLeft?: string
  unlockLevel?: number
  progress?: number
  total?: number
  reward: {
    xp: number
    coins: number
    badge?: string
  }
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface ChallengeCardProps {
  challenge: Challenge
  index: number
}

export default function ChallengeCard({ challenge, index }: ChallengeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="relative"
    >
      <div 
        className={`rounded-2xl p-6 ${
          challenge.status === 'locked' ? 'opacity-60' : ''
        }`}
        style={{
          background: 'linear-gradient(145deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.6) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        {/* Lock Overlay */}
        {challenge.status === 'locked' && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Unlock at Level {challenge.unlockLevel}</p>
            </div>
          </div>
        )}

        {/* Challenge Content */}
        <div className="text-center">
          <motion.div
            className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${challenge.color} p-3`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <challenge.icon className="h-full w-full text-white" />
          </motion.div>

          <h3 className="text-lg font-bold text-white mb-1">{challenge.name}</h3>
          <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>

          {/* Progress or Status */}
          {challenge.status === 'progress' && challenge.progress !== undefined && (
            <div className="mb-3">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${challenge.color}`}
                  style={{ width: `${(challenge.progress / challenge.total!) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {challenge.progress}/{challenge.total} days
              </span>
            </div>
          )}

          {challenge.timeLeft && (
            <p className="text-xs text-gray-500 mb-3">
              <Clock className="inline h-3 w-3 mr-1" />
              {challenge.timeLeft}
            </p>
          )}

          {/* Rewards */}
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-purple-400">+{challenge.reward.xp} XP</span>
            <span className="text-yellow-400">+{challenge.reward.coins} 🪙</span>
            {challenge.reward.badge && (
              <span className="text-blue-400">🏅 {challenge.reward.badge}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}