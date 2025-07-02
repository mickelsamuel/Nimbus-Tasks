'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import ShopHero from '@/components/shop/ShopHero'
import ShopFilters from '@/components/shop/ShopFilters'
import ShopGrid from '@/components/shop/ShopGrid'
import WalletBar from '@/components/shop/WalletBar'
import ItemPreviewModal from '@/components/shop/ItemPreviewModal'
import QuickActions from '@/components/shop/QuickActions'
import ShopStats from '@/components/shop/ShopStats'
import { shopApi } from '@/lib/api/shopApi'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles } from 'lucide-react'

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

// Remove mock data - will be loaded from API

export default function ShopPage() {
  const { user } = useAuth()
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [userWallet, setUserWallet] = useState<UserWallet>({ coins: 0, tokens: 0, history: { earned: 0, spent: 0, transactions: 0 } })
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState<string>('featured')
  const [showOwned, setShowOwned] = useState(true)
  const [onlyAffordable, setOnlyAffordable] = useState(false)

  // Load shop data from API
  useEffect(() => {
    const loadShopData = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        
        // Load shop items
        const shopResponse = await shopApi.getItems()
        if (shopResponse.success) {
          // Category mapping function
          const mapCategory = (apiCategory: string): 'avatar' | 'clothing' | 'accessories' | 'frames' | 'titles' | 'auras' | 'emotes' | 'themes' | 'bundles' | 'consumables' => {
            const categoryMap: Record<string, 'avatar' | 'clothing' | 'accessories' | 'frames' | 'titles' | 'auras' | 'emotes' | 'themes' | 'bundles' | 'consumables'> = {
              'title': 'titles',
              'banner': 'accessories',
              'frame': 'frames',
              'aura': 'auras',
              'emote': 'emotes',
              'sticker': 'accessories',
              'theme': 'themes',
              'minigame': 'bundles',
              'boost': 'consumables',
              'special': 'bundles',
              'avatar': 'avatar',
              'clothing': 'clothing',
              'accessories': 'accessories',
              'frames': 'frames',
              'titles': 'titles',
              'auras': 'auras',
              'emotes': 'emotes',
              'themes': 'themes',
              'bundles': 'bundles',
              'consumables': 'consumables'
            }
            return categoryMap[apiCategory] || 'accessories'
          }

          // Convert API response to component format
          interface ApiShopItem {
            _id: string;
            name: string;
            description: string;
            category: string;
            rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
            price: { coins?: number; tokens?: number };
            originalPrice?: { coins?: number; tokens?: number };
            images: {
              thumbnail: string;
              preview?: string;
              showcase?: string;
            };
            tags?: string[];
            metadata?: {
              isNew?: boolean;
              isHot?: boolean;
              isLimited?: boolean;
              isExclusive?: boolean;
              isFeatured?: boolean;
            };
            stock?: number;
            discount?: {
              percentage: number;
              startDate: string;
              endDate: string;
            };
            owned?: boolean;
            stats?: {
              purchases: number;
            };
          }
          
          const items: ShopItem[] = shopResponse.data.items.map((item: ApiShopItem) => ({
            id: parseInt(item._id),
            name: item.name,
            description: item.description,
            longDescription: item.description,
            category: mapCategory(item.category),
            rarity: item.rarity,
            price: item.price,
            originalPrice: item.originalPrice,
            image: item.images.thumbnail,
            previewImages: [item.images.thumbnail, item.images.preview, item.images.showcase].filter(Boolean),
            tags: item.tags || [],
            isNew: item.metadata?.isNew || false,
            isHot: item.metadata?.isHot || false,
            isTrending: false,
            isLimited: item.metadata?.isLimited || false,
            isExclusive: item.metadata?.isExclusive || false,
            isFeatured: item.metadata?.isFeatured || false,
            isSaleItem: !!item.discount,
            discount: item.discount?.percentage,
            owned: item.owned || false,
            wishlisted: false,
            canAfford: false,
            popularity: item.stats?.purchases || 0,
            previewType: '2d' as const
          }))
          
          setShopItems(items)
        }

        // Load user wallet from user data
        if (user) {
          setUserWallet({
            coins: user.coins || 0,
            tokens: user.tokens || 0,
            history: {
              earned: user.coinsEarned || 0,
              spent: user.coinsSpent || 0,
              transactions: 0
            }
          })
        }

      } catch (error) {
        console.error('Failed to load shop data:', error)
        // Set empty data on error
        setShopItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadShopData()
  }, [user])

  // Update item affordability - only depend on userWallet to avoid infinite loop
  useEffect(() => {
    setShopItems(prevItems => prevItems.map(item => ({
      ...item,
      canAfford: canUserAfford(item, userWallet)
    })))
  }, [userWallet])

  // Filter and sort logic
  useEffect(() => {
    const filtered = shopItems.filter(item => {
      // Search filter
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false

      // Rarity filter
      if (selectedRarity !== 'all' && item.rarity !== selectedRarity) return false

      // Tags filter
      if (selectedTags.length > 0 && !selectedTags.some(tag => item.tags.includes(tag))) return false

      // Ownership filter
      if (!showOwned && item.owned) return false

      // Affordability filter
      if (onlyAffordable && !item.canAfford) return false

      return true
    })

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return getItemPrice(a) - getItemPrice(b)
        case 'price-high':
          return getItemPrice(b) - getItemPrice(a)
        case 'newest':
          return (b.releaseDate?.getTime() || 0) - (a.releaseDate?.getTime() || 0)
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0)
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6 }
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || 
                 (b.popularity || 0) - (a.popularity || 0)
      }
    })

    setFilteredItems(filtered)
  }, [shopItems, searchTerm, selectedCategory, selectedRarity, selectedTags, priceRange, sortBy, showOwned, onlyAffordable])

  const canUserAfford = (item: ShopItem, wallet: UserWallet): boolean => {
    if (item.price.coins && wallet.coins >= item.price.coins) return true
    if (item.price.tokens && wallet.tokens >= item.price.tokens) return true
    return false
  }

  const getItemPrice = (item: ShopItem): number => {
    return item.price.coins || item.price.tokens || 0
  }

  const handlePreview = (item: ShopItem) => {
    setSelectedItem(item)
    setShowPreview(true)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
    setSelectedItem(null)
  }

  const handlePurchase = async (item: ShopItem) => {
    try {
      const currency = item.price.coins ? 'coins' : 'tokens'
      const response = await shopApi.purchaseItem(item.id.toString(), currency)
      
      if (response.success) {
        // Update item as owned
        setShopItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, owned: true } : i
        ))
        
        // Update wallet balance
        setUserWallet(prev => ({
          ...prev,
          coins: response.data.remainingBalance.coins || prev.coins,
          tokens: response.data.remainingBalance.tokens || prev.tokens
        }))
        
        // Purchase successful - UI will reflect the change
      }
    } catch (error) {
      console.error('Purchase failed:', error)
    }
  }

  const handleWishlist = async (item: ShopItem) => {
    try {
      if (item.wishlisted) {
        await shopApi.removeFromWishlist(item.id.toString())
      } else {
        await shopApi.addToWishlist(item.id.toString())
      }
      
      setShopItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, wishlisted: !i.wishlisted } : i
      ))
    } catch (error) {
      console.error('Wishlist operation failed:', error)
    }
  }

  return (
    <ProtectedLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-blue-50/90 to-purple-50/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95 transition-all duration-700" />
          
          {/* Floating Particles - Optimized */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-300/10 dark:to-purple-300/10 rounded-full"
                style={{
                  left: `${(i * 12.5) % 100}%`,
                  top: `${(i * 25) % 100}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  x: [-5, 5, -5],
                  scale: [0.9, 1.1, 0.9],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
          
          {/* Gradient Orbs - Optimized */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/5 to-purple-400/5 dark:from-blue-300/3 dark:to-purple-300/3 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/5 to-yellow-400/5 dark:from-pink-300/3 dark:to-yellow-300/3 rounded-full blur-3xl"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ShopHero />
        </motion.div>
        
        {/* Wallet Bar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <WalletBar wallet={userWallet} />
        </motion.div>
        
        {/* Shop Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <ShopStats 
            totalItems={shopItems.length}
            ownedItems={shopItems.filter(item => item.owned).length}
            wishlistedItems={shopItems.filter(item => item.wishlisted).length}
            recentPurchases={userWallet.history.transactions}
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
          {/* Featured Items Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-sm border-2 border-purple-400/30 dark:border-purple-500/40 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-indigo-400/20 dark:from-purple-300/10 dark:via-blue-300/10 dark:to-indigo-300/10 animate-pulse" />
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Sparkles className="w-8 h-8 text-yellow-300 drop-shadow-lg" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  ✨ Featured Collection ✨
                </h2>
                <p className="text-white/95 text-lg drop-shadow-md">
                  Discover exclusive items with limited-time offers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Filters Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <ShopFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRarity={selectedRarity}
              setSelectedRarity={setSelectedRarity}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              showOwned={showOwned}
              setShowOwned={setShowOwned}
              onlyAffordable={onlyAffordable}
              setOnlyAffordable={setOnlyAffordable}
              totalItems={filteredItems.length}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <QuickActions
              onRefresh={() => setIsLoading(true)}
              onClearFilters={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedRarity('all')
                setSelectedTags([])
                setPriceRange([0, 5000])
                setSortBy('featured')
                setShowOwned(true)
                setOnlyAffordable(false)
              }}
              onToggleView={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
            />
          </motion.div>

          {/* Shop Grid */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <ShopGrid
              items={filteredItems}
              viewMode={viewMode}
              onPreview={handlePreview}
              onPurchase={handlePurchase}
              onWishlist={handleWishlist}
              isLoading={isLoading}
            />
          </motion.div>
        </div>

        {/* Preview Modal */}
        <AnimatePresence mode="wait">
          {selectedItem && showPreview && (
            <ItemPreviewModal
              key={selectedItem.id}
              item={selectedItem}
              isOpen={showPreview}
              onClose={handleClosePreview}
              onPurchase={handlePurchase}
              onWishlist={handleWishlist}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </ProtectedLayout>
  )
}