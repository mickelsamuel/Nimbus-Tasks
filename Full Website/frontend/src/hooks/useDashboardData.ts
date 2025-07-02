'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import api from '@/lib/api/client'
import type { DashboardData } from '@/types/dashboard'
import { useTranslation } from '@/contexts/TranslationContext'

interface UseDashboardDataReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardData(): UseDashboardDataReturn {
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const cacheRef = useRef<{ data: DashboardData; timestamp: number } | null>(null)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh && cacheRef.current) {
      const { data: cachedData, timestamp } = cacheRef.current
      if (Date.now() - timestamp < CACHE_DURATION) {
        setData(cachedData)
        setLoading(false)
        return
      }
    }

    try {
      setLoading(true)
      setError(null)
      
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController()
      
      const response = await api.get('/dashboard', {
        signal: abortControllerRef.current.signal
      })
      
      const dashboardData = response.data
      
      // Ensure all required properties exist with fallbacks
      if (dashboardData) {
        // Add pointsEarned fallback
        if (dashboardData.stats && !dashboardData.stats.pointsEarned) {
          dashboardData.stats.pointsEarned = dashboardData.stats.xpEarned || 0
        }
        
        // Add points property to activities if missing
        if (dashboardData.recentActivity) {
          dashboardData.recentActivity = dashboardData.recentActivity.map((activity: any) => ({
            ...activity,
            points: activity.points || activity.xp || 0
          }))
        }
        
        if (dashboardData.teamActivity) {
          dashboardData.teamActivity = dashboardData.teamActivity.map((activity: any) => ({
            ...activity,
            points: activity.points || activity.xp || 0
          }))
        }
      }
      
      setData(dashboardData)
      
      // Cache the data
      cacheRef.current = {
        data: dashboardData,
        timestamp: Date.now()
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        console.log('Request was cancelled - this is normal during development')
        return // Request was cancelled, don't update state
      }
      console.error('Failed to fetch dashboard data:', err)
      setError(t('dashboard.errors.dataFetchFailed') || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [t, CACHE_DURATION])

  useEffect(() => {
    fetchDashboardData()
    
    // Cleanup function to cancel ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchDashboardData])

  const refetch = async () => {
    await fetchDashboardData(true) // Force refresh
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}