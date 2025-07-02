'use client'

import React, { createContext, useContext, useMemo, useCallback } from 'react'
import type { DashboardData } from '@/types/dashboard'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useErrorContext } from '@/contexts/ErrorContext'
import ErrorDisplay from '@/components/common/ErrorDisplay'
import RetryWrapper from '@/components/common/RetryWrapper'

interface DashboardDataContextValue {
  data: DashboardData
  loading: boolean
  error: string | null
  retry: () => void
  clearError: () => void
}

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null)

// Default empty data structure
const emptyDashboardData: DashboardData = {
  welcome: {
    greeting: 'Welcome',
    motivationalMessage: 'Start your learning journey today!',
    weatherAware: false,
    achievements: []
  },
  stats: {
    assignedModules: 0,
    inProgressModules: 0,
    completedModules: 0,
    xpEarned: 0,
    pointsEarned: 0,
    weeklyProgress: 0,
    streak: 0,
    level: 1,
    nextLevelProgress: 0
  },
  quickActions: [],
  learningProgress: {
    currentPath: '',
    completedModules: 0,
    totalModules: 0,
    estimatedCompletion: '',
    nextMilestone: '',
    xpGained: 0,
    xpToNextLevel: 0
  },
  recentActivity: [],
  teamActivity: [],
  insights: {
    weeklyPerformance: '0%',
    strongestSkill: '',
    improvementArea: '',
    recommendations: []
  }
}

interface DashboardDataProviderProps {
  children: React.ReactNode
  data?: DashboardData | null
  loading?: boolean
  error?: string | null
  onRetry?: () => Promise<void>
  showErrorBoundary?: boolean
}

export function DashboardDataProvider({ 
  children, 
  data = null, 
  loading = false, 
  error = null,
  onRetry,
  showErrorBoundary = true
}: DashboardDataProviderProps) {
  const { handleError } = useErrorHandler()
  const { clearError: clearGlobalError } = useErrorContext()
  
  const clearError = useCallback(() => {
    clearGlobalError('dashboard')
  }, [clearGlobalError])

  const retry = useCallback(async () => {
    if (onRetry) {
      try {
        clearError()
        await onRetry()
      } catch (err) {
        handleError(err, {
          context: 'Dashboard Retry',
          message: 'Failed to reload dashboard data'
        })
      }
    }
  }, [onRetry, clearError, handleError])

  const contextValue = useMemo(() => ({
    data: data || emptyDashboardData,
    loading,
    error,
    retry,
    clearError
  }), [data, loading, error, retry, clearError])

  const content = (
    <DashboardDataContext.Provider value={contextValue}>
      {children}
    </DashboardDataContext.Provider>
  )

  // Show error boundary if enabled and there's an error
  if (showErrorBoundary && error && onRetry) {
    return (
      <RetryWrapper
        onRetry={onRetry}
        errorMessage={error}
        maxRetries={3}
        autoRetry={false}
        className="min-h-[400px] flex items-center justify-center"
        fallback={
          <div className="text-center p-8">
            <ErrorDisplay
              error={error}
              loading={loading}
              retry={retry}
              onDismiss={clearError}
              variant="card"
              size="lg"
            />
          </div>
        }
      >
        {content}
      </RetryWrapper>
    )
  }

  return content
}

export function useDashboardContext() {
  const context = useContext(DashboardDataContext)
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardDataProvider')
  }
  return context
}