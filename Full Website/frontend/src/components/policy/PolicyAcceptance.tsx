'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight, Shield, Sparkles, Award, Lock } from 'lucide-react'

interface PolicyAcceptanceState {
  codeOfConduct: boolean
  dataPrivacy: boolean
  platformUsage: boolean
  bankingSecurity: boolean
}

interface PolicyAcceptanceProps {
  acceptedPolicies: PolicyAcceptanceState
  allPoliciesAccepted: boolean
  hasScrolledToBottom: boolean
  isAccepting: boolean
  onAcceptAll: () => void
  className?: string
}

export const PolicyAcceptance: React.FC<PolicyAcceptanceProps> = ({
  acceptedPolicies,
  allPoliciesAccepted,
  hasScrolledToBottom,
  isAccepting,
  onAcceptAll,
  className = ''
}) => {
  const acceptedCount = Object.values(acceptedPolicies).filter(Boolean).length
  const totalPolicies = Object.keys(acceptedPolicies).length
  const [isHovered, setIsHovered] = useState(false)
  const [celebrationActive, setCelebrationActive] = useState(false)

  useEffect(() => {
    if (allPoliciesAccepted && hasScrolledToBottom) {
      setCelebrationActive(true)
      const timer = setTimeout(() => setCelebrationActive(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [allPoliciesAccepted, hasScrolledToBottom])

  return (
    <motion.div
      className={`mt-16 relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7, type: 'spring', stiffness: 100 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Enhanced Glassmorphism Container */}
      <div className="relative rounded-3xl overflow-hidden backdrop-blur-3xl bg-white/95 dark:bg-gray-900/95 border border-white/30 dark:border-gray-700/30 shadow-2xl dark:shadow-purple-500/10">
        {/* Animated Background Gradient */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            background: allPoliciesAccepted 
              ? 'linear-gradient(135deg, #10B981, #059669, #047857)'
              : 'linear-gradient(135deg, #6B7280, #4B5563, #374151)'
          }}
          animate={{
            background: allPoliciesAccepted
              ? [
                  'linear-gradient(135deg, #10B981, #059669, #047857)',
                  'linear-gradient(135deg, #059669, #047857, #10B981)',
                  'linear-gradient(135deg, #10B981, #059669, #047857)'
                ]
              : 'linear-gradient(135deg, #6B7280, #4B5563, #374151)'
          }}
          transition={{
            duration: 3,
            repeat: allPoliciesAccepted ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        
        {/* Celebration Particles */}
        <AnimatePresence>
          {celebrationActive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -100],
                    x: [0, Math.random() * 100 - 50]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        
        <div className="relative z-10 p-8 md:p-12">
          {/* Enhanced Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
              whileHover={{ scale: 1.02 }}
            >
              Final Acknowledgment
            </motion.h2>
            
            <motion.div
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-green-500" />
              <Award className="h-5 w-5 text-green-500" />
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-green-500" />
            </motion.div>
          </motion.div>
      
          {/* Enhanced Content Box */}
          <motion.div 
            className="relative rounded-2xl p-6 md:p-8 mb-8 overflow-hidden backdrop-blur-sm bg-gray-50/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Subtle Border Animation */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-green-500/30"
              animate={{
                borderColor: allPoliciesAccepted 
                  ? ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.6)', 'rgba(34, 197, 94, 0.3)']
                  : 'rgba(156, 163, 175, 0.3)'
              }}
              transition={{
                duration: 2,
                repeat: allPoliciesAccepted ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="flex items-start space-x-4 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.div
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mt-1"
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <Lock className="h-4 w-4 text-white" />
              </motion.div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg font-medium">
                By accepting these policies, I acknowledge that I have <span className="font-bold text-indigo-600 dark:text-indigo-400">read, understood, and agree to comply</span> with all policies outlined above. I understand that violation of these policies may result in disciplinary action, including termination of access to the training platform and potential employment consequences.
              </p>
            </motion.div>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-medium leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              I commit to upholding the <span className="font-bold text-green-600 dark:text-green-400">highest standards of professional conduct</span> in all interactions within the BNC Training Platform and in my role at National Bank of Canada.
            </motion.p>
          </motion.div>
      
          {/* Enhanced Status and Button Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Progress Indicator */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <motion.div
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${
                  allPoliciesAccepted 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}
                animate={{
                  scale: allPoliciesAccepted ? [1, 1.1, 1] : 1,
                  boxShadow: allPoliciesAccepted 
                    ? [
                        '0 4px 20px rgba(34, 197, 94, 0.3)',
                        '0 8px 30px rgba(34, 197, 94, 0.5)',
                        '0 4px 20px rgba(34, 197, 94, 0.3)'
                      ]
                    : '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                transition={{
                  duration: 2,
                  repeat: allPoliciesAccepted ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle className="h-6 w-6 text-white" />
                
                {allPoliciesAccepted && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-white/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.div>
              
              <div className="text-left">
                <motion.p 
                  className={`text-lg font-bold ${
                    allPoliciesAccepted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                  }`}
                  animate={{
                    color: allPoliciesAccepted 
                      ? ['#059669', '#10B981', '#059669']
                      : '#6B7280'
                  }}
                  transition={{
                    duration: 2,
                    repeat: allPoliciesAccepted ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {allPoliciesAccepted ? 'All Policies Accepted!' : `${acceptedCount}/${totalPolicies} Policies Accepted`}
                </motion.p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {allPoliciesAccepted ? 'Ready to proceed' : 'Complete all sections'}
                </p>
              </div>
            </motion.div>
        
            {/* Enhanced Action Button */}
            <motion.button
              onClick={onAcceptAll}
              disabled={!allPoliciesAccepted || !hasScrolledToBottom || isAccepting}
              className={`relative overflow-hidden px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all duration-500 flex items-center shadow-2xl ${
                allPoliciesAccepted && hasScrolledToBottom
                  ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white hover:shadow-green-500/25'
                  : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={allPoliciesAccepted && hasScrolledToBottom ? { 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)'
              } : {}}
              whileTap={allPoliciesAccepted && hasScrolledToBottom ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              {/* Button Background Animation */}
              {allPoliciesAccepted && hasScrolledToBottom && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"
                  animate={{
                    x: isHovered ? ['-100%', '100%'] : '-100%'
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: 0.5
                  }}
                />
              )}
              
              <div className="relative z-10 flex items-center">
                {isAccepting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-4" />
                    <span>Processing Your Agreement...</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{
                        scale: allPoliciesAccepted && hasScrolledToBottom ? [1, 1.2, 1] : 1
                      }}
                      transition={{
                        duration: 2,
                        repeat: allPoliciesAccepted && hasScrolledToBottom ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <Shield className="h-6 w-6 mr-3" />
                    </motion.div>
                    <span>Accept All Policies & Continue</span>
                    <motion.div
                      className="ml-3"
                      animate={{
                        x: allPoliciesAccepted && hasScrolledToBottom ? [0, 5, 0] : 0
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: allPoliciesAccepted && hasScrolledToBottom ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
                  </>
                )}
              </div>
            </motion.button>
          </div>
      
          {/* Enhanced Warning Message */}
          <AnimatePresence>
            {(!allPoliciesAccepted || !hasScrolledToBottom) && (
              <motion.div
                className="mt-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-center"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="flex items-center justify-center mb-2"
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
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                </motion.div>
                
                <motion.p
                  className="text-amber-800 dark:text-amber-200 font-semibold text-base"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {!hasScrolledToBottom 
                    ? '📜 Please scroll to the bottom of all policies before accepting'
                    : '✅ Please accept all individual policy sections above to continue'
                  }
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default PolicyAcceptance