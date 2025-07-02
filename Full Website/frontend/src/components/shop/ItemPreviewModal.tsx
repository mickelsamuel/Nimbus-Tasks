'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  X, Star, Heart, ShoppingCart, Coins, 
  Zap, Award, TrendingUp, Sparkles, Package,
  ChevronLeft, ChevronRight
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

interface ItemPreviewModalProps {
  item: ShopItem
  isOpen: boolean
  onClose: () => void
  onPurchase: (item: ShopItem) => void
  onWishlist: (item: ShopItem) => void
  userWallet: UserWallet
}

export default function ItemPreviewModal({ 
  item, isOpen, onClose, onPurchase, onWishlist
}: Omit<ItemPreviewModalProps, 'userWallet'>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(item.wishlisted || false)
  const [activeTab, setActiveTab] = useState<'details' | 'stats' | 'reviews'>('details')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const images = item.previewImages && item.previewImages.length > 0 
    ? item.previewImages 
    : [item.image]

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
      uncommon: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
      rare: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
      epic: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
      legendary: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900',
      mythic: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900'
    }
    return colors[rarity as keyof typeof colors] || colors.common
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const CurrencyIcon = getCurrencyIcon()

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh]">
          {/* Image Section */}
          <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Image Carousel */}
            <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
              <Image
                src={images[currentImageIndex]}
                alt={item.name}
                fill
                className="object-cover"
              />
              
              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {item.isNew && (
                  <div className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    NEW
                  </div>
                )}
                {item.isHot && (
                  <div className="bg-red-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    HOT
                  </div>
                )}
                {item.isTrending && (
                  <div className="bg-orange-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    TRENDING
                  </div>
                )}
              </div>

              {/* Rarity Badge */}
              <div className="absolute top-4 right-16">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getRarityColor(item.rarity)} flex items-center gap-1`}>
                  <Star className="w-3 h-3" />
                  {item.rarity.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <CurrencyIcon className={`w-6 h-6 ${getCurrencyColor()}`} />
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {getPrice().toLocaleString()}
                    </span>
                  </div>
                  {getOriginalPrice() && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        {getOriginalPrice()?.toLocaleString()}
                      </span>
                      {item.discount && (
                        <span className="text-sm bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-full font-semibold">
                          Save {item.discount}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleWishlistClick}
                    className={`p-3 rounded-xl transition-colors ${
                      isWishlisted 
                        ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'stats', label: 'Stats' },
                  { id: 'reviews', label: 'Reviews' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'details' | 'stats' | 'reviews')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.longDescription || item.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Category</h3>
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Popularity</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.popularity || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {item.popularity || 0}%
                      </span>
                    </div>
                  </div>

                  {item.bonuses && item.bonuses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bonuses</h3>
                      <div className="space-y-3">
                        {item.bonuses.map((bonus, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{bonus.type}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{bonus.description}</div>
                            </div>
                            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                              +{bonus.value}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reviews yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">Be the first to review this item!</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                {item.owned ? (
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-xl font-semibold cursor-default">
                    <Award className="w-5 h-5" />
                    Already Owned
                  </button>
                ) : (
                  <button
                    onClick={() => onPurchase(item)}
                    disabled={!item.canAfford}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      item.canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {item.canAfford ? (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Purchase Now
                      </>
                    ) : (
                      <>
                        <Package className="w-5 h-5" />
                        Insufficient Funds
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}