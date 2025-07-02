'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ForgotPasswordContainerProps {
  children: React.ReactNode
}

export default function ForgotPasswordContainer({ children }: ForgotPasswordContainerProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      {/* Enhanced Premium Glass Background */}
      <motion.div 
        className="absolute inset-0 rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.08),
            0 32px 64px rgba(13,148,136,0.08),
            inset 0 1px 0 rgba(255,255,255,0.4)
          `
        }}
        animate={{
          boxShadow: [
            '0 8px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(13,148,136,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
            '0 12px 40px rgba(0,0,0,0.12), 0 40px 80px rgba(13,148,136,0.12), inset 0 2px 0 rgba(255,255,255,0.5)',
            '0 8px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(13,148,136,0.08), inset 0 1px 0 rgba(255,255,255,0.4)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Dark mode glass background */}
      <motion.div 
        className="absolute inset-0 rounded-3xl opacity-0 dark:opacity-100"
        style={{
          background: 'linear-gradient(145deg, rgba(17,24,39,0.95) 0%, rgba(31,41,55,0.90) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.3),
            0 32px 64px rgba(13,148,136,0.15),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `
        }}
        animate={{
          boxShadow: [
            '0 8px 32px rgba(0,0,0,0.3), 0 32px 64px rgba(13,148,136,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            '0 12px 40px rgba(0,0,0,0.4), 0 40px 80px rgba(13,148,136,0.2), inset 0 2px 0 rgba(255,255,255,0.15)',
            '0 8px 32px rgba(0,0,0,0.3), 0 32px 64px rgba(13,148,136,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Enhanced National Bank Security Accent Border */}
      <motion.div 
        className="absolute inset-0 rounded-3xl p-0.5"
        style={{
          background: 'linear-gradient(45deg, #E01A1A, #FFD700, #0D9488, #1E40AF, #7C3AED, #E01A1A)',
          backgroundSize: '300% 300%'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div 
          className="w-full h-full rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
        />
      </motion.div>
      
      {/* Floating particles around container */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
            style={{
              left: `${10 + i * 12}%`,
              top: `${-5 + (i % 3) * 10}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
              x: [-2, 2, -2]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8
            }}
          />
        ))}
      </div>
      
      {/* Inner glow effect */}
      <motion.div
        className="absolute inset-2 rounded-2xl opacity-30 group-hover:opacity-50"
        style={{
          background: 'linear-gradient(45deg, rgba(13,148,136,0.1), rgba(30,64,175,0.1), rgba(124,58,237,0.1))'
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-20 p-10">
        {children}
      </div>
    </motion.div>
  )
}