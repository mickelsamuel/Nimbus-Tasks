'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Sparkles, ChevronDown, Info } from 'lucide-react'
import { PolicyItem } from './index'

interface PolicyCardProps {
  policy: PolicyItem
  index: number
  isAccepted: boolean
  onToggle: () => void
  className?: string
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ 
  policy, 
  index, 
  isAccepted, 
  onToggle, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden group ${className}`}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: 0.15 * index,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Enhanced Glassmorphism Card with Dark Mode */}
      <div className="rounded-3xl relative overflow-hidden backdrop-blur-3xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/30 shadow-2xl dark:shadow-purple-500/10 transition-all duration-700">
        {/* Static Border */}
        <div className="absolute inset-0 rounded-3xl p-[2px] opacity-60">
          <div className="w-full h-full rounded-3xl bg-white/95 dark:bg-gray-900/95" />
        </div>

        {/* Floating Particles Effect */}
        <AnimatePresence>
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: policy.accentColor,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -50],
                    x: [0, Math.random() * 40 - 20]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
        {/* Dynamic Background Glow */}
        <motion.div 
          className="absolute inset-0 rounded-3xl opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${policy.accentColor}40, transparent 70%)`
          }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.3 : 0.15
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Enhanced Header Section */}
        <div className="relative z-10 p-8 md:p-10 border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6 md:space-x-8 flex-1">
              {/* Enhanced 3D Icon with Holographic Effect */}
              <motion.div
                className="relative flex-shrink-0"
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 15,
                  rotateX: 5
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400,
                  damping: 10
                }}
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  {/* Main Icon Container */}
                  <motion.div
                    className="w-full h-full rounded-3xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(145deg, ${policy.accentColor} 0%, ${policy.accentColor}80 50%, ${policy.accentColor}CC 100%)`,
                      boxShadow: `
                        0 12px 40px ${policy.accentColor}50,
                        0 0 0 2px ${policy.accentColor}20,
                        inset 0 2px 0 rgba(255,255,255,0.3),
                        inset 0 -2px 0 rgba(0,0,0,0.1)
                      `
                    }}
                    animate={{
                      boxShadow: isHovered 
                        ? [
                            `0 12px 40px ${policy.accentColor}50, 0 0 0 2px ${policy.accentColor}20, inset 0 2px 0 rgba(255,255,255,0.3)`,
                            `0 20px 60px ${policy.accentColor}70, 0 0 0 4px ${policy.accentColor}40, inset 0 2px 0 rgba(255,255,255,0.3)`
                          ]
                        : `0 12px 40px ${policy.accentColor}50, 0 0 0 2px ${policy.accentColor}20, inset 0 2px 0 rgba(255,255,255,0.3)`
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <policy.icon className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-lg relative z-10" />
                    
                    {/* Animated Shimmer */}
                    <motion.div 
                      className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                      animate={{
                        x: isHovered ? ['-100%', '200%'] : '-100%'
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isHovered ? Infinity : 0,
                        repeatDelay: 2
                      }}
                    />
                    
                    {/* Pulsing Glow */}
                    <motion.div 
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        background: `radial-gradient(circle at center, ${policy.accentColor}40, transparent 70%)`
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                  
                  {/* Floating Sparkles */}
                  <AnimatePresence>
                    {isHovered && (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{
                              left: `${20 + i * 30}%`,
                              top: `${10 + i * 20}%`
                            }}
                            initial={{ opacity: 0, scale: 0, rotate: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              y: [0, -20],
                              x: [0, Math.random() * 20 - 10]
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.3,
                              repeat: Infinity,
                              repeatDelay: 1
                            }}
                          >
                            <Sparkles 
                              className="h-3 w-3 text-white" 
                              style={{ color: policy.accentColor }}
                            />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              
              {/* Enhanced Typography */}
              <div className="flex-1 min-w-0">
                <motion.h2 
                  className="text-2xl md:text-4xl font-bold mb-3 leading-tight"
                  style={{ 
                    fontFamily: '"Playfair Display", serif',
                    background: `linear-gradient(135deg, ${policy.accentColor} 0%, ${policy.accentColor}60 50%, ${policy.accentColor}90 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
                  whileHover={{
                    scale: 1.02,
                    textShadow: `0 0 20px ${policy.accentColor}40`
                  }}
                >
                  {policy.title}
                </motion.h2>
                
                <motion.p 
                  className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-semibold mb-5 tracking-wide"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.7 }}
                  whileHover={{ x: 4 }}
                >
                  {policy.subtitle}
                </motion.p>
                
                <motion.div 
                  className="flex flex-col md:flex-row md:items-center text-sm text-gray-500 dark:text-gray-400 space-y-3 md:space-y-0 md:space-x-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.05, x: 4 }}
                  >
                    <motion.div 
                      className="w-3 h-3 rounded-full mr-3 shadow-lg"
                      style={{ backgroundColor: policy.accentColor }}
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          `0 0 0 0 ${policy.accentColor}40`,
                          `0 0 0 8px ${policy.accentColor}00`,
                          `0 0 0 0 ${policy.accentColor}40`
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="font-medium">Section {index + 1} of 4</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.05, x: 4 }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-3 text-amber-500" />
                    <span className="font-medium text-amber-600 dark:text-amber-400">Mandatory for platform access</span>
                  </motion.div>
                  <motion.button
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    <span className="font-medium">Details</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced 3D Checkbox with Holographic Effect */}
            <motion.label 
              className="flex items-center cursor-pointer ml-6"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={onToggle}
                className="sr-only"
              />
              <motion.div className="relative">
                <motion.div 
                  className="relative w-14 h-14 md:w-16 md:h-16 rounded-3xl border-2 flex items-center justify-center overflow-hidden backdrop-blur-sm"
                  style={{
                    background: isAccepted
                      ? 'linear-gradient(145deg, #10B981 0%, #059669 50%, #047857 100%)'
                      : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
                    borderColor: isAccepted ? '#10B981' : '#e5e7eb',
                    boxShadow: isAccepted
                      ? `
                          0 12px 40px rgba(16,185,129,0.5), 
                          0 0 0 2px rgba(16,185,129,0.3), 
                          inset 0 2px 0 rgba(255,255,255,0.3),
                          inset 0 -2px 0 rgba(0,0,0,0.1)
                        `
                      : `
                          0 8px 25px rgba(0,0,0,0.15), 
                          inset 0 2px 0 rgba(255,255,255,0.7),
                          inset 0 -1px 0 rgba(0,0,0,0.05)
                        `
                  }}
                  animate={{ 
                    scale: isAccepted ? [1, 1.15, 1] : 1,
                    boxShadow: isAccepted 
                      ? [
                          `0 12px 40px rgba(16,185,129,0.5), 0 0 0 2px rgba(16,185,129,0.3)`,
                          `0 20px 60px rgba(16,185,129,0.7), 0 0 0 4px rgba(16,185,129,0.5)`,
                          `0 12px 40px rgba(16,185,129,0.5), 0 0 0 2px rgba(16,185,129,0.3)`
                        ]
                      : `0 8px 25px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.7)`
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 400,
                    damping: 12,
                    duration: isAccepted ? 1.2 : 0.4
                  }}
                >
                  {/* Checkbox Icon */}
                  <AnimatePresence mode="wait">
                    {isAccepted ? (
                      <motion.div
                        key="checked"
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        transition={{ 
                          delay: 0.1, 
                          type: 'spring', 
                          stiffness: 500,
                          damping: 15
                        }}
                      >
                        <CheckCircle className="h-7 w-7 md:h-9 md:w-9 text-white drop-shadow-2xl" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unchecked"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-xl border-2 border-gray-400 dark:border-gray-500 bg-white/50 dark:bg-gray-700/50"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Enhanced Shimmer Effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    animate={{
                      x: isAccepted ? ['-100%', '200%'] : '-100%'
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isAccepted ? Infinity : 0,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Success Celebration Particles */}
                  <AnimatePresence>
                    {isAccepted && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 bg-green-300 rounded-full"
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: Math.cos(i * 45 * Math.PI / 180) * 40,
                              y: Math.sin(i * 45 * Math.PI / 180) * 40
                            }}
                            transition={{
                              duration: 1,
                              delay: 0.3,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                {/* Pulsing Ring Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2"
                  style={{ borderColor: isAccepted ? '#10B981' : 'transparent' }}
                  animate={{
                    scale: isAccepted ? [1, 1.3, 1] : 1,
                    opacity: isAccepted ? [0.5, 0, 0.5] : 0
                  }}
                  transition={{
                    duration: 2,
                    repeat: isAccepted ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.label>
          </div>
        </div>
        
        {/* Enhanced Content Section with Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="relative z-10 px-8 md:px-10 pb-8 md:pb-10"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.5,
                type: 'spring',
                stiffness: 100
              }}
            >
              <div className="space-y-6 md:space-y-8">
                {policy.content.map((item, itemIndex) => (
                  <motion.div 
                    key={itemIndex} 
                    className="flex items-start group"
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.1 * itemIndex + 0.2, 
                      duration: 0.6,
                      type: 'spring',
                      stiffness: 200
                    }}
                    whileHover={{ x: 8, scale: 1.02 }}
                  >
                    {/* Enhanced Bullet Point with Particle Effects */}
                    <motion.div 
                      className="relative flex-shrink-0 mt-2 mr-4 md:mr-6"
                      whileHover={{ scale: 1.3, rotate: 90 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <motion.div 
                        className="w-5 h-5 rounded-full flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${policy.accentColor} 0%, ${policy.accentColor}60 50%, ${policy.accentColor}90 100%)`,
                          boxShadow: `
                            0 4px 15px ${policy.accentColor}50, 
                            inset 0 2px 0 rgba(255,255,255,0.4),
                            inset 0 -1px 0 rgba(0,0,0,0.1)
                          `
                        }}
                        animate={{
                          boxShadow: [
                            `0 4px 15px ${policy.accentColor}50, inset 0 2px 0 rgba(255,255,255,0.4)`,
                            `0 8px 25px ${policy.accentColor}70, inset 0 2px 0 rgba(255,255,255,0.4)`,
                            `0 4px 15px ${policy.accentColor}50, inset 0 2px 0 rgba(255,255,255,0.4)`
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <motion.div 
                          className="w-2 h-2 bg-white rounded-full shadow-lg"
                          animate={{
                            scale: [1, 1.3, 1]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Static Shimmer */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" />
                      </motion.div>
                      
                      {/* Expanding Ring on Hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 opacity-0"
                        style={{ borderColor: policy.accentColor }}
                        initial={{ scale: 1, opacity: 0 }}
                        whileHover={{ 
                          scale: [1, 2, 2.5], 
                          opacity: [0, 0.6, 0]
                        }}
                        transition={{ duration: 0.8 }}
                      />
                    </motion.div>
                    
                    {/* Enhanced Content Text */}
                    <motion.div className="flex-1 min-w-0">
                      <motion.p 
                        className="text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg font-medium tracking-wide group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-all duration-300"
                        style={{ 
                          lineHeight: '1.8',
                          letterSpacing: '0.01em'
                        }}
                        initial={{ opacity: 0.85 }}
                        whileHover={{ 
                          opacity: 1,
                          textShadow: `0 0 10px ${policy.accentColor}30`
                        }}
                      >
                        {item}
                      </motion.p>
                      
                      {/* Subtle Accent Line */}
                      <motion.div
                        className="h-0.5 w-0 rounded-full mt-3"
                        style={{ backgroundColor: policy.accentColor }}
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          
        {/* Enhanced Section Footer */}
        <motion.div
          className="relative z-10 mt-8 md:mt-10 px-8 md:px-10 pb-8 md:pb-10 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <motion.div 
              className="flex items-center text-sm text-gray-500 dark:text-gray-400"
              whileHover={{ x: 4, scale: 1.02 }}
            >
              <motion.div>
                <policy.icon className="h-5 w-5 mr-3" />
              </motion.div>
              <span className="font-medium">National Bank of Canada Policy Framework</span>
            </motion.div>
            
            <motion.div
              className="flex items-center text-sm font-semibold"
              animate={{ 
                opacity: isAccepted ? 1 : 0.7,
                scale: isAccepted ? [1, 1.05, 1] : 1
              }}
              transition={{ 
                duration: 0.5,
                repeat: isAccepted ? Infinity : 0,
                repeatDelay: 2
              }}
            >
              <AnimatePresence mode="wait">
                {isAccepted ? (
                  <motion.div
                    key="accepted"
                    className="flex items-center"
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeInOut"
                      }}
                    >
                      <CheckCircle className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <span className="text-green-600 dark:text-green-400 tracking-wide">Acknowledged & Accepted</span>
                    <motion.div
                      className="ml-2 w-2 h-2 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="required"
                    className="flex items-center"
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <AlertTriangle className="h-5 w-5 mr-3 text-amber-500 dark:text-amber-400" />
                    </motion.div>
                    <span className="text-amber-600 dark:text-amber-400 tracking-wide">Acceptance Required</span>
                    <motion.div
                      className="ml-2 w-2 h-2 bg-amber-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.3, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Policy Number Badge */}
          <motion.div
            className="absolute top-4 right-8 md:right-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 400 }}
          >
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${policy.accentColor} 0%, ${policy.accentColor}80 100%)`,
                boxShadow: `0 4px 15px ${policy.accentColor}40`
              }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              {index + 1}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced Ambient Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${policy.accentColor}20, transparent 70%)`,
          filter: 'blur(20px)'
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.6 : 0.3
        }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  )
}

export default PolicyCard