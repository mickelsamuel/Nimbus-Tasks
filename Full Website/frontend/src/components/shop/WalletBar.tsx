'use client'

import { motion } from 'framer-motion'
import { Coins, Star, Plus, TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react'

interface WalletBarProps {
  wallet: {
    coins: number
    tokens: number
    history: {
      earned: number
      spent: number
      transactions: number
    }
  }
}

export default function WalletBar({ wallet }: WalletBarProps) {
  const currencies = [
    {
      name: 'Coins',
      value: wallet.coins,
      icon: Coins,
      color: 'yellow',
      description: 'Main Currency',
      gradient: 'from-yellow-400/10 to-orange-400/10 dark:from-yellow-500/10 dark:to-orange-500/10',
      border: 'border-yellow-200/30 dark:border-yellow-400/20',
      iconBg: 'bg-yellow-400/20 dark:bg-yellow-500/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      hoverColor: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400'
    },
    {
      name: 'Event Tokens',
      value: wallet.tokens,
      icon: Star,
      color: 'purple',
      description: 'Special Currency',
      gradient: 'from-purple-400/10 to-pink-400/10 dark:from-purple-500/10 dark:to-pink-500/10',
      border: 'border-purple-200/30 dark:border-purple-400/20',
      iconBg: 'bg-purple-400/20 dark:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      hoverColor: 'group-hover:text-purple-600 dark:group-hover:text-purple-400'
    }
  ]

  return (
    <div className="relative -mt-8 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border-2 border-white/40 dark:border-slate-600/40 shadow-2xl overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
          
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Enhanced Currency Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                {currencies.map((currency, index) => {
                  const IconComponent = currency.icon
                  return (
                    <motion.div 
                      key={currency.name}
                      className={`group relative p-6 bg-gradient-to-br ${currency.gradient} rounded-2xl border ${currency.border} hover:shadow-xl transition-all duration-300 overflow-hidden`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -5,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Background glow effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${currency.color === 'yellow' ? '#fbbf24' : currency.color === 'purple' ? '#a855f7' : '#6366f1'}, transparent 70%)`
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className={`p-3 ${currency.iconBg} rounded-xl border border-white/30 dark:border-slate-500/30`}
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <IconComponent className={`w-5 h-5 ${currency.iconColor}`} />
                              </motion.div>
                            </motion.div>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{currency.name}</span>
                          </div>
                          <motion.div
                            whileHover={{ rotate: 45, scale: 1.2 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowUpRight className={`w-5 h-5 text-gray-400 ${currency.hoverColor} transition-colors`} />
                          </motion.div>
                        </div>
                        
                        <motion.div 
                          className="text-3xl font-black text-gray-900 dark:text-white mb-2 drop-shadow-sm"
                          key={currency.value}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {currency.value.toLocaleString()}
                        </motion.div>
                        
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-200">
                          {currency.description}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Enhanced Wallet Stats */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <motion.div 
                  className="text-center sm:text-right bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-slate-500/40"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="flex items-center justify-center sm:justify-end gap-3 mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </motion.div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Total Earned</span>
                  </div>
                  <motion.div 
                    className="text-2xl font-black text-gray-900 dark:text-white mb-2 drop-shadow-sm"
                    key={wallet.history.earned}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {wallet.history.earned.toLocaleString()}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {wallet.history.transactions} transactions
                  </div>
                </motion.div>

                <motion.button 
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl border-2 border-white/20 hover:border-white/30 overflow-hidden relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      x: [-100, 100],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  
                  <span className="relative z-10 flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 90, 180, 270, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                    Add Funds
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}