'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Coins, Star } from 'lucide-react'

interface CurrencyDisplayProps {
  currency?: {
    coins?: number
    tokens?: number
    level?: number
  }
  onCurrencyClick: () => void
  className?: string
}

export default function CurrencyDisplay({ 
  currency, 
  onCurrencyClick, 
  className = '' 
}: CurrencyDisplayProps) {
  
  // Provide default values for currency properties
  const safeCurrency = {
    coins: currency?.coins ?? 0,
    tokens: currency?.tokens ?? 0,
    level: currency?.level ?? 0
  }

  return (
    <div className={`hidden md:flex items-center gap-2 lg:gap-3 ${className}`}>
      {/* Coins */}
      <motion.button
        onClick={onCurrencyClick}
        className="relative flex items-center gap-1.5 md:gap-2 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 backdrop-blur-sm border border-yellow-300/60 px-2 md:px-3 py-1.5 text-white shadow-lg group"
        whileHover={{ 
          scale: 1.02,
          y: -1
        }}
        whileTap={{ scale: 0.98 }}
        title="View coin balance and history"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
        >
          <Coins className="h-4 w-4" />
        </motion.div>
        <motion.span 
          className="text-sm font-semibold tabular-nums"
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {safeCurrency.coins.toLocaleString()}
        </motion.span>
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        </div>
      </motion.button>

      {/* Event Tokens */}
      <motion.button
        onClick={onCurrencyClick}
        className="relative flex items-center gap-1.5 md:gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 backdrop-blur-sm border border-purple-400/60 px-2 md:px-3 py-1.5 text-white shadow-lg group"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300 }}
        title="View event token balance and history"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
        >
          <Star className="h-4 w-4" />
        </motion.div>
        <motion.span 
          className="text-sm font-semibold tabular-nums"
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {safeCurrency.tokens.toString()}
        </motion.span>
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        </div>
      </motion.button>
    </div>
  )
}