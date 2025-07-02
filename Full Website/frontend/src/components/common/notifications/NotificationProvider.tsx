'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { NotificationToast } from './NotificationToast'

interface NotificationContextType {
  notifications: any[]
  unreadCount: number
  showToast: (notification: any) => void
  dismissToast: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  refreshNotifications: () => void
  isConnected: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
  userId?: string
  enableRealtime?: boolean
  toastPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}

export function NotificationProvider({ 
  children, 
  userId,
  enableRealtime = true,
  toastPosition = 'top-right',
  maxToasts = 5
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState([])
  const [toastNotifications, setToastNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!userId) return

    try {
      const [notificationsResponse, countResponse] = await Promise.all([
        fetch('/api/notifications?limit=50', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }),
        fetch('/api/notifications/unread-count', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
      ])

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json()
        setNotifications(notificationsData.data.notifications || [])
      }

      if (countResponse.ok) {
        const countData = await countResponse.json()
        setUnreadCount(countData.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }, [userId])

  // Set up real-time connection
  useEffect(() => {
    if (!enableRealtime || !userId) return

    const connectSocket = () => {
      const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')
      
      const socketInstance = io(serverUrl, {
        auth: {
          token
        },
        transports: ['websocket', 'polling'],
        forceNew: true
      })
      
      socketInstance.on('connect', () => {
        console.log('Socket.IO connected')
        setIsConnected(true)
        
        // Join user room for notifications
        socketInstance.emit('join-notification-room', userId)
      })

      socketInstance.on('notification', (notification) => {
        // Add new notification to state
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
        
        // Show toast notification
        showToast({
          id: notification._id,
          type: notification.type,
          importance: notification.importance || 'info',
          title: notification.title,
          message: notification.message,
          sender: notification.sender?.name,
          avatar: notification.sender?.avatar,
          timestamp: 'Just now',
          actions: notification.actions,
          interactive: notification.canInteract,
          persistent: notification.priority === 'urgent'
        })
      })

      socketInstance.on('notification-read', (data) => {
        // Update notification as read
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === data.notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      })

      socketInstance.on('all-notifications-read', () => {
        // Mark all as read
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        )
        setUnreadCount(0)
      })

      socketInstance.on('disconnect', () => {
        console.log('Socket.IO disconnected')
        setIsConnected(false)
      })

      socketInstance.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error)
        setIsConnected(false)
      })

      setSocket(socketInstance)
    }

    connectSocket()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [enableRealtime, userId, showToast, socket])

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Periodic refresh fallback
  useEffect(() => {
    if (!enableRealtime) {
      const interval = setInterval(fetchNotifications, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [enableRealtime, fetchNotifications])

  const showToast = useCallback((notification: any) => {
    const toastId = notification.id || `toast-${Date.now()}`
    
    setToastNotifications(prev => [
      {
        ...notification,
        id: toastId
      },
      ...prev.slice(0, maxToasts - 1)
    ])

    // Auto-dismiss if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        dismissToast(toastId)
      }, notification.duration || 5000)
    }
  }, [maxToasts, dismissToast])

  const dismissToast = useCallback((id: string) => {
    setToastNotifications(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const markAsRead = useCallback(async (id: string) => {
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
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
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
      
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [])

  const handleToastAction = useCallback(async (notificationId: string, action: string) => {
    try {
      // Handle different action types
      if (action === 'like') {
        await fetch(`/api/activity/${notificationId}/reaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({ emoji: '❤️' })
        })
      } else if (action === 'react') {
        await fetch(`/api/activity/${notificationId}/reaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({ emoji: '👍' })
        })
      } else if (action === 'view') {
        // Mark as read when viewing
        await markAsRead(notificationId)
      } else if (action.startsWith('/')) {
        // Internal navigation
        window.location.href = action
      } else if (action.startsWith('http')) {
        // External link
        window.open(action, '_blank')
      }
    } catch (error) {
      console.error('Error handling toast action:', error)
    }
  }, [markAsRead])

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    showToast,
    dismissToast,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
    isConnected
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Toast notifications */}
      <NotificationToast
        notifications={toastNotifications}
        onDismiss={dismissToast}
        onAction={handleToastAction}
        position={toastPosition}
        maxVisible={maxToasts}
      />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Hook for showing toast notifications
export function useToast() {
  const { showToast } = useNotifications()
  
  return {
    success: (title: string, message: string, options?: any) => 
      showToast({
        type: 'system',
        importance: 'success',
        title,
        message,
        ...options
      }),
    
    error: (title: string, message: string, options?: any) => 
      showToast({
        type: 'system',
        importance: 'error',
        title,
        message,
        persistent: true,
        ...options
      }),
    
    warning: (title: string, message: string, options?: any) => 
      showToast({
        type: 'system',
        importance: 'warning',
        title,
        message,
        ...options
      }),
    
    info: (title: string, message: string, options?: any) => 
      showToast({
        type: 'system',
        importance: 'info',
        title,
        message,
        ...options
      }),
    
    achievement: (title: string, message: string, options?: any) => 
      showToast({
        type: 'achievement',
        importance: 'success',
        title,
        message,
        persistent: true,
        interactive: true,
        ...options
      }),
    
    custom: (notification: any) => showToast(notification)
  }
}