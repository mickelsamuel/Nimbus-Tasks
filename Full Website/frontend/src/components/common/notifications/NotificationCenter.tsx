'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Filter, Search, CheckCircle, Archive, Star,
  Zap, Clock, Users, BookOpen, Trophy, Shield,
  Settings, Download, RefreshCw, SortAsc, SortDesc,
  Eye, EyeOff, Trash2, MoreHorizontal, X
} from 'lucide-react'
import { RichNotificationCard } from './RichNotificationCard'

interface NotificationCenterProps {
  userId: string
  className?: string
}

interface NotificationFilters {
  status: 'all' | 'unread' | 'read'
  type: 'all' | 'achievement' | 'module' | 'team' | 'system' | 'reminder' | 'social' | 'security'
  priority: 'all' | 'low' | 'medium' | 'high' | 'urgent'
  timeRange: 'all' | 'today' | 'week' | 'month'
  hasActions: boolean | null
}

export function NotificationCenter({ userId, className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'type'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed')
  
  const [filters, setFilters] = useState<NotificationFilters>({
    status: 'all',
    type: 'all',
    priority: 'all',
    timeRange: 'all',
    hasActions: null
  })

  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    byType: {},
    byPriority: {}
  })

  useEffect(() => {
    fetchNotifications()
    fetchStats()
  }, [userId, filters, sortBy, sortOrder])

  const fetchNotifications = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(filters.status !== 'all' && { isRead: String(filters.status === 'read') }),
        ...(filters.type !== 'all' && { category: filters.type }),
        ...(filters.priority !== 'all' && { priority: filters.priority }),
        sortBy,
        sortOrder: sortOrder === 'desc' ? '-1' : '1',
        limit: '100'
      })

      const response = await fetch(`/api/notifications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/notifications/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const refreshNotifications = async () => {
    setRefreshing(true)
    await Promise.all([fetchNotifications(), fetchStats()])
    setRefreshing(false)
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      )
      
      fetchStats()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
      
      fetchStats()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      setNotifications(prev => prev.filter(notif => notif._id !== id))
      fetchStats()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleBulkAction = async (action: 'read' | 'delete' | 'archive') => {
    if (selectedIds.length === 0) return

    try {
      const promises = selectedIds.map(id => {
        switch (action) {
          case 'read':
            return handleMarkAsRead(id)
          case 'delete':
            return handleDelete(id)
          default:
            return Promise.resolve()
        }
      })

      await Promise.all(promises)
      setSelectedIds([])
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const handleAction = async (notificationId: string, action: string) => {
    // Handle custom notification actions
    if (action.startsWith('/')) {
      window.location.href = action
    } else if (action.startsWith('http')) {
      window.open(action, '_blank')
    }
    
    // Mark as acted upon
    try {
      await fetch(`/api/notifications/${notificationId}/action`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
    } catch (error) {
      console.error('Error marking notification as acted upon:', error)
    }
  }

  const handleReaction = async (notificationId: string, emoji: string) => {
    try {
      await fetch(`/api/activity/${notificationId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ emoji })
      })
      
      // Update local state optimistically
      setNotifications(prev => 
        prev.map(notif => {
          if (notif._id === notificationId) {
            const reactions = [...(notif.reactions || [])]
            const existingReaction = reactions.find(r => r.emoji === emoji)
            
            if (existingReaction) {
              if (existingReaction.userReacted) {
                existingReaction.count--
                existingReaction.userReacted = false
                if (existingReaction.count === 0) {
                  reactions.splice(reactions.indexOf(existingReaction), 1)
                }
              } else {
                existingReaction.count++
                existingReaction.userReacted = true
              }
            } else {
              reactions.push({
                emoji,
                count: 1,
                users: [userId],
                userReacted: true
              })
            }
            
            return { ...notif, reactions }
          }
          return notif
        })
      )
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  const exportNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/export?format=csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `notifications-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting notifications:', error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !notification.title.toLowerCase().includes(query) &&
        !notification.message.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    if (filters.timeRange !== 'all') {
      const createdAt = new Date(notification.createdAt)
      const now = new Date()
      const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      
      if (filters.timeRange === 'today' && diffDays > 1) return false
      if (filters.timeRange === 'week' && diffDays > 7) return false
      if (filters.timeRange === 'month' && diffDays > 30) return false
    }

    if (filters.hasActions !== null) {
      const hasActions = notification.actions && notification.actions.length > 0
      if (filters.hasActions !== hasActions) return false
    }

    return true
  })

  const typeIcons = {
    achievement: Trophy,
    module: BookOpen,
    team: Users,
    system: Bell,
    reminder: Clock,
    social: Star,
    security: Shield
  }

  const priorityColors = {
    low: 'text-green-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notification Center
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {stats.unread > 0 
              ? `${stats.unread} unread notification${stats.unread > 1 ? 's' : ''}`
              : 'All caught up!'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={`Switch to ${viewMode === 'compact' ? 'detailed' : 'compact'} view`}
          >
            {viewMode === 'compact' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          
          <button
            onClick={refreshNotifications}
            disabled={refreshing}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={exportNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total - stats.unread}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.values(stats.byPriority).reduce((a, b) => (a as number) + (b as number), 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field as any)
              setSortOrder(order as any)
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="priority-desc">High Priority First</option>
            <option value="priority-asc">Low Priority First</option>
            <option value="type-asc">Type A-Z</option>
            <option value="type-desc">Type Z-A</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Actions */}
          {stats.unread > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Mark All Read
            </button>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Types</option>
                      <option value="achievement">Achievements</option>
                      <option value="module">Modules</option>
                      <option value="team">Teams</option>
                      <option value="system">System</option>
                      <option value="reminder">Reminders</option>
                      <option value="social">Social</option>
                      <option value="security">Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Range
                    </label>
                    <select
                      value={filters.timeRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.hasActions === true}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        hasActions: e.target.checked ? true : null 
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Has Actions Only
                    </span>
                  </label>

                  <button
                    onClick={() => setFilters({
                      status: 'all',
                      type: 'all',
                      priority: 'all',
                      timeRange: 'all',
                      hasActions: null
                    })}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedIds.length} notification{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('read')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                >
                  <CheckCircle className="h-3 w-3" />
                  Mark Read
                </button>
                
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
                
                <button
                  onClick={() => setSelectedIds([])}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-24" />
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || Object.values(filters).some(f => f !== 'all' && f !== null)
                ? 'Try adjusting your search or filters'
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
              >
                <RichNotificationCard
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  onAction={handleAction}
                  onReaction={handleReaction}
                  compact={viewMode === 'compact'}
                  showActions={true}
                  interactive={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}