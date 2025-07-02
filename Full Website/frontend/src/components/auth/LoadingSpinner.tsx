'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #000a1a 0%, #001a4a 25%, #0A1628 50%, #1E40AF 75%, #F59E0B 100%)'
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Enhanced BNC Logo */}
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.05, 1],
            rotateY: [0, 5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        >
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-3xl relative"
            style={{
              background: 'linear-gradient(145deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%)',
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            <span className="text-3xl font-bold text-white tracking-wide">BNC</span>
            
            {/* Rotating Ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-blue-400/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Pulse Ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-blue-300/30"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>

        {/* Enhanced Spinner */}
        <div className="relative">
          <motion.div
            className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-blue-300/50 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Loading Text with Typewriter Effect */}
        <motion.div className="text-center space-y-2">
          <motion.p
            className="text-xl font-bold text-white tracking-wide"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Loading Executive Portal...
          </motion.p>
          <motion.div
            className="flex items-center justify-center space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-64 h-1 bg-gray-700 dark:bg-gray-600 rounded-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </motion.div>

      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}