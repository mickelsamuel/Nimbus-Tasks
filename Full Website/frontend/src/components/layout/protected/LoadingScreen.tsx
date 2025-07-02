'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* BNC Logo */}
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        >
          <span className="text-2xl font-bold text-white tracking-wide">NBC</span>
        </motion.div>
        
        {/* Loading Spinner */}
        <div className="spinner" />
        
        {/* Loading Text */}
        <motion.p
          className="text-gray-600 dark:text-gray-400 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}