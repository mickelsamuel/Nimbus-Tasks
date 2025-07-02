'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

interface CollapseToggleProps {
  isCollapsed: boolean
  onToggle?: () => void
  className?: string
}

export default function CollapseToggle({ 
  isCollapsed, 
  onToggle, 
  className = '' 
}: CollapseToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`flex items-center justify-center rounded-xl bg-transparent p-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-800/20 ${className}`}
      aria-label="Toggle sidebar"
      title="Toggle sidebar (⌘B)"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-center justify-center"
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.div>
      {!isCollapsed && (
        <motion.span 
          className="ml-2 text-sm font-medium"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          Collapse
        </motion.span>
      )}
    </motion.button>
  )
}