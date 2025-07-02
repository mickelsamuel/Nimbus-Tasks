'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { useModules } from '@/hooks/useModules'
import { ModuleFilters } from '@/types/modules'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useScrollPerformance } from '@/hooks/usePerformance'

// Lazy load heavy components
const ModulesHero = dynamic(() => import('@/components/modules/ModulesHero'), {
  loading: () => <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
})

const ModulesStats = dynamic(() => import('@/components/modules/ModulesStats'), {
  loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
})

const ModulesSearch = dynamic(() => import('@/components/modules/ModulesSearch'), {
  loading: () => <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
})

const ModulesGrid = dynamic(() => import('@/components/modules/ModulesGrid'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
})

const ModulesTabs = dynamic(() => import('@/components/modules/ModulesTabs'), {
  loading: () => <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
})

const ModuleDeadlines = dynamic(() => import('@/components/modules/ModuleDeadlines').then(mod => ({ default: mod.ModuleDeadlines })), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
})

const ModuleCertificates = dynamic(() => import('@/components/modules/ModuleCertificates').then(mod => ({ default: mod.ModuleCertificates })), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
})

// Memoized stats calculation
const useModuleStats = (modules: any[]) => {
  return useMemo(() => ({
    assigned: modules.filter(m => m.userProgress).length,
    inProgress: modules.filter(m => m.userProgress && m.userProgress.progress > 0 && m.userProgress.progress < 100).length,
    completed: modules.filter(m => m.userProgress && m.userProgress.progress === 100).length,
    xp: modules.reduce((total, m) => total + (m.userProgress?.xpEarned || 0), 0),
    bookmarked: modules.filter(m => m.isBookmarked).length
  }), [modules])
}

// Memoized filtered modules
const useFilteredModules = (modules: any[], activeTab: string) => {
  return useMemo(() => {
    switch (activeTab) {
      case 'assigned':
        return modules.filter(m => m.userProgress)
      case 'in-progress':
        return modules.filter(m => m.userProgress && m.userProgress.progress > 0 && m.userProgress.progress < 100)
      case 'completed':
        return modules.filter(m => m.userProgress && m.userProgress.progress === 100)
      case 'bookmarked':
        return modules.filter(m => m.isBookmarked)
      case 'recommended':
        return modules.filter(m => m.rating >= 4.5)
      case 'trending':
        return modules.filter(m => m.enrolled > 1000)
      case 'newest':
        return modules.slice().sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      default:
        return modules
    }
  }, [modules, activeTab])
}

// Memoized deadlines calculation
const useModuleDeadlines = (modules: any[]) => {
  return useMemo(() => {
    return modules
      .filter(m => m.dueDate && m.userProgress && m.userProgress.progress < 100)
      .map(m => ({
        id: m.id,
        title: m.title,
        dueDate: new Date(m.dueDate!),
        progress: m.userProgress?.progress || 0,
        priority: (() => {
          const daysDiff = Math.ceil((new Date(m.dueDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          if (daysDiff <= 2) return 'urgent' as const
          if (daysDiff <= 7) return 'high' as const
          return 'medium' as const
        })(),
        type: (m.isRequired ? 'mandatory' : 'assigned') as 'mandatory' | 'assigned',
        assignedBy: m.instructor || 'System'
      }))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }, [modules])
}

// Memoized certificates calculation
const useModuleCertificates = (modules: any[]) => {
  return useMemo(() => {
    return modules
      .filter(m => m.userProgress && m.userProgress.progress === 100 && m.userProgress.completedAt)
      .map(m => ({
        id: m.id.toString(),
        moduleTitle: m.title,
        completedDate: new Date(m.userProgress!.completedAt!),
        certificateId: `CERT-${m.id}-${new Date(m.userProgress!.completedAt!).getFullYear()}`,
        score: m.userProgress?.finalScore || 0,
        instructor: m.instructor || 'System',
        category: m.category || 'General',
        expiryDate: m.certificateExpiry ? new Date(m.certificateExpiry) : null
      }))
      .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime())
  }, [modules])
}

export default function ModulesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('assigned')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [currentSort, setCurrentSort] = useState('enrolled')

  const {
    modules,
    loading,
    error,
    availableFilters,
    pagination,
    updateFilters,
    enrollInModule,
    loadMore,
    refetch
  } = useModules({
    limit: 12,
    sort: currentSort,
    order: 'desc'
  })

  // Use performance hooks
  const { isScrolling } = useScrollPerformance()
  
  // Use memoized calculations
  const stats = useModuleStats(modules)
  const filteredModules = useFilteredModules(modules, activeTab)
  const moduleDeadlines = useModuleDeadlines(modules)
  const moduleCertificates = useModuleCertificates(modules)

  // Update filters when search/filter state changes
  useEffect(() => {
    const filters: Partial<ModuleFilters> = {}
    
    if (searchQuery) filters.search = searchQuery
    if (selectedCategories.length > 0) filters.category = selectedCategories[0] // API supports single category
    if (selectedLevel !== 'all') filters.difficulty = selectedLevel
    if (currentSort) filters.sort = currentSort
    
    updateFilters(filters)
  }, [searchQuery, selectedCategories, selectedLevel, currentSort, updateFilters])

  // Hero stats calculation
  const heroStats = useMemo(() => ({
    streak: modules.reduce((max, m) => {
      if (m.userProgress?.lastAccessedAt) {
        const daysSinceAccess = Math.floor((Date.now() - new Date(m.userProgress.lastAccessedAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceAccess === 0 ? Math.max(max, m.userProgress.streakDays || 0) : max
      }
      return max
    }, 0),
    weeklyXP: modules.reduce((total, m) => total + (m.userProgress?.xpEarned || 0), 0),
    level: stats.completed >= 20 ? 'Expert Professional' : stats.completed >= 10 ? 'Advanced Learner' : stats.completed >= 5 ? 'Intermediate Learner' : 'Beginner',
    modulesToNext: Math.max(0, (stats.completed < 5 ? 5 : stats.completed < 10 ? 10 : stats.completed < 20 ? 20 : 30) - stats.completed)
  }), [modules, stats.completed])

  // Calculate overall progress
  const progress = useMemo(() => 
    stats.assigned > 0 ? Math.round((stats.completed / stats.assigned) * 100) : 0, 
    [stats.assigned, stats.completed]
  )


  const handleEnroll = async (moduleId: number) => {
    const success = await enrollInModule(moduleId)
    if (success) {
      // Refresh the page to show updated enrollment
      refetch()
    }
  }

  const handleStart = (moduleId: number) => {
    // Navigate to module content page
    router.push(`/modules/${moduleId}`)
  }

  const handleLoadMore = () => {
    loadMore()
  }

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort)
  }

  const handlePreview = (moduleId: number) => {
    // Open module preview modal or navigate to preview page
    router.push(`/modules/${moduleId}/preview`)
  }

  const handleDiscuss = (moduleId: number) => {
    // Navigate to module discussion/comments page
    router.push(`/modules/${moduleId}/discussion`)
  }

  const handleShare = (moduleId: number) => {
    // Share module functionality
    const moduleUrl = `${window.location.origin}/modules/${moduleId}`
    if (navigator.share) {
      navigator.share({
        title: 'Check out this training module',
        url: moduleUrl
      })
    } else {
      navigator.clipboard.writeText(moduleUrl)
      // Could add a toast notification here
    }
  }

  const handleBookmark = async (moduleId: number) => {
    try {
      const { modulesApi } = await import('@/lib/api/modules')
      const response = await modulesApi.toggleBookmark(moduleId)
      if (response.success) {
        // Refresh modules to update bookmark status
        refetch()
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  const handleLike = async (moduleId: number) => {
    try {
      const { modulesApi } = await import('@/lib/api/modules')
      const response = await modulesApi.toggleLike(moduleId)
      if (response.success) {
        // Refresh modules to update like status and count
        refetch()
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
          <div className="container mx-auto px-4 lg:px-6 py-12">
            <div className="max-w-2xl mx-auto">
              <div className="dashboard-card rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Unable to Load Modules
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <button 
                  onClick={() => refetch()} 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }


  return (
    <ProtectedLayout>
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 ${isScrolling ? 'is-scrolling' : ''}`}>
        {/* Simplified Background Elements - No animations */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tr from-purple-500/5 to-pink-500/5 rounded-full" />
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-6 py-8 space-y-12">
          {/* Hero Section */}
          <section className="perf-isolated">
            <ModulesHero progress={progress} stats={heroStats} />
          </section>
          
          {/* Stats Section */}
          <section className="perf-isolated">
            <ModulesStats stats={stats} />
          </section>
          
          {/* Tab Navigation */}
          <section className="perf-isolated">
            <ModulesTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              stats={stats}
            />
          </section>

          {/* Search & Filters Section - Show only for discover tabs */}
          {(activeTab === 'all-modules' || activeTab === 'recommended' || activeTab === 'trending' || activeTab === 'newest') && (
            <section className="perf-isolated">
              <ModulesSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                categories={availableFilters.categories}
              />
            </section>
          )}
          
          {/* Quick Actions & Status Cards */}
          <section className="perf-isolated">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Deadlines Card */}
              <div className="dashboard-card rounded-3xl p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800/50 transition-colors duration-200 perf-hover">
                <ModuleDeadlines modules={moduleDeadlines} />
              </div>

              {/* Certificates Card */}
              <div className="dashboard-card rounded-3xl p-8 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-800/50 transition-colors duration-200 perf-hover">
                <ModuleCertificates certificates={moduleCertificates} />
              </div>
            </div>
          </section>
          
          {/* Modules Grid Section */}
          <section className="perf-isolated">
            <ModulesGrid
              modules={filteredModules}
              loading={loading}
              onEnroll={handleEnroll}
              onStart={handleStart}
              onLoadMore={handleLoadMore}
              onSortChange={handleSortChange}
              currentSort={currentSort}
              hasMore={pagination.page < pagination.pages}
              totalModules={pagination.total}
              onPreview={handlePreview}
              onDiscuss={handleDiscuss}
              onShare={handleShare}
              onBookmark={handleBookmark}
              onLike={handleLike}
            />
          </section>
        </div>
      </div>
    </ProtectedLayout>
  )
}