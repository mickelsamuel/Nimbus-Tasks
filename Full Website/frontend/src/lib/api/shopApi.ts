import api from './client'

export interface ShopItem {
  _id: string
  name: string
  description: string
  category: 'avatar' | 'clothing' | 'title' | 'frame' | 'aura' | 'emote' | 'sticker' | 'banner' | 'theme' | 'minigame' | 'boost' | 'special'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  price: {
    coins?: number
    tokens?: number
  }
  originalPrice?: {
    coins?: number
    tokens?: number
  }
  images: {
    thumbnail: string
    preview?: string
    showcase?: string
  }
  metadata: {
    isNew: boolean
    isHot: boolean
    isLimited: boolean
    isExclusive: boolean
    isFeatured: boolean
    isActive: boolean
  }
  discount?: {
    percentage: number
    startDate: string
    endDate: string
  }
  limitedTime?: {
    endDate: string
    stock: number
  }
  stats: {
    views: number
    purchases: number
    wishlistCount: number
  }
  bonuses?: {
    professionalRating: number
    confidenceBoost: number
    teamSynergy: number
  }
  tags: string[]
  owned?: boolean
  currentDiscount?: number
  discountedPrice?: {
    coins?: number
    tokens?: number
  }
  mainPrice?: {
    amount: number
    type: 'coins' | 'tokens'
  }
  createdAt: string
  updatedAt: string
}

export interface ShopFilters {
  search?: string
  category?: string
  rarity?: string
  sortBy?: string
  page?: number
  limit?: number
  featured?: boolean
  limited?: boolean
  new?: boolean
}

export interface ShopResponse {
  success: boolean
  data: {
    items: ShopItem[]
    pagination: {
      current: number
      total: number
      count: number
      totalItems: number
    }
  }
}

export interface PurchaseRequest {
  currency: 'coins' | 'tokens'
}

export interface PurchaseResponse {
  success: boolean
  message: string
  data: {
    purchase: Record<string, unknown>
    remainingBalance: {
      [key: string]: number
    }
  }
}

export const shopApi = {
  // Get all shop items with filters
  async getItems(filters: ShopFilters = {}): Promise<ShopResponse> {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await api.get(`/shop?${params.toString()}`)
    return response.data
  },

  // Get featured items
  async getFeaturedItems(limit = 10): Promise<{ success: boolean; data: ShopItem[] }> {
    const response = await api.get(`/shop/featured?limit=${limit}`)
    return response.data
  },

  // Get limited time items
  async getLimitedItems(limit = 10): Promise<{ success: boolean; data: ShopItem[] }> {
    const response = await api.get(`/shop/limited?limit=${limit}`)
    return response.data
  },

  // Get new items
  async getNewItems(limit = 10): Promise<{ success: boolean; data: ShopItem[] }> {
    const response = await api.get(`/shop/new?limit=${limit}`)
    return response.data
  },

  // Get single item by ID
  async getItem(id: string): Promise<{ success: boolean; data: ShopItem }> {
    const response = await api.get(`/shop/${id}`)
    return response.data
  },

  // Purchase item
  async purchaseItem(itemId: string, currency: 'coins' | 'tokens'): Promise<PurchaseResponse> {
    const response = await api.post(`/shop/${itemId}/purchase`, { currency })
    return response.data
  },

  // Get user's purchase history
  async getPurchaseHistory(page = 1, limit = 20): Promise<Record<string, unknown>> {
    const response = await api.get(`/shop/user/purchases?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get user's inventory
  async getUserInventory(): Promise<Record<string, unknown>> {
    const response = await api.get('/shop/user/inventory')
    return response.data
  },

  // Add item to wishlist
  async addToWishlist(itemId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/shop/${itemId}/wishlist`)
    return response.data
  },

  // Remove item from wishlist
  async removeFromWishlist(itemId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/shop/${itemId}/wishlist`)
    return response.data
  }
}

export default shopApi