'use client'

import { motion } from 'framer-motion'
import { Package, Heart, Award, Activity } from 'lucide-react'

interface ShopStatsProps {
  totalItems: number
  ownedItems: number
  wishlistedItems: number
  recentPurchases: number
}

export default function ShopStats({ totalItems, ownedItems, wishlistedItems, recentPurchases }: ShopStatsProps) {
  const completionPercentage = totalItems > 0 ? Math.round((ownedItems / totalItems) * 100) : 0

  const stats = [
    {
      title: 'Total Items',
      value: totalItems,
      icon: Package,
      description: 'Available in store',
      color: 'indigo',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200/50 dark:border-indigo-700/50'
    },
    {
      title: 'Owned',
      value: ownedItems,
      percentage: completionPercentage,
      icon: Award,
      description: `${completionPercentage}% Complete`,
      color: 'green',
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-600 dark:text-green-400',
      border: 'border-green-200/50 dark:border-green-700/50'
    },
    {
      title: 'Wishlist',
      value: wishlistedItems,
      icon: Heart,
      description: 'Items saved',
      color: 'pink',
      gradient: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
      border: 'border-pink-200/50 dark:border-pink-700/50'
    },
    {
      title: 'Activity',
      value: recentPurchases,
      icon: Activity,
      description: 'Recent purchases',
      color: 'purple',
      gradient: 'from-purple-500/20 to-violet-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200/50 dark:border-purple-700/50'
    }
  ]

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <motion.div 
              key={stat.title}
              className={`relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 border-2 ${stat.border} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 + index * 0.1,
                type: 'spring',
                bounce: 0.3
              }}
              whileHover={{ 
                scale: 1.03,
                y: -5,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                initial={false}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 bg-current rounded-full opacity-20 ${stat.iconColor}`}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      x: [-2, 2, -2],
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    className="p-3 bg-white/80 dark:bg-slate-700/80 rounded-xl backdrop-blur-sm border border-white/50 dark:border-slate-500/60"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: 'easeInOut' 
                      }}
                    >
                      <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                    </motion.div>
                  </motion.div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider bg-white/80 dark:bg-slate-700/80 px-3 py-1 rounded-full border border-white/40 dark:border-slate-500/50">
                    {stat.title}
                  </span>
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-3 mb-3">
                  <motion.div 
                    className="text-3xl font-black text-gray-900 dark:text-white drop-shadow-sm"
                    key={stat.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  {stat.percentage !== undefined && (
                    <motion.div 
                      className={`text-lg font-bold ${stat.iconColor} bg-white/80 dark:bg-slate-700/80 px-2 py-1 rounded-lg border border-white/40 dark:border-slate-500/50`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {stat.percentage}%
                    </motion.div>
                  )}
                </div>

                {/* Description */}
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
                  {stat.description}
                </div>

                {/* Progress bar for owned items */}
                {stat.percentage !== undefined && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${stat.color === 'green' ? 'from-green-500 to-emerald-500' : 'from-blue-500 to-indigo-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}