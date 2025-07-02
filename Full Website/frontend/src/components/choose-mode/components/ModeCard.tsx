import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle, LucideIcon, Sparkles, Zap } from 'lucide-react'
import { ModeType, ThemeType } from '../types'

interface Feature {
  icon: LucideIcon
  text: string
}

interface ModeCardProps {
  mode: 'website' | 'gamified'
  selectedMode: ModeType
  theme: ThemeType
  title: string
  description: string
  badge: string
  features: Feature[]
  icon: LucideIcon
  onSelect: (mode: ModeType) => void
  onPlaySound: (type: 'hover') => void
}

export const ModeCard: React.FC<ModeCardProps> = ({
  mode,
  selectedMode,
  theme,
  title,
  description,
  badge,
  features,
  icon: Icon,
  onSelect,
  onPlaySound
}) => {
  const prefersReducedMotion = useReducedMotion()
  const isDark = theme === 'dark'
  const isSelected = selectedMode === mode

  const gradients = {
    website: {
      main: isDark 
        ? 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)'
        : 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)',
      container: isSelected 
        ? (isDark 
          ? 'linear-gradient(135deg, rgba(30,64,175,0.35) 0%, rgba(59,130,246,0.25) 50%, rgba(96,165,250,0.15) 100%)'
          : 'linear-gradient(135deg, rgba(30,64,175,0.25) 0%, rgba(59,130,246,0.15) 50%, rgba(96,165,250,0.10) 100%)')
        : (isDark 
          ? 'linear-gradient(135deg, rgba(30,64,175,0.20) 0%, rgba(59,130,246,0.15) 50%, rgba(96,165,250,0.10) 100%)'
          : 'linear-gradient(135deg, rgba(30,64,175,0.12) 0%, rgba(59,130,246,0.08) 50%, rgba(96,165,250,0.05) 100%)'),
      border: isSelected 
        ? `3px solid ${isDark ? 'rgba(59,130,246,0.8)' : 'rgba(30,64,175,0.6)'}`
        : `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      badge: isDark
        ? 'linear-gradient(90deg, rgba(30,64,175,0.4) 0%, rgba(59,130,246,0.3) 100%)'
        : 'linear-gradient(90deg, rgba(30,64,175,0.3) 0%, rgba(59,130,246,0.2) 100%)',
      iconColor: isDark ? 'text-blue-300' : 'text-blue-600',
      accent: isDark ? '#60A5FA' : '#1E40AF'
    },
    gamified: {
      main: isDark
        ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)'
        : 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #EC4899 100%)',
      container: isSelected 
        ? (isDark 
          ? 'linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(168,85,247,0.25) 50%, rgba(236,72,153,0.15) 100%)'
          : 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(168,85,247,0.15) 50%, rgba(236,72,153,0.10) 100%)')
        : (isDark 
          ? 'linear-gradient(135deg, rgba(124,58,237,0.20) 0%, rgba(168,85,247,0.15) 50%, rgba(236,72,153,0.10) 100%)'
          : 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(168,85,247,0.08) 50%, rgba(236,72,153,0.05) 100%)'),
      border: isSelected 
        ? `3px solid ${isDark ? 'rgba(168,85,247,0.8)' : 'rgba(124,58,237,0.6)'}`
        : `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      badge: isDark
        ? 'linear-gradient(90deg, rgba(124,58,237,0.4) 0%, rgba(236,72,153,0.3) 100%)'
        : 'linear-gradient(90deg, rgba(124,58,237,0.3) 0%, rgba(236,72,153,0.2) 100%)',
      iconColor: isDark ? 'text-purple-300' : 'text-purple-600',
      accent: isDark ? '#A855F7' : '#7C3AED'
    }
  }

  const config = gradients[mode]

  // Generate floating sparkles for visual appeal
  const sparkleElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={`sparkle-${i}`}
      className="absolute pointer-events-none"
      style={{
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
      }}
      animate={prefersReducedMotion ? {} : {
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 3,
        ease: "easeInOut"
      }}
    >
      <Sparkles className={`w-4 h-4 ${config.iconColor}`} />
    </motion.div>
  ))

  return (
    <motion.div
      className={`relative group transition-all duration-700 ${
        isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
      onClick={() => onSelect(mode)}
      onMouseEnter={() => onPlaySound('hover')}
      whileHover={prefersReducedMotion ? {} : { 
        y: -12,
        rotateY: 2,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${description}`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(mode)
        }
      }}
    >
      {/* Enhanced Glass Container with Responsive Design */}
      <div 
        className="relative rounded-3xl p-6 sm:p-8 lg:p-10 h-full min-h-[550px] sm:min-h-[600px] lg:min-h-[650px] overflow-hidden"
        style={{
          background: config.container,
          backdropFilter: 'blur(30px) saturate(200%)',
          border: config.border,
          boxShadow: isSelected
            ? `0 35px 70px ${config.accent}40, 0 15px 30px ${config.accent}30, inset 0 2px 0 rgba(255,255,255,0.4)`
            : `0 25px 50px rgba(0,0,0,${isDark ? '0.2' : '0.08'}), 0 10px 20px rgba(0,0,0,${isDark ? '0.1' : '0.04'}), inset 0 1px 0 rgba(255,255,255,${isDark ? '0.2' : '0.3'})`
        }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${config.accent}20 0%, transparent 40%), radial-gradient(circle at 80% 20%, ${config.accent}15 0%, transparent 40%), radial-gradient(circle at 40% 80%, ${config.accent}10 0%, transparent 40%)`,
            animation: prefersReducedMotion ? 'none' : 'float-pattern 8s ease-in-out infinite'
          }} />
        </div>

        {/* Floating Sparkles */}
        {isSelected && !prefersReducedMotion && sparkleElements}

        {/* Selection Indicator with Enhanced Animation */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute top-6 right-6 z-10"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 600, 
                damping: 25,
                duration: 0.6
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              aria-hidden="true"
            >
              <div 
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{
                  background: config.main,
                  boxShadow: `0 8px 16px ${config.accent}40`
                }}
              >
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Mode Icon with Responsive Sizing */}
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-3xl mb-6 sm:mb-8 relative group"
          style={{
            background: config.main,
            boxShadow: `0 15px 30px ${config.accent}40, 0 5px 15px ${config.accent}20`
          }}
          whileHover={prefersReducedMotion ? {} : { 
            scale: 1.15, 
            rotateY: 15,
            rotateX: 5,
            transition: { duration: 0.3 }
          }}
          animate={prefersReducedMotion ? {} : {
            rotate: isSelected ? [0, mode === 'website' ? 3 : -3, mode === 'website' ? -3 : 3, 0] : 0,
            y: [0, -2, 0]
          }}
          transition={{ 
            rotate: { duration: 4, repeat: isSelected ? Infinity : 0 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          aria-hidden="true"
        >
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white drop-shadow-lg" />
          
          {/* Energy Ring Effect */}
          {isSelected && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-white/30"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 0.2, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Enhanced Typography with Responsive Text Sizing */}
        <motion.h3 
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`} 
          style={{ 
            fontFamily: '"Playfair Display", serif',
            background: isDark 
              ? 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)'
              : 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: isDark ? 'transparent' : 'inherit',
            backgroundClip: 'text'
          }}
          whileHover={prefersReducedMotion ? {} : {
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className={`text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed ${isDark ? 'text-white/85' : 'text-gray-700'}`}
          style={{ 
            fontFamily: '"Inter", sans-serif',
            lineHeight: '1.6'
          }}
          whileHover={prefersReducedMotion ? {} : {
            scale: 1.01,
            transition: { duration: 0.2 }
          }}
        >
          {description}
        </motion.p>

        {/* Enhanced Features List with Responsive Text */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl ${isDark ? 'text-white/90 bg-white/5' : 'text-gray-800 bg-black/5'}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={prefersReducedMotion ? {} : {
                x: 8,
                scale: 1.02,
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                transition: { duration: 0.2 }
              }}
              style={{
                backdropFilter: 'blur(10px)'
              }}
            >
              <motion.div
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${config.iconColor}`}
                style={{
                  background: `${config.accent}20`
                }}
                animate={isSelected && !prefersReducedMotion ? {
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ 
                  duration: 2, 
                  delay: index * 0.3, 
                  repeat: isSelected ? Infinity : 0, 
                  repeatDelay: 4 
                }}
              >
                <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
              <span className="text-sm sm:text-base font-medium flex-1 leading-tight">{feature.text}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <Zap className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${config.iconColor}`} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced Benefits Badge with Responsive Text */}
        <motion.div 
          className="relative inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold text-center"
          style={{
            background: config.badge,
            border: `2px solid ${config.accent}60`,
            backdropFilter: 'blur(10px)'
          }}
          whileHover={prefersReducedMotion ? {} : {
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          <span className={`${isDark ? 'text-white' : 'text-gray-900'} leading-tight`}>{badge}</span>
          
          {/* Badge Glow Effect */}
          {isSelected && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: config.badge,
                filter: 'blur(4px)',
                zIndex: -1
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Custom CSS for floating pattern animation */}
      <style jsx>{`
        @keyframes float-pattern {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
      `}</style>
    </motion.div>
  )
}