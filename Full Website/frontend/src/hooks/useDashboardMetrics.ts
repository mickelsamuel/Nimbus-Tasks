'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'

interface MetricTrends {
  completedModules: number[]
  inProgressModules: number[]
  streak: number[]
  weeklyProgress: number[]
}

interface WalletHistory {
  currentBalance: number
  history: Array<{
    date: string
    amount: number
    type: string
    description: string
  }>
  statistics: {
    totalEarnings: number
    dailyAverage: number
    weeklyGrowth: number
    transactionCount: number
  }
}

export function useDashboardMetrics() {
  const [trends, setTrends] = useState<MetricTrends | null>(null)
  const [walletHistory, setWalletHistory] = useState<WalletHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetricsTrends = async (days: number = 7) => {
    try {
      const response = await apiClient.get(`/dashboard/metrics/trends?days=${days}`)
      if (response.data?.success) {
        setTrends(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching metrics trends:', err)
      setError('Failed to fetch metrics trends')
    }
  }

  const fetchWalletHistory = async (days: number = 30) => {
    try {
      const response = await apiClient.get(`/dashboard/wallet/history?days=${days}`)
      if (response.data?.success) {
        setWalletHistory(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching wallet history:', err)
      setError('Failed to fetch wallet history')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        await Promise.all([
          fetchMetricsTrends(),
          fetchWalletHistory()
        ])
      } catch (err) {
        setError('Failed to fetch dashboard metrics')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    trends,
    walletHistory,
    loading,
    error,
    refetch: () => {
      fetchMetricsTrends()
      fetchWalletHistory()
    }
  }
}