'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Mail, Key, Shield, Sparkles } from 'lucide-react'

export default function ForgotPasswordBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced Bank-Grade Encryption Grids */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230D9488%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M0 0h40v40H0z%22/%3E%3Cpath d=%22M40 40h40v40H40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%231E40AF%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2260%22 cy=%2260%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />
      </div>
      
      {/* Floating Neural Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#1E40AF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {[...Array(12)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${(i * 15) % 100}`}
            y1="0"
            x2={`${((i * 25) + 30) % 100}`}
            y2="100"
            stroke="url(#neuralGradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3
            }}
          />
        ))}
      </svg>
      
      {/* Enhanced Security-Focused Elements */}
      <motion.div 
        className="absolute top-16 left-16 w-28 h-28 opacity-20 dark:opacity-15"
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(13,148,136,0.3))'
          }}
        >
          <Lock className="w-full h-full text-teal-300 dark:text-teal-400" />
          <motion.div
            className="absolute inset-0 border-2 border-teal-300/50 rounded-lg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute top-48 right-16 w-24 h-24 opacity-20 dark:opacity-15"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -8, 8, 0],
          scale: [1, 0.85, 1]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        aria-hidden="true"
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(30,64,175,0.3))'
          }}
        >
          <ShieldCheck className="w-full h-full text-blue-300 dark:text-blue-400" />
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${25 + i * 15}%`,
                top: `${20 + i * 10}%`
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-24 left-32 w-32 h-32 opacity-18 dark:opacity-12"
        animate={{ 
          y: [0, -15, 0],
          x: [0, 15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        aria-hidden="true"
      >
        <motion.div 
          className="w-full h-full rounded-full border-4 border-teal-300/60 dark:border-teal-400/40 flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)',
            filter: 'drop-shadow(0 0 25px rgba(13,148,136,0.2))'
          }}
        >
          <motion.div
            className="absolute inset-0 border-2 border-teal-400/30 rounded-full"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 0.1, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Mail className="text-teal-300 dark:text-teal-400 h-10 w-10 z-10" />
        </motion.div>
      </motion.div>
      
      {/* Additional floating icons */}
      <motion.div 
        className="absolute top-72 left-24 w-16 h-16 opacity-15 dark:opacity-10"
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 15, -15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        aria-hidden="true"
      >
        <Key className="w-full h-full text-purple-300 dark:text-purple-400" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-48 right-32 w-20 h-20 opacity-15 dark:opacity-10"
        animate={{ 
          y: [0, 18, 0],
          rotate: [0, -12, 12, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        aria-hidden="true"
      >
        <Shield className="w-full h-full text-indigo-300 dark:text-indigo-400" />
      </motion.div>

      {/* Enhanced Trust Particles */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full mix-blend-overlay filter blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(13,148,136,0.08) 50%, transparent 100%)'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full mix-blend-overlay filter blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(30,64,175,0.08) 50%, transparent 100%)'
        }}
        animate={{
          scale: [1, 0.8, 1],
          opacity: [0.4, 0.7, 0.4],
          x: [0, -25, 0],
          y: [0, 15, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      
      <motion.div 
        className="absolute top-3/4 left-1/3 w-32 h-32 rounded-full mix-blend-overlay filter blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(13,148,136,0.18) 0%, rgba(59,130,246,0.06) 70%, transparent 100%)'
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
      
      {/* Constellation effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-40 dark:opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Animated sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${15 + i * 12}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.2
            }}
          >
            <Sparkles className="h-4 w-4 text-yellow-300 dark:text-yellow-400 opacity-60" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}