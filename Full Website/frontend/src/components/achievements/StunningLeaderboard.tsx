import { motion } from 'framer-motion'
import { Crown, Trophy, Medal, TrendingUp, TrendingDown } from 'lucide-react'
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

interface StunningLeaderboardProps {
  leaderboard: LeaderboardEntry[]
}

export function StunningLeaderboard({ leaderboard }: StunningLeaderboardProps) {

  const getRankConfig = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          gradient: 'from-amber-400 via-yellow-500 to-orange-600',
          bg: 'from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30',
          border: 'border-amber-300/50 dark:border-amber-600/50',
          text: 'text-amber-700 dark:text-amber-400',
          glow: 'shadow-amber-500/50',
          particles: 'text-amber-400'
        }
      case 2:
        return {
          gradient: 'from-gray-400 via-gray-500 to-gray-600',
          bg: 'from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30',
          border: 'border-gray-300/50 dark:border-gray-600/50',
          text: 'text-gray-700 dark:text-gray-400',
          glow: 'shadow-gray-500/50',
          particles: 'text-gray-400'
        }
      case 3:
        return {
          gradient: 'from-amber-600 via-orange-700 to-yellow-800',
          bg: 'from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30',
          border: 'border-orange-300/50 dark:border-orange-600/50',
          text: 'text-orange-700 dark:text-orange-400',
          glow: 'shadow-orange-500/50',
          particles: 'text-orange-400'
        }
      default:
        return {
          gradient: 'from-blue-500 to-purple-600',
          bg: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
          border: 'border-blue-300/50 dark:border-purple-600/50',
          text: 'text-blue-700 dark:text-blue-400',
          glow: 'shadow-blue-500/50',
          particles: 'text-blue-400'
        }
    }
  }

  const topThree = leaderboard.slice(0, 3)
  const others = leaderboard.slice(3)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Hall of Champions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how you rank against your peers and celebrate top performers
          </p>
        </motion.div>

        {/* Podium - Top 3 */}
        <div className="mb-12">
          <div className="flex items-end justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
            {/* Second Place */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative"
                >
                  {/* Floating particles for second place */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full opacity-0 group-hover:opacity-60"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${10 + (i % 2) * 15}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}

                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-300/50 dark:border-gray-600/50 shadow-xl hover:shadow-2xl transition-all">
                    <div className="text-center">
                      <div className="relative mb-4">
                        <Image
                          src={topThree[1].avatar || '/avatars/default.jpg'}
                          alt={topThree[1].name}
                          className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-gray-300 dark:ring-gray-600 shadow-lg"
                          width={80}
                          height={80}
                        />
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                        {topThree[1].name}
                      </h3>
                      <div className="text-3xl font-black text-gray-600 dark:text-gray-400 mb-2">
                        {topThree[1].points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {topThree[1].achievements} achievements
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Podium Base */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 120 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  className="w-24 bg-gradient-to-t from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-t-xl mt-4 flex items-end justify-center pb-4"
                >
                  <div className="text-white font-black text-4xl">2</div>
                </motion.div>
              </motion.div>
            )}

            {/* First Place */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative"
                >
                  {/* Golden particles for first place */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-80"
                      style={{
                        left: `${10 + i * 12}%`,
                        top: `${5 + (i % 3) * 15}%`,
                      }}
                      animate={{
                        y: [0, -25, 0],
                        scale: [1, 1.8, 1],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 2.5 + i * 0.2,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 backdrop-blur-sm rounded-3xl p-8 border border-amber-300/50 dark:border-amber-600/50 shadow-2xl">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <Image
                          src={topThree[0].avatar || '/avatars/default.jpg'}
                          alt={topThree[0].name}
                          className="w-28 h-28 rounded-3xl object-cover mx-auto ring-4 ring-amber-400 dark:ring-amber-500 shadow-xl"
                          width={112}
                          height={112}
                        />
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-xl"
                        >
                          <Crown className="w-6 h-6 text-white" />
                        </motion.div>
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white text-2xl mb-2">
                        {topThree[0].name}
                      </h3>
                      <div className="text-4xl font-black text-amber-600 dark:text-amber-400 mb-3">
                        {topThree[0].points.toLocaleString()}
                      </div>
                      <div className="text-amber-700 dark:text-amber-400 font-semibold">
                        {topThree[0].achievements} achievements
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Podium Base */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 160 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="w-28 bg-gradient-to-t from-amber-400 to-yellow-500 rounded-t-xl mt-4 flex items-end justify-center pb-6 shadow-lg relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 skew-x-12"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="text-white font-black text-5xl relative z-10">1</div>
                </motion.div>
              </motion.div>
            )}

            {/* Third Place */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative"
                >
                  {/* Bronze particles for third place */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-50"
                      style={{
                        left: `${25 + i * 25}%`,
                        top: `${15 + i * 10}%`,
                      }}
                      animate={{
                        y: [0, -12, 0],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2.2 + i * 0.4,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}

                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 border border-orange-300/50 dark:border-orange-600/50 shadow-xl hover:shadow-2xl transition-all">
                    <div className="text-center">
                      <div className="relative mb-4">
                        <Image
                          src={topThree[2].avatar || '/avatars/default.jpg'}
                          alt={topThree[2].name}
                          className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-orange-400 dark:ring-orange-500 shadow-lg"
                          width={80}
                          height={80}
                        />
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                          <Medal className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                        {topThree[2].name}
                      </h3>
                      <div className="text-3xl font-black text-orange-600 dark:text-orange-400 mb-2">
                        {topThree[2].points.toLocaleString()}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">
                        {topThree[2].achievements} achievements
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Podium Base */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 100 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="w-24 bg-gradient-to-t from-orange-400 to-yellow-500 rounded-t-xl mt-4 flex items-end justify-center pb-3"
                >
                  <div className="text-white font-black text-4xl">3</div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Rest of Leaderboard */}
        {others.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Full Rankings
              </h3>
              
              <div className="space-y-3">
                {others.map((entry, index) => {
                  const config = getRankConfig(entry.rank)
                  
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className={`relative rounded-2xl border transition-all ${
                        entry.isCurrentUser
                          ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-300/50 dark:border-purple-600/50 shadow-lg'
                          : 'bg-gray-50/80 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {entry.isCurrentUser && (
                        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          YOU
                        </div>
                      )}
                      
                      <div className="p-4 flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center ${config.glow} shadow-lg`}>
                            <span className="text-white font-black text-lg">
                              {entry.rank}
                            </span>
                          </div>
                        </div>

                        {/* Avatar & Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Image
                            src={entry.avatar || '/avatars/default.jpg'}
                            alt={entry.name}
                            className="w-12 h-12 rounded-xl object-cover shadow-md"
                            width={48}
                            height={48}
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                              {entry.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>Level {entry.level}</span>
                              <span>{entry.achievements} achievements</span>
                            </div>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <div className="text-2xl font-black text-gray-900 dark:text-white">
                            {entry.points.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            XP
                          </div>
                        </div>

                        {/* Trend */}
                        <div className="flex items-center gap-1">
                          <motion.div
                            animate={{ 
                              y: entry.trend === 'up' ? [0, -2, 0] : entry.trend === 'down' ? [0, 2, 0] : 0
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {entry.trend === 'up' && (
                              <TrendingUp className="w-5 h-5 text-green-500" />
                            )}
                            {entry.trend === 'down' && (
                              <TrendingDown className="w-5 h-5 text-red-500" />
                            )}
                            {entry.trend === 'same' && (
                              <div className="w-5 h-5 flex items-center justify-center">
                                <div className="w-3 h-0.5 bg-gray-400 rounded-full" />
                              </div>
                            )}
                          </motion.div>
                          {entry.trendValue && (
                            <span className={`text-sm font-medium ${
                              entry.trend === 'up' ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {entry.trend === 'up' ? '+' : '-'}{entry.trendValue}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}