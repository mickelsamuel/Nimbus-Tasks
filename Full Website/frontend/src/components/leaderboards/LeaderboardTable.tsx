'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Flame
} from 'lucide-react'
import { LeaderboardAvatar } from '@/components/ui/UserAvatar'

interface LeaderboardUser {
  id: number
  name: string
  department: string
  avatar: string
  score: number
  rank: number
  previousRank: number
  achievements: number
  streak: number
  completedModules: number
  averageScore: number
  trend: 'up' | 'down' | 'stable'
  badges: string[]
  country?: string
  team?: string
}

interface LeaderboardTableProps {
  users: LeaderboardUser[]
  loading?: boolean
  maxRows?: number
}

export default function LeaderboardTable({ 
  users, 
  loading = false, 
  maxRows = 20 
}: LeaderboardTableProps) {
  if (loading) {
    return (
      <div className="championship-league-table animate-pulse">
        <div className="h-64 bg-gray-800/30 rounded-xl" />
      </div>
    )
  }

  const displayUsers = users.slice(0, maxRows)

  return (
    <motion.div
      className="championship-league-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        borderRadius: '20px',
        overflow: 'hidden',
        margin: '24px 0',
        position: 'relative'
      }}
    >
      {/* Table Header */}
      <div 
        className="table-header"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 140, 0, 0.15) 100%)',
          borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
          padding: '20px'
        }}
      >
        <div className="hidden md:grid grid-cols-12 gap-4 text-yellow-300 font-bold text-sm uppercase tracking-wide">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-3">Competitor</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center">Achievements</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-2 text-center">Trend</div>
        </div>
        <div className="md:hidden grid grid-cols-4 gap-2 text-yellow-300 font-bold text-xs uppercase tracking-wide">
          <div className="text-center">Rank</div>
          <div className="col-span-2">Competitor</div>
          <div className="text-center">Score</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-y-auto max-h-[600px]">
        {displayUsers.map((user, index) => (
          <motion.div
            key={user.id}
            className="league-table-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 2.2 + index * 0.05 }}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{
              backgroundColor: 'rgba(255, 215, 0, 0.05)',
              x: 4
            }}
          >
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-12 gap-4 items-center p-4">
              {/* Rank Cell */}
              <div className="col-span-1 text-center">
                <div className="rank-number text-2xl font-bold text-yellow-400">
                  {user.rank}
                </div>
                {user.rank !== user.previousRank && (
                  <div className={`rank-change-indicator ${user.rank < user.previousRank ? 'rank-up' : 'rank-down'}`}>
                    {user.rank < user.previousRank ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  </div>
                )}
              </div>

              {/* Competitor Info */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="relative">
                  <LeaderboardAvatar
                    user={{
                      avatar: user.avatar,
                      firstName: user.name.split(' ')[0],
                      lastName: user.name.split(' ')[1] || '',
                      role: user.department,
                      level: Math.floor(user.score / 100),
                      isOnline: false
                    }}
                    rank={user.rank}
                    size="lg"
                    showLevel={true}
                    showStatus={true}
                    className="border-2 border-yellow-400/40"
                  />
                  {user.rank <= 3 && <div className="champion-aura" />}
                </div>
                <div>
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-sm text-yellow-300/70">{user.department}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {user.badges.slice(0, 3).map((badge, idx) => (
                      <span key={idx} className="text-sm">{badge}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="col-span-2 text-center">
                <div className="text-xl font-bold text-yellow-300">{user.score.toLocaleString()}</div>
                <div className="text-xs text-gray-400">XP</div>
              </div>

              {/* Achievements */}
              <div className="col-span-2 text-center">
                <div className="flex justify-center gap-1">
                  {user.badges.slice(0, 3).map((badge, i) => (
                    <span key={i} className="text-xl">{badge}</span>
                  ))}
                  {user.badges.length > 3 && (
                    <span className="text-sm text-gray-400">+{user.badges.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Streak */}
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className={`h-5 w-5 ${user.streak > 7 ? 'text-orange-500' : 'text-gray-500'}`} />
                  <span className="font-bold text-white">{user.streak}</span>
                </div>
              </div>

              {/* Trend */}
              <div className="col-span-2 text-center">
                <div className="performance-trend inline-block">
                  {user.trend === 'up' && (
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  )}
                  {user.trend === 'down' && (
                    <TrendingDown className="h-6 w-6 text-red-400" />
                  )}
                  {user.trend === 'stable' && (
                    <Minus className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden grid grid-cols-4 gap-2 items-center p-3">
              {/* Rank */}
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{user.rank}</div>
                {user.rank !== user.previousRank && (
                  <div className="text-xs">
                    {user.rank < user.previousRank ? '↑' : '↓'}
                  </div>
                )}
              </div>

              {/* Competitor Info */}
              <div className="col-span-2 flex items-center gap-2">
                <div className="relative">
                  <LeaderboardAvatar
                    user={{
                      avatar: user.avatar,
                      firstName: user.name.split(' ')[0],
                      lastName: user.name.split(' ')[1] || '',
                      role: user.department,
                      level: Math.floor(user.score / 100),
                      isOnline: false
                    }}
                    rank={user.rank}
                    size="sm"
                    showLevel={false}
                    showStatus={false}
                    className="border border-yellow-400/40"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white text-sm truncate">{user.name}</div>
                  <div className="text-xs text-yellow-300/70 truncate">{user.department}</div>
                  <div className="flex items-center gap-1">
                    <Flame className={`h-3 w-3 ${user.streak > 7 ? 'text-orange-500' : 'text-gray-500'}`} />
                    <span className="text-xs text-white">{user.streak}</span>
                    <div className="ml-1">
                      {user.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-400" />}
                      {user.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-400" />}
                      {user.trend === 'stable' && <Minus className="h-3 w-3 text-gray-400" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-300">{user.score > 999 ? `${(user.score/1000).toFixed(1)}k` : user.score}</div>
                <div className="text-xs text-gray-400">XP</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        /* Rank Change Indicators */
        .rank-change-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .rank-up {
          background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
          color: white;
          animation: rank-up-celebration 1s ease-out;
        }

        @keyframes rank-up-celebration {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .rank-down {
          background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
          color: white;
        }

        .champion-aura {
          position: absolute;
          inset: -6px;
          border: 2px solid transparent;
          border-top-color: #FFD700;
          border-radius: 50%;
          animation: champion-aura-rotate 3s linear infinite;
        }

        @keyframes champion-aura-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}