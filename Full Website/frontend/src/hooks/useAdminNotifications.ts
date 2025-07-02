'use client'

import { useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [removeNotification])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Convenience methods
  const notifySuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options })
  }, [addNotification])

  const notifyError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, duration: 8000, ...options })
  }, [addNotification])

  const notifyWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options })
  }, [addNotification])

  const notifyInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options })
  }, [addNotification])

  // Operation result handlers
  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    {
      loadingMessage = 'Processing...',
      successMessage = 'Operation completed successfully',
      errorMessage = 'Operation failed'
    }: {
      loadingMessage?: string
      successMessage?: string
      errorMessage?: string
    } = {}
  ): Promise<T | null> => {
    const loadingId = notifyInfo('Processing', loadingMessage, { duration: 0 })

    try {
      const result = await operation()
      removeNotification(loadingId)
      notifySuccess('Success', successMessage)
      return result
    } catch (error) {
      removeNotification(loadingId)
      const message = error instanceof Error ? error.message : errorMessage
      notifyError('Error', message)
      return null
    }
  }, [notifyInfo, removeNotification, notifySuccess, notifyError])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    handleAsyncOperation
  }
}

export default useAdminNotifications