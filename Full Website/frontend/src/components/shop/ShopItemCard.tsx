'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, Heart, Eye, ShoppingCart, Coins, 
  Zap, Timer, Award, TrendingUp, Sparkles, Package, 
  ArrowUpRight, Flame, Diamond
} from 'lucide-react'

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

interface ShopItemCardProps {
  item: ShopItem
  index: number
  viewMode: 'grid' | 'list'
  userWallet: UserWallet
  onPreview: (item: ShopItem) => void
  onPurchase: (item: ShopItem) => void
  onWishlist: (item: ShopItem) => void
}

export default function ShopItemCard({ 
  item, index, viewMode, onPreview, onPurchase, onWishlist 
}: Omit<ShopItemCardProps, 'userWallet'>) {
  const [isWishlisted, setIsWishlisted] = useState(item.wishlisted || false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getRarityStyles = (rarity: string) => {
    const styles = {
      common: {
        border: 'border-gray-300/50 dark:border-gray-600/50',
        bg: 'from-gray-50/80 via-gray-100/60 to-gray-50/80 dark:from-gray-800/80 dark:via-gray-700/60 dark:to-gray-800/80',
        text: 'text-gray-700 dark:text-gray-300',
        glow: 'hover:shadow-gray-400/30 dark:hover:shadow-gray-500/20',
        gradient: 'from-gray-400/20 to-gray-500/20',
        accent: 'bg-gray-500'
      },
      uncommon: {
        border: 'border-green-300/50 dark:border-green-600/50',
        bg: 'from-green-50/80 via-green-100/60 to-green-50/80 dark:from-green-900/80 dark:via-green-800/60 dark:to-green-900/80',
        text: 'text-green-700 dark:text-green-300',
        glow: 'hover:shadow-green-400/30 dark:hover:shadow-green-500/20',
        gradient: 'from-green-400/20 to-green-500/20',
        accent: 'bg-green-500'
      },
      rare: {
        border: 'border-blue-300/50 dark:border-blue-600/50',
        bg: 'from-blue-50/80 via-blue-100/60 to-blue-50/80 dark:from-blue-900/80 dark:via-blue-800/60 dark:to-blue-900/80',
        text: 'text-blue-700 dark:text-blue-300',
        glow: 'hover:shadow-blue-400/30 dark:hover:shadow-blue-500/20',
        gradient: 'from-blue-400/20 to-blue-500/20',
        accent: 'bg-blue-500'
      },
      epic: {
        border: 'border-purple-300/50 dark:border-purple-600/50',
        bg: 'from-purple-50/80 via-purple-100/60 to-purple-50/80 dark:from-purple-900/80 dark:via-purple-800/60 dark:to-purple-900/80',
        text: 'text-purple-700 dark:text-purple-300',
        glow: 'hover:shadow-purple-400/30 dark:hover:shadow-purple-500/20',
        gradient: 'from-purple-400/20 to-purple-500/20',
        accent: 'bg-purple-500'
      },
      legendary: {
        border: 'border-yellow-300/50 dark:border-yellow-600/50',
        bg: 'from-yellow-50/80 via-yellow-100/60 to-yellow-50/80 dark:from-yellow-900/80 dark:via-yellow-800/60 dark:to-yellow-900/80',
        text: 'text-yellow-700 dark:text-yellow-300',
        glow: 'hover:shadow-yellow-400/30 dark:hover:shadow-yellow-500/20',
        gradient: 'from-yellow-400/20 to-yellow-500/20',
        accent: 'bg-yellow-500'
      },
      mythic: {
        border: 'border-red-300/50 dark:border-red-600/50',
        bg: 'from-red-50/80 via-red-100/60 to-red-50/80 dark:from-red-900/80 dark:via-red-800/60 dark:to-red-900/80',
        text: 'text-red-700 dark:text-red-300',
        glow: 'hover:shadow-red-400/30 dark:hover:shadow-red-500/20',
        gradient: 'from-red-400/20 to-red-500/20',
        accent: 'bg-red-500'
      }
    }
    return styles[rarity as keyof typeof styles] || styles.common
  }

  const getCurrencyIcon = () => {
    if (item.price.tokens) return Star
    return Coins
  }

  const getCurrencyColor = () => {
    if (item.price.tokens) return 'text-purple-600 dark:text-purple-400'
    return 'text-yellow-600 dark:text-yellow-400'
  }

  const getPrice = () => {
    return item.price.tokens || item.price.coins || 0
  }

  const getOriginalPrice = () => {
    return item.originalPrice?.tokens || item.originalPrice?.coins
  }

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted)
    onWishlist(item)
  }

  const rarityStyles = getRarityStyles(item.rarity)
  const CurrencyIcon = getCurrencyIcon()

  if (viewMode === 'list') {
    return (
      <div className={`group bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border ${rarityStyles.border} rounded-2xl transition-all duration-300 hover:shadow-lg ${rarityStyles.glow} overflow-hidden`}>
        <div className="flex p-6 gap-6">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse" />
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={`object-cover rounded-xl transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            {/* Badges */}
            <div className="absolute -top-2 -right-2 flex flex-col gap-1">
              {item.isNew && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  NEW
                </div>
              )}
              {item.isHot && (
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  HOT
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{item.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${rarityStyles.bg} ${rarityStyles.text} flex items-center gap-1`}>
                <Star className="w-3 h-3" />
                {item.rarity.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100/90 dark:bg-gray-700/90 text-xs text-gray-800 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-500">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CurrencyIcon className={`w-5 h-5 ${getCurrencyColor()}`} />
                <span className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                  {getPrice().toLocaleString()}
                </span>
                {getOriginalPrice() && (
                  <span className="text-sm text-gray-600 dark:text-gray-300 line-through">
                    {getOriginalPrice()?.toLocaleString()}
                  </span>
                )}
                {item.discount && (
                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                    -{item.discount}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPreview(item)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={handleWishlistClick}
                  className={`p-2 rounded-lg transition-colors ${
                    isWishlisted 
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onPurchase(item)}
                  disabled={item.owned || !item.canAfford}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    item.owned 
                      ? 'bg-green-100 dark:bg-green-900/80 text-green-700 dark:text-green-300 cursor-default'
                      : item.canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {item.owned ? 'Owned' : item.canAfford ? 'Buy Now' : 'Insufficient Funds'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <motion.div 
      className="group relative"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: 'spring',
        bounce: 0.4
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-2 ${rarityStyles.border} rounded-3xl transition-all duration-500 ${rarityStyles.glow} overflow-hidden`}>
        {/* Animated Border Glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${rarityStyles.gradient} opacity-0 rounded-3xl`}
          animate={{ 
            opacity: isHovered ? [0, 0.3, 0] : 0,
            scale: isHovered ? [1, 1.02, 1] : 1
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Enhanced Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-3xl">
          {/* Loading skeleton */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
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
          
          {/* Main Image */}
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={`object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
          
          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Enhanced Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  onClick={() => onPreview(item)}
                  className="p-3 bg-white/95 hover:bg-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-5 h-5 text-gray-900" />
                </motion.button>
                <motion.button
                  onClick={handleWishlistClick}
                  className={`p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border ${
                    isWishlisted 
                      ? 'bg-red-500/95 hover:bg-red-600 text-white border-red-500/30' 
                      : 'bg-white/95 hover:bg-white text-gray-900 border-white/30'
                  }`}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {item.isNew && (
              <motion.div 
                className="bg-gradient-to-r from-green-500 to-green-600 backdrop-blur-md text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
                NEW
              </motion.div>
            )}
            {item.isHot && (
              <motion.div 
                className="bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-md text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', bounce: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Flame className="w-3 h-3" />
                </motion.div>
                HOT
              </motion.div>
            )}
            {item.isTrending && (
              <motion.div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 backdrop-blur-md text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', bounce: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <TrendingUp className="w-3 h-3" />
                </motion.div>
                TRENDING
              </motion.div>
            )}
            {item.isLimited && (
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 backdrop-blur-md text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring', bounce: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Timer className="w-3 h-3" />
                </motion.div>
                LIMITED
              </motion.div>
            )}
          </div>

          {/* Enhanced Rarity Badge */}
          <div className="absolute top-4 right-4 z-10">
            <motion.div 
              className={`px-4 py-2 rounded-full text-xs font-bold bg-white/98 dark:bg-gray-800/95 backdrop-blur-md ${rarityStyles.text} flex items-center gap-2 shadow-lg border border-white/40 dark:border-gray-600/50`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Diamond className="w-4 h-4" />
              </motion.div>
              {item.rarity.toUpperCase()}
            </motion.div>
          </div>

          {/* Enhanced Discount Badge */}
          {item.discount && (
            <div className="absolute bottom-4 right-4 z-10">
              <motion.div 
                className="bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-md text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg border border-white/20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, type: 'spring', bounce: 0.6 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  -{item.discount}%
                </motion.span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Enhanced Content */}
        <div className="p-5 relative z-10">
          <motion.div 
            className="mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </motion.div>

          {/* Enhanced Tags */}
          <motion.div 
            className="flex flex-wrap gap-1 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {item.tags.slice(0, 2).map((tag, index) => (
              <motion.span 
                key={tag} 
                className="px-2 py-0.5 bg-gray-100/90 dark:bg-gray-700/90 text-xs font-medium text-gray-800 dark:text-gray-200 rounded-full border border-gray-300 dark:border-gray-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: 'spring', bounce: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                #{tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Enhanced Price and Action */}
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex flex-col"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CurrencyIcon className={`w-6 h-6 ${getCurrencyColor()}`} />
                </motion.div>
                <span className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                  {getPrice().toLocaleString()}
                </span>
              </div>
              {getOriginalPrice() && (
                <motion.div 
                  className="flex items-center gap-2 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300 line-through">
                    {getOriginalPrice()?.toLocaleString()}
                  </span>
                  {item.discount && (
                    <motion.span 
                      className="text-xs bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 text-red-600 dark:text-red-400 px-2 py-1 rounded-full border border-red-200 dark:border-red-700"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: 'spring', bounce: 0.6 }}
                    >
                      Save {item.discount}%
                    </motion.span>
                  )}
                </motion.div>
              )}
            </motion.div>

            <motion.button
              onClick={() => onPurchase(item)}
              disabled={item.owned || !item.canAfford}
              className={`group px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg border ${
                item.owned 
                  ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/80 dark:to-green-800/80 text-green-700 dark:text-green-300 cursor-default border-green-300 dark:border-green-600'
                  : item.canAfford
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border-indigo-500 hover:border-indigo-400'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed border-gray-300 dark:border-gray-600'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={item.canAfford && !item.owned ? { scale: 1.05, y: -2 } : {}}
              whileTap={item.canAfford && !item.owned ? { scale: 0.95 } : {}}
            >
              {item.owned ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award className="w-4 h-4" />
                  </motion.div>
                  Owned
                </>
              ) : item.canAfford ? (
                <>
                  <motion.div
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </motion.div>
                  Buy Now
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Insufficient
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}