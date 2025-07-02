'use client'

import { motion } from 'framer-motion'
import { Shield, Bell, AlertTriangle } from 'lucide-react'

export const AdminHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden"
    >
      {/* Three-Tier Glassmorphism Background */}
      <div className="absolute inset-0 holographic-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      
      {/* First Glass Panel */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(40px)'
      }} />
      
      {/* Second Glass Panel */}
      <div className="absolute inset-4" style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(224,26,26,0.1)'
      }} />
      
      {/* Third Glass Panel */}
      <div className="absolute inset-8" style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(224,26,26,0.05)'
      }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Security Badge with Biometric Scanner */}
            <motion.div
              className="relative biometric-scanner"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-xl shadow-2xl border border-red-500/50">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Biometric Scanning Lines */}
              <motion.div
                className="absolute inset-0 border-2 border-red-400 rounded-xl"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                Executive Command Center
              </h1>
              <p className="text-slate-300 mt-1">
                Administrator • Security Clearance: Level 9 • Session: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Emergency Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-xl transition-colors"
            >
              <Bell className="h-5 w-5 text-yellow-400" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl transition-colors"
            >
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}