'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Star } from 'lucide-react'

interface Transaction {
  type: 'earn' | 'spend' | 'transfer_in' | 'transfer_out'
  coins: number
  tokens: number
  reason: string
  timestamp: Date
}

interface CurrencyHistoryModalProps {
  show: boolean
  transactions: Transaction[]
  currency: {
    coins: number
    tokens: number
    level: number
  }
  onClose: () => void
  className?: string
}

export default function CurrencyHistoryModal({
  show,
  transactions,
  currency,
  onClose,
  className = ''
}: CurrencyHistoryModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transaction History
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'earn' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                          transaction.type === 'spend' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                          transaction.type === 'transfer_in' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                          'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                        }`}>
                          {transaction.type === 'earn' && '💰'}
                          {transaction.type === 'spend' && '💸'}
                          {transaction.type === 'transfer_in' && '⬇️'}
                          {transaction.type === 'transfer_out' && '⬆️'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.reason}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {transaction.coins > 0 && (
                          <div className={`text-sm font-semibold ${
                            transaction.type === 'earn' || transaction.type === 'transfer_in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'earn' || transaction.type === 'transfer_in' ? '+' : '-'}{transaction.coins} coins
                          </div>
                        )}
                        {transaction.tokens > 0 && (
                          <div className={`text-xs ${
                            transaction.type === 'earn' || transaction.type === 'transfer_in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'earn' || transaction.type === 'transfer_in' ? '+' : '-'}{transaction.tokens} Event tokens
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-600 mb-2">
                      💰
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No currency transactions yet
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                      Complete modules and activities to earn currency!
                    </p>
                  </div>
                )}
              </div>
              
              {/* Current Balance Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Current Balance:</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {(currency?.coins || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {currency?.tokens || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}