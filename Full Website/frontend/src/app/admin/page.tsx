'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { RoleProtectedRoute } from '@/components/layout/protected'
import UserManagement from '@/components/admin/UserManagement'
import { api } from '@/lib/api/client'
import { 
  Monitor,
  Users,
  GraduationCap,
  Store,
  Trophy,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  MoreHorizontal,
  type LucideIcon
} from 'lucide-react'

interface AdminTab {
  id: string
  label: string
  icon: LucideIcon
  color: string
  description: string
}

interface SystemMetric {
  id: string
  label: string
  value: number | string
  change: number
  status: 'healthy' | 'warning' | 'critical'
  trend: number[]
  unit?: string
  icon?: LucideIcon
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  lastActive: string
  avatar: string
  department: string
  joinDate: string
  completionRate: number
  xp: number
}

interface Activity {
  id: string
  user: string
  action: string
  time: string
  type: 'completion' | 'warning' | 'social' | 'achievement' | 'system'
  details?: string
}

interface RawUserData {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  status?: string
  lastLogin?: string
  avatar?: string
  department?: string
  createdAt?: string
  completionRate?: number
  stats?: {
    completionRate?: number
    xp?: number
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAdminData = async () => {
      try {
        setLoading(true)
        
        try {
          const [metricsRes, usersRes, activityRes] = await Promise.all([
            api.get('/admin/metrics'),
            api.get('/admin/users'),
            api.get('/admin/activity')
          ])
          
          const metrics = metricsRes.data
          const users = usersRes.data
          const activity = activityRes.data
          
          if (metrics.success && metrics.data) {
            const mappedMetrics = metrics.data.map((metric: SystemMetric & { icon?: string }) => ({
              ...metric,
              icon: metric.icon === 'Users' ? Users :
                    metric.icon === 'Activity' ? Activity :
                    metric.icon === 'TrendingUp' ? TrendingUp :
                    metric.icon === 'GraduationCap' ? GraduationCap :
                    Users
            }))
            setSystemMetrics(mappedMetrics)
          } else {
            setSystemMetrics([
              {
                id: 'api-status',
                label: 'API Status',
                value: 'Connected',
                change: 0,
                status: 'healthy' as const,
                trend: [0, 0, 0, 0, 0, 0, 0],
                icon: Activity
              }
            ])
          }
          
          if (users.success && users.data?.users) {
            const transformedUsers = users.data.users.map((user: RawUserData) => ({
              id: user._id,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
              email: user.email || 'N/A',
              role: user.role || 'employee',
              status: user.status || 'active',
              lastActive: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
              avatar: user.avatar || '/avatars/default.jpg',
              department: user.department || 'General',
              joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
              completionRate: user.completionRate || 0,
              xp: user.stats?.xp || 0
            }))
            setRecentUsers(transformedUsers)
          } else {
            setRecentUsers([])
          }
          
          if (activity.success && activity.data) {
            setRecentActivity(activity.data)
          } else {
            setRecentActivity([])
          }
        } catch (apiError) {
          console.error('Admin API error:', apiError)
          setSystemMetrics([
            {
              id: 'api-status',
              label: 'API Status',
              value: 'Unavailable',
              change: 0,
              status: 'critical' as const,
              trend: [0, 0, 0, 0, 0, 0, 0],
              icon: AlertTriangle
            }
          ])
          setRecentUsers([])
          setRecentActivity([])
        }
      } catch (error) {
        setSystemMetrics([])
        setRecentUsers([])
        setRecentActivity([])
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const tabs: AdminTab[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Monitor, 
      color: 'blue',
      description: 'System overview and key metrics'
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      color: 'green',
      description: 'Manage users, roles, and permissions'
    },
    { 
      id: 'training', 
      label: 'Training Center', 
      icon: GraduationCap, 
      color: 'purple',
      description: 'Manage courses and training programs'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      color: 'orange',
      description: 'Detailed analytics and reporting'
    },
    { 
      id: 'commerce', 
      label: 'Commerce', 
      icon: Store, 
      color: 'emerald',
      description: 'Shop management and transactions'
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: Trophy, 
      color: 'yellow',
      description: 'Achievement system configuration'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield, 
      color: 'red',
      description: 'Security settings and monitoring'
    },
    { 
      id: 'settings', 
      label: 'System Settings', 
      icon: Settings, 
      color: 'gray',
      description: 'System configuration and preferences'
    }
  ]

  const getTabActiveStyles = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/50'
      case 'green':
        return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/50'
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/50'
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/50'
      case 'emerald':
        return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/50'
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/50'
      case 'red':
        return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/50'
      case 'gray':
        return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/50'
      default:
        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/50'
    }
  }

  // Helper component for displaying user avatars
  const UserAvatar = ({ src, alt, size = 48 }: { src: string, alt: string, size?: number }) => {
    // Check if the avatar is a 3D model (GLB file)
    const is3DAvatar = src && (src.endsWith('.glb') || src.includes('readyplayer.me'))
    const fallbackAvatar = '/avatars/default.jpg'
    
    if (is3DAvatar) {
      // For 3D avatars, show a placeholder or fallback image
      return (
        <div 
          className={`bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center`}
          style={{ width: size, height: size }}
        >
          <span className="text-white font-semibold text-lg">
            {alt ? alt.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
      )
    }
    
    return (
      <Image
        src={src || fallbackAvatar}
        alt={alt}
        width={size}
        height={size}
        className={`w-${size/4} h-${size/4} rounded-xl object-cover`}
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallbackAvatar
        }}
      />
    )
  }

  const MetricCard = ({ metric }: { metric: SystemMetric }) => {
    const IconComponent = metric.icon
    const isPositive = metric.change > 0
    
    if (!IconComponent) return null
    
    return (
      <div className="relative overflow-hidden rounded-2xl p-6 border transition-all duration-200 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute inset-0 bg-gradient-to-br ${
            metric.status === 'healthy' ? 'from-green-400' :
            metric.status === 'warning' ? 'from-yellow-400' : 'from-red-400'
          } to-transparent`} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
              <IconComponent className={`h-6 w-6 ${
                metric.status === 'healthy' ? 'text-green-500' :
                metric.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
              }`} />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositive
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              <TrendingUp className={`h-3 w-3 ${isPositive ? '' : 'rotate-180'}`} />
              {Math.abs(metric.change)}%
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {metric.label}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>
          </div>
          
          {/* Mini trend chart */}
          <div className="mt-4 flex items-end space-x-1 h-6">
            {metric.trend.map((value, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-sm ${
                  metric.status === 'healthy' ? 'bg-green-500' :
                  metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ height: `${(value / Math.max(...metric.trend)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const UserCard = ({ user }: { user: AdminUser }) => (
    <div className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-md">
      <div className="relative">
        <UserAvatar
          src={user.avatar}
          alt={user.name}
          size={48}
        />
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
          user.status === 'active' ? 'bg-green-500' :
          user.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate text-gray-900 dark:text-white">
          {user.name}
        </h4>
        <p className="text-sm truncate text-gray-600 dark:text-gray-400">
          {user.department} • {user.role}
        </p>
      </div>
      
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {user.completionRate}%
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {user.lastActive}
        </div>
      </div>
    </div>
  )

  const ActivityItem = ({ activity }: { activity: Activity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'completion': return CheckCircle
        case 'warning': return AlertTriangle
        case 'social': return Users
        case 'achievement': return Trophy
        case 'system': return Settings
        default: return Activity
      }
    }

    const getActivityColor = () => {
      switch (activity.type) {
        case 'completion': return 'text-green-500'
        case 'warning': return 'text-yellow-500'
        case 'social': return 'text-blue-500'
        case 'achievement': return 'text-purple-500'
        case 'system': return 'text-gray-500'
        default: return 'text-slate-500'
      }
    }

    const IconComponent = getActivityIcon()

    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          <IconComponent className={`h-4 w-4 ${getActivityColor()}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {activity.user}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {activity.action}
          </p>
          {activity.details && (
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              {activity.details}
            </p>
          )}
        </div>
        
        <div className="text-xs whitespace-nowrap text-gray-600 dark:text-gray-400">
          {activity.time}
        </div>
      </div>
    )
  }

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      System administration and management
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setLoading(true)
                      fetchAdminData()
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const data = {
                        timestamp: new Date().toISOString(),
                        metrics: systemMetrics,
                        users: recentUsers,
                        activity: recentActivity
                      }
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="p-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  const isActive = activeTab === tab.id
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive
                          ? `${getTabActiveStyles(tab.color)} shadow-lg`
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* System Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    [...Array(6)].map((_, index) => (
                      <div key={index} className="rounded-2xl h-40 bg-gray-200 dark:bg-gray-800" />
                    ))
                  ) : (
                    systemMetrics.map((metric) => (
                      <MetricCard key={metric.id} metric={metric} />
                    ))
                  )}
                </div>

                {/* Overview Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Users */}
                  <div className="rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Users
                      </h2>
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {loading ? (
                        [...Array(3)].map((_, index) => (
                          <div key={index} className="rounded-xl h-16 bg-gray-200 dark:bg-gray-800" />
                        ))
                      ) : (
                        recentUsers.map((user) => (
                          <UserCard key={user.id} user={user} />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Activity
                      </h2>
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {loading ? (
                        [...Array(4)].map((_, index) => (
                          <div key={index} className="rounded-lg h-12 bg-gray-200 dark:bg-gray-800" />
                        ))
                      ) : (
                        recentActivity.map((activity) => (
                          <ActivityItem key={activity.id} activity={activity} />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <UserManagement />
            )}

            {/* Other tabs content - simplified placeholder */}
            {activeTab !== 'overview' && activeTab !== 'users' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tabs.find(tab => tab.id === activeTab)?.description}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-center py-12">
                    {tabs.find(tab => tab.id === activeTab)?.icon && (
                      <div className="mb-4">
                        {React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                          className: "h-16 w-16 text-gray-400 mx-auto"
                        })}
                      </div>
                    )}
                    <p className="text-gray-500 text-lg mb-2">{tabs.find(tab => tab.id === activeTab)?.label} Interface</p>
                    <p className="text-gray-400 text-sm">This section is available for administrative management</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ProtectedLayout>
    </RoleProtectedRoute>
  )
}