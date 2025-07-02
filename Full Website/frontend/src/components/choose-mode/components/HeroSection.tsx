import React from 'react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { ThemeType } from '../types'

interface HeroSectionProps {
  theme: ThemeType
  title: string
  subtitle: string
  onPlaySound: (type: 'hover') => void
  itemVariants: Variants
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  title,
  subtitle,
  onPlaySound,
  itemVariants
}) => {
  const prefersReducedMotion = useReducedMotion()
  const isDark = theme === 'dark'

  const floatingParticles = Array.from({ length: 12 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 rounded-full"
      style={{
        background: isDark 
          ? `linear-gradient(45deg, rgba(${i % 2 === 0 ? '99, 102, 241' : '139, 92, 246'}, 0.6), rgba(${i % 2 === 0 ? '59, 130, 246' : '168, 85, 247'}, 0.4))`
          : `linear-gradient(45deg, rgba(${i % 2 === 0 ? '99, 102, 241' : '139, 92, 246'}, 0.4), rgba(${i % 2 === 0 ? '59, 130, 246' : '168, 85, 247'}, 0.2))`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        filter: 'blur(0.5px)'
      }}
      animate={prefersReducedMotion ? {} : {
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.8, 0.3]
      }}
      transition={{
        duration: 4 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2
      }}
    />
  ))

  return (
    <motion.div className="text-center mb-16 relative" variants={itemVariants}>
      {/* Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingParticles}
      </div>

      {/* Enhanced National Bank Logo */}
      <motion.div
        className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-10 relative cursor-pointer group"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #E01A1A 0%, #B71C1C 40%, #8B0000 100%)'
            : 'linear-gradient(135deg, #E01A1A 0%, #B71C1C 40%, #FF6B6B 100%)',
          boxShadow: isDark 
            ? '0 30px 60px rgba(224,26,26,0.5), 0 10px 20px rgba(224,26,26,0.3), inset 0 2px 0 rgba(255,255,255,0.2)'
            : '0 30px 60px rgba(224,26,26,0.4), 0 10px 20px rgba(224,26,26,0.2), inset 0 2px 0 rgba(255,255,255,0.3)',
        }}
        whileHover={{ 
          scale: 1.08,
          rotate: 5,
          boxShadow: isDark 
            ? '0 40px 80px rgba(224,26,26,0.6), 0 15px 30px rgba(224,26,26,0.4)'
            : '0 40px 80px rgba(224,26,26,0.5), 0 15px 30px rgba(224,26,26,0.3)'
        }}
        animate={prefersReducedMotion ? {} : {
          y: [-3, 3, -3],
          rotate: [-2, 2, -2]
        }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          whileHover: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        onMouseEnter={() => onPlaySound('hover')}
        tabIndex={0}
        role="button"
        aria-label="National Bank of Canada logo"
      >
        <span className="text-5xl font-bold text-white tracking-wider drop-shadow-lg">BNC</span>
        
        {/* Enhanced Holographic Effects */}
        {!prefersReducedMotion && (
          <>
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
              animate={{ x: [-150, 150] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-white/20"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          </>
        )}

        {/* Orbiting Elements */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          >
            <div className="absolute w-3 h-3 bg-white/60 rounded-full -top-2 left-1/2 transform -translate-x-1/2" />
            <div className="absolute w-2 h-2 bg-white/40 rounded-full top-1/2 -right-2 transform -translate-y-1/2" />
            <div className="absolute w-2.5 h-2.5 bg-white/50 rounded-full -bottom-2 left-1/2 transform -translate-x-1/2" />
          </motion.div>
        )}
      </motion.div>

      {/* Modern Typography with Gradient Text */}
      <motion.h1 
        className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight`}
        style={{ 
          fontFamily: '"Playfair Display", serif',
          background: isDark 
            ? 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #9CA3AF 100%)'
            : 'linear-gradient(135deg, #1F2937 0%, #374151 50%, #6B7280 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          letterSpacing: '-0.02em'
        }}
        variants={itemVariants}
        whileHover={prefersReducedMotion ? {} : {
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        {title.split(' ').map((word, index) => (
          <motion.span
            key={index}
            className="inline-block"
            animate={prefersReducedMotion ? {} : {
              y: [0, -2, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.h1>
      
      <motion.p 
        className={`text-2xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed mb-8 ${
          isDark ? 'text-white/80' : 'text-gray-600'
        }`}
        style={{ 
          fontFamily: '"Inter", sans-serif',
          fontWeight: '300',
          letterSpacing: '0.01em'
        }}
        variants={itemVariants}
        whileHover={prefersReducedMotion ? {} : {
          scale: 1.01,
          transition: { duration: 0.3 }
        }}
      >
        {subtitle}
      </motion.p>

      {/* Decorative Elements */}
      <motion.div 
        className="flex justify-center items-center gap-4 mt-8"
        variants={itemVariants}
      >
        <motion.div 
          className={`w-16 h-0.5 ${isDark ? 'bg-white/30' : 'bg-gray-400/60'}`}
          animate={prefersReducedMotion ? {} : {
            scaleX: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className={`w-3 h-3 rounded-full ${isDark ? 'bg-white/50' : 'bg-gray-500/70'}`}
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className={`w-16 h-0.5 ${isDark ? 'bg-white/30' : 'bg-gray-400/60'}`}
          animate={prefersReducedMotion ? {} : {
            scaleX: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </motion.div>
    </motion.div>
  )
}