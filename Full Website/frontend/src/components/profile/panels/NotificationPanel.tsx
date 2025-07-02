'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Moon,
  Settings,
  CheckCircle2,
  type LucideIcon
} from 'lucide-react'
import { UserProfile } from '../types'

interface NotificationPanelProps {
  user: UserProfile
  setUser: (user: UserProfile) => void
}

export default function NotificationPanel({ user, setUser }: NotificationPanelProps) {
  const updatePreference = (key: string, value: boolean) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [key]: value
      }
    })
  }

  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    disabled = false 
  }: { 
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean 
  }) => (
    <motion.button
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative w-11 h-6 rounded-full transition-colors
        ${disabled 
          ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
          : checked 
            ? 'bg-blue-600' 
            : 'bg-gray-300 dark:bg-gray-600'
        }
      `}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{
          x: checked ? 26 : 2
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )

  const NotificationCard = ({ 
    icon: Icon, 
    title, 
    description, 
    checked, 
    onChange,
    disabled = false,
    badge = null 
  }: {
    icon: LucideIcon
    title: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    badge?: string | null
  }) => (
    <motion.div
      className={`
        border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all
        ${disabled ? 'opacity-60' : 'hover:shadow-md'}
      `}
      whileHover={disabled ? {} : { scale: 1.01 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className={`
            p-2 rounded-lg
            ${checked 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }
          `}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
              {badge && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-md">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        <ToggleSwitch 
          checked={checked} 
          onChange={onChange} 
          disabled={disabled}
        />
      </div>
    </motion.div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Customize how and when you receive notifications
        </p>
      </div>

      {/* Quick Status */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-medium text-green-900 dark:text-green-100">
              Notifications: {user.preferences?.notifications ? 'Enabled' : 'Disabled'}
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              {user.preferences?.notifications 
                ? 'You will receive notifications based on your preferences below'
                : 'All notifications are currently disabled'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4">
        {/* Master Toggle */}
        <NotificationCard
          icon={Bell}
          title="All Notifications"
          description="Master control for all notification types"
          checked={user.preferences?.notifications || false}
          onChange={(checked) => updatePreference('notifications', checked)}
          badge="Master"
        />

        {/* Email Notifications */}
        <NotificationCard
          icon={Mail}
          title="Email Notifications"
          description="Receive notifications via email for important updates"
          checked={user.preferences?.emailNotifications || false}
          onChange={(checked) => updatePreference('emailNotifications', checked)}
          disabled={!user.preferences?.notifications}
        />

        {/* Push Notifications */}
        <NotificationCard
          icon={Smartphone}
          title="Push Notifications"
          description="Get instant notifications on your device"
          checked={user.preferences?.pushNotifications || false}
          onChange={(checked) => updatePreference('pushNotifications', checked)}
          disabled={!user.preferences?.notifications}
        />

        {/* Sound Notifications */}
        <NotificationCard
          icon={user.preferences?.sounds ? Volume2 : VolumeX}
          title="Sound Notifications"
          description="Play sounds when notifications arrive"
          checked={user.preferences?.sounds || false}
          onChange={(checked) => updatePreference('sounds', checked)}
          disabled={!user.preferences?.notifications}
        />

        {/* Do Not Disturb */}
        <NotificationCard
          icon={Moon}
          title="Do Not Disturb"
          description="Pause notifications during focus time (9 PM - 7 AM)"
          checked={user.preferences?.doNotDisturb || false}
          onChange={(checked) => updatePreference('doNotDisturb', checked)}
          disabled={!user.preferences?.notifications}
        />
      </div>

      {/* Notification Categories */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Notification Types
        </h3>
        <div className="space-y-3">
          {[
            { category: 'Learning Updates', description: 'Module completions, progress milestones', enabled: true },
            { category: 'Team Activities', description: 'Team announcements, collaborations', enabled: true },
            { category: 'System Updates', description: 'Maintenance, feature releases', enabled: false },
            { category: 'Security Alerts', description: 'Login attempts, password changes', enabled: true },
            { category: 'Achievement Unlocks', description: 'New badges, level ups', enabled: true },
            { category: 'Social Features', description: 'Friend requests, messages', enabled: false }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {item.category}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {item.description}
                </div>
              </div>
              <ToggleSwitch 
                checked={item.enabled && (user.preferences?.notifications || false)}
                onChange={() => {}}
                disabled={!user.preferences?.notifications}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delivery Schedule */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Delivery Schedule
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <div>• Email notifications: Daily digest at 9:00 AM</div>
              <div>• Push notifications: Instant delivery</div>
              <div>• Sound alerts: Enabled for urgent notifications only</div>
            </div>
            <motion.button
              className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Customize Schedule
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}