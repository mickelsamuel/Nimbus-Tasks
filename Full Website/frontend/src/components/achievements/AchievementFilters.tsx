import { motion } from 'framer-motion'
import { Search, Filter, Grid3x3, List, LayoutGrid, SortDesc } from 'lucide-react'

interface AchievementFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedRarity: string
  onRarityChange: (rarity: string) => void
  sortBy: 'recent' | 'points' | 'progress' | 'rarity'
  onSortChange: (sort: 'recent' | 'points' | 'progress' | 'rarity') => void
  viewMode: 'grid' | 'list' | 'showcase'
  onViewModeChange: (mode: 'grid' | 'list' | 'showcase') => void
  showUnlockedOnly: boolean
  onShowUnlockedOnlyChange: (show: boolean) => void
  totalCount: number
}

export function AchievementFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedRarity,
  onRarityChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showUnlockedOnly,
  onShowUnlockedOnlyChange,
  totalCount
}: AchievementFiltersProps) {
  const categories = [
    { value: 'all', label: 'All Categories', color: 'bg-gray-500' },
    { value: 'learning', label: 'Learning', color: 'bg-blue-500' },
    { value: 'performance', label: 'Performance', color: 'bg-green-500' },
    { value: 'collaboration', label: 'Collaboration', color: 'bg-purple-500' },
    { value: 'innovation', label: 'Innovation', color: 'bg-orange-500' },
    { value: 'leadership', label: 'Leadership', color: 'bg-red-500' }
  ]

  const rarities = [
    { value: 'all', label: 'All Rarities' },
    { value: 'common', label: 'Common', color: 'text-gray-500' },
    { value: 'rare', label: 'Rare', color: 'text-blue-500' },
    { value: 'epic', label: 'Epic', color: 'text-purple-500' },
    { value: 'legendary', label: 'Legendary', color: 'text-orange-500' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search achievements by name, description, or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
            {totalCount} results
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Left Side Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Category Pills */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category.value
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Rarity Dropdown */}
          <div className="relative">
            <select
              value={selectedRarity}
              onChange={(e) => onRarityChange(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
            >
              {rarities.map((rarity) => (
                <option key={rarity.value} value={rarity.value}>
                  {rarity.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'recent' | 'points' | 'progress' | 'rarity')}
              className="appearance-none px-4 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
            >
              <option value="recent">Recently Updated</option>
              <option value="points">Highest XP</option>
              <option value="progress">Most Progress</option>
              <option value="rarity">By Rarity</option>
            </select>
            <SortDesc className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Show Unlocked Toggle */}
          <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => onShowUnlockedOnlyChange(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Unlocked Only</span>
          </label>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="Grid View"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('showcase')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'showcase'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="Showcase View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}