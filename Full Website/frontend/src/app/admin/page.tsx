'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { RoleProtectedRoute } from '@/components/layout/protected'
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
  Database,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Download,
  RefreshCw,
  MoreHorizontal,
  type LucideIcon
} from 'lucide-react'

// Note: Could import API for future use
// import { adminAPI } from '@/lib/api/admin'

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
  points: number
}

interface Activity {
  id: string
  user: string
  action: string
  time: string
  type: 'completion' | 'warning' | 'social' | 'achievement' | 'system'
  details?: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch admin dashboard data from API
        // Note: These endpoints would need to be implemented in the backend
        
        // For now, show empty state until API is implemented
        setSystemMetrics([])
        setRecentUsers([])
        setRecentActivity([])
        
        // TODO: Implement API calls when admin endpoints are ready
        // const [metricsRes, usersRes, activityRes] = await Promise.all([
        //   adminAPI.getMetrics(),
        //   adminAPI.getRecentUsers(),
        //   adminAPI.getRecentActivity()
        // ])
        // setSystemMetrics(metricsRes.data)
        // setRecentUsers(usersRes.data)
        // setRecentActivity(activityRes.data)
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
        setSystemMetrics([])
        setRecentUsers([])
        setRecentActivity([])
      } finally {
        setLoading(false)
      }
    }

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

  const MetricCard = ({ metric, index }: { metric: SystemMetric; index: number }) => {
    const IconComponent = metric.icon
    const isPositive = metric.change > 0
    
    if (!IconComponent) return null
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 bg-white/80 dark:bg-gray-900/40 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 hover:shadow-2xl group"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${
            metric.status === 'healthy' ? 'from-green-400' :
            metric.status === 'warning' ? 'from-yellow-400' : 'from-red-400'
          } to-transparent`} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl transition-colors duration-300 bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50">
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
                className={`flex-1 rounded-sm transition-all duration-300 opacity-60 group-hover:opacity-100 ${
                  metric.status === 'healthy' ? 'bg-green-500' :
                  metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ height: `${(value / Math.max(...metric.trend)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  const UserCard = ({ user, index }: { user: AdminUser; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 bg-white/60 dark:bg-gray-800/30 hover:bg-white/80 dark:hover:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 hover:shadow-lg"
    >
      <div className="relative">
        <Image
          src={user.avatar}
          alt={user.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-xl object-cover"
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
    </motion.div>
  )

  const ActivityItem = ({ activity, index }: { activity: Activity; index: number }) => {
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
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/30"
      >
        <div className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50">
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
      </motion.div>
    )
  }

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <ProtectedLayout>
      <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-xl transition-colors duration-300 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors duration-300 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors duration-300 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="p-2 rounded-2xl backdrop-blur-xl border transition-colors duration-300 bg-white/80 dark:bg-gray-800/30 border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? `${getTabActiveStyles(tab.color)} shadow-lg`
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* System Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    [...Array(6)].map((_, index) => (
                      <div key={index} className="animate-pulse rounded-2xl h-40 bg-gray-200/50 dark:bg-gray-800/50" />
                    ))
                  ) : (
                    systemMetrics.map((metric, index) => (
                      <MetricCard key={metric.id} metric={metric} index={index} />
                    ))
                  )}
                </div>

                {/* Overview Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Users */}
                  <div className="rounded-2xl p-6 backdrop-blur-xl border transition-colors duration-300 bg-white/80 dark:bg-gray-900/40 border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Users
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg transition-colors duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </motion.button>
                    </div>
                    
                    <div className="space-y-3">
                      {loading ? (
                        [...Array(3)].map((_, index) => (
                          <div key={index} className="animate-pulse rounded-xl h-16 bg-gray-200/50 dark:bg-gray-800/50" />
                        ))
                      ) : (
                        recentUsers.map((user, index) => (
                          <UserCard key={user.id} user={user} index={index} />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-2xl p-6 backdrop-blur-xl border transition-colors duration-300 bg-white/80 dark:bg-gray-900/40 border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Activity
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg transition-colors duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </motion.button>
                    </div>
                    
                    <div className="space-y-2">
                      {loading ? (
                        [...Array(4)].map((_, index) => (
                          <div key={index} className="animate-pulse rounded-lg h-12 bg-gray-200/50 dark:bg-gray-800/50" />
                        ))
                      ) : (
                        recentActivity.map((activity, index) => (
                          <ActivityItem key={activity.id} activity={activity} index={index} />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other tabs - Coming Soon */}
            {activeTab !== 'overview' && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center min-h-96"
              >
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 border-2 border-gray-200/50 dark:border-gray-700/50">
                    {(() => {
                      const activeTabData = tabs.find(t => t.id === activeTab)
                      if (activeTabData?.icon) {
                        const IconComponent = activeTabData.icon
                        return (
                          <IconComponent className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                        )
                      }
                      return null
                    })()}
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">
                    {tabs.find(t => t.id === activeTab)?.description}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    This section is under development and will be available soon.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </ProtectedLayout>
    </RoleProtectedRoute>
  )
}