'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, GraduationCap, Award } from 'lucide-react'

interface PolicyConfirmationProps {
  className?: string
}

export const PolicyConfirmation: React.FC<PolicyConfirmationProps> = ({ className = '' }) => {
  return (
    <div 
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1E40AF 50%, #F59E0B 100%)'
      }}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-20 w-16 h-16 opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <GraduationCap className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 right-20 w-20 h-20 opacity-15"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 3, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Award className="w-full h-full text-white" />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 text-center p-8 md:p-12 max-w-lg mx-4"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '32px',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.08),
            0 32px 64px rgba(224,26,26,0.08),
            inset 0 1px 0 rgba(255,255,255,0.4)
          `
        }}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Success Animation */}
        <motion.div
          className="w-20 md:w-24 h-20 md:h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 relative"
          style={{
            background: 'linear-gradient(145deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 20px 40px rgba(16,185,129,0.3), inset 0 2px 0 rgba(255,255,255,0.3)'
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-white" />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        </motion.div>
        
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: '"Playfair Display", serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Welcome to BNC Training Excellence
        </motion.h2>
        
        <motion.p 
          className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Your commitment to our standards has been recorded. You now have access to our premium training modules and professional development resources.
        </motion.p>
        
        {/* Enhanced Progress Bar */}
        <motion.div
          className="w-full rounded-2xl p-1 mb-6"
          style={{
            background: 'linear-gradient(145deg, rgba(224,26,26,0.1) 0%, rgba(224,26,26,0.05) 100%)',
            border: '1px solid rgba(224,26,26,0.2)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.div
            className="h-3 rounded-xl"
            style={{
              background: 'linear-gradient(90deg, #10B981 0%, #059669 50%, #047857 100%)'
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 1, duration: 2.5, ease: 'easeInOut' }}
          />
        </motion.div>
        
        <motion.p
          className="text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Redirecting to your personalized dashboard...
        </motion.p>
      </motion.div>
    </div>
  )
}

export default PolicyConfirmation