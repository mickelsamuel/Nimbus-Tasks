import { motion } from 'framer-motion'
import { Target, Zap, Calendar } from 'lucide-react'

interface AchievementProgressProps {
  stats: {
    completionRate: number
    currentStreak: number
    totalXP: number
    rank: string
    nextRankXP: number
    monthlyTarget: number
    monthlyProgress: number
  }
  milestones: Array<{
    id: string
    title: string
    target: number
    current: number
    reward: number
    icon: string
  }>
}

export function AchievementProgress({ stats, milestones }: AchievementProgressProps) {
  const rankProgress = ((stats.totalXP || 0) / (stats.nextRankXP || 1)) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Rank Progress */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Your Progress Journey</h3>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium">Current Rank: {stats.rank}</span>
                <span className="text-sm opacity-80">{(stats.totalXP || 0).toLocaleString()} / {(stats.nextRankXP || 0).toLocaleString()} XP</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rankProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Completion Rate</span>
                </div>
                <div className="text-2xl font-bold">{stats.completionRate}%</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Current Streak</span>
                </div>
                <div className="text-2xl font-bold">{stats.currentStreak} days</div>
              </div>
            </div>
          </div>

          {/* Right Side - Monthly Target */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="16"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="white"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 553", strokeDashoffset: 0 }}
                  animate={{
                    strokeDasharray: "553 553",
                    strokeDashoffset: 553 - (553 * stats.monthlyProgress) / stats.monthlyTarget
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Calendar className="w-8 h-8 mb-2" />
                <div className="text-3xl font-bold">{Math.round((stats.monthlyProgress / stats.monthlyTarget) * 100)}%</div>
                <div className="text-sm opacity-80">Monthly Goal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Milestones */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.slice(0, 4).map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl">{milestone.icon}</div>
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  +{milestone.reward} XP
                </div>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{milestone.title}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {milestone.current}/{milestone.target}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}