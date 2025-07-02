'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface GlassContainerProps {
  children: React.ReactNode
  isAdminMode?: boolean
}

export default function GlassContainer({ children, isAdminMode = false }: GlassContainerProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      {/* Enhanced Premium Glass Background - Light Mode */}
      <div 
        className="absolute inset-0 rounded-3xl block dark:hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(60px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: `
            0 12px 40px rgba(0,0,0,0.06),
            0 40px 80px rgba(0,0,0,0.04),
            0 2px 8px rgba(0,0,0,0.02),
            inset 0 1px 0 rgba(255,255,255,0.6),
            inset 0 -1px 0 rgba(0,0,0,0.02)
          `
        }}
      />
      
      {/* Enhanced Dark Mode Glass */}
      <div 
        className="absolute inset-0 rounded-3xl hidden dark:block"
        style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 50%, rgba(15,23,42,0.92) 100%)',
          backdropFilter: 'blur(60px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: `
            0 12px 40px rgba(0,0,0,0.3),
            0 40px 80px rgba(0,0,0,0.2),
            0 2px 8px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `
        }}
      />

      {/* Animated Gradient Border */}
      <motion.div 
        className="absolute inset-0 rounded-3xl"
        style={{
          background: isAdminMode 
            ? 'linear-gradient(145deg, #DAA520, #B22222, #8B0000)' 
            : 'linear-gradient(145deg, #1E40AF, #3B82F6, #F59E0B)',
          padding: '2px',
          borderRadius: '24px'
        }}
      >
        <div 
          className="w-full h-full rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
          }}
        />
        <div 
          className="w-full h-full rounded-3xl hidden dark:block absolute inset-0"
          style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)',
          }}
        />
      </motion.div>

      {/* Floating Light Reflections */}
      <motion.div
        className="absolute top-4 left-4 w-20 h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 10, 0],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          filter: 'blur(15px)'
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -8, 0],
          y: [0, 8, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />

      {/* Interactive Highlight Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
        }}
      />

      {/* Enhanced Inner Shadow */}
      <div 
        className="absolute inset-0 rounded-3xl"
        style={{
          boxShadow: `
            inset 0 1px 4px rgba(255,255,255,0.3),
            inset 0 -1px 4px rgba(0,0,0,0.05)
          `
        }}
      />

      {/* Content with Enhanced Padding */}
      <div className="relative z-10 p-10">
        {children}
      </div>

      {/* Subtle Noise Texture Overlay */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  )
}