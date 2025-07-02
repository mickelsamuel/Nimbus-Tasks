'use client'

import { motion } from 'framer-motion'

export function AnimationTest() {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-bold mb-2">Animation Test</h3>
      
      {/* CSS Animation Test */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs">CSS Spin</span>
      </div>
      
      {/* Pulse Test */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs">CSS Pulse</span>
      </div>
      
      {/* Bounce Test */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-purple-500 rounded-full animate-bounce"></div>
        <span className="text-xs">CSS Bounce</span>
      </div>
      
      {/* Framer Motion Test */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-6 h-6 bg-red-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <span className="text-xs">Motion Spin</span>
      </div>
      
      <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
        These should keep animating while scrolling
      </p>
    </div>
  )
}