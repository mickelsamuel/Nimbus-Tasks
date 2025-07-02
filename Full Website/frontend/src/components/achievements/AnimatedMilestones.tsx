import { motion } from 'framer-motion'
import { Calendar, Trophy, Target, Clock, CheckCircle, Star, Crown, Gift } from 'lucide-react'

interface Milestone {
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

interface AnimatedMilestonesProps {
  milestones: Milestone[]
}

export function AnimatedMilestones({ milestones }: AnimatedMilestonesProps) {
  const getMilestoneConfig = (type: string) => {
    switch (type) {
      case 'daily':
        return {
          gradient: 'from-emerald-500 to-green-600',
          bg: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
          border: 'border-emerald-200/50 dark:border-emerald-700/50',
          icon: Calendar,
          label: 'Daily Goal',
          color: 'text-emerald-600 dark:text-emerald-400'
        }
      case 'weekly':
        return {
          gradient: 'from-blue-500 to-cyan-600',
          bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
          border: 'border-blue-200/50 dark:border-blue-700/50',
          icon: Target,
          label: 'Weekly Challenge',
          color: 'text-blue-600 dark:text-blue-400'
        }
      case 'monthly':
        return {
          gradient: 'from-purple-500 to-violet-600',
          bg: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
          border: 'border-purple-200/50 dark:border-purple-700/50',
          icon: Trophy,
          label: 'Monthly Goal',
          color: 'text-purple-600 dark:text-purple-400'
        }
      case 'special':
        return {
          gradient: 'from-amber-500 to-orange-600',
          bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
          border: 'border-amber-200/50 dark:border-amber-700/50',
          icon: Crown,
          label: 'Special Event',
          color: 'text-amber-600 dark:text-amber-400'
        }
      default:
        return {
          gradient: 'from-gray-500 to-slate-600',
          bg: 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
          border: 'border-gray-200/50 dark:border-gray-700/50',
          icon: Star,
          label: 'Goal',
          color: 'text-gray-600 dark:text-gray-400'
        }
    }
  }

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return ''
    const date = new Date(deadline)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return `${diffDays} days left`
  }

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
            Active Milestones
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track your progress on current goals and challenges
          </p>
        </motion.div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {milestones.map((milestone, index) => {
            const config = getMilestoneConfig(milestone.type)
            const progressPercentage = Math.min((milestone.current / milestone.target) * 100, 100)
            const isCompleted = milestone.completed
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Success Particles */}
                {isCompleted && Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    style={{
                      left: `${10 + i * 15}%`,
                      top: `${5 + (i % 2) * 10}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
                
                {/* Card */}
                <div className={`relative bg-gradient-to-br ${config.bg} backdrop-blur-sm rounded-3xl p-6 border ${config.border} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  {/* Completion Overlay */}
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.4 }
                      }}
                    >
                      <config.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${config.color} mb-1`}>
                        {config.label}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                        {milestone.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Progress Section */}
                  <div className="space-y-3 mb-4">
                    {/* Progress Numbers */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {milestone.current}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {milestone.target}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <motion.div
                          className={`h-3 bg-gradient-to-r ${config.gradient} rounded-full relative overflow-hidden`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1.5, ease: "easeOut" }}
                        >
                          {/* Animated shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 skew-x-12"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </motion.div>
                      </div>
                      
                      {/* Progress Percentage */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 1 }}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1 text-xs font-bold text-white bg-gray-800 dark:bg-gray-700 px-2 py-1 rounded-full"
                      >
                        {Math.round(progressPercentage)}%
                      </motion.div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                    {/* Reward */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <Gift className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {milestone.reward} XP
                      </span>
                    </div>

                    {/* Deadline */}
                    {milestone.deadline && !isCompleted && (
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className={`font-medium ${
                          formatDeadline(milestone.deadline).includes('today') || formatDeadline(milestone.deadline).includes('tomorrow')
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatDeadline(milestone.deadline)}
                        </span>
                      </div>
                    )}

                    {/* Completed Status */}
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Pulsing effect for near completion */}
                  {!isCompleted && progressPercentage >= 80 && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-3xl opacity-10`}
                      animate={{ opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="text-4xl font-black text-green-600 dark:text-green-400 mb-2"
              >
                {milestones.filter(m => m.completed).length}
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Completed Milestones</div>
            </div>
            
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
                className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2"
              >
                {milestones.filter(m => !m.completed).length}
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Active Goals</div>
            </div>
            
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: "spring" }}
                className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2"
              >
                {milestones.reduce((total, m) => total + (m.completed ? m.reward : 0), 0)}
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">XP Earned</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}