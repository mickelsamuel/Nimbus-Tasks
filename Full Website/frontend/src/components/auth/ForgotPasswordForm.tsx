'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Shield, 
  AlertCircle, 
  Send, 
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Key,
  Zap
} from 'lucide-react'

interface FormState {
  email: string
  isSubmitting: boolean
  isSuccess: boolean
  error: string
  step: 'email' | 'success'
  resendCountdown: number
}

interface ForgotPasswordFormProps {
  formState: FormState
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function ForgotPasswordForm({ 
  formState, 
  onEmailChange, 
  onSubmit 
}: ForgotPasswordFormProps) {
  return (
    <motion.div
      key="email-step"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Initial Request State - "Secure Verification" */}
      <div className="text-center mb-6">
        {/* Enhanced 3D Security Shield */}
        <motion.div
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0D9488 0%, #0891B2 30%, #1E40AF 70%, #7C3AED 100%)',
            boxShadow: '0 20px 60px rgba(13,148,136,0.4), inset 0 2px 0 rgba(255,255,255,0.3)'
          }}
          whileHover={{ 
            scale: 1.1, 
            rotateY: 15,
            rotateX: 5,
            boxShadow: '0 30px 80px rgba(13,148,136,0.6), inset 0 2px 0 rgba(255,255,255,0.4)'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          animate={{
            boxShadow: [
              '0 20px 60px rgba(13,148,136,0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
              '0 20px 60px rgba(124,58,237,0.4), inset 0 2px 0 rgba(255,255,255,0.4)'
            ]
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Shield className="h-12 w-12 text-white" />
          </motion.div>
          
          {/* Simplified floating particles */}
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/50 rounded-full"
              style={{
                left: `${30 + i * 20}%`,
                top: `${25 + i * 30}%`,
                animation: `float-gentle ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 1.5}s`
              }}
            />
          ))}
          
          {/* Simplified security border */}
          <div className="absolute inset-1 rounded-2xl border border-white/30" />
          
          {/* Simplified shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-3xl opacity-50" />
        </motion.div>

        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 via-teal-800 to-blue-900 dark:from-white dark:via-teal-300 dark:to-blue-300 bg-clip-text text-transparent" 
          style={{ fontFamily: '"Playfair Display", serif' }}
          animate={{
            backgroundPosition: ['0%', '100%', '0%']
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Secure Identity Verification
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-gray-300 leading-relaxed text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Enter your official National Bank email address and we&apos;ll send secure recovery instructions to your verified account.
        </motion.p>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {formState.error && (
          <motion.div
            className="mb-6 p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 backdrop-blur-sm relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            role="alert"
            aria-live="polite"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              </motion.div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">{formState.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Form Design */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email Input - "Secure Identity Verification" */}
        <div className="space-y-2">
          <motion.label 
            htmlFor="email" 
            className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Key className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </motion.div>
            Secure Identity Verification
          </motion.label>
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </motion.div>
            </div>
            
            <motion.input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formState.email}
              onChange={onEmailChange}
              className="block w-full pl-12 pr-16 py-4 border-2 border-teal-300/50 dark:border-teal-600/30 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-500 text-base font-medium"
              style={{
                boxShadow: formState.email 
                  ? '0 0 0 1px rgba(13,148,136,0.3), 0 8px 25px rgba(13,148,136,0.15), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 4px 15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
              placeholder="your.secure.email@bnc.ca"
              aria-describedby={formState.error ? "email-error" : "email-help"}
              aria-invalid={formState.error ? "true" : "false"}
              whileFocus={{ scale: 1.02 }}
            />
            
            {/* Enhanced Trust Indicators */}
            <AnimatePresence>
              {formState.email && (
                <motion.div
                  className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <motion.div
                    className="flex items-center gap-1"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                    <div className="w-1 h-1 rounded-full bg-purple-500 dark:bg-purple-400" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  >
                    <Lock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  >
                    <Sparkles className="h-3 w-3 text-yellow-500 dark:text-yellow-400" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Input glow effect */}
            {formState.email && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-purple-500/20 -z-10"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [0.95, 1.05, 0.95]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.div>
          
          <motion.div 
            id="email-help" 
            className="text-xs text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-2 mt-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Zap className="h-3 w-3" />
            </motion.div>
            Verify your secure banking identity
          </motion.div>
        </div>

        {/* Enhanced Send Button */}
        <motion.button
          type="submit"
          disabled={!formState.email || formState.isSubmitting}
          className={`
            group w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-white transition-all duration-500 relative overflow-hidden text-lg
            ${formState.email && !formState.isSubmitting
              ? 'bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 hover:from-teal-500 hover:via-blue-500 hover:to-purple-500 shadow-xl hover:shadow-2xl'
              : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            }
          `}
          style={{
            boxShadow: formState.email && !formState.isSubmitting 
              ? '0 15px 40px rgba(13,148,136,0.4), 0 5px 15px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
              : 'none'
          }}
          whileHover={formState.email && !formState.isSubmitting ? { 
            scale: 1.03,
            y: -3,
            boxShadow: '0 20px 50px rgba(13,148,136,0.5), 0 10px 25px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
          } : {}}
          whileTap={formState.email && !formState.isSubmitting ? { scale: 0.97 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {/* Background gradient animation */}
          {formState.email && !formState.isSubmitting && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 via-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundSize: '200% 200%' }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          
          <div className="relative z-20 flex items-center gap-3">
            {formState.isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-6 w-6" />
                </motion.div>
                <span className="font-semibold">Initiating secure account recovery...</span>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Shield className="h-6 w-6" />
                </motion.div>
                <span className="font-semibold">Initiate Secure Recovery</span>
                <motion.div
                  animate={{ 
                    x: [0, 6, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <Send className="h-6 w-6" />
                </motion.div>
              </>
            )}
          </div>
          
          {/* Simplified button effect */}
          {formState.email && !formState.isSubmitting && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 rounded-2xl" />
          )}
        </motion.button>
      </form>

      {/* Enhanced Security Assurance Panel */}
      <motion.div
        className="mt-8 p-6 rounded-2xl border relative overflow-hidden backdrop-blur-sm"
        style={{
          background: 'linear-gradient(145deg, rgba(13,148,136,0.12) 0%, rgba(30,64,175,0.08) 50%, rgba(124,58,237,0.06) 100%)',
          borderColor: 'rgba(13,148,136,0.3)'
        }}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        whileHover={{ 
          scale: 1.02,
          borderColor: 'rgba(13,148,136,0.5)',
          boxShadow: '0 10px 30px rgba(13,148,136,0.2)'
        }}
      >
        {/* Simplified background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-teal-400/30"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animation: `float-gentle ${5 + i}s ease-in-out infinite`,
                animationDelay: `${i * 1.5}s`
              }}
            />
          ))}
        </div>
        
        {/* Simplified border */}
        <div className="absolute inset-0 rounded-2xl border border-teal-500/20" />
        
        <div className="flex items-start gap-4 relative z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10],
              boxShadow: [
                '0 0 0 rgba(13,148,136,0.5)',
                '0 0 20px rgba(13,148,136,0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/50"
          >
            <ShieldCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </motion.div>
          <div className="flex-1">
            <motion.h3 
              className="text-base font-bold text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Bank-Grade Security Protection
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </motion.div>
            </motion.h3>
            <motion.p 
              className="text-sm text-teal-700 dark:text-teal-300 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              For your protection, we&apos;ll only send reset links to verified BNC email addresses. Your security is protected by banking-standard encryption and institutional-grade security protocols.
            </motion.p>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  )
}