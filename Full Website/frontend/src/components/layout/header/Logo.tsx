'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <motion.div 
      className={`flex items-center gap-4 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Simple Logo - No 3D effects */}
      <motion.div
        className="relative"
        whileHover={{ 
          scale: 1.05,
          transition: { type: 'spring', stiffness: 300 }
        }}
      >
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25 border border-primary-400/30">
          <span className="text-xl font-bold text-white tracking-wide">BNC</span>
        </div>
      </motion.div>

      {/* Brand Text */}
      <div className="hidden sm:block">
        <h1 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white tracking-wide">
          BNC Learning
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          National Bank of Canada
        </p>
      </div>
    </motion.div>
  )
}