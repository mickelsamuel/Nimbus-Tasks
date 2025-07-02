'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Clock, Check, Star, MessageSquare, ExternalLink,
  ChevronRight, Info, AlertTriangle, CheckCircle, AlertCircle,
  Trophy, BookOpen, Users, Bell, Calendar, Shield, Zap,
  ThumbsUp, ThumbsDown, Share2, Archive, Bookmark,
  Play, Pause, Download, Eye, Heart, User
} from 'lucide-react'

interface NotificationAction {
  type: 'button' | 'link'
  label: string
  action: string
  style: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  external?: boolean
  icon?: string
}

interface NotificationData {
  _id: string
  type: 'achievement' | 'module' | 'team' | 'system' | 'reminder' | 'social' | 'security'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  importance: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  timeAgo: string
  actions?: NotificationAction[]
  relatedEntity?: {
    type: string
    id: string
    data: any
  }
  sender?: {
    id: string
    name: string
    avatar: string
  }
  metadata?: any
  reactions?: Array<{
    emoji: string
    count: number
    users: string[]
    userReacted?: boolean
  }>
  canInteract?: boolean
}

interface RichNotificationCardProps {
  notification: NotificationData
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onAction: (notificationId: string, action: string) => void
  onReaction: (notificationId: string, emoji: string) => void
  compact?: boolean
  showActions?: boolean
  interactive?: boolean
}

export function RichNotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onAction,
  onReaction,
  compact = false,
  showActions = true,
  interactive = true
}: RichNotificationCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [archived, setArchived] = useState(false)

  const getTypeIcon = (type: string) => {
    const icons = {
      achievement: Trophy,
      module: BookOpen,
      team: Users,
      system: AlertCircle,
      reminder: Bell,
      social: MessageSquare,
      security: Shield
    }
    return icons[type] || Bell
  }

  const getTypeColor = (type: string) => {
    const colors = {
      achievement: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
      module: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      team: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      system: 'text-red-500 bg-red-100 dark:bg-red-900/30',
      reminder: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
      social: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30',
      security: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
    }
    return colors[type] || 'text-gray-500 bg-gray-100 dark:bg-gray-700'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'border-l-green-400',
      medium: 'border-l-blue-400',
      high: 'border-l-orange-400',
      urgent: 'border-l-red-400'
    }
    return colors[priority] || 'border-l-gray-400'
  }

  const getImportanceIcon = (importance: string) => {
    const icons = {
      info: Info,
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle
    }
    return icons[importance] || Info
  }

  const handleAction = async (action: string) => {
    if (!interactive) return
    
    setProcessing(action)
    try {
      if (action.startsWith('http')) {
        window.open(action, '_blank')
      } else {
        await onAction(notification._id, action)
      }
    } finally {
      setProcessing(null)
    }
  }

  const handleQuickAction = async (type: 'read' | 'delete' | 'bookmark' | 'archive') => {
    if (!interactive) return
    
    setProcessing(type)
    try {
      switch (type) {
        case 'read':
          await onMarkAsRead(notification._id)
          break
        case 'delete':
          await onDelete(notification._id)
          break
        case 'bookmark':
          setBookmarked(!bookmarked)
          break
        case 'archive':
          setArchived(!archived)
          break
      }
    } finally {
      setProcessing(null)
    }
  }

  const handleReaction = (emoji: string) => {
    if (!interactive || !notification.canInteract) return
    onReaction(notification._id, emoji)
  }

  const TypeIcon = getTypeIcon(notification.type)
  const ImportanceIcon = getImportanceIcon(notification.importance)

  if (archived) return null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border-l-4 ${getPriorityColor(notification.priority)} border-r border-t border-b border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 ${
        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${getTypeColor(notification.type)}`}>
          <TypeIcon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'} ${compact ? 'text-sm' : 'text-base'}`}>
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
                <ImportanceIcon className={`h-4 w-4 ${
                  notification.importance === 'error' ? 'text-red-500' :
                  notification.importance === 'warning' ? 'text-yellow-500' :
                  notification.importance === 'success' ? 'text-green-500' :
                  'text-blue-500'
                }`} />
              </div>
              
              {/* Sender Info */}
              {notification.sender && (
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={notification.sender.avatar || '/avatars/default.jpg'}
                    alt={notification.sender.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    from {notification.sender.name}
                  </span>
                </div>
              )}

              <p className={`text-gray-600 dark:text-gray-400 ${compact ? 'text-sm' : 'text-base'} ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}>
                {notification.message}
              </p>
            </div>

            {/* Quick Actions */}
            {interactive && (
              <div className="flex items-center gap-1 ml-2">
                {bookmarked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-yellow-500"
                  >
                    <Bookmark className="h-4 w-4 fill-current" />
                  </motion.div>
                )}
                
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                  title="Toggle details"
                >
                  <motion.div
                    animate={{ rotate: showDetails ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </button>

                {!notification.isRead && (
                  <button
                    onClick={() => handleQuickAction('read')}
                    disabled={processing === 'read'}
                    className="p-1 text-gray-400 hover:text-green-500 rounded transition-colors disabled:opacity-50"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() => handleQuickAction('bookmark')}
                  disabled={processing === 'bookmark'}
                  className={`p-1 rounded transition-colors disabled:opacity-50 ${
                    bookmarked 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                  title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => handleQuickAction('delete')}
                  disabled={processing === 'delete'}
                  className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors disabled:opacity-50"
                  title="Delete notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{notification.timeAgo}</span>
            </div>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              notification.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
              notification.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
              notification.priority === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {notification.priority}
            </span>

            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {notification.type}
            </span>
          </div>

          {/* Reactions */}
          {notification.reactions && notification.reactions.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {notification.reactions.map((reaction, index) => (
                <button
                  key={index}
                  onClick={() => handleReaction(reaction.emoji)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                    reaction.userReacted
                      ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600'
                  }`}
                  disabled={!interactive || !notification.canInteract}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
              
              {interactive && notification.canInteract && (
                <button
                  onClick={() => handleReaction('👍')}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-xs"
                  title="Add reaction"
                >
                  +
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && notification.actions && notification.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleAction(action.action)}
                  disabled={processing === action.action}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    action.style === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                    action.style === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' :
                    action.style === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                    action.style === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' :
                    'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  {action.external && <ExternalLink className="h-3 w-3" />}
                  {processing === action.action ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-3 h-3 border border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    action.label
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Additional Actions Row */}
          {interactive && notification.canInteract && (
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <button
                onClick={() => handleReaction('❤️')}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart className="h-3 w-3" />
                <span>Like</span>
              </button>
              
              <button
                onClick={() => navigator.share?.({ title: notification.title, text: notification.message })}
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
              >
                <Share2 className="h-3 w-3" />
                <span>Share</span>
              </button>
              
              <button
                onClick={() => handleQuickAction('archive')}
                className="flex items-center gap-1 hover:text-yellow-500 transition-colors"
              >
                <Archive className="h-3 w-3" />
                <span>Archive</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Notification Details */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Details</h4>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400">
                    <div>ID: {notification._id}</div>
                    <div>Created: {new Date(notification.createdAt).toLocaleString()}</div>
                    {notification.relatedEntity && (
                      <div>Related: {notification.relatedEntity.type} #{notification.relatedEntity.id}</div>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                {notification.metadata && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Metadata</h4>
                    <div className="space-y-1 text-gray-600 dark:text-gray-400">
                      {Object.entries(notification.metadata).map(([key, value]) => (
                        <div key={key}>
                          {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}