'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, TrendingUp, TrendingDown, BarChart3, Users, Activity, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { RoleProtectedRoute } from '@/components/layout/protected'
import { adminAPI } from '@/lib/api/admin'
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from '@/components/admin/charts/SimpleChart'
import { SystemMetric } from '@/components/admin/types'

interface AnalyticsData {
  users?: {
    total: number
    active: number
    new: number
    trend: number
  }
  modules?: {
    total: number
    completed: number
    inProgress: number
    trend: number
  }
  engagement?: {
    dailyActive: number
    weeklyActive: number
    monthlyActive: number
    avgSessionTime: number
  }
  performance?: {
    avgCompletionRate: number
    avgScore: number
    avgTimeToComplete: number
  }
  totalUsers?: number
  activeThisWeek?: number
  modulesCompleted?: number
  userActivityTrend?: number[]
  modulePerformance?: { label: string; value: number; color: string }[]
  departmentStats?: { label: string; value: number; color: string }[]
}


export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<SystemMetric[]>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch analytics data
        const [analyticsResponse, metricsResponse] = await Promise.all([
          adminAPI.getAnalytics(),
          adminAPI.getSystemMetrics()
        ])
        
        setAnalyticsData(analyticsResponse as AnalyticsData)
        // Map API response to proper SystemMetric format
        const mappedMetrics: SystemMetric[] = (metricsResponse as unknown[]).map((metric: unknown) => {
          const metricObj = metric as Record<string, unknown>
          return {
            id: (metricObj.id as string) || Math.random().toString(36).substr(2, 9),
            label: (metricObj.label as string) || (metricObj.title as string) || (metricObj.name as string) || 'Unknown Metric',
            value: (metricObj.value as string | number) || 0,
            change: (metricObj.change as number) || 0,
            status: (metricObj.status as 'healthy' | 'warning' | 'critical') || 'healthy',
            trend: Array.isArray(metricObj.trend) ? (metricObj.trend as number[]) : [50, 60, 55, 70, 65, 80, 75],
            trendDirection: (metricObj.trendDirection as 'up' | 'down' | 'stable') || 'stable',
            lastUpdated: (metricObj.lastUpdated as string) || new Date().toISOString(),
            unit: metricObj.unit as string | undefined,
            icon: metricObj.icon as React.ComponentType<{ className?: string }> | undefined
          }
        })
        setMetrics(mappedMetrics)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setError('Failed to load analytics data. Please try again later.')
        
        // Fallback to basic structure for UI
        setMetrics([
          {
            id: '1',
            label: 'User Engagement',
            value: 'N/A',
            change: 0,
            status: 'healthy' as const,
            trend: [50, 60, 55, 70, 65, 80, 75],
            trendDirection: 'stable' as const,
            lastUpdated: new Date().toISOString(),
            icon: Users
          },
          {
            id: '2',
            label: 'Module Completion Rate',
            value: 'N/A',
            change: 0,
            status: 'healthy' as const,
            trend: [40, 50, 45, 60, 55, 70, 65],
            trendDirection: 'stable' as const,
            lastUpdated: new Date().toISOString(),
            icon: BarChart3
          },
          {
            id: '3',
            label: 'Average Session Time',
            value: 'N/A',
            change: 0,
            status: 'healthy' as const,
            trend: [30, 40, 35, 50, 45, 60, 55],
            trendDirection: 'stable' as const,
            lastUpdated: new Date().toISOString(),
            icon: Activity
          },
          {
            id: '4',
            label: 'Active Users',
            value: 'N/A',
            change: 0,
            status: 'healthy' as const,
            trend: [60, 70, 65, 80, 75, 90, 85],
            trendDirection: 'stable' as const,
            lastUpdated: new Date().toISOString(),
            icon: TrendingUp
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const handleExport = async () => {
    try {
      setError(null)
      const exportData = await adminAPI.exportData('analytics', 'json')
      
      const url = URL.createObjectURL(exportData)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      setError('Failed to export data. Please try again.')
      
      // Fallback to basic export
      const data = {
        timestamp: new Date().toISOString(),
        analytics: analyticsData,
        metrics: metrics,
        note: 'Exported during limited connectivity'
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin Dashboard
              </button>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Analytics & Reporting
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed insights and performance metrics
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Export Report
                </motion.button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-500">Error Loading Analytics</h3>
                    <p className="text-red-400">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Key Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                          {metric.icon && React.createElement(metric.icon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" })}
                        </div>
                        <div className="flex items-center gap-1">
                          {metric.trendDirection === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : metric.trendDirection === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : null}
                          {metric.change !== 0 && (
                            <span className={`text-sm font-medium ${
                              metric.trendDirection === 'up' ? 'text-green-500' : 
                              metric.trendDirection === 'down' ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {metric.change > 0 ? '+' : ''}{metric.change}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* User Activity Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
                  >
                    {analyticsData?.userActivityTrend ? (
                      <SimpleLineChart
                        data={analyticsData.userActivityTrend}
                        labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                        title="User Activity Trends"
                        color="bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    ) : (
                      <SimpleLineChart
                        data={[65, 78, 82, 88, 75, 92, 85]}
                        labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                        title="User Activity Trends"
                        color="bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    )}
                  </motion.div>

                  {/* Module Performance */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
                  >
                    {analyticsData?.modulePerformance ? (
                      <SimplePieChart
                        data={analyticsData.modulePerformance}
                        title="Module Performance"
                      />
                    ) : (
                      <SimplePieChart
                        data={[
                          { label: 'Completed', value: 75, color: '#10b981' },
                          { label: 'In Progress', value: 20, color: '#3b82f6' },
                          { label: 'Not Started', value: 5, color: '#ef4444' }
                        ]}
                        title="Module Performance"
                      />
                    )}
                  </motion.div>
                </div>

                {/* Additional Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
                >
                  {analyticsData?.departmentStats ? (
                    <SimpleBarChart
                      data={analyticsData.departmentStats}
                      title="Training Progress by Department"
                    />
                  ) : (
                    <SimpleBarChart
                      data={[
                        { label: 'IT', value: 95, color: 'bg-blue-500' },
                        { label: 'Finance', value: 87, color: 'bg-green-500' },
                        { label: 'HR', value: 92, color: 'bg-purple-500' },
                        { label: 'Sales', value: 78, color: 'bg-yellow-500' },
                        { label: 'Marketing', value: 83, color: 'bg-red-500' }
                      ]}
                      title="Training Progress by Department"
                    />
                  )}
                </motion.div>

                {/* Detailed Statistics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Detailed Statistics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {analyticsData?.totalUsers || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Users
                      </div>
                    </div>
                    
                    <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {analyticsData?.activeThisWeek || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Active This Week
                      </div>
                    </div>
                    
                    <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {analyticsData?.modulesCompleted || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Modules Completed
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </ProtectedLayout>
    </RoleProtectedRoute>
  )
}