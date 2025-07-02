'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield,
  Key,
  ShieldCheck,
  Lock
} from 'lucide-react'

interface ResetPasswordLayoutProps {
  children: React.ReactNode
}

export const ResetPasswordLayout: React.FC<ResetPasswordLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1E40AF 50%, #F59E0B 100%)'
      }}
    >
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      {/* Banking Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Banking Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23E01A1A%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M0 0h40v40H0z%22/%3E%3Cpath d=%22M40 40h40v40H40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        {/* Floating Banking Security Symbols */}
        <motion.div 
          className="absolute top-20 left-20 w-24 h-24 opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Key className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-20 w-20 h-20 opacity-20"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 3, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          aria-hidden="true"
        >
          <ShieldCheck className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 left-40 w-28 h-28 opacity-15"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full border-4 border-white flex items-center justify-center">
            <Lock className="text-white h-8 w-8" />
          </div>
        </motion.div>

        {/* Premium Gradient Particles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent-500/20 rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl" id="main-content">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* National Bank Security Logo */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-3xl mb-6 relative"
            style={{
              background: 'linear-gradient(145deg, #E01A1A 0%, #B71C1C 100%)',
              boxShadow: '0 20px 40px rgba(224,26,26,0.3), inset 0 2px 0 rgba(255,255,255,0.3)'
            }}
            whileHover={{ 
              scale: 1.05
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">BNC</span>
            {/* Security Badge */}
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
              style={{
                background: 'linear-gradient(145deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 2px 8px rgba(16,185,129,0.4)'
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Key className="h-3 w-3 text-white m-0.5" />
            </motion.div>
            {/* Holographic Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
          </motion.div>

          {/* Executive Typography */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3"
            style={{ 
              fontFamily: '"Playfair Display", serif',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              letterSpacing: '0.02em'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Secure Password Reset
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-white/90 font-medium"
            style={{ fontFamily: '"Inter", sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Bank-Grade Security Protection
          </motion.p>
          
          {/* Security Level Indicator */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.7 + i * 0.05 }}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-green-300">
              Level 5 Security
            </span>
          </motion.div>
        </motion.div>

        {/* Enhanced Glassmorphism Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        >
          {/* Premium Glass Background */}
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: `
                0 8px 32px rgba(0,0,0,0.08),
                0 32px 64px rgba(224,26,26,0.08),
                inset 0 1px 0 rgba(255,255,255,0.4)
              `
            }}
          />
          
          {/* Dark mode enhanced glass */}
          <div 
            className="absolute inset-0 rounded-3xl hidden dark:block"
            style={{
              background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.90) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: `
                0 8px 32px rgba(0,0,0,0.2),
                0 32px 64px rgba(224,26,26,0.1),
                inset 0 1px 0 rgba(255,255,255,0.1)
              `
            }}
          />

          {/* National Bank Security Accent Border */}
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(45deg, #E01A1A, transparent, #10B981, transparent, #E01A1A)',
              padding: '2px',
              borderRadius: '24px'
            }}
          >
            <div 
              className="w-full h-full rounded-3xl"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)'
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            {children}
          </div>
        </motion.div>

        {/* Executive Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-white/70" />
            <span className="text-sm text-white/70 font-medium">Bank-Grade Security</span>
          </div>
          <p className="text-sm text-white/60">
            © 2025 National Bank of Canada. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Focus outline styling */
        .focus\\:outline-none:focus {
          outline: 2px solid #10B981;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}