'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { 
  Search, Target, Users, TrendingUp, 
  Sparkles, X, SlidersHorizontal
} from 'lucide-react'
import { debounce } from '@/utils/debounce'

interface ModulesSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  selectedLevel: string
  setSelectedLevel: (level: string) => void
  selectedDuration?: string
  setSelectedDuration?: (duration: string) => void
  selectedRating?: string
  setSelectedRating?: (rating: string) => void
  categories: string[]
}

export default function ModulesSearch({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedLevel,
  setSelectedLevel,
  selectedDuration = 'all',
  setSelectedDuration,
  selectedRating = 'all',
  setSelectedRating,
  categories
}: ModulesSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [, setAiSuggestions] = useState<string[]>([])
  const [, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Debounced search to improve performance
  const debouncedSearch = useCallback((query: string) => {
    const debounced = debounce(() => {
      setSearchQuery(query)
    }, 300)
    debounced()
  }, [setSearchQuery])
  
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const levels = [
    { key: 'all', label: 'All Levels' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
    { key: 'expert', label: 'Expert' }
  ]
  const durations = [
    { key: 'all', label: 'Any Duration' },
    { key: 'short', label: 'Short (< 30 min)' },
    { key: 'medium', label: 'Medium (30-60 min)' },
    { key: 'long', label: 'Long (60+ min)' }
  ]
  const ratings = [
    { key: 'all', label: 'Any Rating' },
    { key: 'fourPlus', label: '4+ Stars' },
    { key: 'threePlus', label: '3+ Stars' },
    { key: 'any', label: 'Any Rating' }
  ]

  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category]
    )
  }

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedLevel('all')
    setSelectedDuration?.('all')
    setSelectedRating?.('all')
    setSearchQuery('')
  }, [setSelectedCategories, setSelectedLevel, setSelectedDuration, setSelectedRating, setSearchQuery])

  const activeFiltersCount = useMemo(() => {
    let count = selectedCategories.length
    if (selectedLevel !== 'all') count++
    if (selectedDuration && selectedDuration !== 'all') count++
    if (selectedRating && selectedRating !== 'all') count++
    return count
  }, [selectedCategories.length, selectedLevel, selectedDuration, selectedRating])

  const aiSampleQueries = [
    'Advanced cybersecurity protocols for banking',
    'Risk management strategies for financial institutions',
    'Banking fundamentals for new employees',
    'Quick modules I can complete in 30 minutes',
    'Compliance training for regulatory requirements'
  ]

  const handleSearchFocus = () => {
    setShowSuggestions(true)
    setAiSuggestions(aiSampleQueries.slice(0, 3))
  }

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200)
  }

  // const handleAISuggestionClick = (suggestion: string) => {
  //   setSearchQuery(suggestion)
  //   setShowSuggestions(false)
  // }

  const smartRecommendations = [
    {
      icon: Target,
      title: 'Quick Wins Available',
      description: 'Complete 2 short modules to boost your weekly progress',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Team Trending',
      description: 'Popular modules among your colleagues this week',
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Fill Your Skill Gap',
      description: 'Personalized recommendations based on your role',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping animation-delay-200" />
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-ping animation-delay-400" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          🌍 Discover Your Next Learning Adventure
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          📚 Find the perfect training modules to advance your career and enhance your skills with AI-powered recommendations
        </p>
      </div>

      {/* Main Search Container */}
      <div className="dashboard-card rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/50 dark:to-purple-900/50 border-2 border-blue-200/50 dark:border-blue-800/50 hover:shadow-2xl transition-all duration-500">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative z-10 space-y-6">
          {/* AI-Powered Search Bar */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                    <Search className="h-6 w-6 text-blue-500 group-focus-within:text-purple-500" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="🔍 Search modules by title, topic, or skill..."
                    defaultValue={searchQuery}
                    onChange={handleSearchInput}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className="w-full pl-14 pr-14 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 text-lg font-medium placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 hover:shadow-lg focus:shadow-xl"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  
                  {/* Search glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                </div>

              </div>

              {/* Filters Toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`group flex items-center gap-3 px-6 py-5 rounded-2xl border-2 transition-all duration-500 relative whitespace-nowrap transform hover:scale-105 ${
                  showFilters
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 text-white shadow-xl'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <SlidersHorizontal className={`h-5 w-5 transition-transform duration-300 ${
                  showFilters ? 'rotate-180' : 'group-hover:rotate-12'
                }`} />
                <span className="font-bold">🎯 Filters</span>
                {activeFiltersCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-bounce shadow-lg">
                    {activeFiltersCount}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Advanced Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Difficulty Level
                  </label>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <button
                        key={level.key}
                        onClick={() => setSelectedLevel(level.key)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedLevel === level.key
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span className="text-sm">{level.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Categories
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategories.includes(category)
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span className="text-sm">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Duration
                    </label>
                    <select 
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration?.(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      {durations.map(duration => (
                        <option key={duration.key} value={duration.key}>{duration.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Minimum Rating
                    </label>
                    <select 
                      value={selectedRating}
                      onChange={(e) => setSelectedRating?.(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      {ratings.map(rating => (
                        <option key={rating.key} value={rating.key}>{rating.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Quick Filters */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Popular Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategories.includes(category)
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="dashboard-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Smart Recommendations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-Powered • Personalized for You
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {smartRecommendations.map((rec, index) => {
            const IconComponent = rec.icon
            return (
              <div
                key={index}
                className={`p-6 rounded-xl bg-gradient-to-br from-${rec.color}-50 to-${rec.color}-100 dark:from-${rec.color}-900/20 dark:to-${rec.color}-800/20 border border-${rec.color}-200 dark:border-${rec.color}-800/50 group hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-gradient-to-r ${rec.gradient} rounded-xl group-hover:rotate-12 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-${rec.color}-900 dark:text-${rec.color}-100 mb-2 text-sm lg:text-base`}>
                      {rec.title}
                    </h4>
                    <p className={`text-xs lg:text-sm text-${rec.color}-700 dark:text-${rec.color}-300 leading-relaxed`}>
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}