'use client'

import { Search, X, Filter, Sparkles, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EventCategory } from '../types/event.types'

interface EventFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: EventCategory | 'all'
  onCategoryChange: (category: EventCategory | 'all') => void
  onFilterClick?: () => void
}

export default function EventFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: EventFiltersProps) {
  const categories = [
    { value: 'all', label: 'All Categories', color: 'gray' },
    { value: 'training', label: 'Training', color: 'blue' },
    { value: 'competition', label: 'Competition', color: 'red' },
    { value: 'team', label: 'Team Events', color: 'green' },
    { value: 'special', label: 'Special', color: 'purple' },
    { value: 'certification', label: 'Certification', color: 'yellow' }
  ]

  const clearSearch = () => {
    onSearchChange('')
  }

  const getCategoryGradient = (color: string) => {
    switch (color) {
      case 'gray': return 'from-gray-500 to-gray-600'
      case 'blue': return 'from-blue-500 to-blue-600'
      case 'red': return 'from-red-500 to-red-600'
      case 'green': return 'from-green-500 to-green-600'
      case 'purple': return 'from-purple-500 to-purple-600'
      case 'yellow': return 'from-yellow-500 to-yellow-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getAlternateGradient = (color: string) => {
    switch (color) {
      case 'gray': return 'from-slate-500 to-slate-600'
      case 'blue': return 'from-cyan-500 to-blue-600'
      case 'red': return 'from-red-500 to-orange-500'
      case 'green': return 'from-emerald-500 to-green-600'
      case 'purple': return 'from-purple-500 to-pink-500'
      case 'yellow': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-slate-600'
    }
  }

  const getCategoryIcon = (value: string) => {
    switch (value) {
      case 'all': return '🌟'
      case 'training': return '📚'
      case 'competition': return '🏆'
      case 'team': return '👥'
      case 'special': return '✨'
      case 'certification': return '🎓'
      default: return '📋'
    }
  }

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Enhanced Search Bar */}
      <div className="relative group">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 z-10"
          >
            <Search />
          </motion.div>
          
          <input
            type="text"
            placeholder="🔍 Search events, competitions, training..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-12 py-4 backdrop-blur-xl bg-white/80 dark:bg-slate-700/80 border-2 border-white/30 dark:border-slate-600/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-red-500/30 focus:border-red-500 dark:focus:ring-red-400/30 dark:focus:border-red-400 transition-all duration-300 text-lg font-medium shadow-lg focus:shadow-2xl"
          />
          
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 90,
                  backgroundColor: '#ef4444'
                }}
                whileTap={{ scale: 0.9 }}
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-red-500"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          
          {/* Search glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
        </motion.div>
      </div>

      {/* Enhanced Category Filters */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Filter className="w-5 h-5" />
          <span className="font-semibold text-lg">Filter by Category</span>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => {
            const isActive = selectedCategory === category.value
            
            return (
              <motion.button
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { type: "spring", stiffness: 400 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category.value as EventCategory | 'all')}
                className={`relative px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden group ${
                  isActive 
                    ? `bg-gradient-to-r ${getCategoryGradient(category.color)} text-white shadow-2xl` 
                    : 'backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-600/80 border-2 border-white/30 dark:border-slate-600/50 hover:border-white/50 dark:hover:border-slate-500/70 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Active background animation */}
                {isActive && (
                  <motion.div
                    animate={{
                      background: [
                        getCategoryGradient(category.color),
                        getAlternateGradient(category.color),
                        getCategoryGradient(category.color)
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0"
                  />
                )}
                
                {/* Hover shimmer effect */}
                {!isActive && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-slate-400/20 to-transparent transform skew-x-12"
                    />
                  </div>
                )}
                
                <span className="relative z-10 flex items-center space-x-2">
                  <span>{getCategoryIcon(category.value)}</span>
                  <span>{category.label}</span>
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4" />
                    </motion.div>
                  )}
                </span>
                
                {/* Active pulse effect */}
                {isActive && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl border-4 border-white/50"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}