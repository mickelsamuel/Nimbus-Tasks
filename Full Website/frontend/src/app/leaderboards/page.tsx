'use client'

import React, { useState, useEffect } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import LeaderboardsContainer from '@/components/leaderboards/LeaderboardsContainer'
import { getAllLeaderboards, getLeaderboardAnalytics, type LeaderboardData } from '@/lib/api/leaderboards'

export interface AnalyticsData {
  competitionIntensity: number
  achievementVelocity: number
  activeCompetitors: number
  leadingDepartment: string
  departmentAverageScore: number
  competitorsTrend?: string
  userRank?: number
  userPercentile?: string
  weeklyXP?: number
  weeklyTrend?: string
  recentActivities: Array<{
    id: string
    user: string
    action: string
    time: string
    icon: string
  }>
  topPerformers: Array<{
    id: string
    name: string
    score: number
    change: number
    department: string
  }>
}

const tabConfigs = [
  { id: 'global', label: 'Global Leaderboard', icon: '🌍', count: 0, description: 'Company-wide rankings' },
  { id: 'department', label: 'Department Rankings', icon: '🏢', count: 0, description: 'Departmental competition' },
  { id: 'team', label: 'Team Standings', icon: '👥', count: 0, description: 'Team-based performance' },
  { id: 'achievements', label: 'Achievement Leaders', icon: '🏅', count: 0, description: 'Top achievement earners' },
  { id: 'liveEvents', label: 'Live Competitions', icon: '⚡', count: 0, description: 'Real-time events' },
  { id: 'seasonal', label: 'Seasonal Champions', icon: '🎯', count: 0, description: 'Seasonal challenges' }
]

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState('global')
  const [timeframe, setTimeframe] = useState('month')
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liveUpdateActive, setLiveUpdateActive] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Update tab counts when data changes
  const tabs = tabConfigs.map(tab => ({
    ...tab,
    count: leaderboardData ? leaderboardData[tab.id as keyof LeaderboardData]?.length || 0 : 0
  }))

  // Retry function for failed requests
  const retryFetch = () => {
    setRetryCount(prev => prev + 1)
    setError(null)
  }

  // Fetch data on component mount, timeframe change, and retry
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch leaderboards and analytics in parallel
        const [leaderboards, analytics] = await Promise.allSettled([
          getAllLeaderboards(),
          getLeaderboardAnalytics()
        ])
        
        // Handle leaderboards result
        if (leaderboards.status === 'fulfilled') {
          setLeaderboardData(leaderboards.value)
        } else {
          console.error('Failed to fetch leaderboards:', leaderboards.reason)
          // Set empty data structure instead of null for better UX
          setLeaderboardData({
            global: [],
            department: [],
            team: [],
            achievements: [],
            liveEvents: [],
            seasonal: []
          })
        }
        
        // Handle analytics result
        if (analytics.status === 'fulfilled') {
          setAnalyticsData(analytics.value)
        } else {
          console.error('Failed to fetch analytics:', analytics.reason)
          // Set undefined to let components handle the missing analytics gracefully
          setAnalyticsData(undefined)
        }

        // If both requests failed, show error state
        if (leaderboards.status === 'rejected' && analytics.status === 'rejected') {
          setError('Failed to load leaderboard data. Please check your connection and try again.')
        }
        
      } catch (error) {
        console.error('Unexpected error fetching leaderboard data:', error)
        setError('An unexpected error occurred. Please try again later.')
        
        // Set empty data structure for graceful degradation
        setLeaderboardData({
          global: [],
          department: [],
          team: [],
          achievements: [],
          liveEvents: [],
          seasonal: []
        })
        setAnalyticsData(undefined)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [timeframe, retryCount])

  // Real-time updates - only when live updates are enabled and we have data
  useEffect(() => {
    if (!liveUpdateActive || !leaderboardData) return

    const fetchLiveUpdates = async () => {
      try {
        // Fetch fresh data without changing loading state
        const updatedData = await getAllLeaderboards()
        setLeaderboardData(updatedData)
      } catch (error) {
        // Silently handle live update failures to avoid disrupting UX
        if (process.env.NODE_ENV === 'development') {
          console.warn('Live update failed:', error)
        }
      }
    }

    // Set up periodic live updates every 30 seconds
    const interval = setInterval(fetchLiveUpdates, 30000)

    return () => clearInterval(interval)
  }, [liveUpdateActive, leaderboardData])

  const currentData = leaderboardData ? leaderboardData[activeTab as keyof LeaderboardData] : []

  return (
    <ProtectedLayout>
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
            <button
              onClick={retryFetch}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-800 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <LeaderboardsContainer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        tabs={tabs}
        leaderboardData={currentData}
        analyticsData={analyticsData}
        loading={loading}
        liveUpdateActive={liveUpdateActive}
        onLiveUpdateToggle={setLiveUpdateActive}
        topThree={leaderboardData && leaderboardData.global.length >= 3 ? {
          first: leaderboardData.global[0],
          second: leaderboardData.global[1],
          third: leaderboardData.global[2]
        } : undefined}
      />
    </ProtectedLayout>
  )
}