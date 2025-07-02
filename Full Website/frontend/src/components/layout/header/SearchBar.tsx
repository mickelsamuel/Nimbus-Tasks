'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Command } from 'lucide-react'
import SearchResults from './SearchResults'

interface SearchBarProps {
  searchQuery: string
  searchFocused: boolean
  showSearchResults: boolean
  searchResults: Array<{ type: string; title: string; path: string; description?: string; icon?: React.ComponentType; id?: string }>
  searchSuggestions: string[]
  showMobileSearch: boolean
  onSearchChange: (value: string) => void
  onSearchFocus: () => void
  onSearchBlur: () => void
  onResultClick: (result: { type: string; title: string; path: string; description?: string; icon?: React.ComponentType; id?: string }) => void
  onMobileSearchToggle: (show: boolean) => void
  className?: string
}

export default function SearchBar({
  searchQuery,
  searchFocused,
  showSearchResults,
  searchResults,
  searchSuggestions,
  showMobileSearch,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onResultClick,
  onMobileSearchToggle,
  className = ''
}: SearchBarProps) {
  return (
    <>
      {/* Mobile Search Button */}
      <motion.button
        className="md:hidden flex items-center justify-center rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-500 dark:border-gray-500 p-2.5 text-gray-700 dark:text-gray-300 transition-all hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-gray-600 dark:hover:border-gray-400 shadow-sm"
        onClick={() => onMobileSearchToggle(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
      </motion.button>

      {/* Desktop Search */}
      <motion.div 
        className={`hidden md:flex w-full max-w-full ${className}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative w-full">
          <div 
            className={`relative flex items-center rounded-lg transition-all duration-300 ${
              searchFocused 
                ? 'bg-white/95 dark:bg-gray-800/95' 
                : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90'
            }`}
          >
            <Search className={`ml-4 h-4 w-4 transition-colors duration-200 ${
              searchFocused ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'
            }`} />
            <input
              id="global-search"
              type="text"
              placeholder="Search modules, teams, events... (⌘K)"
              className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none border-none focus:border-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
              aria-label="Global search"
              role="searchbox"
              aria-describedby="search-help"
            />
            <motion.div 
              className="mr-4 hidden lg:flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <kbd 
                className="flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/60 rounded-md shadow-sm"
                id="search-help"
              >
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </kbd>
            </motion.div>
          </div>

          {/* Search Results Dropdown */}
          <SearchResults
            show={showSearchResults}
            searchQuery={searchQuery}
            searchResults={searchResults}
            searchSuggestions={searchSuggestions}
            onResultClick={onResultClick}
            onSearchChange={onSearchChange}
          />
        </div>
      </motion.div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => onMobileSearchToggle(false)}
            />
            
            {/* Search Panel */}
            <motion.div
              className="relative bg-white dark:bg-gray-800 shadow-xl p-4"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onMobileSearchToggle(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Close search"
                >
                  ✕
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search modules, teams, events..."
                    className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Mobile Search Results */}
              <SearchResults
                show={showSearchResults}
                searchQuery={searchQuery}
                searchResults={searchResults}
                searchSuggestions={searchSuggestions}
                onResultClick={(result) => {
                  onResultClick(result)
                  onMobileSearchToggle(false)
                }}
                onSearchChange={onSearchChange}
                    isMobile={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}