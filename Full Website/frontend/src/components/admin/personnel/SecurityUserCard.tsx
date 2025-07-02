'use client'

import { motion } from 'framer-motion'
import { 
  MoreHorizontal,
  MessageSquare,
  Edit3,
  Lock,
  Unlock
} from 'lucide-react'
import { UserCardProps } from '../types'
import { getRoleColor, getUserStatusColor } from '../styles'

export const SecurityUserCard = ({ user, index }: UserCardProps) => {
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
      className="group relative overflow-hidden rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 transition-all duration-500 cursor-pointer"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-br ${getRoleColor(user.role)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar with Status Ring */}
            <div className="relative">
              <motion.div
                className={`p-1 rounded-full bg-gradient-to-r ${getRoleColor(user.role)}`}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </motion.div>
              
              {/* Status Indicator */}
              <motion.div
                className={`absolute -bottom-1 -right-1 w-4 h-4 ${getUserStatusColor(user.status)} rounded-full border-2 border-slate-900`}
                animate={{ scale: user.status === 'active' ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 2, repeat: user.status === 'active' ? Infinity : 0 }}
              />
            </div>

            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                {user.name}
              </h3>
              <p className="text-slate-300 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getRoleColor(user.role)} text-white capitalize`}>
                  {user.role}
                </span>
                <span className="text-xs text-slate-400">{user.department}</span>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <MoreHorizontal className="h-5 w-5 text-white" />
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{user.completionRate}%</div>
            <div className="text-xs text-slate-400">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{user.points.toLocaleString()}</div>
            <div className="text-xs text-slate-400">XP</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{user.status}</div>
            <div className="text-xs text-slate-400">Status</div>
          </div>
        </div>

        {/* Activity Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Activity Level</span>
            <span className="text-slate-300">{user.lastActive}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${getRoleColor(user.role)}`}
              initial={{ width: 0 }}
              animate={{ width: `${user.completionRate}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <MessageSquare className="h-4 w-4 mx-auto" />
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
            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {user.status === 'active' ? <Lock className="h-4 w-4 mx-auto" /> : <Unlock className="h-4 w-4 mx-auto" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}