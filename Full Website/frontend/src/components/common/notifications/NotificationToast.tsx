'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, CheckCircle, AlertCircle, Info, AlertTriangle, 
  Trophy, BookOpen, Users, Bell, MessageSquare, Shield,
  ExternalLink, Clock, Star, Heart, ThumbsUp
} from 'lucide-react'

interface ToastNotification {
  id: string
  type: 'achievement' | 'module' | 'team' | 'system' | 'reminder' | 'social' | 'security'
  importance: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    action: string
    style: 'primary' | 'secondary'
  }>
  avatar?: string
  sender?: string
  timestamp?: string
  interactive?: boolean
}

interface NotificationToastProps {
  notifications: ToastNotification[]
  onDismiss: (id: string) => void
  onAction: (id: string, action: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxVisible?: number
}

export function NotificationToast({ 
  notifications, 
  onDismiss, 
  onAction,
  position = 'top-right',
  maxVisible = 5
}: NotificationToastProps) {
  const [visible, setVisible] = useState<string[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    // Auto-dismiss non-persistent notifications
    notifications.forEach(notification => {
      if (!notification.persistent && !visible.includes(notification.id)) {
        setVisible(prev => [...prev, notification.id])
        
        const timer = setTimeout(() => {
          handleDismiss(notification.id)
        }, notification.duration || 5000)

        return () => clearTimeout(timer)
      }
    })
  }, [notifications])

  const handleDismiss = (id: string) => {
    setVisible(prev => prev.filter(vid => vid !== id))
    setTimeout(() => onDismiss(id), 300) // Allow animation to complete
  }

  const handleAction = (notificationId: string, action: string) => {
    onAction(notificationId, action)
    if (!notifications.find(n => n.id === notificationId)?.persistent) {
      handleDismiss(notificationId)
    }
  }

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    }
    return positions[position]
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      achievement: Trophy,
      module: BookOpen,
      team: Users,
      system: Bell,
      reminder: Clock,
      social: MessageSquare,
      security: Shield
    }
    return icons[type] || Bell
  }

  const getImportanceIcon = (importance: string) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle,
      info: Info
    }
    return icons[importance] || Info
  }

  const getImportanceColors = (importance: string) => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
    }
    return colors[importance] || colors.info
  }

  const getTypeColors = (type: string) => {
    const colors = {
      achievement: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
      module: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      team: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
      system: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400',
      reminder: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
      social: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400',
      security: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
    }
    return colors[type] || colors.system
  }

  const visibleNotifications = notifications
    .filter(n => visible.includes(n.id))
    .slice(0, maxVisible)

  return (
    <div className={`fixed z-50 pointer-events-none ${getPositionClasses()}`}>
      <div className="space-y-3 w-96 max-w-sm">
        <AnimatePresence>
          {visibleNotifications.map((notification, index) => {
            const TypeIcon = getTypeIcon(notification.type)
            const ImportanceIcon = getImportanceIcon(notification.importance)
            const isHovered = hoveredId === notification.id

            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ 
                  opacity: 0, 
                  y: position.includes('top') ? -50 : 50,
                  scale: 0.9 
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1 
                }}
                exit={{ 
                  opacity: 0, 
                  x: position.includes('right') ? 300 : -300,
                  scale: 0.9 
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  delay: index * 0.1 
                }}
                className={`pointer-events-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border ${getImportanceColors(notification.importance)} backdrop-blur-sm overflow-hidden`}
                onMouseEnter={() => setHoveredId(notification.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Progress bar for auto-dismiss */}
                {!notification.persistent && !isHovered && (
                  <motion.div
                    className="absolute top-0 left-0 h-1 bg-current opacity-30"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ 
                      duration: (notification.duration || 5000) / 1000,
                      ease: 'linear'
                    }}
                  />
                )}

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${getTypeColors(notification.type)}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <ImportanceIcon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {notification.title}
                          </h4>
                          
                          {notification.sender && (
                            <div className="flex items-center gap-2 mt-1">
                              {notification.avatar && (
                                <img
                                  src={notification.avatar}
                                  alt={notification.sender}
                                  className="w-4 h-4 rounded-full"
                                />
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                from {notification.sender}
                              </span>
                              {notification.timestamp && (
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  • {notification.timestamp}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleDismiss(notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex items-center gap-2">
                          {notification.actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => handleAction(notification.id, action.action)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                action.style === 'primary'
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                              }`}
                            >
                              {action.action.startsWith('http') && <ExternalLink className="h-3 w-3" />}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Interactive elements */}
                      {notification.interactive && (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => handleAction(notification.id, 'like')}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-3 w-3" />
                            <span>Like</span>
                          </button>
                          
                          <button
                            onClick={() => handleAction(notification.id, 'react')}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>React</span>
                          </button>
                          
                          <button
                            onClick={() => handleAction(notification.id, 'view')}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-500 transition-colors"
                          >
                            <Star className="h-3 w-3" />
                            <span>View</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover effects */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Overflow indicator */}
        {notifications.filter(n => visible.includes(n.id)).length > maxVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              +{notifications.filter(n => visible.includes(n.id)).length - maxVisible} more notifications
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}