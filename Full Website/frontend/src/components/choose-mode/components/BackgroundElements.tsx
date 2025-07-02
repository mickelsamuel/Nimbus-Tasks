import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Building2, BarChart3, TrendingUp, Shield, Target, Award } from 'lucide-react'
import { ThemeType } from '../types'

interface BackgroundElementsProps {
  theme: ThemeType
}

export const BackgroundElements: React.FC<BackgroundElementsProps> = ({ theme }) => {
  const prefersReducedMotion = useReducedMotion()
  const isDark = theme === 'dark'

  // Enhanced multi-layer animated gradients
  const gradientLayers = {
    primary: isDark
      ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #334155 50%, #475569 75%, #64748B 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 50%, #E2E8F0 75%, #CBD5E1 100%)',
    
    animated: isDark
      ? 'radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(34, 197, 94, 0.15) 0%, transparent 50%)'
      : 'radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(34, 197, 94, 0.08) 0%, transparent 50%)',
    
    mesh: isDark
      ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  }

  // Floating particles for enhanced depth
  const floatingParticles = Array.from({ length: 25 }, (_, i) => {
    const size = 2 + Math.random() * 6
    const delay = Math.random() * 10
    const duration = 8 + Math.random() * 12
    const x = Math.random() * 100
    const y = Math.random() * 100
    
    return (
      <motion.div
        key={`particle-${i}`}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${x}%`,
          top: `${y}%`,
          background: isDark 
            ? `radial-gradient(circle, rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '168, 85, 247' : '236, 72, 153'}, 0.4) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '168, 85, 247' : '236, 72, 153'}, 0.2) 0%, transparent 70%)`,
          filter: 'blur(1px)'
        }}
        animate={prefersReducedMotion ? {} : {
          x: [0, Math.random() * 40 - 20, 0],
          y: [0, Math.random() * 40 - 20, 0],
          scale: [1, 1.2 + Math.random() * 0.5, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay
        }}
      />
    )
  })

  return (
    <>
      {/* Base Layer */}
      <div 
        className="absolute inset-0 -z-20"
        style={{ background: gradientLayers.primary }}
      />

      {/* Animated Gradient Layer */}
      <motion.div 
        className="absolute inset-0 -z-19"
        style={{ 
          background: gradientLayers.animated,
          opacity: 0.8
        }}
        animate={prefersReducedMotion ? {} : {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Mesh Pattern Overlay */}
      <div 
        className="absolute inset-0 -z-18 opacity-50"
        style={{ 
          backgroundImage: gradientLayers.mesh,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating Particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 -z-17 overflow-hidden">
          {floatingParticles}
        </div>
      )}

      {/* Enhanced Banking Symbols with More Variety */}
      {!prefersReducedMotion && (
        <>
          <motion.div 
            className={`absolute top-16 left-16 w-20 h-20 ${isDark ? 'opacity-8' : 'opacity-12'}`}
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 8, -8, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <div className={`w-full h-full ${isDark ? 'text-blue-300/60' : 'text-blue-600/60'}`}>
              <Building2 className="w-full h-full" />
            </div>
          </motion.div>
          
          <motion.div 
            className={`absolute top-32 right-24 w-16 h-16 ${isDark ? 'opacity-8' : 'opacity-12'}`}
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 5, 0],
              scale: [1, 0.85, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            aria-hidden="true"
          >
            <div className={`w-full h-full ${isDark ? 'text-purple-300/60' : 'text-purple-600/60'}`}>
              <BarChart3 className="w-full h-full" />
            </div>
          </motion.div>
          
          <motion.div 
            className={`absolute bottom-24 left-32 w-24 h-24 ${isDark ? 'opacity-6' : 'opacity-10'}`}
            animate={{ 
              y: [0, -15, 0],
              x: [0, 15, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            aria-hidden="true"
          >
            <div className={`w-full h-full ${isDark ? 'text-green-300/60' : 'text-green-600/60'}`}>
              <TrendingUp className="w-full h-full" />
            </div>
          </motion.div>

          <motion.div 
            className={`absolute top-2/3 right-1/4 w-18 h-18 ${isDark ? 'opacity-6' : 'opacity-10'}`}
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            aria-hidden="true"
          >
            <div className={`w-full h-full ${isDark ? 'text-pink-300/60' : 'text-pink-600/60'}`}>
              <Shield className="w-full h-full" />
            </div>
          </motion.div>

          <motion.div 
            className={`absolute bottom-1/3 right-16 w-20 h-20 ${isDark ? 'opacity-6' : 'opacity-10'}`}
            animate={{ 
              x: [0, -20, 0],
              y: [0, 10, 0],
              rotate: [0, -6, 6, 0]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
            aria-hidden="true"
          >
            <div className={`w-full h-full ${isDark ? 'text-yellow-300/60' : 'text-yellow-600/60'}`}>
              <Target className="w-full h-full" />
            </div>
          </motion.div>

          <motion.div 
            className={`absolute top-1/4 left-2/3 w-22 h-22 ${isDark ? 'opacity-6' : 'opacity-10'}`}
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 360],
              opacity: [0.6, 0.3, 0.6]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            aria-hidden="true"
          >
            <div className={`w-full h-full ${isDark ? 'text-indigo-300/60' : 'text-indigo-600/60'}`}>
              <Award className="w-full h-full" />
            </div>
          </motion.div>

          {/* Premium Gradient Orbs */}
          <motion.div 
            className="absolute top-1/5 left-1/5 w-40 h-40 rounded-full mix-blend-screen filter blur-2xl"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.03) 40%, transparent 70%)'
            }}
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-1/5 right-1/5 w-56 h-56 rounded-full mix-blend-screen filter blur-2xl"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.03) 40%, transparent 70%)'
            }}
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.3, 1],
              x: [0, -25, 0],
              y: [0, 15, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />

          <motion.div 
            className="absolute top-2/3 left-1/3 w-48 h-48 rounded-full mix-blend-screen filter blur-2xl"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0.04) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(236, 72, 153, 0.02) 40%, transparent 70%)'
            }}
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6
            }}
          />
        </>
      )}

      {/* Subtle Noise Texture for Added Depth */}
      <div 
        className="absolute inset-0 -z-16 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />
    </>
  )
}