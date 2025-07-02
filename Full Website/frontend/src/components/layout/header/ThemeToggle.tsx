'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
  className?: string
}

export default function ThemeToggle({ 
  isDark, 
  onToggle, 
  className = '' 
}: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`flex items-center justify-center rounded-xl p-3 text-gray-700 dark:text-gray-300 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="flex items-center justify-center">
        {isDark ? (
          <Moon className="h-5 w-5 text-blue-400" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-500" />
        )}
      </div>
    </motion.button>
  )
}