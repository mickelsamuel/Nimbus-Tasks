'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Coins, Star, TrendingUp, History } from 'lucide-react'

interface WalletDisplayProps {
  currency?: {
    coins?: number
    tokens?: number
    level?: number
  }
  onOpenHistory: () => void
  className?: string
}

export default function WalletDisplay({ 
  currency, 
  onOpenHistory, 
  className = '' 
}: WalletDisplayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showFullInterface, setShowFullInterface] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  
  const safeCurrency = {
    coins: currency?.coins ?? 0,
    tokens: currency?.tokens ?? 0,
    level: currency?.level ?? 0
  }

  const handleWalletClick = () => {
    setIsOpen(true)
    setTimeout(() => {
      setShowFullInterface(true)
    }, 1400) // Show full interface after wallet opens
  }

  const handleClose = () => {
    setIsClosing(true)
    setShowFullInterface(false)
    // Show closing wallet animation for a moment, then fully close
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 1000)
  }

  return (
    <>
      {/* Wallet Button */}
      <motion.button
        onClick={handleWalletClick}
        className={`relative flex items-center gap-2 md:gap-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 dark:from-amber-600 dark:via-amber-700 dark:to-yellow-600 backdrop-blur-sm border border-amber-400/60 dark:border-amber-500/60 px-3 md:px-4 py-2.5 text-white shadow-lg group hover:shadow-xl transition-all duration-300 ${className}`}
        whileHover={{ 
          scale: 1.02,
          y: -1
        }}
        whileTap={{ scale: 0.98 }}
        title="View wallet contents"
      >
        {/* Animated Wallet Icon */}
        <div className="relative">
          <motion.div
            className="perspective-1000"
            animate={isOpen ? {} : {}}
          >
            <motion.div
              className="preserve-3d"
              animate={isOpen ? { rotateY: 25, rotateX: -10 } : { rotateY: 0, rotateX: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Wallet className="h-5 w-5 md:h-6 md:w-6 text-amber-100" />
            </motion.div>
          </motion.div>
          
          {/* Notification Badge */}
          {(safeCurrency.coins > 0 || safeCurrency.tokens > 0) && (
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        {/* Currency Summary */}
        <div className="flex items-center gap-3">
          {/* Coins */}
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            >
              <Coins className="h-4 w-4 text-yellow-200" />
            </motion.div>
            <span className="text-sm md:text-base font-bold tabular-nums">
              {safeCurrency.coins.toLocaleString()}
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-amber-300/50" />

          {/* Event Tokens */}
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            >
              <Star className="h-4 w-4 text-purple-200" />
            </motion.div>
            <span className="text-sm md:text-base font-bold tabular-nums">
              {safeCurrency.tokens.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
          <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        </div>

        {/* Subtle opening indicator */}
        {isOpen && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-white/30"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>

      {/* Wallet Animation & Interface - Rendered via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: isClosing ? 0.4 : 0.2,
                ease: isClosing ? 'easeIn' : 'easeOut'
              }}
            >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isClosing ? 0.3 : 0.2 }}
              onClick={showFullInterface ? handleClose : undefined}
            />
            
            {/* Premium Wallet */}
            <motion.div
              className="relative w-[28rem] h-72 perspective-1000"
              initial={isClosing ? { scale: 1, rotateY: 0 } : { scale: 0.7, rotateY: 0 }}
              animate={isClosing ? { scale: 0.7, rotateY: 0 } : { scale: 1, rotateY: 0 }}
              transition={{ 
                delay: isClosing ? 0.8 : 0,
                duration: 0.6, 
                ease: isClosing ? 'easeIn' : 'easeOut' 
              }}
            >
              {/* Outer Glow Ring */}
              <motion.div
                className="absolute -inset-4 rounded-3xl"
                style={{
                  background: 'conic-gradient(from 0deg, #fbbf24, #f59e0b, #d97706, #92400e, #fbbf24)',
                  filter: 'blur(20px)',
                  opacity: 0.6
                }}
                initial={isClosing ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 0.8 }}
                animate={isClosing ? { opacity: 0, scale: 0.8 } : { opacity: 0.6, scale: 1 }}
                transition={{ 
                  delay: isClosing ? 0.2 : 1.2, 
                  duration: 0.8 
                }}
              />

              {/* Main Wallet Body */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                {/* Premium Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black">
                  {/* Animated mesh gradient overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: 'linear-gradient(45deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #1e293b 100%)',
                      backgroundSize: '400% 400%'
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Holographic accents */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
                </div>

                {/* Metallic Frame */}
                <div className="absolute inset-2 rounded-2xl border border-gradient-to-r from-amber-400/50 via-yellow-300/30 to-amber-400/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                  
                  {/* Content Area */}
                  <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-slate-800/80 via-gray-800/60 to-slate-900/80 backdrop-blur-md border border-white/10 p-6 flex items-center justify-between">
                    
                    {/* Coins Section */}
                    <motion.div
                      className="flex flex-col items-center gap-3"
                      initial={isClosing ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -40, scale: 0.8 }}
                      animate={isClosing ? { opacity: 0, x: -40, scale: 0.8 } : { opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: isClosing ? 0.6 : 0.8, 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {/* Coin with holographic effect */}
                      <motion.div
                        className="relative"
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 shadow-xl border-2 border-yellow-300/50 flex items-center justify-center relative overflow-hidden">
                          {/* Holographic shine */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <Coins className="h-8 w-8 text-yellow-900 z-10" />
                        </div>
                        {/* Coin glow */}
                        <div className="absolute inset-0 rounded-full bg-yellow-400/50 blur-xl scale-150" />
                      </motion.div>
                      
                      <motion.div
                        className="text-center"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                          {safeCurrency.coins.toLocaleString()}
                        </div>
                        <div className="text-sm text-yellow-300/80 font-medium tracking-wider">COINS</div>
                      </motion.div>
                    </motion.div>

                    {/* Center Divider with Energy Effect */}
                    <motion.div 
                      className="w-px h-24 relative"
                      initial={isClosing ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
                      animate={isClosing ? { opacity: 0, scaleY: 0 } : { opacity: 1, scaleY: 1 }}
                      transition={{ 
                        delay: isClosing ? 0.4 : 0.6,
                        duration: 0.6 
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-white via-cyan-300 to-white"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {/* Energy particles */}
                      <motion.div
                        className="absolute w-1 h-1 bg-cyan-300 rounded-full -left-0.5"
                        animate={{ y: [-10, 34], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                      />
                    </motion.div>

                    {/* Tokens Section */}
                    <motion.div
                      className="flex flex-col items-center gap-3"
                      initial={isClosing ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.8 }}
                      animate={isClosing ? { opacity: 0, x: 40, scale: 0.8 } : { opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: isClosing ? 0.2 : 1.0, 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {/* Token with cosmic effect */}
                      <motion.div
                        className="relative"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotateZ: [0, 180, 360]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 shadow-xl border-2 border-purple-400/50 flex items-center justify-center relative overflow-hidden">
                          {/* Cosmic shimmer */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45"
                            animate={{ rotate: [45, 405] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                          <Star className="h-8 w-8 text-purple-100 z-10" />
                        </div>
                        {/* Token aura */}
                        <div className="absolute inset-0 rounded-full bg-purple-500/50 blur-xl scale-150" />
                      </motion.div>
                      
                      <motion.div
                        className="text-center"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent">
                          {safeCurrency.tokens.toLocaleString()}
                        </div>
                        <div className="text-sm text-purple-300/80 font-medium tracking-wider">EVENT TOKENS</div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Premium Wallet Lid/Flap */}
              <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden preserve-3d border border-white/20"
                style={{ transformOrigin: 'center bottom' }}
                initial={isClosing ? { rotateX: -180 } : { rotateX: 0 }}
                animate={isClosing ? { rotateX: 0 } : { rotateX: -180 }}
                transition={{ 
                  delay: isClosing ? 0 : 0.4, 
                  duration: 0.8, 
                  ease: 'easeInOut' 
                }}
              >
                {/* Lid gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-black">
                  <motion.div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background: 'conic-gradient(from 0deg, #1e293b, #334155, #475569, #1e293b)',
                      backgroundSize: '200% 200%'
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                {/* Wallet Icon with Premium Effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="relative"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotateY: [0, 5, 0, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="relative">
                      <Wallet className="h-20 w-20 text-white drop-shadow-2xl" />
                      {/* Icon glow */}
                      <motion.div
                        className="absolute inset-0 blur-md"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Wallet className="h-20 w-20 text-cyan-300" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Advanced Lighting Effects */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                  filter: 'blur(1px)'
                }}
                initial={isClosing ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                animate={isClosing ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                transition={{ 
                  delay: isClosing ? 0.4 : 1.4, 
                  duration: 0.8 
                }}
              />

              {/* Interactive Elements (appear after animation) */}
              {showFullInterface && (
                <motion.div
                  className="absolute inset-0 flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Close Button */}
                  <motion.button
                    onClick={handleClose}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>

                  {/* Action Buttons at Bottom */}
                  <motion.div
                    className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <motion.button
                      onClick={() => {
                        handleClose()
                        onOpenHistory()
                      }}
                      className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 shadow-lg transition-colors"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <History className="h-5 w-5" />
                      <span className="font-medium">History</span>
                    </motion.button>
                    
                    <motion.button
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl px-4 py-3 hover:from-amber-600 hover:to-amber-700 shadow-lg transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-medium">Earn More</span>
                    </motion.button>
                  </motion.div>

                  {/* Wallet Title */}
                  <motion.div
                    className="absolute -top-12 left-0 right-0 text-center"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-1">My Wallet</h2>
                    <p className="text-amber-200">
                      Level {safeCurrency.level} Banking Professional
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}