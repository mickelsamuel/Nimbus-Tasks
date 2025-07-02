'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Zap } from 'lucide-react'

interface StatusIndicatorsProps {
  isOnline: boolean
  isSyncing: boolean
  currentPage: string
  className?: string
}

export default function StatusIndicators({ 
  isOnline, 
  isSyncing, 
  currentPage, 
  className = '' 
}: StatusIndicatorsProps) {
  return (
    <motion.div 
      className={`hidden xl:flex items-center gap-2 ml-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {isOnline ? (
          <motion.div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Wifi className="h-3 w-3" />
            <span className="text-xs font-medium">Online</span>
          </motion.div>
        ) : (
          <motion.div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <WifiOff className="h-3 w-3" />
            <span className="text-xs font-medium">Offline</span>
          </motion.div>
        )}
      </div>

      {/* Sync Status */}
      {isSyncing && (
        <motion.div 
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-3 w-3" />
          </motion.div>
          <span className="text-xs font-medium">Syncing...</span>
        </motion.div>
      )}

      {/* Current Page Context */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <div className="h-1 w-1 rounded-full bg-gray-400" />
        <span className="text-xs font-medium">{currentPage}</span>
      </div>
    </motion.div>
  )
}