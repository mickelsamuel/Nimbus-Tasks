'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Shield, Activity, Bell } from 'lucide-react'
import { ProfilePanel } from '../types'

interface ProfileTabsProps {
  activePanel: ProfilePanel
  onPanelChange: (panel: ProfilePanel) => void
}

interface TabItem {
  id: ProfilePanel
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function ProfileTabs({ activePanel, onPanelChange }: ProfileTabsProps) {
  const tabs: TabItem[] = [
    { id: 'personal', label: 'Personal Information', icon: User, color: '#3F51B5' },
    { id: 'accessibility', label: 'Accessibility', icon: Settings, color: '#673AB7' },
    { id: 'security', label: 'Security & Privacy', icon: Shield, color: '#F44336' },
    { id: 'activity', label: 'Activity & Sessions', icon: Activity, color: '#2196F3' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: '#FF9800' }
  ]

  return (
    <motion.div
      className="lg:col-span-1"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <nav className="space-y-3">
        {tabs.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onPanelChange(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative overflow-hidden ${
              activePanel === item.id
                ? 'text-white shadow-xl'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
            }`}
            style={activePanel === item.id ? {
              background: `linear-gradient(135deg, ${item.color}E6 0%, ${item.color}CC 100%)`,
              boxShadow: `0 8px 25px ${item.color}40`
            } : {}}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active Panel Background Effect */}
            {activePanel === item.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            
            <div 
              className={`w-6 h-6 rounded-lg flex items-center justify-center relative z-10 ${
                activePanel === item.id ? 'bg-white/20' : ''
              }`}
              style={activePanel !== item.id ? { color: item.color } : {}}
            >
              <item.icon className="w-4 h-4" />
            </div>
            <span 
              className="font-semibold relative z-10 text-left"
              style={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: '600',
                letterSpacing: '0.3px'
              }}
            >
              {item.label}
            </span>
            
            {/* Active Indicator */}
            {activePanel === item.id && (
              <motion.div
                className="absolute right-4 w-2 h-2 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              />
            )}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  )
}