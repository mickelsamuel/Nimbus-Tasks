'use client'

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react'
import React from 'react'
import dynamic from 'next/dynamic'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { useScrollPerformance, useDebounce, useInViewport } from '@/hooks/usePerformance'
import { 
  Building2, 
  Users, 
  Heart, 
  Brain,
  Briefcase,
  Coffee,
  Search,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Clock
} from 'lucide-react'
import { useSpaces } from '@/hooks/useSpaces'
import { VirtualSpace } from '@/types'
import { transformSpaceData } from '@/utils/iconMapping'

// Lazy load heavy components
const SpaceJoinModal = dynamic(() => import('./SpaceJoinModal'), {
  loading: () => null
})

const SpaceExplorerView = dynamic(() => import('./SpaceExplorerView'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
})

// Virtual Spaces will be fetched from API

// Memoized space filter hook
const useSpaceFilters = (spaces: VirtualSpace[], searchQuery: string, selectedCategory: string) => {
  return useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    
    return spaces.filter(space => {
      const matchesSearch = !query || 
        space.name.toLowerCase().includes(query) ||
        space.description.toLowerCase().includes(query)
      const matchesCategory = selectedCategory === 'all' || space.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [spaces, searchQuery, selectedCategory])
}

// Memoized categories
const spaceCategories = [
  { id: 'all', name: 'All Spaces', icon: Building2 },
  { id: 'meeting', name: 'Meeting Rooms', icon: Users },
  { id: 'work', name: 'Workspaces', icon: Briefcase },
  { id: 'social', name: 'Social Areas', icon: Coffee },
  { id: 'training', name: 'Training', icon: Brain },
  { id: 'wellness', name: 'Wellness', icon: Heart }
]

export default function SpacesPage() {
  const [viewMode, setViewMode] = useState<'explorer' | 'grid' | 'list'>('explorer')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [selectedSpace, setSelectedSpace] = useState<VirtualSpace | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  // Performance hooks
  const { isScrolling } = useScrollPerformance()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const {
    spaces: apiSpaces,
    showJoinModal,
    loading,
    error,
    setShowJoinModal,
    joinSpace
  } = useSpaces()

  // Transform API spaces to frontend format - memoized
  const spaces = useMemo(() => {
    return apiSpaces ? apiSpaces.map(transformSpaceData) : []
  }, [apiSpaces])

  // Use memoized filter
  const filteredSpaces = useSpaceFilters(spaces, debouncedSearchQuery, selectedCategory)

  // Memoized handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsFilterOpen(false)
  }, [])

  const handleViewModeChange = useCallback((mode: 'explorer' | 'grid' | 'list') => {
    setViewMode(mode)
  }, [])

  const showNotificationMessage = useCallback((message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }, [])

  const handleJoinSpace = useCallback(async () => {
    if (selectedSpace) {
      try {
        await joinSpace(selectedSpace.id)
        showNotificationMessage(`Successfully joined ${selectedSpace.name}!`)
        setShowJoinModal(false)
      } catch (error) {
        showNotificationMessage('Failed to join space. Please try again.')
        console.error('Error joining space:', error)
      }
    }
  }, [selectedSpace, joinSpace, showNotificationMessage, setShowJoinModal])

  const handleSpaceSelect = useCallback((space: VirtualSpace) => {
    if (space.id === selectedSpace?.id) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedSpace(space)
      setIsTransitioning(false)
    }, 300)
  }, [selectedSpace?.id])

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFilterOpen])

  // Initialize selected space when spaces are loaded
  useEffect(() => {
    if (spaces.length > 0 && !selectedSpace) {
      setSelectedSpace(spaces[0])
    }
  }, [spaces, selectedSpace])

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600/30 border-t-primary-600 rounded-full mx-auto mb-4 animate-spin" />
            <div className="text-xl font-semibold text-gray-900 dark:text-white">Loading Virtual Spaces...</div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-semibold text-red-600 mb-4">Error Loading Spaces</div>
            <div className="text-gray-600 dark:text-gray-400">{error}</div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          {/* Glassmorphism background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23E01A1A%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
          </div>
          
          <div className="relative z-10 px-6 py-8">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Virtual Spaces
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore and connect in immersive virtual environments designed for modern workplace collaboration
              </p>
            </div>

            {/* Controls Bar */}
            <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search spaces..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-slate-700/90 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="bg-white/90 dark:bg-slate-700/90 rounded-xl border border-gray-300 dark:border-slate-600 shadow-sm p-1">
                      <button
                        onClick={(e) => {
                          if (!isFilterOpen) {
                            const rect = e.currentTarget.getBoundingClientRect()
                            setDropdownPosition({
                              top: rect.bottom + window.scrollY + 8,
                              left: rect.left + window.scrollX
                            })
                          }
                          setIsFilterOpen(!isFilterOpen)
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-slate-700/70 w-full"
                      >
                        <Filter className="h-4 w-4" />
                        <span>
                          {spaceCategories.find(c => c.id === selectedCategory)?.name || 'All Spaces'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-700/90 rounded-xl p-1 border border-gray-300 dark:border-slate-600 shadow-sm">
                  {[
                    { mode: 'explorer', icon: Building2, label: 'Explorer' },
                    { mode: 'grid', icon: Grid3X3, label: 'Grid' },
                    { mode: 'list', icon: List, label: 'List' }
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as 'explorer' | 'grid' | 'list')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium ${
                        viewMode === mode
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'hover:bg-white/70 dark:hover:bg-slate-700/70 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-700 dark:text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">{filteredSpaces.length} Spaces</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-700 dark:text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">{filteredSpaces.reduce((acc, space) => acc + (space.occupancy || 0), 0)} Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-8">
          {viewMode === 'explorer' && selectedSpace && (
            <SpaceExplorerView 
              spaces={filteredSpaces}
              selectedSpace={selectedSpace}
              onSpaceSelect={handleSpaceSelect}
              onJoinSpace={handleJoinSpace}
              isTransitioning={isTransitioning}
            />
          )}
          
          {viewMode === 'explorer' && !selectedSpace && filteredSpaces.length > 0 && (
            <div className="text-center py-12">
              <div className="text-gray-600 dark:text-gray-400 mb-4">Select a space to explore</div>
              <button
                onClick={() => setSelectedSpace(filteredSpaces[0])}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
              >
                Explore First Space
              </button>
            </div>
          )}
          
          {filteredSpaces.length === 0 && !loading && (
            <div className="text-center py-24">
              <div className="text-gray-600 dark:text-gray-400 mb-4">No spaces match your criteria</div>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
          
          {viewMode === 'grid' && (
            <SpacesGridView 
              spaces={filteredSpaces}
              onJoinSpace={handleJoinSpace}
            />
          )}
          
          {viewMode === 'list' && (
            <SpacesListView 
              spaces={filteredSpaces}
              onJoinSpace={handleJoinSpace}
            />
          )}
        </div>

      {/* Category Filter Dropdown - Positioned below button */}
      {isFilterOpen && (
        <div
          className="fixed w-64 bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-400 dark:border-slate-500 shadow-2xl z-[99999] p-2"
          style={{ 
            zIndex: 99999,
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="text-center mb-2 p-2 border-b border-gray-200 dark:border-slate-600">
            <span className="font-bold text-gray-900 dark:text-white">Filter by Category</span>
          </div>
          {spaceCategories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setIsFilterOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg font-medium text-sm mb-1 ${
                  selectedCategory === category.id 
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm' 
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          {notificationMessage}
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Space Join Modal */}
      <SpaceJoinModal
        isOpen={showJoinModal}
        space={selectedSpace}
        onJoin={handleJoinSpace}
        onCancel={() => setShowJoinModal(false)}
      />

      </div>
    </ProtectedLayout>
  )
}

// Grid View Component
function SpacesGridView({ spaces, onJoinSpace }: {
  spaces: VirtualSpace[]
  onJoinSpace: () => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {spaces.map((space) => (
        <div
          key={space.id}
          className="group cursor-pointer hover:-translate-y-1 transition-transform duration-200"
        >
          <div className="backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 rounded-2xl border border-gray-300/70 dark:border-slate-700/70 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            {/* Space Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-primary-600/30 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
              
              {/* Space Icon */}
              <div className="absolute top-4 left-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <space.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              {/* Occupancy */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-bold border-2 border-white/60">
                  <Users className="h-4 w-4 drop-shadow-lg" />
                  <span className="drop-shadow-lg">{space.occupancy || 0}</span>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="absolute bottom-4 left-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border-2 ${
                  space.status === 'available' 
                    ? 'bg-green-600/80 text-white border-green-300'
                    : space.status === 'busy'
                    ? 'bg-red-600/80 text-white border-red-300'
                    : 'bg-yellow-600/80 text-white border-yellow-300'
                }`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                  {space.status === 'available' ? 'Available' : space.status === 'busy' ? 'In Use' : 'Reserved'}
                </div>
              </div>
            </div>
            
            {/* Space Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {space.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {space.description}
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {space.features?.slice(0, 3).map((feature: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-xs rounded-lg font-medium border border-primary-200 dark:border-primary-700"
                  >
                    {feature}
                  </span>
                ))}
                {space.features?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg font-medium border border-gray-200 dark:border-slate-600">
                    +{space.features.length - 3} more
                  </span>
                )}
              </div>
              
              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onJoinSpace()
                }}
                disabled={space.status === 'busy'}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  space.status === 'available'
                    ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
                    : space.status === 'busy'
                    ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {space.status === 'available' ? 'Join Space' : space.status === 'busy' ? 'In Use' : 'Reserved'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// List View Component
function SpacesListView({ spaces, onJoinSpace }: {
  spaces: VirtualSpace[]
  onJoinSpace: () => void
}) {
  return (
    <div className="space-y-4">
      {spaces.map((space) => (
        <div
          key={space.id}
          className="group cursor-pointer"
        >
          <div className="backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 rounded-2xl border border-gray-300/70 dark:border-slate-700/70 shadow-xl hover:shadow-2xl transition-all duration-300 p-6">
            <div className="flex items-center gap-6">
              {/* Space Icon */}
              <div className="flex-shrink-0">
                <div className="p-4 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-xl">
                  <space.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              
              {/* Space Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {space.name}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    space.status === 'available' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : space.status === 'busy'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {space.status === 'available' ? 'Available' : space.status === 'busy' ? 'In Use' : 'Reserved'}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {space.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{space.occupancy || 0}/{space.capacity || 10}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{space.location || 'Floor 2'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Available now</span>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onJoinSpace()
                  }}
                  disabled={space.status === 'busy'}
                  className={`py-3 px-6 rounded-xl font-semibold transition-all ${
                    space.status === 'available'
                      ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
                      : space.status === 'busy'
                      ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {space.status === 'available' ? 'Join' : space.status === 'busy' ? 'Busy' : 'Reserved'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}