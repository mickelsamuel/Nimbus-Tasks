import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, TrendingUp, Star } from 'lucide-react'
import Image from 'next/image'

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar: string
  points: number
  achievements: number
  level: number
  trend: 'up' | 'down' | 'same'
  trendValue?: number
  isCurrentUser?: boolean
}

interface AchievementLeaderboardProps {
  leaderboard: LeaderboardEntry[]
}

export function AchievementLeaderboard({ leaderboard }: AchievementLeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />
      default:
        return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-amber-500'
      case 2:
        return 'from-gray-400 to-gray-500'
      case 3:
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-purple-600 to-blue-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievement Leaderboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            This Week
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
            All Time
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
          >
            <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-all ${
              index === 0 ? 'transform scale-105' : ''
            }`}>
              {/* Rank Badge */}
              <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${getRankColor(entry.rank)} rounded-full flex items-center justify-center shadow-lg`}>
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto mb-3 mt-4">
                <Image
                  src={entry.avatar || '/avatars/default.jpg'}
                  alt={entry.name}
                  fill
                  className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
                {entry.rank === 1 && (
                  <div className="absolute -top-2 -right-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{entry.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Level {entry.level}</p>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{entry.points.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {entry.achievements} achievements
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rest of Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Player</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">Level</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">Achievements</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">XP</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">Trend</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(3).map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    entry.isCurrentUser ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src={entry.avatar || '/avatars/default.jpg'}
                          alt={entry.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {entry.name}
                          {entry.isCurrentUser && (
                            <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">(You)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      {entry.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-gray-900 dark:text-white">{entry.achievements}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-gray-900 dark:text-white">{entry.points.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {entry.trend === 'up' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-400">+{entry.trendValue}</span>
                        </>
                      ) : entry.trend === 'down' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                          <span className="text-sm text-red-600 dark:text-red-400">-{entry.trendValue}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View More */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full py-2 text-center text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors font-medium">
            View Full Leaderboard
          </button>
        </div>
      </div>
    </motion.div>
  )
}