import { motion } from 'framer-motion'
import { Milestone, Trophy, Clock, CheckCircle2 } from 'lucide-react'

interface MilestoneData {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  target: number
  current: number
  reward: number
  deadline?: string
  completed: boolean
  icon: string
}

interface AchievementMilestonesProps {
  milestones: MilestoneData[]
}

export function AchievementMilestones({ milestones }: AchievementMilestonesProps) {
  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'daily': return 'from-blue-500 to-cyan-500'
      case 'weekly': return 'from-purple-500 to-pink-500'
      case 'monthly': return 'from-orange-500 to-red-500'
      case 'special': return 'from-yellow-500 to-amber-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Daily Challenge'
      case 'weekly': return 'Weekly Goal'
      case 'monthly': return 'Monthly Target'
      case 'special': return 'Special Event'
      default: return 'Milestone'
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
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Milestone className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Milestones & Challenges</h2>
        </div>
        <button className="px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border ${
              milestone.completed 
                ? 'border-green-500 dark:border-green-400' 
                : 'border-gray-200 dark:border-gray-700'
            } hover:shadow-lg transition-all`}
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getMilestoneColor(milestone.type)} opacity-10 rounded-full blur-2xl`} />

            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${getMilestoneColor(milestone.type)} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {milestone.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{milestone.title}</h3>
                      {milestone.completed && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{milestone.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getMilestoneColor(milestone.type)} text-white font-medium`}>
                        {getTypeLabel(milestone.type)}
                      </span>
                      {milestone.deadline && (
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{milestone.deadline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reward */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold text-lg">+{milestone.reward}</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">XP</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className={`font-medium ${
                    milestone.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {milestone.current}/{milestone.target} {milestone.completed && '✓'}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-full ${
                      milestone.completed 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : `bg-gradient-to-r ${getMilestoneColor(milestone.type)}`
                    }`}
                  />
                </div>
              </div>

              {/* Action Button */}
              {!milestone.completed && milestone.current === milestone.target && (
                <button className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105">
                  Claim Reward
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}