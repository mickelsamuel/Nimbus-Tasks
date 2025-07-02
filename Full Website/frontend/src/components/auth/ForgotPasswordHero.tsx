'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Shield, Sparkles, Star, Zap } from 'lucide-react'

export default function ForgotPasswordHero() {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Enhanced 3D National Bank Security Emblem */}
      <motion.div
        className="inline-flex items-center justify-center w-32 h-32 rounded-4xl mb-8 relative overflow-hidden group"
        style={{
          background: 'linear-gradient(145deg, #E01A1A 0%, #FF6B6B 30%, #FFD700 70%, #B71C1C 100%)',
          boxShadow: '0 30px 70px rgba(224,26,26,0.5), inset 0 2px 0 rgba(255,255,255,0.3)'
        }}
        whileHover={{ 
          scale: 1.1,
          rotateY: 15,
          rotateX: 10,
          boxShadow: '0 40px 90px rgba(224,26,26,0.7), inset 0 3px 0 rgba(255,255,255,0.4)'
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        animate={{
          boxShadow: [
            '0 30px 70px rgba(224,26,26,0.5), inset 0 2px 0 rgba(255,255,255,0.3)',
            '0 30px 70px rgba(255,215,0,0.4), inset 0 2px 0 rgba(255,255,255,0.4)'
          ]
        }}
      >
        {/* Floating particles around emblem */}
        <div className="absolute inset-0 overflow-hidden rounded-4xl">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${15 + i * 10}%`,
                top: `${10 + (i % 3) * 25}%`
              }}
              animate={{
                y: [-5, 5, -5],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        
        <motion.span 
          className="text-5xl font-bold text-white tracking-wide relative z-10"
          animate={{
            textShadow: [
              '0 4px 8px rgba(0,0,0,0.5)',
              '0 4px 8px rgba(255,215,0,0.3)',
              '0 4px 8px rgba(13,148,136,0.3)',
              '0 4px 8px rgba(0,0,0,0.5)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          BNC
        </motion.span>
        
        {/* Enhanced Security Badges */}
        <motion.div
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 flex items-center justify-center"
          style={{
            boxShadow: '0 6px 20px rgba(13,148,136,0.5)'
          }}
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, 360]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lock className="h-4 w-4 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center"
          style={{
            boxShadow: '0 6px 20px rgba(59,130,246,0.5)'
          }}
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, -360]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Shield className="h-4 w-4 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center"
          style={{
            boxShadow: '0 6px 20px rgba(124,58,237,0.5)'
          }}
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, 270]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Star className="h-4 w-4 text-white" />
        </motion.div>
        
        {/* Multiple Holographic Effects */}
        <motion.div 
          className="absolute inset-0 rounded-4xl bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          animate={{ x: ['-150%', '150%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
        <motion.div 
          className="absolute inset-0 rounded-4xl bg-gradient-to-l from-transparent via-yellow-300/20 to-transparent skew-x-12"
          animate={{ x: ['150%', '-150%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3, delay: 1 }}
        />
        
        {/* Glow ring effect */}
        <motion.div
          className="absolute inset-2 rounded-3xl border-2 border-white/40"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Enhanced Welcome Sequence */}
      <motion.h1 
        className="text-6xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent"
        style={{ 
          fontFamily: '"Playfair Display", serif',
          textShadow: '0 6px 20px rgba(0,0,0,0.5)',
          letterSpacing: '0.02em',
          fontVariant: 'small-caps'
        }}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          backgroundPosition: ['0%', '100%', '0%']
        }}
        transition={{ 
          duration: 1, 
          delay: 0.3,
          backgroundPosition: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        Account Recovery Center
      </motion.h1>
      
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div 
          className="text-2xl text-white/95 font-semibold flex items-center justify-center gap-3"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Zap className="h-6 w-6 text-yellow-400" />
          </motion.div>
          Secure Password Reset Service
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <Sparkles className="h-6 w-6 text-teal-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Security Indicators */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: `linear-gradient(45deg, 
                    ${i === 0 ? '#10B981' : ''}
                    ${i === 1 ? '#3B82F6' : ''}
                    ${i === 2 ? '#8B5CF6' : ''}
                    ${i === 3 ? '#F59E0B' : ''}
                    ${i === 4 ? '#EF4444' : ''}
                  , #10B981)`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  boxShadow: [
                    '0 0 0 rgba(16,185,129,0.5)',
                    '0 0 15px rgba(16,185,129,0.8)'
                  ]
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.8 + i * 0.1,
                  boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }
                }}
              />
            ))}
          </div>
          <motion.span 
            className="text-sm font-bold text-white flex items-center gap-2"
            animate={{ 
              textShadow: [
                '0 0 10px rgba(16,185,129,0.5)',
                '0 0 20px rgba(16,185,129,0.8)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Bank-Grade Security Protection
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Shield className="h-4 w-4" />
            </motion.div>
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Enhanced Reassurance Messaging */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <motion.div
          className="text-lg text-white/90 font-semibold flex items-center justify-center gap-2"
          animate={{
            textShadow: [
              '0 2px 10px rgba(255,255,255,0.3)',
              '0 2px 20px rgba(13,148,136,0.4)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Lock className="h-5 w-5 text-teal-300" />
          </motion.div>
          Your Account Security Is Our Priority
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </motion.div>
        </motion.div>
        
        {/* Floating emphasis particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${25 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}