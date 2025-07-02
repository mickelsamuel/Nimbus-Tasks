'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, Users, Clock,
  MapPin, AlertTriangle, CheckCircle,
  Loader2
} from 'lucide-react'
import { useWorkspaces } from '@/hooks/useWorkspaces'


export function RoomUtilization() {
  const {
    roomMetrics,
    alerts,
    overallStats,
    loading,
    error,
    refreshMetrics
  } = useWorkspaces()

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week')
  const [selectedFloor, setSelectedFloor] = useState<'all' | number>('all')

  // Refresh data when period changes
  useEffect(() => {
    refreshMetrics(selectedPeriod)
  }, [selectedPeriod, refreshMetrics])

  const filteredMetrics = selectedFloor === 'all' 
    ? roomMetrics 
    : roomMetrics.filter(room => room.floor === selectedFloor)

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
    if (rate >= 60) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    if (rate >= 40) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
    return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
  }

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
      default: return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'underutilized': return <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      case 'overbooked': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
      case 'popular': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
      case 'maintenance': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      default: return <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    }
  }

  // Calculate fallback stats if API data is not available
  const calculatedStats = roomMetrics.length > 0 ? {
    totalRooms: roomMetrics.length,
    averageUtilization: Math.round(roomMetrics.reduce((acc, room) => acc + room.utilizationRate, 0) / roomMetrics.length),
    totalBookings: roomMetrics.reduce((acc, room) => acc + room.hoursBooked, 0),
    underutilizedRooms: roomMetrics.filter(room => room.utilizationRate < 50).length
  } : {
    totalRooms: 0,
    averageUtilization: 0,
    totalBookings: 0,
    underutilizedRooms: 0
  }

  const displayStats = overallStats || calculatedStats

  return (
    <div className="dashboard-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Room Utilization Analytics
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monitor workspace efficiency and usage patterns
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {displayStats.averageUtilization}% Avg
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedPeriod === period
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50'
              }`}
            >
              {loading && period === selectedPeriod && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFloor('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedFloor === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Floors
          </button>
          {[2, 3, 4, 5, 6].map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedFloor === floor
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Floor {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Rooms</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{displayStats.totalRooms}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Avg Utilization</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">{displayStats.averageUtilization}%</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Hours</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{displayStats.totalBookings}</div>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Underutilized</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{displayStats.underutilizedRooms}</div>
        </div>
      </div>

      {/* Room Metrics Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Performance</h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading room metrics...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Room</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Floor</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Capacity</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Utilization</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Avg Occupancy</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Peak Hours</th>
                </tr>
              </thead>
              <tbody>
                {roomMetrics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <div className="text-lg font-medium mb-2">No metrics available</div>
                      <div className="text-sm">Data will appear here when available</div>
                    </td>
                  </tr>
                ) : (
                  filteredMetrics.map((room) => (
                <tr key={room.roomId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">{room.roomName}</div>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{room.floor}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{room.capacity}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUtilizationColor(room.utilizationRate)}`}>
                      {room.utilizationRate}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-900 dark:text-white">{room.averageOccupancy}</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {room.peakHours.map((hour, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          {hour}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Alerts and Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alerts & Recommendations</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading alerts...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <div className="text-lg font-medium mb-1">All systems running smoothly</div>
                <div className="text-sm">No alerts or recommendations at this time</div>
              </div>
            ) : (
              alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.priority)}`}>
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{alert.roomName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                      alert.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    }`}>
                      {alert.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                </div>
              </div>
            </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}