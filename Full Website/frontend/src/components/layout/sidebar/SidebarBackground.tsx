'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SidebarBackgroundProps {
  className?: string
}

export default function SidebarBackground({ className = '' }: SidebarBackgroundProps) {
  return (
    <motion.div 
      className={`absolute inset-0 ml-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Light mode glassmorphism */}
      <div 
        className="h-full rounded-2xl dark:hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: `
            0 2px 8px rgba(0,0,0,0.06),
            0 8px 32px rgba(0,0,0,0.08),
            0 32px 64px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.4)
          `
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-primary-500/5" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 rounded-2xl opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23E01A1A%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M0 20L20 0L40 20L20 40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
        
        {/* Edge Lighting */}
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-primary-500/20 to-transparent rounded-r-2xl" />
      </div>
      
      {/* Dark mode glassmorphism */}
      <div 
        className="h-full rounded-2xl hidden dark:block"
        style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.90) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: `
            0 2px 8px rgba(0,0,0,0.12),
            0 8px 32px rgba(0,0,0,0.16),
            0 32px 64px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-primary-500/5" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 rounded-2xl opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23E01A1A%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M0 20L20 0L40 20L20 40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
        
        {/* Edge Lighting for dark mode */}
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-primary-500/30 to-transparent rounded-r-2xl" />
      </div>
    </motion.div>
  )
}