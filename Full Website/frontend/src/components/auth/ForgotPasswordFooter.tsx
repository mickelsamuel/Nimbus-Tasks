'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles, Lock } from 'lucide-react'

export default function ForgotPasswordFooter() {
  return (
    <motion.div
      className="mt-12 text-center relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.4 }}
    >
      {/* Enhanced security badge */}
      <motion.div 
        className="flex items-center justify-center gap-3 mb-4 p-3 rounded-xl bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 max-w-xs mx-auto"
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Shield className="h-5 w-5 text-white/80 dark:text-gray-300" />
        </motion.div>
        <span className="text-sm text-white/80 dark:text-gray-300 font-semibold">Bank-Grade Security</span>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Sparkles className="h-4 w-4 text-yellow-400" />
        </motion.div>
      </motion.div>
      
      {/* Enhanced copyright */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <div className="text-sm text-white/70 dark:text-gray-400 font-medium flex items-center justify-center gap-2">
          <motion.div
            animate={{
              rotate: [0, 15],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Lock className="h-4 w-4" />
          </motion.div>
          © 2025 National Bank of Canada. All rights reserved.
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40"
              style={{
                left: `${25 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}