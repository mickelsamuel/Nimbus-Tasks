'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Shield } from 'lucide-react'

interface UserTypeSelectorProps {
  userType: 'employee' | 'admin'
  onUserTypeChange: (type: 'employee' | 'admin') => void
}

export default function UserTypeSelector({ userType, onUserTypeChange }: UserTypeSelectorProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div 
        className="flex p-1 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <button
          onClick={() => onUserTypeChange('employee')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
            userType === 'employee'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          aria-pressed={userType === 'employee'}
          aria-label="Switch to employee portal mode"
        >
          <User className="h-4 w-4" />
          Employee Portal
        </button>
        <button
          onClick={() => onUserTypeChange('admin')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
            userType === 'admin'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          aria-pressed={userType === 'admin'}
          aria-label="Switch to admin portal mode"
        >
          <Shield className="h-4 w-4" />
          Admin Center
        </button>
      </div>
    </motion.div>
  )
}