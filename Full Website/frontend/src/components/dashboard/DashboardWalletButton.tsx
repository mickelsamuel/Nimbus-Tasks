'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, Star, TrendingUp, 
  ChevronRight, Sparkles, Plus
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics'

interface Currency {
  coins: number
  tokens: number
  totalXP?: number
  level?: number
}

interface DashboardWalletButtonProps {
  currency: Currency
  onWalletClick?: () => void
  className?: string
}

export function DashboardWalletButton({ 
  currency, 
  onWalletClick,
  className = ""
}: DashboardWalletButtonProps) {
  const router = useRouter()
  const { walletHistory } = useDashboardMetrics()
  const [isHovered, setIsHovered] = useState(false)

  const safeCurrency = {
    coins: currency?.coins || 0,
    tokens: currency?.tokens || 0
  }

  const handleWalletClick = () => {
    if (onWalletClick) {
      onWalletClick()
    } else {
      router.push('/shop')
    }
  }

  return (
    <div className={`h-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card rounded-2xl p-6 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-900/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-lg"
            >
              <Wallet className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                My Wallet
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your rewards & currency
              </p>
            </div>
          </div>
          <motion.button
            onClick={handleWalletClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Main Balance Display */}
        <motion.div
          onClick={handleWalletClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative p-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 dark:from-amber-600 dark:via-amber-700 dark:to-yellow-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer mb-6 overflow-hidden"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl transform -translate-x-12 translate-y-12" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium mb-2">Total Balance</p>
                <p className="text-3xl font-bold mb-1">
                  {safeCurrency.coins.toLocaleString()}
                </p>
                <p className="text-amber-200 text-sm">coins</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-200" />
                    <span className="text-2xl font-bold">
                      {safeCurrency.tokens.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100 mt-1">Event Tokens</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-amber-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-medium text-green-200">
                    {walletHistory?.statistics.weeklyGrowth ? 
                      `${walletHistory.statistics.weeklyGrowth > 0 ? '+' : ''}${walletHistory.statistics.weeklyGrowth}% this week` : 
                      'No activity this week'
                    }
                  </span>
                </div>
                <ChevronRight className={`w-5 h-5 text-amber-200 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Daily Earnings */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/shop')}
            className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl cursor-pointer"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              +{walletHistory?.statistics.dailyAverage || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Daily Avg</div>
          </motion.div>

          {/* Weekly Earnings */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/dashboard')}
            className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl cursor-pointer"
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {walletHistory?.statistics.transactionCount || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Earnings</div>
          </motion.div>

          {/* Monthly Total */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/dashboard')}
            className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl cursor-pointer"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {walletHistory?.statistics.totalEarnings.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/modules')}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Earn More</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/shop')}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            <span>Shop</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}