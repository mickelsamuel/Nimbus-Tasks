'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Globe } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from '@/contexts/TranslationContext'
import Link from 'next/link'

export function PublicHeader() {
  const { isDark, toggleTheme } = useTheme()
  const { language } = useTranslation()

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 h-16"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Glassmorphism Background */}
      <div 
        className="absolute inset-0 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50"
      />

      {/* Header Content */}
      <div className="relative z-10 flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div
            className="relative"
            whileHover={{ 
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25 border border-primary-400/30">
              <span className="text-lg font-bold text-white tracking-wide">BNC</span>
            </div>
          </motion.div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
              BNC Learning
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              National Bank of Canada
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          
          {/* Language Toggle */}
          <motion.button
            onClick={() => {}} // Disabled as requested
            className="relative group p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 opacity-50 cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
                {language}
              </span>
            </div>
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              FR Soon
            </div>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="relative group p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 dark:from-purple-400/20 dark:to-pink-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div className="relative">
              {isDark ? (
                <Moon className="h-4 w-4 text-purple-400" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-600" />
              )}
            </motion.div>
          </motion.button>

          {/* Login Button */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300" />
            <Link
              href="/login"
              className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg transition-all duration-200"
            >
              Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  )
}