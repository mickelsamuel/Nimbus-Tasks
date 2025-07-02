'use client'

import { useState, useEffect, useCallback } from 'react'
import { modulesApi } from '@/lib/api/modules'
import { Module, ModuleFilters } from '@/types/modules'

export const useModules = (initialFilters: ModuleFilters = {}) => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ModuleFilters>(initialFilters)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    difficulties: [] as string[],
    rarities: [] as string[]
  })

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await modulesApi.getModules(filters)
      
      if (response.success) {
        setModules(response.modules)
        setPagination(response.pagination)
        setAvailableFilters(response.filters)
      } else {
        setError('Failed to fetch modules')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching modules:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<ModuleFilters>) => {
    const resetPage = !newFilters.page // Reset page unless explicitly setting page
    setFilters(prev => ({ ...prev, ...newFilters, ...(resetPage && { page: 1 }) }))
  }, [])

  const loadMore = useCallback(async () => {
    if (pagination.page >= pagination.pages || loading) return
    
    try {
      setLoading(true)
      const nextPage = pagination.page + 1
      const response = await modulesApi.getModules({ ...filters, page: nextPage })
      
      if (response.success) {
        setModules(prev => [...prev, ...response.modules])
        setPagination(response.pagination)
      }
    } catch (err) {
      console.error('Error loading more modules:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination, loading])

  const enrollInModule = useCallback(async (moduleId: number) => {
    try {
      const response = await modulesApi.enrollInModule(moduleId)
      if (response.success) {
        // Refresh modules to get updated enrollment status
        fetchModules()
        return true
      }
      return false
    } catch (err) {
      console.error('Error enrolling in module:', err)
      return false
    }
  }, [fetchModules])

  const updateProgress = useCallback(async (
    moduleId: number, 
    chapterId: number, 
    completed: boolean
  ) => {
    try {
      const response = await modulesApi.updateProgress(moduleId, chapterId, completed)
      if (response.success) {
        // Update the module progress locally
        setModules(prev => prev.map(module => {
          if (module.id === moduleId && module.userProgress) {
            const completedChapters = completed
              ? [...module.userProgress.completedChapters, String(chapterId)]
              : module.userProgress.completedChapters.filter(id => id !== String(chapterId))
            
            const progress = Math.round((completedChapters.length / module.chapters.length) * 100)
            
            return {
              ...module,
              userProgress: {
                ...module.userProgress,
                progress,
                completedChapters
              }
            }
          }
          return module
        }))
        return true
      }
      return false
    } catch (err) {
      console.error('Error updating progress:', err)
      return false
    }
  }, [])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  return {
    modules,
    loading,
    error,
    filters,
    pagination,
    availableFilters,
    updateFilters,
    enrollInModule,
    updateProgress,
    loadMore,
    refetch: fetchModules
  }
}