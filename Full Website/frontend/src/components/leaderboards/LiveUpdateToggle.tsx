'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Pause } from 'lucide-react'

interface LiveUpdateToggleProps {
  active: boolean
  onToggle: (active: boolean) => void
}

export default function LiveUpdateToggle({ active, onToggle }: LiveUpdateToggleProps) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      <motion.button
        onClick={() => onToggle(!active)}
        className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg backdrop-blur-sm border ${
          active
            ? 'bg-green-500/90 hover:bg-green-600/90 text-white border-green-400 shadow-green-500/25'
            : 'bg-slate-200/90 hover:bg-slate-300/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icon */}
        <div className="relative">
          {active ? (
            <>
              <Zap className="h-5 w-5" />
              <div className="absolute inset-0 animate-ping">
                <Zap className="h-5 w-5 opacity-75" />
              </div>
            </>
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </div>

        {/* Text */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span>{active ? 'Live Updates' : 'Updates Paused'}</span>
            {active && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Mobile indicator */}
        <div className="sm:hidden">
          {active && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {active ? 'Pause live updates' : 'Resume live updates'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
        </div>
      </motion.button>
    </motion.div>
  )
}