'use client'

import { useState } from 'react'
import { 
  Search, Grid, List, SlidersHorizontal, 
  Star, Package, Eye, EyeOff, DollarSign 
} from 'lucide-react'

interface ShopFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedRarity: string
  setSelectedRarity: (rarity: string) => void
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  showOwned: boolean
  setShowOwned: (show: boolean) => void
  onlyAffordable: boolean
  setOnlyAffordable: (only: boolean) => void
  totalItems: number
  isLoading: boolean
}

export default function ShopFilters({ 
  searchTerm, setSearchTerm, selectedCategory, setSelectedCategory,
  selectedRarity, setSelectedRarity, selectedTags, setSelectedTags,
  sortBy, setSortBy, viewMode, setViewMode, showOwned, setShowOwned,
  onlyAffordable, setOnlyAffordable, totalItems, isLoading
}: ShopFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const categories = [
    { id: 'all', label: 'All Items', count: 500 },
    { id: 'avatar', label: 'Avatars', count: 85 },
    { id: 'clothing', label: 'Clothing', count: 120 },
    { id: 'accessories', label: 'Accessories', count: 95 },
    { id: 'frames', label: 'Frames', count: 60 },
    { id: 'titles', label: 'Titles', count: 45 },
    { id: 'auras', label: 'Auras', count: 35 },
    { id: 'emotes', label: 'Emotes', count: 50 },
    { id: 'themes', label: 'Themes', count: 25 },
    { id: 'bundles', label: 'Bundles', count: 15 }
  ]

  const rarities = [
    { id: 'all', label: 'All Rarities', color: 'gray' },
    { id: 'common', label: 'Common', color: 'gray' },
    { id: 'uncommon', label: 'Uncommon', color: 'green' },
    { id: 'rare', label: 'Rare', color: 'blue' },
    { id: 'epic', label: 'Epic', color: 'purple' },
    { id: 'legendary', label: 'Legendary', color: 'yellow' },
    { id: 'mythic', label: 'Mythic', color: 'red' }
  ]

  const popularTags = [
    'premium', 'professional', 'executive', 'luxury', 'animated',
    'exclusive', 'limited', 'trending', 'new', 'bundle'
  ]

  const getRarityColor = (color: string) => {
    const colors = {
      gray: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      red: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Search and Controls */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-lg">
        <div className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Quick Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {category.label}
                  <span className="ml-2 text-xs opacity-70">{category.count}</span>
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showAdvanced
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Advanced
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {isLoading ? 'Loading...' : `${totalItems} items found`}
            </span>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1 text-sm"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rarity">Rarity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-gray-200 dark:border-slate-700 p-6 space-y-6">
            {/* Rarity Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rarity
              </h3>
              <div className="flex flex-wrap gap-2">
                {rarities.map((rarity) => (
                  <button
                    key={rarity.id}
                    onClick={() => setSelectedRarity(rarity.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedRarity === rarity.id
                        ? 'ring-2 ring-indigo-500 ' + getRarityColor(rarity.color)
                        : getRarityColor(rarity.color) + ' hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                    }`}
                  >
                    {rarity.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setShowOwned(!showOwned)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  showOwned
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}
              >
                {showOwned ? (
                  <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-sm font-medium ${
                  showOwned ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Show Owned
                </span>
              </button>

              <button
                onClick={() => setOnlyAffordable(!onlyAffordable)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  onlyAffordable
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}
              >
                <DollarSign className={`w-4 h-4 ${
                  onlyAffordable ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  onlyAffordable ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Only Affordable
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}