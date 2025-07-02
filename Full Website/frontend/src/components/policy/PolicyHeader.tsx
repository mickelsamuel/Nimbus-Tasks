'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Shield } from 'lucide-react'

interface PolicyHeaderProps {
  className?: string
}

export const PolicyHeader: React.FC<PolicyHeaderProps> = ({ className = '' }) => {
  return (
    <motion.header 
      className={`pt-4 px-4 sm:px-6 lg:px-8 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo - matching homepage/login/help pattern */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
              <span className="relative text-lg font-black text-white z-10">BNC</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">National Bank of Canada</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Policy Center
              </p>
            </div>
          </motion.div>

          {/* Back to Login - matching other pages pattern */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Login</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default PolicyHeader