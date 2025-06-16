'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { useTranslation } from '@/contexts/TranslationContext'
import api from '@/lib/api/client'
import { 
  Bell, 
  Check, 
  X, 
  Archive, 
  Filter, 
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Users,
  BookOpen,
  Trophy
} from 'lucide-react'

interface Notification {
  _id: string
  type: 'achievement' | 'module' | 'team' | 'system' | 'reminder' | 'social'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  metadata?: {
    achievementId?: string
    moduleId?: string
    teamId?: string
    userId?: string
  }
}

const typeIcons = {
  achievement: Trophy,
  module: BookOpen,
  team: Users,
  system: AlertCircle,
  reminder: Bell,
  social: Star
}

const typeColors = {
  achievement: 'text-yellow-500',
  module: 'text-blue-500',
  team: 'text-green-500',
  system: 'text-red-500',
  reminder: 'text-purple-500',
  social: 'text-pink-500'
}

const priorityColors = {
  low: 'border-l-gray-400',
  medium: 'border-l-yellow-400',
  high: 'border-l-red-400'
}

export default function NotificationsPage() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await api.get('/notifications')
      setNotifications(response.data.notifications || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`)
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      // Optimistic update - mark as read locally
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      )
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read')
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      // Optimistic update - mark all as read locally
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}`)
      setNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      )
    } catch (error) {
      console.error('Failed to delete notification:', error)
      // Optimistic update - remove from local state
      setNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      )
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    // Filter by read status
    if (filter === 'unread' && notif.isRead) return false
    if (filter === 'read' && !notif.isRead) return false
    
    // Filter by type
    if (typeFilter !== 'all' && notif.type !== typeFilter) return false
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return notif.title.toLowerCase().includes(query) ||
             notif.message.toLowerCase().includes(query)
    }
    
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter by read status */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All notifications</option>
              <option value="unread">Unread only</option>
              <option value="read">Read only</option>
            </select>

            {/* Filter by type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All types</option>
              <option value="achievement">Achievements</option>
              <option value="module">Modules</option>
              <option value="team">Teams</option>
              <option value="system">System</option>
              <option value="reminder">Reminders</option>
              <option value="social">Social</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {notifications.length === 0 
                  ? "You're all caught up! No new notifications."
                  : "Try adjusting your filters to see more notifications."
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const IconComponent = typeIcons[notification.type] || Bell
              
              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${priorityColors[notification.priority]} border-r border-t border-b border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 ${typeColors[notification.type]}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : notification.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.priority}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {notification.type}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              title="Mark as read"
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="View details"
                            >
                              <Info className="h-4 w-4" />
                            </a>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            title="Delete notification"
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}