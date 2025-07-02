'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Eye } from 'lucide-react'

interface PolicyNoticeProps {
  className?: string
}

export const PolicyNotice: React.FC<PolicyNoticeProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`mb-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <div 
        className="p-6 md:p-8 rounded-3xl relative"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.08),
            0 32px 64px rgba(245,158,11,0.08),
            inset 0 1px 0 rgba(255,255,255,0.4)
          `
        }}
      >
        {/* Warning Border */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(45deg, #F59E0B, transparent, #F59E0B)',
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
        
        <div className="relative z-10 flex flex-col md:flex-row items-start">
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0"
            style={{
              background: 'linear-gradient(145deg, #F59E0B 0%, #D97706 100%)',
              boxShadow: '0 8px 16px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
            }}
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AlertTriangle className="h-6 w-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Mandatory Training Platform Agreement
            </h3>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
              As a National Bank of Canada employee, you must review each policy section completely, 
              scroll through all content, and individually accept each requirement before accessing our 
              training modules. These standards are identical to those governing all bank operations and 
              client interactions.
            </p>
            <div className="flex items-center text-amber-700 font-semibold">
              <Eye className="h-5 w-5 mr-2" />
              Full review and individual acceptance required
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PolicyNotice