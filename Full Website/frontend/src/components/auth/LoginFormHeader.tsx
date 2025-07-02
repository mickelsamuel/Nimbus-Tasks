'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

interface LoginFormHeaderProps {
  isAdminMode?: boolean
}

export default function LoginFormHeader({ isAdminMode = false }: LoginFormHeaderProps) {
  return (
    <div className="text-center mb-8">
      <motion.div
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative"
        style={{
          background: isAdminMode 
            ? 'linear-gradient(145deg, #8B0000 0%, #B22222 100%)'
            : 'linear-gradient(145deg, #E01A1A 0%, #B71C1C 100%)',
          boxShadow: isAdminMode
            ? '0 12px 24px rgba(139,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            : '0 12px 24px rgba(224,26,26,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
        whileHover={{ 
          scale: 1.05,
          rotateY: 5
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className="text-2xl font-bold text-white tracking-wide">BNC</span>
        {/* Banking Security Badge */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
          style={{
            background: isAdminMode ? '#DAA520' : '#F59E0B',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lock className="h-3 w-3 text-white m-0.5" />
        </motion.div>
      </motion.div>
      
      <motion.h1 
        className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        style={{ 
          fontFamily: '"Playfair Display", serif',
          letterSpacing: '0.01em'
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {isAdminMode ? 'Administrative Access' : 'Executive Portal'}
      </motion.h1>
      
      <motion.p 
        className={`font-medium ${isAdminMode ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {isAdminMode ? 'Command Center Authentication Required' : 'Continue your executive training journey'}
      </motion.p>
      
      {/* Security Level Indicator */}
      <motion.div
        className="mt-4 flex items-center justify-center gap-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center gap-1">
          {[...Array(isAdminMode ? 9 : 5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                isAdminMode ? 'bg-red-500' : 'bg-primary-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold ${
          isAdminMode ? 'text-red-600' : 'text-primary-600'
        }`}>
          Level {isAdminMode ? '9' : '5'} Security
        </span>
      </motion.div>
    </div>
  )
}