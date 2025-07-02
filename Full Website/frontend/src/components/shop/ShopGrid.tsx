'use client'

import { motion, AnimatePresence } from 'framer-motion'
import ShopItemCard from './ShopItemCard'
import { Search, Filter } from 'lucide-react'

interface ShopItem {
  id: number
  name: string
  description: string
  longDescription?: string
  category: 'avatar' | 'clothing' | 'accessories' | 'frames' | 'titles' | 'auras' | 'emotes' | 'themes' | 'bundles' | 'consumables'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  price: {
    coins?: number
    tokens?: number
  }
  originalPrice?: {
    coins?: number
    tokens?: number
  }
  image: string
  previewImages?: string[]
  tags: string[]
  isNew?: boolean
  isHot?: boolean
  isTrending?: boolean
  isLimited?: boolean
  isExclusive?: boolean
  isFeatured?: boolean
  isSaleItem?: boolean
  discount?: number
  timeRemaining?: number
  stock?: number
  totalStock?: number
  owned?: boolean
  wishlisted?: boolean
  canAfford?: boolean
  popularity?: number
  releaseDate?: Date
  previewType?: '2d' | '3d' | 'animation'
  bonuses?: {
    type: string
    value: number
    description: string
  }[]
}

interface UserWallet {
  coins: number
  tokens: number
  history: {
    earned: number
    spent: number
    transactions: number
  }
}

interface ShopGridProps {
  items: ShopItem[]
  viewMode: 'grid' | 'list'
  userWallet: UserWallet
  onPreview: (item: ShopItem) => void
  onPurchase: (item: ShopItem) => void
  onWishlist: (item: ShopItem) => void
  isLoading: boolean
}

export default function ShopGrid({ 
  items, viewMode, onPreview, onPurchase, onWishlist, isLoading 
}: Omit<ShopGridProps, 'userWallet'>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div 
            key={index} 
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-3xl p-6 space-y-4 border-2 border-gray-200/80 dark:border-gray-600/80"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 h-48 rounded-2xl"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            />
            <div className="space-y-3">
              <motion.div 
                className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 h-4 rounded-lg w-3/4"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.2,
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              />
              <motion.div 
                className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 h-3 rounded-lg w-1/2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.4,
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              />
            </div>
            <motion.div 
              className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 h-12 rounded-2xl"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.6,
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <motion.div 
        className="text-center py-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-600 dark:to-slate-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border-2 border-gray-200 dark:border-gray-500"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.6 }}
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Search className="w-16 h-16 text-gray-500 dark:text-gray-300" />
          </motion.div>
        </motion.div>
        
        <motion.h3 
          className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          No items found
        </motion.h3>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Try adjusting your filters or search terms to discover amazing items
        </motion.p>
        
        <motion.button 
          className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-indigo-500 hover:border-indigo-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-3">
            <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Clear All Filters
          </span>
        </motion.button>
      </motion.div>
    )
  }

  const gridClass = viewMode === 'list' 
    ? 'grid grid-cols-1 gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'

  return (
    <motion.div 
      className={`${gridClass} relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="wait">
        {items.map((item, index) => (
          <ShopItemCard
            key={item.id}
            item={item}
            index={index}
            viewMode={viewMode}
            onPreview={onPreview}
            onPurchase={onPurchase}
            onWishlist={onWishlist}
          />
        ))}
      </AnimatePresence>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-300/10 dark:to-purple-300/10 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}