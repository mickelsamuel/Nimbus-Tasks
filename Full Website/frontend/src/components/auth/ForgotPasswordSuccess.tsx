'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, UserCheck, Clock, Sparkles, Mail, Shield, Star, Zap } from 'lucide-react'

interface FormState {
  email: string
  resendCountdown: number
}

interface ForgotPasswordSuccessProps {
  formState: FormState
  onResend: () => void
}

export default function ForgotPasswordSuccess({ 
  formState, 
  onResend 
}: ForgotPasswordSuccessProps) {
  return (
    <motion.div
      key="success-step"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center relative"
    >
      {/* Enhanced Success State with Celebration */}
      <div className="relative mb-8">
        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${120 + i * 30}, 70%, 60%)`,
                left: `${20 + i * 8}%`,
                top: `${10 + (i % 4) * 20}%`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                y: [0, -30, -60],
                x: [0, (i % 2 === 0 ? 1 : -1) * 20]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5 + i * 0.1
              }}
            />
          ))}
        </div>
        
        {/* Enhanced Success Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #059669 0%, #0D9488 30%, #10B981 60%, #34D399 100%)',
            boxShadow: '0 25px 60px rgba(5,150,105,0.5), inset 0 2px 0 rgba(255,255,255,0.3)'
          }}
          initial={{ scale: 0, rotate: -360 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            boxShadow: [
              '0 25px 60px rgba(5,150,105,0.5), inset 0 2px 0 rgba(255,255,255,0.3)',
              '0 25px 60px rgba(16,185,129,0.6), inset 0 2px 0 rgba(255,255,255,0.4)',
              '0 25px 60px rgba(52,211,153,0.5), inset 0 2px 0 rgba(255,255,255,0.3)',
              '0 25px 60px rgba(5,150,105,0.5), inset 0 2px 0 rgba(255,255,255,0.3)'
            ]
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            delay: 0.2,
            boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CheckCircle className="h-16 w-16 text-white" />
          </motion.div>
          
          {/* Multiple ring effects */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-teal-300/60"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-3 border-green-300/40"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 2.2, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-300/30"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 2.6, 1],
              opacity: [0.4, 0, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }}
          />
          
          {/* Sparkle effects around icon */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${30 + Math.cos(i * 60 * Math.PI / 180) * 60}px`,
                top: `${30 + Math.sin(i * 60 * Math.PI / 180) * 60}px`
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.h2 
        className="text-4xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 dark:from-green-400 dark:via-teal-400 dark:to-blue-400 bg-clip-text text-transparent"
        style={{ fontFamily: '"Playfair Display", serif' }}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          backgroundPosition: ['0%', '100%', '0%']
        }}
        transition={{ 
          delay: 0.4,
          duration: 0.8,
          backgroundPosition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        🎉 Recovery Instructions Sent!
      </motion.h2>
      
      {/* Enhanced Email Display */}
      <motion.div
        className="space-y-6 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.p 
          className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          We&apos;ve sent secure password recovery instructions to your verified banking address:
        </motion.p>
        
        <motion.div 
          className="p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-green-50 to-emerald-50 dark:from-teal-900/20 dark:via-green-900/20 dark:to-emerald-900/20 border-2 border-teal-200 dark:border-teal-700/50 backdrop-blur-sm relative overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-green-500/10 to-emerald-500/10"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <UserCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </motion.div>
              <span className="text-base text-gray-600 dark:text-gray-300 font-semibold">Securely sent to:</span>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="font-bold text-xl text-teal-800 dark:text-teal-200 bg-white/50 dark:bg-gray-800/50 rounded-lg px-4 py-2 border border-teal-300/50 dark:border-teal-600/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              {formState.email}
            </motion.div>
          </div>
          
          {/* Floating security indicators */}
          <div className="absolute top-2 right-2">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1, 0.8]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Shield className="h-5 w-5 text-teal-500 dark:text-teal-400" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Clock className="h-5 w-5 text-orange-500" />
          </motion.div>
          Check your inbox and follow the secure link to reset your password. The link will expire in 15 minutes for your security protection.
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Zap className="h-5 w-5 text-yellow-500" />
          </motion.div>
        </motion.p>
      </motion.div>

      {/* Enhanced Resend Functionality */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700/50 backdrop-blur-sm mb-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"
          animate={{
            backgroundPosition: ['0%', '100%', '0%']
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <div className="flex items-start gap-4 relative z-10">
          <motion.div
            className="p-2 rounded-xl bg-blue-100 dark:bg-blue-800/50"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
          
          <div className="text-left flex-1">
            <motion.h3 
              className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              Security Notice
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Star className="h-5 w-5 text-yellow-500" />
              </motion.div>
            </motion.h3>
            
            <motion.p 
              className="text-sm text-blue-700 dark:text-blue-300 mb-4 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              If you don&apos;t receive the email within 5 minutes, check your spam folder or contact our Security Specialists.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              {formState.resendCountdown > 0 ? (
                <motion.div 
                  className="flex items-center gap-2 p-3 rounded-lg bg-blue-100 dark:bg-blue-800/50 border border-blue-300 dark:border-blue-600/50"
                  animate={{
                    boxShadow: [
                      '0 0 0 rgba(59,130,246,0.3)',
                      '0 0 20px rgba(59,130,246,0.2)',
                      '0 0 0 rgba(59,130,246,0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: formState.resendCountdown, ease: 'linear' }}
                  >
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <span className="text-sm text-blue-600 dark:text-blue-300 font-semibold">
                    Resend available in {formState.resendCountdown}s
                  </span>
                </motion.div>
              ) : (
                <motion.button
                  onClick={onResend}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                  />
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Mail className="h-4 w-4" />
                  </motion.div>
                  <span className="relative z-10">Request additional secure recovery email</span>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}