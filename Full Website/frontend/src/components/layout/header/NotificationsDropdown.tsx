'use client'

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  createdAt: Date
  timeAgo?: string
  isRead: boolean
  actions?: Array<{ action: string }>
}

interface NotificationsDropdownProps {
  isOpen: boolean
  notifications: Notification[]
  unreadCount: number
  onToggle: () => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  className?: string
}

export default function NotificationsDropdown({
  isOpen,
  notifications,
  unreadCount,
  onToggle,
  onMarkAsRead,
  onMarkAllAsRead,
  className = ''
}: NotificationsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
        onToggle()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle])

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        onClick={onToggle}
        className="relative flex items-center justify-center rounded-lg bg-white/80 dark:bg-gray-800/80 p-2.5 text-gray-700 dark:text-gray-300 transition-all hover:bg-white/90 dark:hover:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 border border-gray-200 dark:border-gray-600"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
        aria-expanded={isOpen}
      >
        <motion.div
          animate={unreadCount > 0 ? { 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, -10, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
        >
          <Bell className="h-4 w-4" />
        </motion.div>
        {unreadCount > 0 && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
            {/* Pulsing ring effect */}
            <motion.div
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-12 w-80 rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            role="menu"
            aria-label="Notifications"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`rounded-lg p-3 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600/50 ${
                        !notification.isRead
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/50'
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          onMarkAsRead(notification._id)
                        }
                        // Navigate to notification action if available
                        if (notification.actions && notification.actions[0]) {
                          window.location.href = notification.actions[0].action
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            {/* Notification icon based on type */}
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                              notification.type === 'achievement_unlocked' ? 'bg-yellow-100 text-yellow-600' :
                              notification.type === 'module_completed' ? 'bg-green-100 text-green-600' :
                              notification.type === 'deadline_approaching' ? 'bg-red-100 text-red-600' :
                              notification.type === 'team_invitation' ? 'bg-blue-100 text-blue-600' :
                              notification.type === 'friend_request' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {notification.type === 'achievement_unlocked' && '🏆'}
                              {notification.type === 'module_completed' && '🎓'}
                              {notification.type === 'deadline_approaching' && '⏰'}
                              {notification.type === 'team_invitation' && '👥'}
                              {notification.type === 'friend_request' && '👤'}
                              {!['achievement_unlocked', 'module_completed', 'deadline_approaching', 'team_invitation', 'friend_request'].includes(notification.type) && '📢'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {notification.timeAgo || new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-600 mb-2">
                      <Bell className="h-8 w-8 mx-auto opacity-50" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No notifications yet
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                      We&apos;ll notify you when something interesting happens!
                    </p>
                  </div>
                )}
              </div>
              
              {/* View all notifications link */}
              {notifications.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => {
                      onToggle()
                      router.push('/notifications')
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}