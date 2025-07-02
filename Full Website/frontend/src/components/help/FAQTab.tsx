'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search,
  CheckCircle,
  Star,
  Sparkles,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Award,
  Zap
} from 'lucide-react'

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  verified: boolean
  updated: string
}

export interface FAQCategory {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  count: number
}

interface FAQTabProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  faqItems: FAQItem[]
  categories: FAQCategory[]
  helpfulVotes: Record<string, boolean>
  onFAQVote: (faqId: string, helpful: boolean) => void
  loading?: boolean
}

export default function FAQTab({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  faqItems, 
  categories, 
  helpfulVotes, 
  onFAQVote,
}: FAQTabProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const filteredFAQs = faqItems
    .filter(item => !selectedCategory || item.category === selectedCategory)
    .filter(item => 
      !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 
          className="text-3xl font-black mb-2"
          style={{ 
            background: isDarkMode
              ? 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%)'
              : 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Knowledge Excellence Center
        </h2>
        <p 
          className="text-lg font-medium"
          style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
        >
          Find expert answers to your questions
        </p>
      </motion.div>

      {/* Premium Search */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div 
          className="relative p-6 rounded-3xl backdrop-blur-xl transition-all duration-500"
          style={{
            background: isDarkMode
              ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            border: searchFocused
              ? '2px solid #6366F1'
              : isDarkMode 
              ? '2px solid rgba(255, 255, 255, 0.1)' 
              : '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: searchFocused
              ? '0 20px 40px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : isDarkMode
              ? '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 10px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
          }}
        >
          {/* Search Icon with Animation */}
          <motion.div
            className="absolute left-6 top-1/2 transform -translate-y-1/2"
            animate={{
              scale: searchFocused ? [1, 1.1, 1] : 1,
              rotate: searchQuery ? [0, 10, -10, 0] : 0
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Search 
              className="h-6 w-6" 
              style={{ color: searchFocused ? '#6366F1' : isDarkMode ? '#94A3B8' : '#6B7280' }}
            />
          </motion.div>
          
          {/* Search Input */}
          <input
            type="text"
            placeholder="Ask anything... our AI will find the perfect answer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-16 pr-16 py-4 bg-transparent border-none text-lg font-medium focus:outline-none transition-all duration-300"
            style={{
              color: isDarkMode ? '#F1F5F9' : '#1F2937',
              // Placeholder styling handled by CSS classes
            }}
          />
          
          {/* Search Actions */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="p-2 rounded-xl transition-all duration-300"
                style={{
                  background: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444'
                }}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </motion.button>
            )}
            
            <motion.div
              className="p-2 rounded-xl"
              style={{
                background: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                color: '#6366F1'
              }}
              animate={{
                scale: searchQuery ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
          </div>
          
          {/* Search Glow Effect */}
          {searchFocused && (
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1), transparent 70%)',
                filter: 'blur(20px)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>
      </motion.div>

      {/* Premium Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Filter 
            className="w-6 h-6" 
            style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
          />
          <h3 
            className="text-xl font-bold"
            style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
          >
            Browse by Category
          </h3>
          {selectedCategory && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                background: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444'
              }}
              onClick={() => setSelectedCategory('')}
            >
              Clear Filter
            </motion.button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="cursor-pointer group"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
            >
              <div 
                className="relative p-6 rounded-2xl transition-all duration-500 overflow-hidden backdrop-blur-xl"
                style={{
                  background: selectedCategory === category.name
                    ? isDarkMode
                      ? `linear-gradient(135deg, ${category.color}25, ${category.color}15)`
                      : `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
                    : isDarkMode
                    ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
                  border: selectedCategory === category.name
                    ? `2px solid ${category.color}80`
                    : isDarkMode 
                    ? '2px solid rgba(255, 255, 255, 0.1)' 
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: selectedCategory === category.name
                    ? `0 15px 35px ${category.color}30, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                    : isDarkMode
                    ? '0 8px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
              >
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${category.color.replace('#', '%23')}' fill-opacity='0.1'%3E%3Cpath d='M0 0h10v10H0z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '10px 10px'
                  }}
                />
                
                {/* Icon */}
                <motion.div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 mx-auto"
                  style={{ 
                    background: `linear-gradient(135deg, ${category.color}, ${category.color}CC)`,
                    boxShadow: `0 8px 20px ${category.color}40`
                  }}
                  animate={{
                    rotateY: selectedCategory === category.name ? [0, 15, -15, 0] : 0,
                    scale: selectedCategory === category.name ? [1, 1.05, 1] : 1
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <category.icon className="h-6 w-6 text-white" />
                  
                  {/* Icon Sparkle */}
                  {selectedCategory === category.name && (
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Sparkles className="w-3 h-3" style={{ color: category.color }} />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Category Name */}
                <h3 
                  className="text-sm font-bold text-center mb-2 leading-tight"
                  style={{ 
                    color: selectedCategory === category.name 
                      ? category.color 
                      : isDarkMode 
                      ? '#F1F5F9' 
                      : '#1F2937'
                  }}
                >
                  {category.name}
                </h3>
                
                {/* Article Count */}
                <div className="flex items-center justify-center gap-1">
                  <span 
                    className="text-xs font-medium"
                    style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
                  >
                    {category.count} articles
                  </span>
                  {selectedCategory === category.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="w-3 h-3" style={{ color: category.color }} />
                    </motion.div>
                  )}
                </div>
                
                {/* Selection Indicator */}
                {selectedCategory === category.name && (
                  <motion.div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full"
                    style={{ backgroundColor: category.color }}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 32, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Premium FAQ Items */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 
            className="text-xl font-bold"
            style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
          >
            {selectedCategory ? `${selectedCategory} Questions` : 'Frequently Asked Questions'}
          </h3>
          <span 
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{
              background: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
              color: '#6366F1'
            }}
          >
            {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <AnimatePresence>
          {filteredFAQs.map((item, index) => (
            <motion.div
              key={item.id}
              className="group"
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <motion.div 
                className="relative p-6 rounded-2xl backdrop-blur-xl transition-all duration-500 cursor-pointer overflow-hidden"
                style={{
                  background: expandedFAQ === item.id
                    ? isDarkMode
                      ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)'
                      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)'
                    : isDarkMode
                    ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
                  border: expandedFAQ === item.id
                    ? '2px solid #6366F1'
                    : isDarkMode 
                    ? '2px solid rgba(255, 255, 255, 0.1)' 
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: expandedFAQ === item.id
                    ? '0 20px 40px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    : isDarkMode
                    ? '0 8px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
                whileHover={{ 
                  scale: 1.01, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
              >
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366F1' fill-opacity='0.1'%3E%3Cpath d='M20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Question Icon */}
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mt-1"
                      style={{
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                      }}
                      animate={{
                        scale: expandedFAQ === item.id ? [1, 1.05, 1] : 1,
                        rotate: expandedFAQ === item.id ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <span className="text-white font-bold">Q</span>
                    </motion.div>
                    
                    {/* Question Text */}
                    <div className="flex-1">
                      <h4 
                        className="text-lg font-bold leading-tight mb-2 transition-colors duration-300"
                        style={{ 
                          color: expandedFAQ === item.id 
                            ? '#6366F1' 
                            : isDarkMode 
                            ? '#F1F5F9' 
                            : '#1F2937'
                        }}
                      >
                        {item.question}
                      </h4>
                      
                      {/* Category Badge */}
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                          color: '#6366F1'
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    {item.verified && (
                      <motion.div
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{
                          background: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                          color: '#22C55E'
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Award className="h-3 w-3" />
                        <span className="text-xs font-medium">Verified</span>
                      </motion.div>
                    )}
                    
                    {/* Expand Arrow */}
                    <motion.div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                      }}
                      animate={{ rotate: expandedFAQ === item.id ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span 
                        className="text-lg font-bold"
                        style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
                      >
                        +
                      </span>
                    </motion.div>
                  </div>
                </div>
                
                {/* Answer */}
                <AnimatePresence>
                  {expandedFAQ === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden', transformOrigin: 'top' }}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        {/* Answer Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <span className="text-white font-bold">A</span>
                        </div>
                        
                        {/* Answer Text */}
                        <motion.p 
                          className="text-base leading-relaxed flex-1"
                          style={{ color: isDarkMode ? '#E2E8F0' : '#374151' }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          {item.answer}
                        </motion.p>
                      </div>
                      
                      {/* Footer */}
                      <motion.div
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t"
                        style={{
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        {/* Stats */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span 
                              className="text-sm font-medium"
                              style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
                            >
                              {item.helpful}% helpful
                            </span>
                          </div>
                          <span 
                            className="text-xs"
                            style={{ color: isDarkMode ? '#64748B' : '#9CA3AF' }}
                          >
                            Updated {item.updated}
                          </span>
                        </div>
                        
                        {/* Vote Buttons */}
                        <div className="flex gap-2">
                          <motion.button 
                            onClick={(e) => {
                              e.stopPropagation()
                              onFAQVote(item.id, true)
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                            style={{
                              background: helpfulVotes[item.id] === true 
                                ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                                : isDarkMode
                                ? 'rgba(34, 197, 94, 0.2)'
                                : 'rgba(34, 197, 94, 0.1)',
                              color: helpfulVotes[item.id] === true ? '#FFFFFF' : '#22C55E'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful</span>
                          </motion.button>
                          
                          <motion.button 
                            onClick={(e) => {
                              e.stopPropagation()
                              onFAQVote(item.id, false)
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                            style={{
                              background: helpfulVotes[item.id] === false 
                                ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                                : isDarkMode
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(239, 68, 68, 0.1)',
                              color: helpfulVotes[item.id] === false ? '#FFFFFF' : '#EF4444'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>Not Helpful</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1), transparent 70%)',
                    filter: 'blur(20px)',
                    opacity: 0
                  }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}