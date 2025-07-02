'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  Coins, 
  Star, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  Gift,
  Flame
} from 'lucide-react'

interface LeaderboardWalletProps {
  className?: string
}


export default function LeaderboardWallet({ className = '' }: LeaderboardWalletProps) {
  const [currency, setCurrency] = useState({
    coins: 0,
    tokens: 0
  })
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Safe currency values with defaults
  const safeCurrency = {
    coins: currency?.coins ?? 0,
    tokens: currency?.tokens ?? 0
  }

  // Fetch currency balance
  const fetchCurrencyBalance = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        return
      }

      const response = await fetch(`${API_BASE}/currency/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCurrency(prev => ({
          coins: data.data?.coins ?? prev.coins,
          tokens: data.data?.tokens ?? prev.tokens
        }))
      }
    } catch (error) {
      console.warn('Currency balance API not available, using defaults')
    }
  }

  useEffect(() => {
    fetchCurrencyBalance()
  }, [])

  const handleWalletClick = () => {
    // Navigate to modules page to earn more currency
    window.location.href = '/modules'
  }

  return (
    <motion.div
      className={`relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      onHoverStart={() => setShowDetails(true)}
      onHoverEnd={() => setShowDetails(false)}
    >

      {/* Header */}
      <motion.div
        className="relative z-10 p-6 border-b border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="relative p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wallet className="h-8 w-8 text-white" />
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="h-3 w-3 text-white" />
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              My Wallet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Digital treasury
            </p>
          </div>
          
          <motion.button
            onClick={handleWalletClick}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors group"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            title="Open full wallet"
          >
            <ArrowUpRight className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          </motion.button>
        </div>
      </motion.div>

      {/* Currency Display */}
      <motion.div
        className="relative z-10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Coins */}
          <motion.div
            className="group relative overflow-hidden rounded-2xl"
            onHoverStart={() => setHoveredSection('coins')}
            onHoverEnd={() => setHoveredSection(null)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-0.5 rounded-2xl">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl h-full" />
            </div>
            
            <div className="relative p-4">
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative"
                  animate={hoveredSection === 'coins' ? {
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  } : {
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: hoveredSection === 'coins' ? 0.6 : 4, 
                    repeat: hoveredSection === 'coins' ? 0 : Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <div className="flex-1">
                  <motion.div
                    className="text-3xl font-black text-slate-900 dark:text-white"
                    animate={hoveredSection === 'coins' ? {
                      scale: [1, 1.05, 1]
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {safeCurrency.coins.toLocaleString()}
                  </motion.div>
                  <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
                    Coins
                  </div>
                </div>
                
                <motion.div
                  className="text-emerald-500"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <TrendingUp className="h-5 w-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Tokens */}
          <motion.div
            className="group relative overflow-hidden rounded-2xl"
            onHoverStart={() => setHoveredSection('tokens')}
            onHoverEnd={() => setHoveredSection(null)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-500 p-0.5 rounded-2xl">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl h-full" />
            </div>
            
            <div className="relative p-4">
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative"
                  animate={hoveredSection === 'tokens' ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  } : {
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: hoveredSection === 'tokens' ? 0.8 : 5, 
                    repeat: hoveredSection === 'tokens' ? 0 : Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [1, 0.6, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </motion.div>
                
                <div className="flex-1">
                  <motion.div
                    className="text-3xl font-black text-slate-900 dark:text-white"
                    animate={hoveredSection === 'tokens' ? {
                      scale: [1, 1.05, 1]
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {safeCurrency.tokens.toLocaleString()}
                  </motion.div>
                  <div className="text-purple-600 dark:text-purple-400 font-semibold">
                    Event Tokens
                  </div>
                </div>
                
                <motion.div
                  className="text-purple-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="h-5 w-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>


        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <motion.button
            onClick={handleWalletClick}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white rounded-2xl px-6 py-4 font-bold transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl"
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="h-6 w-6" />
            </motion.div>
            <span className="text-lg">Earn More Coins</span>
            <motion.div
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowUpRight className="h-5 w-5" />
            </motion.div>
          </motion.button>

          <motion.button
            className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-2xl px-6 py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-3 group"
            whileHover={{ 
              scale: 1.02, 
              y: -2 
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('Navigating to shop...')
              window.location.href = '/shop'
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Gift className="h-5 w-5" />
            </motion.div>
            <span>Spend Currency</span>
          </motion.button>
        </motion.div>

        {/* Additional Details (shown on hover) */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700/30 dark:to-gray-700/30 rounded-2xl border border-slate-200 dark:border-slate-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  className="flex items-center justify-center gap-2 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No streak data
                  </span>
                </motion.div>
                <motion.div
                  className="text-xs text-slate-600 dark:text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Keep earning to unlock bonus multipliers!
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}