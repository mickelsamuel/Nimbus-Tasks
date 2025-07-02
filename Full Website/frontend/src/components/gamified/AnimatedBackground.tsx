'use client'

import React, { useMemo } from 'react'
// import { motion } from 'framer-motion' // Unused import
import { prefersReducedMotion } from '@/utils/performance'
import { ScrollOptimizedDiv } from '@/components/common/ScrollOptimizedMotion'

export default function AnimatedBackground() {
  const isReducedMotion = useMemo(() => prefersReducedMotion(), [])
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, [])
  const particleCount = isMobile ? 10 : 20 // Reduced from 30

  const particles = useMemo(() => 
    [...Array(particleCount)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 2
    })), [particleCount]
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 0%, rgba(224,26,26,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(147,51,234,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
          `
        }}
      />
      
      {/* Optimized floating particles */}
      {!isReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <ScrollOptimizedDiv
              key={particle.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full particle-optimized"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                willChange: 'transform, opacity',
                contain: 'layout style paint'
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
                type: "tween"
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}