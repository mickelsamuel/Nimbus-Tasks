'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'

interface LeaderboardPlayer {
  rank: number
  name: string
  level: number
  xp: number
  avatar: string
  trend: 'up' | 'down' | 'same'
}

interface LeaderboardProps {
  leaderboard: LeaderboardPlayer[]
}

export default function Leaderboard({ leaderboard }: LeaderboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.8) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
    >
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Team Leaderboard
      </h2>

      <div className="space-y-3">
        {leaderboard.map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-xl ${
              player.name === 'You'
                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                : 'bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Rank */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                player.rank === 1 ? 'bg-yellow-500 text-black' :
                player.rank === 2 ? 'bg-gray-300 text-black' :
                player.rank === 3 ? 'bg-orange-600 text-white' :
                'bg-gray-700 text-gray-300'
              }`}>
                {player.rank}
              </div>

              {/* Avatar */}
              <div className="text-2xl">{player.avatar}</div>

              {/* Name & Level */}
              <div>
                <p className="text-white font-medium">{player.name}</p>
                <p className="text-gray-400 text-sm">Level {player.level}</p>
              </div>
            </div>

            {/* XP & Trend */}
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-medium">{player.xp.toLocaleString()} XP</span>
              {player.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {player.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 font-medium hover:bg-purple-600/30 transition-colors">
        View Full Leaderboard
      </button>
    </motion.div>
  )
}