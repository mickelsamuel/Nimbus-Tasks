'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Notification, NotificationType } from '@/hooks/useAdminNotifications'

interface NotificationDisplayProps {
  notifications: Notification[]
  removeNotification: (id: string) => void
}

const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        bgColor: 'bg-green-500/10 border-green-500/20',
        textColor: 'text-green-500',
        icon: CheckCircle
      }
    case 'error':
      return {
        bgColor: 'bg-red-500/10 border-red-500/20',
        textColor: 'text-red-500',
        icon: AlertCircle
      }
    case 'warning':
      return {
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        textColor: 'text-yellow-500',
        icon: AlertTriangle
      }
    case 'info':
      return {
        bgColor: 'bg-blue-500/10 border-blue-500/20',
        textColor: 'text-blue-500',
        icon: Info
      }
    default:
      return {
        bgColor: 'bg-gray-500/10 border-gray-500/20',
        textColor: 'text-gray-500',
        icon: Info
      }
  }
}

export const NotificationDisplay: React.FC<NotificationDisplayProps> = ({
  notifications,
  removeNotification
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getNotificationStyles(notification.type)
          const Icon = styles.icon

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`${styles.bgColor} border rounded-lg p-4 shadow-lg backdrop-blur-xl max-w-sm`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 ${styles.textColor} mt-0.5 flex-shrink-0`} />
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${styles.textColor}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className={`mt-2 text-sm font-medium ${styles.textColor} hover:underline`}
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default NotificationDisplay