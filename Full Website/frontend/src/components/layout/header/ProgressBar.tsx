'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress?: number
  className?: string
}

export default function ProgressBar({ progress = 73, className = '' }: ProgressBarProps) {
  const validProgress = typeof progress === 'number' && !isNaN(progress) ? Math.max(0, Math.min(100, progress)) : 0;
  
  return (
    <motion.div 
      className={`absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 ${className}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <motion.div 
        className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500"
        initial={{ width: '0%' }}
        animate={{ width: `${validProgress}%` }}
        transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
      >
        {/* Glowing effect at the end */}
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white/50 animate-pulse" />
      </motion.div>
    </motion.div>
  )
}