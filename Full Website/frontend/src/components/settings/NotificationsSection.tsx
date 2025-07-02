'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSettingsContext } from '@/components/settings/SettingsProvider'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Volume2, 
  Settings,
  Users,
  Trophy,
  Calendar,
  Shield,
  Zap,
  Play,
  Pause,
  VolumeX
} from 'lucide-react'



const NotificationsSection: React.FC = () => {
  const { preferences, updatePreferences, isLoading } = useSettingsContext()
  const [soundPreview, setSoundPreview] = useState<string | null>(null)
  
  const onChange = (path: string, value: boolean | string | number) => {
    updatePreferences({ [path]: value })
  }
  
  // Show loading state if preferences aren't loaded yet
  if (!preferences) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notification settings...</p>
        </div>
      </div>
    )
  }

  const notificationTypes = [
    {
      key: 'email',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: <Mail className="h-5 w-5" />,
      color: 'blue'
    },
    {
      key: 'push',
      label: 'Push Notifications',
      description: 'Browser and mobile push notifications',
      icon: <Bell className="h-5 w-5" />,
      color: 'green'
    },
    {
      key: 'sms',
      label: 'SMS Notifications',
      description: 'Text message notifications for critical updates',
      icon: <Smartphone className="h-5 w-5" />,
      color: 'purple'
    },
    {
      key: 'inApp',
      label: 'In-App Notifications',
      description: 'Notifications within the application',
      icon: <Zap className="h-5 w-5" />,
      color: 'yellow'
    }
  ]

  const notificationCategories = [
    {
      key: 'moduleReminders',
      label: 'Module Reminders',
      description: 'Reminders for upcoming training modules',
      icon: <Calendar className="h-5 w-5" />,
      priority: 'high'
    },
    {
      key: 'teamUpdates',
      label: 'Team Updates',
      description: 'Updates from your team and colleagues',
      icon: <Users className="h-5 w-5" />,
      priority: 'medium'
    },
    {
      key: 'friendRequests',
      label: 'Friend Requests',
      description: 'New connection requests',
      icon: <Users className="h-5 w-5" />,
      priority: 'low'
    },
    {
      key: 'achievements',
      label: 'Achievements',
      description: 'New badges and accomplishments',
      icon: <Trophy className="h-5 w-5" />,
      priority: 'medium'
    },
    {
      key: 'events',
      label: 'Events',
      description: 'Company events and announcements',
      icon: <Calendar className="h-5 w-5" />,
      priority: 'high'
    },
    {
      key: 'security',
      label: 'Security Alerts',
      description: 'Account security and login notifications',
      icon: <Shield className="h-5 w-5" />,
      priority: 'critical'
    }
  ]

  const soundTypes = [
    { value: 'chime', label: 'Chime', description: 'Pleasant bell sound' },
    { value: 'bell', label: 'Bell', description: 'Classic notification bell' },
    { value: 'ping', label: 'Ping', description: 'Quick digital ping' },
    { value: 'notification', label: 'Notification', description: 'Standard system sound' }
  ]

  const groupingOptions = [
    { 
      value: 'immediate', 
      label: 'Immediate', 
      description: 'Send notifications right away'
    },
    { 
      value: 'smart', 
      label: 'Smart Grouping', 
      description: 'Intelligently group related notifications'
    },
    { 
      value: 'priority', 
      label: 'Priority Based', 
      description: 'Group by importance level'
    },
    { 
      value: 'batched', 
      label: 'Batched', 
      description: 'Send notifications in scheduled batches'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const playSound = (soundType: string) => {
    setSoundPreview(soundType)
    // Simulate sound preview
    setTimeout(() => setSoundPreview(null), 1000)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
            <Bell className="h-6 w-6 text-white" />
          </div>
          Notifications
        </h2>
        <p className="text-gray-600">Configure how and when you receive notifications</p>
      </motion.div>

      <div className="space-y-8">
        {/* Notification Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Notification Methods</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTypes.map((type) => (
              <motion.div
                key={type.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${type.color}-100 rounded-lg text-${type.color}-600`}>
                    {type.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(preferences?.notifications?.[type.key]) || false}
                    onChange={(e) => onChange(`notifications.${type.key}`, e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Notification Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Notification Categories</h4>
          </div>

          <div className="space-y-4">
            {notificationCategories.map((category) => (
              <motion.div
                key={category.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-gray-900">{category.label}</div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(category.priority)}`}>
                        {category.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{category.description}</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(preferences?.notifications?.[category.key]) || false}
                    onChange={(e) => onChange(`notifications.${category.key}`, e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Work Hours Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Work Hours Schedule</h4>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Respect Work Hours</div>
                <div className="text-sm text-gray-600">Only send notifications during work hours</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.notifications?.workHours?.enabled || false}
                  onChange={(e) => onChange('notifications.workHours.enabled', e.target.checked)}
                  disabled={isLoading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>

            {preferences?.notifications?.workHours?.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={preferences?.notifications?.workHours?.start || '09:00'}
                    onChange={(e) => onChange('notifications.workHours.start', e.target.value)}
                    disabled={isLoading}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={preferences?.notifications?.workHours?.end || '17:00'}
                    onChange={(e) => onChange('notifications.workHours.end', e.target.value)}
                    disabled={isLoading}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences?.notifications?.workHours?.weekendsEnabled || false}
                      onChange={(e) => onChange('notifications.workHours.weekendsEnabled', e.target.checked)}
                      disabled={isLoading}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Include weekends</span>
                  </label>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Sound & Volume Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Sound & Volume</h4>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Notification Sounds</div>
                <div className="text-sm text-gray-600">Play sounds for notifications</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.notifications?.soundEnabled || false}
                  onChange={(e) => onChange('notifications.soundEnabled', e.target.checked)}
                  disabled={isLoading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>

            {preferences?.notifications?.soundEnabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Sound Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {soundTypes.map((sound) => (
                      <motion.button
                        key={sound.value}
                        onClick={() => onChange('notifications.soundType', sound.value)}
                        className={`p-3 rounded-lg border-2 text-left transition-all duration-300 ${
                          preferences?.notifications?.soundType === sound.value
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{sound.label}</div>
                            <div className="text-sm text-gray-600">{sound.description}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              playSound(sound.value)
                            }}
                            className="p-2 bg-yellow-100 rounded-lg text-yellow-600 hover:bg-yellow-200 transition-colors"
                          >
                            {soundPreview === sound.value ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Volume: {preferences?.notifications?.volume || 75}%
                  </label>
                  <div className="flex items-center gap-3">
                    <VolumeX className="h-5 w-5 text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={preferences?.notifications?.volume || 75}
                      onChange={(e) => onChange('notifications.volume', parseInt(e.target.value))}
                      disabled={isLoading}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <Volume2 className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Notification Grouping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Notification Grouping</h4>
          </div>

          <div className="space-y-4">
            {groupingOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => onChange('notifications.grouping', option.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                  preferences?.notifications?.grouping === option.value
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  {preferences?.notifications?.grouping === option.value && (
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  )}
                </div>
              </motion.button>
            ))}

            {preferences?.notifications?.grouping === 'batched' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Interval: {preferences?.notifications?.batchInterval || 30} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="240"
                  step="5"
                  value={preferences?.notifications?.batchInterval || 30}
                  onChange={(e) => onChange('notifications.batchInterval', parseInt(e.target.value))}
                  disabled={isLoading}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 min</span>
                  <span>4 hours</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotificationsSection