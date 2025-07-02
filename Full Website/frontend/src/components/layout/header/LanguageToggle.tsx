'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

type Language = 'en' | 'fr'

interface LanguageToggleProps {
  language: Language
  onToggle: (newLanguage: Language) => void
  className?: string
}

export default function LanguageToggle({ 
  language = 'en',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToggle: _onToggle,
  className = '' 
}: LanguageToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])
  return (
    <motion.button
      onClick={() => {}} // Disabled - FR coming soon
      className={`relative group flex items-center justify-center rounded-xl p-3 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-not-allowed ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Language toggle - French coming soon"
      title="Language toggle - French coming soon"
      disabled
    >
      <div className="flex items-center gap-2">
        <Globe 
          className="h-5 w-5" 
          style={{ color: isDarkMode ? '#60A5FA' : '#3B82F6' }}
        />
        <span 
          className="text-sm font-bold uppercase tracking-wide drop-shadow-lg"
          style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
        >
          {language}
        </span>
      </div>
      
      {/* Coming Soon Badge */}
      <motion.div
        className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        FR Soon
      </motion.div>
    </motion.button>
  )
}