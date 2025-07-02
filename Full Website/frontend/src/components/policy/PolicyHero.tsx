'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles, Award } from 'lucide-react'

interface PolicyHeroProps {
  className?: string
}

export const PolicyHero: React.FC<PolicyHeroProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`text-center mb-20 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, type: 'spring', stiffness: 100 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Simple Hero Icon */}
      <motion.div 
        className="flex justify-center mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="relative">
          <div 
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          >
            <Shield className="h-12 w-12 md:h-14 md:w-14 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </motion.div>
      
      {/* Enhanced Typography with Gradient Effects - matching homepage pattern */}
      <motion.h1 
        className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 1, type: 'spring', stiffness: 100 }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.span
          className="text-gray-900 dark:text-white block"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Professional Training
        </motion.span>
        <motion.span 
          className="block bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mt-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Policy Center
        </motion.span>
      </motion.h1>
      
      {/* Simple Decorative Elements */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-gray-400/50" />
          <Sparkles className="h-6 w-6 text-blue-500" />
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-gray-400/50" />
        </div>
      </motion.div>
      
      {/* Enhanced Description with Typewriter Effect */}
      <motion.div
        className="max-w-5xl mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
          whileHover={{ scale: 1.01 }}
        >
          Welcome to the <motion.span 
            className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent font-bold"
            whileHover={{ scale: 1.05 }}
          >
            National Bank of Canada Training Platform
          </motion.span>. As a valued professional, your commitment to our standards of excellence, integrity, and compliance is essential for maintaining our industry-leading reputation.
        </motion.p>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          Please review and accept our comprehensive training platform policies that align with banking regulations, institutional values, and professional development standards.
        </motion.p>
        
        {/* Call to Action Badge */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold shadow-lg">
            <Award className="h-5 w-5 mr-2" />
            <span>4 Essential Policy Sections</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default PolicyHero