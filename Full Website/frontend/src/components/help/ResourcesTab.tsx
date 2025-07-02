'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen,
  Video,
  MessageSquare,
  Target,
  ChevronRight
} from 'lucide-react'

interface ResourcesTabProps {
  onOpenResource: (resource: string) => void
}

export default function ResourcesTab({ onOpenResource }: ResourcesTabProps) {
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

  const resources = [
    { 
      title: 'Executive Handbook', 
      description: 'Comprehensive guides and best practices',
      icon: BookOpen,
      color: '#1E40AF',
      action: 'documentation'
    },
    { 
      title: 'Masterclass Series', 
      description: 'Professional video tutorials',
      icon: Video,
      color: '#7C3AED',
      action: 'videos'
    },
    { 
      title: 'Executive Network', 
      description: 'Peer-to-peer support forum',
      icon: MessageSquare,
      color: '#059669',
      action: 'forum'
    },
    { 
      title: 'Best Practices', 
      description: 'Industry standards and procedures',
      icon: Target,
      color: '#F59E0B',
      action: 'practices'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.title}
          className="cursor-pointer group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={() => onOpenResource(resource.action)}
        >
          <div 
            className="p-6 rounded-2xl h-48 flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: isDarkMode
                ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.5) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
              style={{ background: `${resource.color}20` }}
              animate={{ rotateY: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <resource.icon className="h-8 w-8" style={{ color: resource.color }} />
            </motion.div>
            <h3 
              className="text-lg font-bold mb-2 text-center"
              style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
            >
              {resource.title}
            </h3>
            <p 
              className="text-sm text-center"
              style={{ color: isDarkMode ? '#CBD5E1' : '#4B5563' }}
            >
              {resource.description}
            </p>
            <div className="absolute bottom-4 right-4">
              <ChevronRight 
                className="h-4 w-4 transition-colors duration-300" 
                style={{ 
                  color: isDarkMode ? '#64748B' : '#9CA3AF'
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}