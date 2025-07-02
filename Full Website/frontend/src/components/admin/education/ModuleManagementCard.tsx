'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen,
  Clock,
  Star,
  Eye,
  Edit3,
  BarChart3
} from 'lucide-react'
import { ModuleCardProps } from '../types'
import { getDifficultyColor, getModuleStatusColor } from '../styles'

export const ModuleManagementCard = ({ module, index }: ModuleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-500 cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-br ${getDifficultyColor(module.difficulty)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`p-3 rounded-xl bg-gradient-to-br ${getDifficultyColor(module.difficulty)} shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <BookOpen className="h-6 w-6 text-white" />
            </motion.div>

            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">
                {module.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(module.difficulty)} text-white capitalize`}>
                  {module.difficulty}
                </span>
                <span className="text-xs text-slate-400">{module.category}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${getModuleStatusColor(module.status)} rounded-full`} />
            <span className="text-xs text-slate-300 capitalize">{module.status}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{module.completionRate}%</div>
            <div className="text-xs text-slate-400">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{module.enrolledUsers}</div>
            <div className="text-xs text-slate-400">Enrolled</div>
          </div>
        </div>

        {/* Duration & Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-300">{module.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-slate-300">{module.ratings} ({module.totalRatings})</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Overall Progress</span>
            <span className="text-slate-300">{module.completionRate}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(module.difficulty)}`}
              initial={{ width: 0 }}
              animate={{ width: `${module.completionRate}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Eye className="h-4 w-4 mx-auto" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Edit3 className="h-4 w-4 mx-auto" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <BarChart3 className="h-4 w-4 mx-auto" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}