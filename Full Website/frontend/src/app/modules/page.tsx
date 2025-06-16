'use client'

import { useState, useEffect } from 'react'
import './animations.css'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { 
  ModulesHero,
  ModulesStats,
  ModulesSearch,
  ModulesGrid,
  ModulesTabs,
  ModuleDeadlines,
  ModuleCertificates
} from '@/components/modules'
import { useModules } from '@/hooks/useModules'
import { ModuleFilters } from '@/types/modules'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ModulesPage() {
  const [activeTab, setActiveTab] = useState('assigned')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState('all')

  const {
    modules,
    loading,
    error,
    availableFilters,
    updateFilters,
    enrollInModule,
    refetch
  } = useModules({
    limit: 12,
    sort: 'enrolled',
    order: 'desc'
  })

  // Update filters when search/filter state changes
  useEffect(() => {
    const filters: Partial<ModuleFilters> = {}
    
    if (searchQuery) filters.search = searchQuery
    if (selectedCategories.length > 0) filters.category = selectedCategories[0] // API supports single category
    if (selectedLevel !== 'all') filters.difficulty = selectedLevel
    
    updateFilters(filters)
  }, [searchQuery, selectedCategories, selectedLevel, updateFilters])

  // Calculate stats from actual module data
  const stats = {
    assigned: modules.filter(m => m.userProgress).length,
    inProgress: modules.filter(m => m.userProgress && m.userProgress.progress > 0 && m.userProgress.progress < 100).length,
    completed: modules.filter(m => m.userProgress && m.userProgress.progress === 100).length,
    points: modules.reduce((total, m) => total + (m.userProgress?.pointsEarned || 0), 0),
    bookmarked: modules.filter(m => m.isBookmarked).length
  }

  // Filter modules based on active tab
  const getFilteredModules = () => {
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
  }

  const filteredModules = getFilteredModules()

  // Calculate hero stats from actual data
  const heroStats = {
    streak: 0, // Will be calculated from user progress data
    weeklyXP: modules.reduce((total, m) => total + (m.userProgress?.pointsEarned || 0), 0),
    level: 'Learning Professional',
    modulesToNext: Math.max(0, 10 - stats.completed)
  }

  // Calculate overall progress
  const progress = stats.assigned > 0 ? Math.round((stats.completed / stats.assigned) * 100) : 0

  const handleEnroll = async (moduleId: number) => {
    const success = await enrollInModule(moduleId)
    if (success) {
      console.log('Successfully enrolled in module', moduleId)
    }
  }

  const handleStart = (moduleId: number) => {
    // Navigate to module content page
    window.location.href = `/modules/${moduleId}`
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

  // Calculate deadlines from modules with due dates
  const moduleDeadlines = modules
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
      type: (m.isRequired ? 'mandatory' : 'assigned') as const,
      assignedBy: m.instructor || 'System'
    }))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  // Calculate certificates from completed modules
  const moduleCertificates = modules
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

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-6 py-8 space-y-12">
          {/* Hero Section */}
          <div className="animate-fade-in-up">
            <ModulesHero progress={progress} stats={heroStats} />
          </div>
          
          {/* Stats Section */}
          <div className="animate-fade-in-up animation-delay-200">
            <ModulesStats stats={stats} />
          </div>
          
          {/* Tab Navigation */}
          <div className="animate-fade-in-up animation-delay-300">
            <ModulesTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              stats={stats}
            />
          </div>

          {/* Search & Filters Section - Show only for discover tabs */}
          {activeTab === 'all-modules' || activeTab === 'recommended' || activeTab === 'trending' || activeTab === 'newest' ? (
            <div className="animate-fade-in-up animation-delay-400">
              <ModulesSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                categories={availableFilters.categories}
              />
            </div>
          ) : null}
          
          {/* Quick Actions & Status Cards */}
          <div className="animate-fade-in-up animation-delay-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Deadlines Card - Redesigned */}
              <div className="dashboard-card rounded-3xl p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800/50 hover:scale-105 transition-all duration-500 hover:shadow-2xl group">
                <ModuleDeadlines modules={moduleDeadlines} />
              </div>

              {/* Certificates Card - Redesigned */}
              <div className="dashboard-card rounded-3xl p-8 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-800/50 hover:scale-105 transition-all duration-500 hover:shadow-2xl group">
                <ModuleCertificates certificates={moduleCertificates} />
              </div>
            </div>
          </div>
          
          {/* Modules Grid Section */}
          <div className="animate-fade-in-up animation-delay-600">
            <ModulesGrid
              modules={filteredModules}
              loading={loading}
              onEnroll={handleEnroll}
              onStart={handleStart}
            />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}