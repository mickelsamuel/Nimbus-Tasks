'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Command } from 'lucide-react'

interface SearchSectionProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  isCollapsed: boolean
  className?: string
}

export default function SearchSection({ 
  searchQuery, 
  onSearchChange, 
  isCollapsed, 
  className = '' 
}: SearchSectionProps) {
  if (isCollapsed) return null

  return (
    <motion.div 
      className={`mb-4 px-3 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search navigation..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 pl-12 pr-12 py-2 text-sm text-center text-gray-900 dark:text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary-500/20"
          aria-label="Search navigation"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          <Command className="h-3 w-3 inline" />K
        </kbd>
      </div>
    </motion.div>
  )
}