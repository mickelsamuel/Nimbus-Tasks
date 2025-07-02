'use client'

import { useState, useEffect, useCallback } from 'react'
import { SimulationData, SimulationHookReturn, TradeOrder } from '@/types/simulation'
import api from '@/lib/api/client'

export function useSimulationData(): SimulationHookReturn {
  const [data, setData] = useState<SimulationData>({
    marketData: null,
    portfolio: null,
    loading: true,
    error: null
  })

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await api.get('/simulation/market')
      
      if (response.data.success) {
        setData(prev => ({
          ...prev,
          marketData: response.data.data,
          error: null
        }))
      } else {
        setData(prev => ({
          ...prev,
          error: 'Failed to fetch market data'
        }))
      }
    } catch (error) {
      console.error('Market data fetch error:', error)
      setData(prev => ({
        ...prev,
        error: 'Network error fetching market data'
      }))
    }
  }, [])

  const fetchPortfolio = useCallback(async () => {
    try {
      const response = await api.get('/simulation/portfolio')
      
      if (response.data.success) {
        setData(prev => ({
          ...prev,
          portfolio: response.data.portfolio,
          error: null
        }))
      } else {
        setData(prev => ({
          ...prev,
          error: 'Failed to fetch portfolio data'
        }))
      }
    } catch (error) {
      console.error('Portfolio fetch error:', error)
      setData(prev => ({
        ...prev,
        error: 'Network error fetching portfolio data'
      }))
    }
  }, [])

  const executeOrder = useCallback(async (order: TradeOrder) => {
    try {
      const response = await api.post('/simulation/order', order)
      
      if (response.data.success) {
        // Update portfolio with new data
        setData(prev => ({
          ...prev,
          portfolio: response.data.portfolio,
          error: null
        }))
        return { success: true, data: response.data }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Order execution error:', error)
      return { success: false, error: 'Network error executing order' }
    }
  }, [])

  const refreshData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true }))
    await Promise.all([fetchMarketData(), fetchPortfolio()])
    setData(prev => ({ ...prev, loading: false }))
  }, [fetchMarketData, fetchPortfolio])

  // Initial data fetch
  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Set up real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData()
      fetchPortfolio()
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [fetchMarketData, fetchPortfolio])

  return {
    ...data,
    executeOrder,
    refreshData
  }
}