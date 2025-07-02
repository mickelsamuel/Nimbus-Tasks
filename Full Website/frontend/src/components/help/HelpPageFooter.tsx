'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Shield,
  Heart,
  Star,
  Award,
  Sparkles
} from 'lucide-react'

interface HelpPageFooterProps {
  onBackToLogin: () => void
}

export default function HelpPageFooter({ onBackToLogin }: HelpPageFooterProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      className="mt-12 space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Premium Stats Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        {[
          {
            icon: Heart,
            label: 'Customer Satisfaction',
            value: '99.8%',
            color: '#EF4444'
          },
          {
            icon: Star,
            label: 'Resolution Rate',
            value: '98.5%',
            color: '#F59E0B'
          },
          {
            icon: Award,
            label: 'Industry Awards',
            value: '15+',
            color: '#10B981'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="text-center p-4 rounded-2xl backdrop-blur-xl"
            style={{
              background: isDarkMode
                ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)'
                : 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: isDarkMode
                ? '0 8px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                boxShadow: `0 8px 20px ${stat.color}40`
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </motion.div>
            <div 
              className="text-xl font-black mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div 
              className="text-sm font-medium"
              style={{ color: isDarkMode ? '#CBD5E1' : '#64748B' }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Button */}
      <motion.button
        onClick={onBackToLogin}
        className="w-full max-w-md mx-auto flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold transition-all duration-500 backdrop-blur-xl group overflow-hidden relative"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
          border: isDarkMode ? '2px solid rgba(99, 102, 241, 0.3)' : '2px solid rgba(99, 102, 241, 0.2)',
          color: isDarkMode ? '#E2E8F0' : '#374151'
        }}
        whileHover={{ 
          scale: 1.02, 
          y: -2,
          boxShadow: isDarkMode
            ? '0 15px 35px rgba(99, 102, 241, 0.3)'
            : '0 15px 35px rgba(99, 102, 241, 0.2)'
        }}
        whileTap={{ scale: 0.98 }}
        aria-label="Return to Secure Login"
      >
        {/* Button Shimmer Effect */}
        <motion.div
          className="absolute inset-0 -skew-x-12"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)'
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
        />
        
        <motion.div
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.div>
        <span className="relative z-10">Return to Secure Login</span>
        
        {/* Floating Sparkles */}
        <motion.div
          className="absolute top-2 right-6"
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Sparkles className="w-3 h-3" style={{ color: '#6366F1' }} />
        </motion.div>
      </motion.button>

      {/* Premium Footer */}
      <motion.div
        className="text-center pt-8 border-t"
        style={{
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        {/* Trust Badges */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          {[
            { icon: Shield, label: 'Bank-Grade Security', color: '#10B981' },
            { icon: Award, label: 'Industry Leading', color: '#F59E0B' },
            { icon: Star, label: 'Premium Support', color: '#6366F1' }
          ].map((badge, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              animate={{
                y: [0, -2, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
            >
              <badge.icon className="w-4 h-4" style={{ color: badge.color }} />
              <span 
                className="text-xs font-medium hidden sm:inline"
                style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
              >
                {badge.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Copyright */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <p 
            className="text-lg font-bold"
            style={{
              color: isDarkMode ? '#F1F5F9' : '#1F2937'
            }}
          >
            National Bank of Canada
          </p>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#64748B' : '#9CA3AF' }}
          >
            © {currentYear} All rights reserved. Premium Support Excellence.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}