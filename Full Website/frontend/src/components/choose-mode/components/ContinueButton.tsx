import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Briefcase, Trophy, Sparkles } from 'lucide-react'
import { ModeType } from '../types'

interface ContinueButtonProps {
  selectedMode: ModeType
  isLoading: boolean
  onContinue: () => void
  onPlaySound: (type: 'hover') => void
  translations: {
    enterExecutive: string
    beginAcademy: string
    loading: string
  }
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  selectedMode,
  isLoading,
  onContinue,
  onPlaySound,
  translations
}) => {
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const buttonConfig = {
    website: {
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
      glowColor: 'rgba(59, 130, 246, 0.6)',
      shadowColor: 'rgba(30, 64, 175, 0.4)',
      particleColor: 'rgba(59, 130, 246, 0.8)',
      accentColor: '#60A5FA'
    },
    gamified: {
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
      glowColor: 'rgba(168, 85, 247, 0.6)',
      shadowColor: 'rgba(124, 58, 237, 0.4)',
      particleColor: 'rgba(168, 85, 247, 0.8)',
      accentColor: '#A855F7'
    }
  }

  const config = selectedMode ? buttonConfig[selectedMode] : buttonConfig.website

  // Generate floating micro-particles for enhanced visual appeal
  const microParticles = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={`micro-${i}`}
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{
        background: config.particleColor,
        left: `${20 + Math.random() * 60}%`,
        top: `${30 + Math.random() * 40}%`,
      }}
      animate={prefersReducedMotion ? {} : {
        y: [-10, 10, -10],
        x: [-5, 5, -5],
        scale: [0.5, 1.2, 0.5],
        opacity: [0.4, 1, 0.4]
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2
      }}
    />
  ))

  return (
    <AnimatePresence mode="wait">
      {selectedMode && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 25,
            duration: 0.6
          }}
        >
          <motion.button
            onClick={onContinue}
            onMouseEnter={() => {
              onPlaySound('hover')
              setIsHovered(true)
            }}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            className="group relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-opacity-50"
            style={{
              '--tw-ring-color': config.accentColor
            } as React.CSSProperties}
            whileHover={prefersReducedMotion ? {} : { 
              scale: 1.05,
              rotateY: 2,
              transition: { duration: 0.3 }
            }}
            whileTap={prefersReducedMotion ? {} : { 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
            aria-label={selectedMode === 'website' ? translations.enterExecutive : translations.beginAcademy}
          >
            {/* Enhanced Main Button Container with Responsive Design */}
            <div 
              className="relative px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl lg:text-2xl text-white flex items-center gap-3 sm:gap-4 z-10 overflow-hidden"
              style={{
                background: config.gradient,
                boxShadow: `0 20px 40px ${config.shadowColor}, 0 10px 20px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {/* Floating Micro-Particles */}
              {isHovered && !prefersReducedMotion && microParticles}

              {/* Shimmer Effect */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  animate={isHovered ? { x: [-200, 200] } : {}}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  aria-hidden="true"
                />
              )}

              {isLoading ? (
                <>
                  <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  >
                    <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full" />
                    {/* Inner spinning element */}
                    <motion.div
                      className="absolute inset-2 border-2 border-transparent border-b-white/60 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                  <span className="tracking-wide">{translations.loading}</span>
                </>
              ) : (
                <>
                  {selectedMode === 'website' ? (
                    <motion.div
                      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-sm"
                      whileHover={prefersReducedMotion ? {} : {
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                      aria-hidden="true"
                    >
                      <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-sm"
                      whileHover={prefersReducedMotion ? {} : {
                        scale: 1.1,
                        rotate: -5,
                        transition: { duration: 0.2 }
                      }}
                      aria-hidden="true"
                    >
                      <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  )}
                  
                  <span className="tracking-wide flex-1 text-center leading-tight">
                    {selectedMode === 'website' ? translations.enterExecutive : translations.beginAcademy}
                  </span>
                  
                  <motion.div
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-sm"
                    animate={!prefersReducedMotion ? {
                      x: [0, 4, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: 'easeInOut',
                      delay: 0.5
                    }}
                    whileHover={prefersReducedMotion ? {} : {
                      x: 6,
                      scale: 1.2,
                      transition: { duration: 0.2 }
                    }}
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                </>
              )}
            </div>

            {/* Enhanced Glow Effects */}
            {!prefersReducedMotion && (
              <>
                {/* Primary Glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl -z-10"
                  style={{
                    background: config.gradient,
                    filter: 'blur(20px)',
                    opacity: isHovered ? 0.8 : 0.4
                  }}
                  animate={{
                    scale: isHovered ? [1, 1.1, 1] : 1,
                    opacity: isHovered ? [0.4, 0.8, 0.4] : 0.4
                  }}
                  transition={{
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  aria-hidden="true"
                />

                {/* Secondary Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl -z-20"
                  style={{
                    background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
                    filter: 'blur(30px)'
                  }}
                  animate={isHovered ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  aria-hidden="true"
                />

                {/* Energy Pulses */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-white/30 -z-5"
                    animate={{
                      scale: [1, 1.2, 1.4],
                      opacity: [0.8, 0.4, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    aria-hidden="true"
                  />
                )}
              </>
            )}

            {/* Interactive Sparkles */}
            {isHovered && !prefersReducedMotion && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }, (_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                    }}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Selection Change Ripple */}
            <motion.div
              className="absolute inset-0 rounded-3xl -z-10"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                background: `radial-gradient(circle, ${config.particleColor} 0%, transparent 70%)`
              }}
              key={selectedMode}
              aria-hidden="true"
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}