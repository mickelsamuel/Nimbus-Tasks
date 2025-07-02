'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, Shield, Zap } from 'lucide-react'

interface LoginSubmitButtonProps {
  isFormValid: boolean
  isSubmitting: boolean
  isAdminMode?: boolean
  error?: string
}

export default function LoginSubmitButton({ isFormValid, isSubmitting, isAdminMode = false, error }: LoginSubmitButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      type="submit"
      disabled={!isFormValid || isSubmitting}
      className={`
        w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-white 
        transition-all duration-500 relative overflow-hidden group text-lg
        ${isFormValid && !isSubmitting
          ? (isAdminMode 
              ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-xl hover:shadow-2xl'
              : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl'
            )
          : 'bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 cursor-not-allowed'
        }
      `}
      aria-describedby={error ? "login-error" : undefined}
      style={{
        boxShadow: isFormValid && !isSubmitting 
          ? (isAdminMode 
              ? '0 15px 40px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)'
              : '0 15px 40px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)')
          : 'none'
      }}
      whileHover={isFormValid && !isSubmitting ? { 
        scale: 1.03,
        y: -3,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : {}}
      whileTap={isFormValid && !isSubmitting ? { 
        scale: 0.97,
        transition: { duration: 0.1 }
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Enhanced Background Gradients */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: isAdminMode
            ? 'linear-gradient(135deg, #DC2626, #B91C1C, #991B1B)'
            : 'linear-gradient(135deg, #2563EB, #1D4ED8, #1E40AF)',
          opacity: isHovered ? 1 : 0.8
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          rotate: isHovered ? [0, 1, -1, 0] : 0
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated Border Ring */}
      {isFormValid && !isSubmitting && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: isAdminMode
              ? 'conic-gradient(from 0deg, #FCA5A5, #DC2626, #7F1D1D, #DC2626, #FCA5A5)'
              : 'conic-gradient(from 0deg, #93C5FD, #2563EB, #1E3A8A, #2563EB, #93C5FD)',
            padding: '2px'
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-2xl bg-transparent" />
        </motion.div>
      )}

      {/* Button Content */}
      <div className="relative z-20 flex items-center gap-4">
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Loader2 className="h-6 w-6" />
            </motion.div>
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="font-semibold tracking-wide"
            >
              {isAdminMode ? 'Verifying Command Access...' : 'Authenticating Executive Portal...'}
            </motion.span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ 
                scale: isHovered ? [1, 1.2, 1] : 1,
                rotate: isHovered ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: 0.6, 
                repeat: isHovered ? Infinity : 0,
                ease: 'easeInOut' 
              }}
            >
              {isAdminMode ? (
                <Shield className="h-6 w-6" />
              ) : (
                <Zap className="h-6 w-6" />
              )}
            </motion.div>
            
            <motion.span 
              className="font-semibold tracking-wide"
              animate={{
                x: isHovered ? [0, 2, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {isAdminMode ? 'Access Command Center' : 'Enter Executive Portal'}
            </motion.span>
            
            <motion.div
              animate={{ 
                x: isHovered ? [0, 8, 0] : [0, 4, 0],
                scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1]
              }}
              transition={{ 
                duration: isHovered ? 0.4 : 1.5, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            >
              <ArrowRight className="h-6 w-6" />
            </motion.div>
          </>
        )}
      </div>
      
      {/* Enhanced Shimmer Effects */}
      {isFormValid && !isSubmitting && (
        <>
          {/* Primary Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            animate={{ x: ['-120%', '120%'] }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: 'easeInOut',
              repeatDelay: 2
            }}
          />
          
          {/* Secondary Glow */}
          <motion.div
            className={`absolute inset-0 rounded-2xl ${
              isAdminMode 
                ? 'bg-gradient-to-r from-red-400/20 to-red-600/20'
                : 'bg-gradient-to-r from-blue-400/20 to-blue-600/20'
            }`}
            animate={{
              opacity: isHovered ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3],
              scale: isHovered ? [1, 1.01, 1] : 1
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          />

          {/* Particle Effects on Hover */}
          {isHovered && (
            <motion.div className="absolute inset-0 rounded-2xl overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/60 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: '50%'
                  }}
                  animate={{
                    y: [-20, -40, -20],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </motion.div>
          )}
        </>
      )}

      {/* Success Ripple Effect */}
      {isFormValid && !isSubmitting && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle, ${
              isAdminMode ? 'rgba(220, 38, 38, 0.3)' : 'rgba(37, 99, 235, 0.3)'
            } 0%, transparent 70%)`
          }}
          animate={{
            scale: [0.8, 1.2],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      )}

      {/* Inner Shadow for Depth */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)'
        }}
      />
    </motion.button>
  )
}