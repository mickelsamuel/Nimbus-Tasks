'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TrendingUp, Flame } from 'lucide-react'

interface QuickActionsBarProps {
  show: boolean
  className?: string
}

export default function QuickActionsBar({ show, className = '' }: QuickActionsBarProps) {
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg z-40 ${className}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-8 py-3">
            <div className="flex items-center gap-6">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</span>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboards</span>
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">L</kbd>
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  <TrendingUp className="h-4 w-4" />
                  <span>Simulation</span>
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">S</kbd>
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  <Flame className="h-4 w-4" />
                  <span>Daily Challenge</span>
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">D</kbd>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}