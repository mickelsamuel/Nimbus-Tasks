'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import AvatarViewer3D from '@/components/avatar/AvatarViewer3D'
import { useAuth } from '@/contexts/AuthContext'
import { UserProfile } from '../types'

interface Avatar3DDisplayProps {
  user: UserProfile
  show3DAvatar: boolean
  onClose: () => void
  avatarAnimating: boolean
  onAnimationToggle: () => void
}

export default function Avatar3DDisplay({ 
  user, 
  show3DAvatar, 
  onClose, 
  avatarAnimating
}: Avatar3DDisplayProps) {
  const { user: authUser } = useAuth()
  return (
    <AnimatePresence>
      {show3DAvatar && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  3D Avatar Preview
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {user.firstName} {user.lastName} - Level {user.stats.level}
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* 3D Avatar Container */}
            <div className="p-6">
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl overflow-hidden">
                <AvatarViewer3D
                  avatarUrl={authUser?.avatar || user.avatar || 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb'}
                  isAnimating={avatarAnimating}
                  className="w-full h-full"
                />

                {/* Loading Overlay */}
                <motion.div
                  className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-gray-600 dark:text-gray-400">Loading 3D Avatar...</p>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <motion.button
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset View
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Customize Avatar
                </motion.button>
              </div>

              {/* Avatar Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.stats.level}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(user.stats.totalXP || user.stats.xp || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">XP</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.stats.currentStreak}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}