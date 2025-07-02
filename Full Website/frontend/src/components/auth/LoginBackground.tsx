'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Building2, Shield, DollarSign, TrendingUp, Globe, Lock } from 'lucide-react'

export default function LoginBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced Banking Pattern Overlay with Dark Mode Support */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M0 0h40v40H0z%22/%3E%3Cpath d=%22M40 40h40v40H40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M0 0h40v40H0z%22/%3E%3Cpath d=%22M40 40h40v40H40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      {/* Floating Banking Symbols with Enhanced Animation */}
      <motion.div 
        className="absolute top-16 left-16 w-20 h-20 opacity-15"
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, 8, -8, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.3, opacity: 0.3 }}
      >
        <Building2 className="w-full h-full text-white drop-shadow-lg" />
      </motion.div>
      
      <motion.div 
        className="absolute top-32 right-16 w-16 h-16 opacity-20"
        animate={{ 
          y: [0, 18, 0],
          rotate: [0, -10, 10, 0],
          scale: [1, 0.85, 1]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        whileHover={{ scale: 1.4, opacity: 0.4 }}
      >
        <Shield className="w-full h-full text-white drop-shadow-lg" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-24 left-32 w-24 h-24 opacity-12"
        animate={{ 
          y: [0, -15, 0],
          x: [0, 12, 0],
          rotate: [0, 360]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        whileHover={{ scale: 1.2, opacity: 0.25 }}
      >
        <div className="w-full h-full rounded-full border-3 border-white/60 flex items-center justify-center backdrop-blur-sm">
          <DollarSign className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Additional Banking Icons */}
      <motion.div 
        className="absolute top-1/2 left-8 w-14 h-14 opacity-18"
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <TrendingUp className="w-full h-full text-white drop-shadow-lg" />
      </motion.div>

      <motion.div 
        className="absolute bottom-1/3 right-12 w-18 h-18 opacity-15"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -15, 15, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      >
        <Globe className="w-full h-full text-white drop-shadow-lg" />
      </motion.div>

      <motion.div 
        className="absolute top-2/3 right-1/4 w-16 h-16 opacity-20"
        animate={{ 
          y: [0, -8, 0],
          x: [0, -8, 0],
          rotate: [0, 12, -12, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      >
        <Lock className="w-full h-full text-white drop-shadow-lg" />
      </motion.div>

      {/* Enhanced Premium Gradient Particles */}
      <motion.div 
        className="absolute top-1/5 left-1/5 w-36 h-36 bg-white/8 rounded-full mix-blend-overlay filter blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 20, 0],
          y: [0, -15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div 
        className="absolute bottom-1/5 right-1/5 w-44 h-44 bg-accent-500/15 rounded-full mix-blend-overlay filter blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.15, 0.35, 0.15],
          x: [0, -25, 0],
          y: [0, 10, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <motion.div 
        className="absolute top-1/2 left-1/2 w-28 h-28 bg-blue-400/10 rounded-full mix-blend-overlay filter blur-xl transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.1, 0.25, 0.1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Geometric Banking Elements */}
      <motion.div 
        className="absolute top-20 right-1/3 w-12 h-12"
        animate={{ 
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full border-2 border-white/30 rotate-45 backdrop-blur-sm"></div>
      </motion.div>

      <motion.div 
        className="absolute bottom-32 left-1/4 w-8 h-8"
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, -45, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      >
        <div className="w-full h-full bg-white/20 rounded-full backdrop-blur-sm"></div>
      </motion.div>

      {/* Corporate Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path
          d="M100,100 Q400,200 800,150 T1200,100"
          stroke="white"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0,300 Q300,250 600,350 T1200,300"
          stroke="white"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.15 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </svg>

      {/* Premium Banking Cards Effect */}
      <motion.div 
        className="absolute top-1/4 right-8 w-20 h-12 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-lg backdrop-blur-sm border border-white/10"
        animate={{ 
          y: [0, -10, 0],
          rotateY: [0, 15, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div 
        className="absolute bottom-1/4 left-12 w-18 h-11 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-lg backdrop-blur-sm border border-white/10"
        animate={{ 
          y: [0, 8, 0],
          rotateY: [0, -12, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
    </div>
  )
}