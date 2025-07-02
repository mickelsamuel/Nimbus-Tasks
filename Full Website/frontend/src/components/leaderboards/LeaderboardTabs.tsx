'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TabConfig {
  id: string
  label: string
  icon: string
  count: number
}

interface LeaderboardTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs: TabConfig[]
}

export default function LeaderboardTabs({ activeTab, onTabChange, tabs }: LeaderboardTabsProps) {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
    >
      <div 
        className="championship-division-tabs"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '20px',
          marginBottom: '32px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div className="flex flex-wrap justify-center p-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`championship-tab ${activeTab === tab.id ? 'active' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.5 + index * 0.1 }}
              style={{
                minHeight: '90px',
                fontSize: '1.1rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '20px 28px',
                position: 'relative',
                transition: 'all 0.4s ease',
                borderRadius: '16px',
                margin: '4px',
                backgroundColor: activeTab === tab.id 
                  ? 'rgba(255, 215, 0, 0.2)' 
                  : 'transparent',
                color: activeTab === tab.id ? '#FFD700' : '#FFF',
                transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
                boxShadow: activeTab === tab.id 
                  ? '0 8px 25px rgba(255, 215, 0, 0.3)' 
                  : 'none'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="tab-competition-icon text-3xl relative">
                {tab.icon}
                {tab.id === 'liveEvents' && (
                  <div className="tab-activity-pulse absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="text-sm font-semibold">{tab.label}</div>
              <div className="tab-trophy-count absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full px-2 py-1 text-xs font-bold">
                {tab.count}
              </div>
              {activeTab === tab.id && (
                <div className="championship-tab-glow absolute inset-0 rounded-2xl pointer-events-none" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Championship Tab Glow */
        .championship-tab-glow {
          background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%);
          opacity: 0.3;
          animation: tab-glow-pulse 2s ease-in-out infinite;
        }

        @keyframes tab-glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  )
}