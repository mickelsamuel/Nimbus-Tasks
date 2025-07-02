'use client'

import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, Users, MapPin, Trophy, type LucideIcon } from 'lucide-react'

interface CategoryData {
  category: string
  icon: LucideIcon
  label: string
  color: string
  count: number
}

interface AchievementCategoriesProps {
  categoryStats: Record<string, number>
  selectedCategory: string
  onCategorySelect: (category: string) => void
}

export const AchievementCategories = ({ 
  categoryStats, 
  selectedCategory, 
  onCategorySelect 
}: AchievementCategoriesProps) => {
  const categories: CategoryData[] = [
    { category: 'learning', icon: BookOpen, label: 'Learning & Development', color: 'blue', count: categoryStats.learning },
    { category: 'performance', icon: TrendingUp, label: 'Performance & Results', color: 'green', count: categoryStats.performance },
    { category: 'social', icon: Users, label: 'Social & Collaboration', color: 'purple', count: categoryStats.social },
    { category: 'exploration', icon: MapPin, label: 'Exploration & Discovery', color: 'orange', count: categoryStats.exploration },
    { category: 'milestones', icon: Trophy, label: 'Milestones & Goals', color: 'red', count: categoryStats.milestones }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50"
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        Achievement Categories
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((cat, index) => {
          const CategoryIcon = cat.icon
          const isSelected = selectedCategory === cat.category
          
          return (
            <motion.button
              key={cat.category}
              onClick={() => onCategorySelect(isSelected ? 'all' : cat.category)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                isSelected 
                  ? `bg-${cat.color}-50 dark:bg-${cat.color}-950/20 border-${cat.color}-500/50 shadow-lg shadow-${cat.color}-500/20` 
                  : 'bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50 hover:border-red-500/30'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="text-center">
                <motion.div
                  className={`inline-flex p-4 rounded-xl mb-4 ${
                    isSelected 
                      ? `bg-${cat.color}-500 text-white shadow-lg` 
                      : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                  }`}
                  whileHover={{ rotate: 5 }}
                >
                  <CategoryIcon className="h-8 w-8" />
                </motion.div>
                
                <h3 className={`font-bold text-lg mb-2 ${isSelected ? `text-${cat.color}-700 dark:text-${cat.color}-300` : 'text-slate-900 dark:text-white'}`}>
                  {cat.count}
                </h3>
                
                <p className={`text-sm ${isSelected ? `text-${cat.color}-600 dark:text-${cat.color}-400` : 'text-slate-600 dark:text-slate-300'}`}>
                  {cat.label}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}