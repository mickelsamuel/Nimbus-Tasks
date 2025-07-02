'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  Volume2, 
  Type, 
  Contrast, 
  Moon, 
  Sun, 
  Monitor,
  Settings,
  CheckCircle2,
  type LucideIcon
} from 'lucide-react'
import { UserProfile } from '../types'

interface AccessibilityPanelProps {
  user: UserProfile
  setUser: (user: UserProfile) => void
}

export default function AccessibilityPanel({ user, setUser }: AccessibilityPanelProps) {
  const updateTheme = (theme: 'light' | 'dark' | 'auto') => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        theme
      }
    })
  }

  const ThemeButton = ({ 
    theme, 
    icon: Icon, 
    label, 
    description 
  }: { 
    theme: 'light' | 'dark' | 'auto'
    icon: LucideIcon
    label: string
    description: string
  }) => (
    <motion.button
      onClick={() => updateTheme(theme)}
      className={`
        p-4 rounded-lg border transition-all text-left
        ${user.preferences?.theme === theme
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${
          user.preferences?.theme === theme
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400'
        }`} />
        <span className={`font-medium ${
          user.preferences?.theme === theme
            ? 'text-blue-900 dark:text-blue-100'
            : 'text-gray-900 dark:text-white'
        }`}>
          {label}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </motion.button>
  )

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

  const AccessibilityCard = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: {
    icon: LucideIcon
    title: string
    description: string
    children: React.ReactNode
  }) => (
    <motion.div
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
          {children}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Accessibility & Display
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Customize the interface to better suit your needs
        </p>
      </div>

      {/* Current Status */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="font-medium text-purple-900 dark:text-purple-100">
              Current Theme: {user.preferences?.theme === 'auto' ? 'System' : user.preferences?.theme || 'Light'}
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Interface optimized for your preferences
            </p>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Theme Preference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ThemeButton
            theme="light"
            icon={Sun}
            label="Light Mode"
            description="Clean, bright interface"
          />
          <ThemeButton
            theme="dark"
            icon={Moon}
            label="Dark Mode"
            description="Easy on the eyes"
          />
          <ThemeButton
            theme="auto"
            icon={Monitor}
            label="System"
            description="Follow device preference"
          />
        </div>
      </div>

      {/* Accessibility Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Accessibility Options
        </h3>

        {/* High Contrast */}
        <AccessibilityCard
          icon={Contrast}
          title="High Contrast Mode"
          description="Increase contrast for better visibility"
        >
          <ToggleSwitch 
            checked={false}
            onChange={() => {}}
          />
        </AccessibilityCard>

        {/* Font Size */}
        <AccessibilityCard
          icon={Type}
          title="Font Size"
          description="Adjust text size for better readability"
        >
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">Small</span>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="2"
                  defaultValue="1"
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-right">Large</span>
          </div>
        </AccessibilityCard>

        {/* Reduce Motion */}
        <AccessibilityCard
          icon={Eye}
          title="Reduce Motion"
          description="Minimize animations and transitions"
        >
          <ToggleSwitch 
            checked={false}
            onChange={() => {}}
          />
        </AccessibilityCard>

        {/* Audio Settings */}
        <AccessibilityCard
          icon={Volume2}
          title="Audio Feedback"
          description="Enable sound cues for interface interactions"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Master Volume</span>
              <ToggleSwitch 
                checked={user.preferences?.sounds || false}
                onChange={() => {}}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[40px]">Low</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[40px] text-right">High</span>
            </div>
          </div>
        </AccessibilityCard>
      </div>

      {/* Language & Region */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Language & Region
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Language
            </label>
            <select 
              value={user.preferences?.language || 'en'}
              onChange={(e) => setUser({
                ...user,
                preferences: {
                  ...user.preferences,
                  language: e.target.value as 'en' | 'fr'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Format
            </label>
            <select 
              value={user.preferences?.timeFormat || '12h'}
              onChange={(e) => setUser({
                ...user,
                preferences: {
                  ...user.preferences,
                  timeFormat: e.target.value as '12h' | '24h'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="12h">12-hour (2:30 PM)</option>
              <option value="24h">24-hour (14:30)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility Tips */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Accessibility Tips
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Use keyboard shortcuts for faster navigation</li>
              <li>• Adjust theme based on lighting conditions</li>
              <li>• Enable high contrast if you have vision difficulties</li>
              <li>• Use voice commands when available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}