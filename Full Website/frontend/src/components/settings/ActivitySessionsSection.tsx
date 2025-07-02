'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSettingsContext } from '@/components/settings/SettingsProvider'
import { SettingsAPI } from '@/lib/api/settings'
import { 
  Activity, 
  MapPin, 
  Wifi, 
  Calendar, 
  Filter, 
  Download,
  LogOut,
  Shield,
  Monitor,
  Smartphone,
  Globe,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react'

interface DeviceInfo {
  browser?: string
  os?: string
}

interface Location {
  country?: string
  city?: string
  ip?: string
}

interface ActiveSession {
  sessionId: string
  deviceInfo?: DeviceInfo
  location?: Location
  lastActivity: string | Date
  isCurrent?: boolean
}

interface ActivityItem {
  _id: string
  action: string
  timestamp: string | Date
  ipAddress: string
  userAgent: string
  riskScore: number
  location?: Location
  deviceInfo?: DeviceInfo
}

const ActivitySessionsSection: React.FC = () => {
  const {
    activeSessions = [],
    sessionsLoading,
    activityLoading,
    loadSessions,
    loadActivity,
    terminateSession,
    terminateAllSessions,
    isLoading
  } = useSettingsContext()
  
  const [activityFilter, setActivityFilter] = useState('all')
  const [timeframe, setTimeframe] = useState('week')
  const [activityData, setActivityData] = useState<ActivityItem[]>([])
  
  // Handle activity export
  const handleExportActivity = async () => {
    try {
      const blob = await SettingsAPI.exportActivity({
        timeframe: timeframe as 'week' | 'month' | 'quarter' | 'year',
        format: 'csv'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `activity-export-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export activity:', error)
    }
  }

  // Load real activity data from API
  useEffect(() => {
    const fetchActivityData = async () => {
      if (!activityLoading && loadActivity) {
        try {
          const params = {
            timeframe: timeframe as 'day' | 'week' | 'month' | 'year',
            limit: 50
          };
          
          // Get activity data from API - loadActivity returns ActivityItem[] directly
          const activities = await loadActivity(params);
          if (activities && Array.isArray(activities)) {
            setActivityData(activities);
          }
        } catch (error) {
          console.error('Failed to load activity data:', error);
          // Set empty array on error instead of mock data
          setActivityData([]);
        }
      }
    };

    fetchActivityData();
  }, [activityLoading, timeframe, loadActivity])

  const filterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'security', label: 'Security Events' },
    { value: 'learning', label: 'Learning Activity' },
    { value: 'settings', label: 'Settings Changes' }
  ]

  const timeframeOptions = [
    { value: 'day', label: 'Last 24 hours' },
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
    { value: 'year', label: 'Last year' }
  ]

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
      case 'logout':
        return <LogOut className="h-4 w-4" />
      case 'password changed':
        return <Shield className="h-4 w-4" />
      case 'settings changed':
        return <Settings className="h-4 w-4" />
      case 'module completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 2) return 'text-green-600 bg-green-100'
    if (riskScore <= 4) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRiskLabel = (riskScore: number) => {
    if (riskScore <= 2) return 'Low Risk'
    if (riskScore <= 4) return 'Medium Risk'
    return 'High Risk'
  }

  const getDeviceIcon = (deviceInfo?: DeviceInfo) => {
    if (deviceInfo?.os?.toLowerCase().includes('mobile') || deviceInfo?.os?.toLowerCase().includes('ios') || deviceInfo?.os?.toLowerCase().includes('android')) {
      return <Smartphone className="h-4 w-4" />
    }
    return <Monitor className="h-4 w-4" />
  }

  const filteredActivity = activityData.filter(item => {
    if (activityFilter === 'all') return true
    if (activityFilter === 'security') return ['login', 'logout', 'password changed'].includes(item.action.toLowerCase())
    if (activityFilter === 'learning') return item.action.toLowerCase().includes('module')
    if (activityFilter === 'settings') return item.action.toLowerCase().includes('settings')
    return true
  })

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          Activity & Sessions
        </h2>
        <p className="text-gray-600">Monitor your account activity and manage active sessions</p>
      </motion.div>

      <div className="space-y-8">
        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Wifi className="h-5 w-5 text-red-600" />
              <h4 className="text-lg font-semibold text-gray-900">Active Sessions</h4>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadSessions}
                disabled={sessionsLoading || isLoading}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${sessionsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={terminateAllSessions}
                disabled={isLoading || activeSessions.length === 0}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-all disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 inline mr-1" />
                Terminate All
              </button>
            </div>
          </div>

          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin h-8 w-8 border-3 border-red-600 border-t-transparent rounded-full"></div>
                <div className="text-gray-600">Loading sessions...</div>
              </div>
            </div>
          ) : activeSessions.length === 0 ? (
            <div className="text-center py-8">
              <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <div className="text-gray-500 text-lg">No active sessions</div>
              <div className="text-gray-400 text-sm">All devices have been logged out</div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSessions.map((session: ActiveSession) => (
                <motion.div
                  key={session.sessionId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      {getDeviceIcon(session.deviceInfo)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">
                          {session.deviceInfo?.browser} on {session.deviceInfo?.os}
                        </div>
                        {session.isCurrent && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Current Session
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location?.city}, {session.location?.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {session.location?.ip}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Last active: {new Date(session.lastActivity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => terminateSession(session.sessionId)}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 transition-all disabled:opacity-50"
                    >
                      <LogOut className="h-3 w-3" />
                      Terminate
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-red-600" />
              <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => loadActivity()}
                disabled={activityLoading || isLoading}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${activityLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExportActivity}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500"
            >
              {timeframeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {activityLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin h-8 w-8 border-3 border-red-600 border-t-transparent rounded-full"></div>
                <div className="text-gray-600">Loading activity...</div>
              </div>
            </div>
          ) : filteredActivity.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <div className="text-gray-500 text-lg">No activity found</div>
              <div className="text-gray-400 text-sm">Try adjusting your filters</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivity.map((activity) => (
                <motion.div
                  key={activity._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                      {getActionIcon(activity.action)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-gray-900">{activity.action}</div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(activity.riskScore)}`}>
                          {getRiskLabel(activity.riskScore)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {activity.location?.city}, {activity.location?.country}
                        </span>
                        <span className="flex items-center gap-1">
                          {getDeviceIcon(activity.deviceInfo)}
                          {activity.deviceInfo?.browser}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        IP: {activity.ipAddress}
                      </div>
                    </div>
                  </div>
                  
                  {activity.riskScore > 3 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600 font-medium">Review Required</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-5 w-5 text-red-600" />
            <h4 className="text-lg font-semibold text-gray-900">Activity Summary</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredActivity.length}</div>
              <div className="text-sm text-gray-600">Total Actions</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredActivity.filter(a => a.riskScore <= 2).length}
              </div>
              <div className="text-sm text-gray-600">Safe Actions</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredActivity.filter(a => a.riskScore > 2 && a.riskScore <= 4).length}
              </div>
              <div className="text-sm text-gray-600">Medium Risk</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredActivity.filter(a => a.riskScore > 4).length}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ActivitySessionsSection