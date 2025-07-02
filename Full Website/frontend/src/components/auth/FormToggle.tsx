'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface FormToggleProps {
  isLogin: boolean
  onToggle: (isLogin: boolean) => void
}

export default function FormToggle({ isLogin, onToggle }: FormToggleProps) {
  return (
    <div className="relative mb-8">
      {/* Toggle Container */}
      <div className="relative bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
        {/* Animated Background Slider - Now properly centered and sized */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
          style={{
            width: 'calc(50% - 4px)',
            left: isLogin ? '4px' : 'calc(50% + 0px)',
          }}
          animate={{
            left: isLogin ? '4px' : 'calc(50% + 0px)',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.3
          }}
        />

        {/* Login Button */}
        <motion.button
          onClick={() => onToggle(true)}
          className={`
            relative z-10 w-1/2 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent
            ${isLogin
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }
          `}
          whileHover={{ scale: isLogin ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-pressed={isLogin}
        >
          Sign In
        </motion.button>

        {/* Register Button */}
        <motion.button
          onClick={() => onToggle(false)}
          className={`
            relative z-10 w-1/2 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent
            ${!isLogin
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }
          `}
          whileHover={{ scale: !isLogin ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-pressed={!isLogin}
        >
          Register
        </motion.button>
      </div>
    </div>
  )
}