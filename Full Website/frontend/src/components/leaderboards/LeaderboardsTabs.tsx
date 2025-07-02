'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TabConfig {
  id: string
  label: string
  icon: string
  count: number
  description: string
}

interface LeaderboardsTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs: TabConfig[]
}

export default function LeaderboardsTabs({ activeTab, onTabChange, tabs }: LeaderboardsTabsProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <motion.div
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-3 border border-slate-200 dark:border-slate-700 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Mobile: Horizontal scroll */}
        <div className="flex lg:grid lg:grid-cols-6 gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-shrink-0 lg:flex-shrink group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 min-w-[140px] lg:min-w-0 ${activeTab === tab.id ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg transform scale-105' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: activeTab === tab.id ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <div className={`text-3xl mb-2 transition-transform duration-300 ${
                activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
              }`}>
                {tab.icon}
              </div>

              {/* Label */}
              <div className="text-center">
                <h3 className={`font-bold text-sm lg:text-base mb-1 ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}>
                  {tab.label}
                </h3>
                <p className={`text-xs opacity-75 mb-2 ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {tab.description}
                </p>
              </div>

              {/* Count Badge */}
              <div className={`absolute -top-1 -right-1 min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeTab === tab.id
                  ? 'bg-white text-amber-600'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
              }`}>
                {tab.count > 99 ? '99+' : tab.count}
              </div>

              {/* Live indicator for live events */}
              {tab.id === 'liveEvents' && (
                <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}

              {/* Active indicator */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/30"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}