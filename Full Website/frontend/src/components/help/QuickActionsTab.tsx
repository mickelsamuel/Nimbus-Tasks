'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle,
  Mail,
  Phone,
  Zap,
  Star,
  Sparkles,
  Award
} from 'lucide-react'

interface QuickActionsTabProps {
  onQuickAction: (action: string) => void
}

export default function QuickActionsTab({ onQuickAction }: QuickActionsTabProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const actionCards = [
    {
      id: 'chat',
      title: 'Live Concierge',
      subtitle: 'Instant Premium Support',
      description: 'Connect with our elite support specialists',
      icon: MessageCircle,
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6',
      accent: '#F59E0B',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
      features: ['Instant Connection', 'Expert Specialists', '24/7 Available']
    },
    {
      id: 'email',
      title: 'Priority Mail',
      subtitle: 'Professional Communication',
      description: 'High-priority email support channel',
      icon: Mail,
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      accent: '#06B6D4',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
      features: ['2-Hour Response', 'Detailed Solutions', 'Follow-up Included']
    },
    {
      id: 'phone',
      title: 'Executive Line',
      subtitle: 'Direct Specialist Access',
      description: 'Skip the queue with priority calling',
      icon: Phone,
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      accent: '#EF4444',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
      features: ['No Wait Time', 'Senior Specialists', 'Immediate Resolution']
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 
          className="text-3xl font-black mb-2"
          style={{ 
            color: isDarkMode ? '#F1F5F9' : '#1F2937'
          }}
        >
          Choose Your Support Experience
        </h2>
        <p 
          className="text-lg font-medium"
          style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
        >
          Premium assistance tailored to your needs
        </p>
      </motion.div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {actionCards.map((card, index) => (
          <motion.div
            key={card.id}
            className="relative group cursor-pointer"
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onQuickAction(card.id)}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              transition: { duration: 0.3, ease: 'easeOut' }
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Card Background with Advanced Glass Effect */}
            <div 
              className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-500"
              style={{
                background: isDarkMode
                  ? `linear-gradient(135deg, ${card.primaryColor}15, ${card.secondaryColor}08)`
                  : `linear-gradient(135deg, ${card.primaryColor}10, ${card.secondaryColor}05)`,
                border: `2px solid ${hoveredCard === card.id ? card.primaryColor + '60' : 'transparent'}`,
                boxShadow: hoveredCard === card.id
                  ? `0 25px 50px ${card.primaryColor}30, inset 0 1px 0 rgba(255,255,255,0.2)`
                  : `0 10px 25px ${card.primaryColor}20`,
                minHeight: '320px'
              }}
            >
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${card.primaryColor.replace('#', '%23')}' fill-opacity='0.1'%3E%3Cpath d='m30 0v60m-30-30h60'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px'
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%']
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Award 
                    className="w-5 h-5 opacity-30" 
                    style={{ color: card.accent }}
                  />
                </motion.div>
              </div>
              
              {/* Main Icon with Premium Effects */}
              <div className="flex flex-col items-center text-center mb-6">
                <motion.div
                  className="relative mb-6"
                  animate={{
                    scale: hoveredCard === card.id ? [1, 1.1, 1] : 1,
                    rotate: hoveredCard === card.id ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Icon Glow Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, ${card.primaryColor}40, ${card.secondaryColor}40, ${card.accent}40, ${card.primaryColor}40)`,
                      padding: '3px'
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  >
                    <div 
                      className="w-full h-full rounded-full"
                      style={{
                        background: isDarkMode
                          ? 'linear-gradient(135deg, #1E293B, #334155)'
                          : 'linear-gradient(135deg, #FFFFFF, #F8FAFC)'
                      }}
                    />
                  </motion.div>
                  
                  {/* Main Icon */}
                  <div 
                    className="relative w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${card.primaryColor}, ${card.secondaryColor})`,
                      boxShadow: `0 10px 30px ${card.primaryColor}40`
                    }}
                  >
                    <card.icon className="w-10 h-10 text-white" />
                    
                    {/* Sparkle Effect */}
                    {hoveredCard === card.id && (
                      <motion.div
                        className="absolute -top-2 -right-2"
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ 
                          scale: [0, 1, 0],
                          rotate: [0, 180, 360],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Sparkles className="w-4 h-4" style={{ color: card.accent }} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                {/* Title and Subtitle */}
                <h3 
                  className="text-2xl font-black mb-2"
                  style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
                >
                  {card.title}
                </h3>
                
                <h4 
                  className="text-lg font-bold mb-3"
                  style={{ color: card.primaryColor }}
                >
                  {card.subtitle}
                </h4>
                
                <p 
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: isDarkMode ? '#CBD5E1' : '#6B7280' }}
                >
                  {card.description}
                </p>
              </div>
              
              {/* Features List */}
              <div className="space-y-3 mb-6">
                {card.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.15 + featureIndex * 0.1 
                    }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: card.primaryColor }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: 'easeInOut',
                        delay: featureIndex * 0.3
                      }}
                    />
                    <span 
                      className="text-sm font-medium"
                      style={{ color: isDarkMode ? '#E2E8F0' : '#374151' }}
                    >
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {/* Action Button */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: card.gradient,
                    boxShadow: `0 8px 25px ${card.primaryColor}30`
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Connect Now
                  </span>
                  
                  {/* Button Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 -skew-x-12"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: 'easeInOut',
                      repeatDelay: 3
                    }}
                  />
                </button>
              </motion.div>
              
              {/* Corner Decorations */}
              <motion.div
                className="absolute bottom-4 left-4"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Star className="w-4 h-4" style={{ color: card.accent }} />
              </motion.div>
              
              {/* Hover Glow Effect */}
              {hoveredCard === card.id && (
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${card.primaryColor}15, transparent 70%)`,
                    filter: 'blur(20px)'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}