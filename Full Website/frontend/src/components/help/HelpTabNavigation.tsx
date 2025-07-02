'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap,
  BookOpen,
  FileText,
  Globe,
  Sparkles,
  Star
} from 'lucide-react'

type TabType = 'quick' | 'faq' | 'ticket' | 'resources'

interface HelpTabNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export default function HelpTabNavigation({ activeTab, setActiveTab }: HelpTabNavigationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const tabs = [
    { 
      id: 'quick' as const, 
      label: 'Quick Actions', 
      icon: Zap, 
      color: '#6366F1',
      description: 'Instant support access'
    },
    { 
      id: 'faq' as const, 
      label: 'Knowledge Center', 
      icon: BookOpen, 
      color: '#8B5CF6',
      description: 'Expert guidance library'
    },
    { 
      id: 'ticket' as const, 
      label: 'Priority Support', 
      icon: FileText, 
      color: '#06B6D4',
      description: 'Dedicated assistance'
    },
    { 
      id: 'resources' as const, 
      label: 'Resource Hub', 
      icon: Globe, 
      color: '#10B981',
      description: 'Premium resources'
    }
  ]

  return (
    <motion.div
      className="flex justify-center mb-12"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Premium Tab Container */}
      <div className="relative">
        {/* Glow Effect */}
        <motion.div
          className="absolute -inset-2 rounded-3xl opacity-20"
          style={{
            background: isDarkMode
              ? 'linear-gradient(45deg, #6366F1, #8B5CF6, #06B6D4, #10B981)'
              : 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
            filter: 'blur(20px)'
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Main Tab Container */}
        <div 
          className="relative flex flex-wrap justify-center p-2 rounded-3xl gap-2"
          style={{
            background: isDarkMode
              ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(25px) saturate(200%)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: isDarkMode
              ? '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
          }}
        >
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative flex flex-col items-center gap-2 py-4 px-6 rounded-2xl text-sm font-bold transition-all duration-500 focus:outline-none group overflow-hidden min-w-[120px]"
              style={{
                background: activeTab === tab.id
                  ? `linear-gradient(135deg, ${tab.color}20, ${tab.color}10)`
                  : hoveredTab === tab.id
                  ? isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.3)'
                  : 'transparent',
                border: activeTab === tab.id
                  ? `2px solid ${tab.color}60`
                  : '2px solid transparent',
                boxShadow: activeTab === tab.id
                  ? `0 10px 30px ${tab.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                  : 'none'
              }}
              whileHover={{ 
                scale: 1.05,
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              aria-pressed={activeTab === tab.id}
            >
              {/* Shimmer Effect */}
              {(activeTab === tab.id || hoveredTab === tab.id) && (
                <motion.div
                  className="absolute inset-0 -skew-x-12"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              )}
              
              {/* Icon with Premium Effect */}
              <motion.div
                className="relative"
                animate={{
                  rotate: activeTab === tab.id ? [0, 5, -5, 0] : 0,
                  scale: hoveredTab === tab.id ? 1.1 : 1
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <tab.icon 
                  className="h-6 w-6 relative z-10" 
                  style={{ 
                    color: activeTab === tab.id 
                      ? tab.color 
                      : isDarkMode 
                      ? '#E5E7EB' 
                      : '#374151'
                  }}
                />
                
                {/* Icon Glow */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${tab.color}40 0%, transparent 70%)`,
                      filter: 'blur(8px)'
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </motion.div>
              
              {/* Tab Label */}
              <motion.div className="flex flex-col items-center gap-1">
                <span 
                  className="font-bold text-sm leading-tight text-center"
                  style={{ 
                    color: activeTab === tab.id 
                      ? tab.color 
                      : isDarkMode 
                      ? '#F9FAFB' 
                      : '#1F2937'
                  }}
                >
                  {tab.label}
                </span>
                
                {/* Description */}
                <motion.span 
                  className="text-xs opacity-60 text-center leading-tight"
                  style={{ 
                    color: isDarkMode ? '#D1D5DB' : '#6B7280'
                  }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: activeTab === tab.id || hoveredTab === tab.id ? 0.6 : 0,
                    height: activeTab === tab.id || hoveredTab === tab.id ? 'auto' : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.description}
                </motion.span>
              </motion.div>
              
              {/* Active Indicator */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{ backgroundColor: tab.color }}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 32, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )}
              
              {/* Sparkle Effects for Active Tab */}
              {activeTab === tab.id && (
                <>
                  <motion.div
                    className="absolute top-2 right-2"
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                      ease: 'easeInOut'
                    }}
                  >
                    <Sparkles className="w-3 h-3" style={{ color: tab.color }} />
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-2 left-2"
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [360, 180, 0],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: 1,
                      ease: 'easeInOut'
                    }}
                  >
                    <Star className="w-2 h-2" style={{ color: tab.color }} />
                  </motion.div>
                </>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}