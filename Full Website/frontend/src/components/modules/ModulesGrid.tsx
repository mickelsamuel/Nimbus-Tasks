'use client'

import { BookOpen, Loader } from 'lucide-react'
import ModuleCard from './ModuleCard'
import { Module } from '@/types/modules'

interface ModulesGridProps {
  modules: Module[]
  loading?: boolean
  onEnroll?: (moduleId: number) => void
  onStart?: (moduleId: number) => void
  onLoadMore?: () => void
  onSortChange?: (sort: string) => void
  currentSort?: string
  hasMore?: boolean
  totalModules?: number
  onPreview?: (moduleId: number) => void
  onDiscuss?: (moduleId: number) => void
  onShare?: (moduleId: number) => void
  onBookmark?: (moduleId: number, bookmarked: boolean) => void
  onLike?: (moduleId: number, liked: boolean) => void
}

export default function ModulesGrid({ 
  modules, 
  loading, 
  onEnroll, 
  onStart,
  onLoadMore,
  onSortChange,
  currentSort = 'enrolled',
  hasMore = false,
  totalModules = 0,
  onPreview,
  onDiscuss,
  onShare,
  onBookmark,
  onLike
}: ModulesGridProps) {

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
            <Loader className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Training Modules
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch your personalized training content
            </p>
          </div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="dashboard-card rounded-2xl overflow-hidden animate-pulse">
              {/* Header skeleton */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700" />
              
              {/* Content skeleton */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
                </div>
                
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                </div>
                
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
                
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              No modules found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn&apos;t find any modules matching your current filters
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>Try these suggestions:</p>
            <ul className="space-y-1">
              <li>• Adjust your search terms</li>
              <li>• Remove some filters</li>
              <li>• Browse a different category</li>
              <li>• Use AI-powered search</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Available Training Modules
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Showing {modules.length} results
          </p>
        </div>
        
        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Sort by</span>
          <select 
            value={currentSort}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
          >
            <option value="enrolled">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="duration">Shortest First</option>
            <option value="xp">Most XP</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <ModuleCard
            key={module.id}
            module={module}
            index={index}
            onEnroll={onEnroll}
            onStart={onStart}
            onPreview={onPreview}
            onDiscuss={onDiscuss}
            onShare={onShare}
            onBookmark={onBookmark}
            onLike={onLike}
          />
        ))}
      </div>

      {/* Load More Section */}
      {hasMore && (
        <div className="text-center pt-8">
          <button 
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <BookOpen className="w-5 h-5" />
            <span>Load More Modules</span>
          </button>
          {totalModules > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              {totalModules} total modules available
            </p>
          )}
        </div>
      )}
    </div>
  )
}