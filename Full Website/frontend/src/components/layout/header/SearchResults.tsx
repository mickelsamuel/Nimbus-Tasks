'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchResultsProps {
  show: boolean
  searchQuery: string
  searchResults: Array<{ type: string; title: string; path: string; description?: string; icon?: React.ComponentType; id?: string; score?: number }>
  searchSuggestions: string[]
  onResultClick: (result: { type: string; title: string; path: string; description?: string; icon?: React.ComponentType; id?: string; score?: number }) => void
  onSearchChange: (query: string) => void
  isMobile?: boolean
  className?: string
}

export default function SearchResults({
  show,
  searchQuery,
  searchResults,
  searchSuggestions,
  onResultClick,
  onSearchChange,
  isMobile = false,
  className = ''
}: SearchResultsProps) {
  const router = useRouter()
  
  const performSearch = (suggestion: string) => {
    onSearchChange(suggestion)
  }

  if (!show || (searchResults.length === 0 && searchSuggestions.length === 0 && !searchQuery.trim())) {
    return null
  }

  const containerClasses = isMobile 
    ? "mt-4 max-h-96 overflow-y-auto"
    : "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 max-h-96 overflow-y-auto z-50"

  return (
    <AnimatePresence>
      <motion.div
        className={`${containerClasses} ${className}`}
        initial={!isMobile ? { opacity: 0, scale: 0.95, y: -10 } : {}}
        animate={!isMobile ? { opacity: 1, scale: 1, y: 0 } : {}}
        exit={!isMobile ? { opacity: 0, scale: 0.95, y: -10 } : {}}
        transition={{ duration: 0.2 }}
      >
        <div className={isMobile ? "" : "p-4"}>
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Search Results
              </h3>
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => onResultClick(result)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Result type icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                        result.type === 'module' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                        result.type === 'team' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                        result.type === 'user' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                        result.type === 'event' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                        result.type === 'achievement' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {result.type === 'module' && '📚'}
                        {result.type === 'team' && '👥'}
                        {result.type === 'user' && '👤'}
                        {result.type === 'event' && '📅'}
                        {result.type === 'achievement' && '🏆'}
                        {!['module', 'team', 'user', 'event', 'achievement'].includes(result.type) && '📄'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {result.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 capitalize">
                          {result.type}
                        </p>
                      </div>
                      {result.score && (
                        <div className="flex-shrink-0">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
{Math.round((result.score || 0) * 100)}% match
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Search suggestions
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => performSearch(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {searchResults.length === 0 && searchSuggestions.length === 0 && searchQuery.trim() && (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-600 mb-2">
                <Search className="h-8 w-8 mx-auto opacity-50" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                Try searching for modules, teams, or events
              </p>
            </div>
          )}

          {/* Advanced search link */}
          {searchQuery.trim() && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                }}
                className="w-full text-center text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                View all results for &ldquo;{searchQuery}&rdquo;
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}