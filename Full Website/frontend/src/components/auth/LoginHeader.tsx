'use client'

import React from 'react'
import { motion } from 'framer-motion'
// import { Shield } from 'lucide-react' // Unused import

interface LoginHeaderProps {
  isAdminMode?: boolean
}

export default function LoginHeader({ isAdminMode = false }: LoginHeaderProps) {
  return (
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Simple National Bank Logo - No 3D effects */}
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 relative"
        style={{
          background: 'linear-gradient(145deg, #E01A1A 0%, #B71C1C 100%)',
          boxShadow: '0 20px 40px rgba(224,26,26,0.3), inset 0 2px 0 rgba(255,255,255,0.3)'
        }}
        whileHover={{ 
          scale: 1.05
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className="text-3xl font-bold text-white tracking-wide">BNC</span>
      </motion.div>

      {/* Executive Typography */}
      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-white mb-3"
        style={{ 
          fontFamily: '"Playfair Display", serif',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          letterSpacing: '0.02em'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {isAdminMode ? 'Administrative Command Center' : 'National Bank Training Portal'}
      </motion.h1>
      
      <motion.p 
        className="text-xl text-white/90 font-medium"
        style={{ fontFamily: '"Inter", sans-serif' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {isAdminMode ? 'Level 9 Administrative Access Required' : 'Executive Learning Excellence'}
      </motion.p>
    </motion.div>
  )
}