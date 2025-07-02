'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSettingsContext } from '@/components/settings/SettingsProvider'
import { 
  Eye, 
  Monitor, 
  Globe, 
  Palette,
  Zap,
  Settings,
  RefreshCw,
  Check,
  Sun,
  Moon,
  Smartphone
} from 'lucide-react'




const AccessibilityDisplaySection: React.FC = () => {
  const { preferences, updatePreferences, isLoading } = useSettingsContext()
  
  // Always call hooks at the top level
  const [previewSettings, setPreviewSettings] = useState({
    fontSize: preferences?.accessibility?.fontSize || 'medium',
    theme: preferences?.theme || 'light'
  })
  
  const onChange = (path: string, value: unknown) => {
    updatePreferences({ [path]: value })
  }
  
  // Show loading state if preferences aren't loaded yet
  if (!preferences) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accessibility settings...</p>
        </div>
      </div>
    )
  }

  const handlePreviewChange = (setting: string, value: unknown) => {
    setPreviewSettings(prev => ({ ...prev, [setting]: value }))
    if (setting === 'fontSize') {
      onChange('accessibility.fontSize', value)
    } else if (setting === 'theme') {
      onChange('theme', value)
    }
  }

  const getFontSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'text-sm'
      case 'medium': return 'text-base'
      case 'large': return 'text-lg'
      case 'extraLarge': return 'text-xl'
      default: return 'text-base'
    }
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg">
            <Eye className="h-6 w-6 text-white" />
          </div>
          Accessibility & Display
        </h2>
        <p className="text-gray-600">Customize your visual experience and accessibility preferences</p>
      </motion.div>

      <div className="space-y-8">
        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Theme Selection</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'light',
                name: 'Light Mode',
                description: 'Clean and bright interface',
                icon: <Sun className="h-6 w-6" />,
                gradient: 'from-blue-400 to-cyan-400',
                preview: 'bg-white border-gray-200'
              },
              {
                id: 'dark',
                name: 'Dark Mode',
                description: 'Easy on the eyes for extended use',
                icon: <Moon className="h-6 w-6" />,
                gradient: 'from-slate-600 to-slate-800',
                preview: 'bg-gray-900 border-gray-700'
              },
              {
                id: 'auto',
                name: 'Auto Mode',
                description: 'Follows system preference',
                icon: <Monitor className="h-6 w-6" />,
                gradient: 'from-purple-400 to-pink-400',
                preview: 'bg-gradient-to-br from-white to-gray-900 border-purple-300'
              }
            ].map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => handlePreviewChange('theme', theme.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  previewSettings.theme === theme.id
                    ? 'border-yellow-500 bg-yellow-50 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                whileHover={{ scale: previewSettings.theme === theme.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <div className={`w-full h-24 rounded-lg mb-4 ${theme.preview} flex items-center justify-center`}>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${theme.gradient} text-white`}>
                    {theme.icon}
                  </div>
                </div>
                <div className="text-left">
                  <h5 className="font-medium text-gray-900">{theme.name}</h5>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>
                {previewSettings.theme === theme.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Language & Region */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Language & Region</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Interface Language</label>
              <div className="space-y-3">
                {[
                  { value: 'en', label: 'English (Canada)', flag: '🇨🇦', description: 'Default language for National Bank' },
                  { value: 'fr', label: 'Français (Canada)', flag: '🇫🇷', description: 'Langue officielle du Canada' }
                ].map((lang) => (
                  <motion.button
                    key={lang.value}
                    onClick={() => onChange('language', lang.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                      preferences?.language === lang.value
                        ? 'border-yellow-500 bg-yellow-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="font-medium text-gray-900">{lang.label}</div>
                        <div className="text-sm text-gray-600">{lang.description}</div>
                      </div>
                      {preferences?.language === lang.value && (
                        <Check className="h-5 w-5 text-yellow-600 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Time & Date Format</label>
              <div className="space-y-3">
                {[
                  { value: '12', label: '12-hour format', example: '2:30 PM' },
                  { value: '24', label: '24-hour format', example: '14:30' }
                ].map((format) => (
                  <motion.button
                    key={format.value}
                    onClick={() => onChange('accessibility.timeFormat', format.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                      preferences?.accessibility?.timeFormat === format.value
                        ? 'border-yellow-500 bg-yellow-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{format.label}</div>
                        <div className="text-sm text-gray-600">Example: {format.example}</div>
                      </div>
                      {preferences?.accessibility?.timeFormat === format.value && (
                        <Check className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Font & Text Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Font & Text Settings</h4>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Font Size</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'small', label: 'Small', size: 'text-sm' },
                  { value: 'medium', label: 'Medium', size: 'text-base' },
                  { value: 'large', label: 'Large', size: 'text-lg' },
                  { value: 'extraLarge', label: 'Extra Large', size: 'text-xl' }
                ].map((size) => (
                  <motion.button
                    key={size.value}
                    onClick={() => handlePreviewChange('fontSize', size.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      previewSettings.fontSize === size.value
                        ? 'border-yellow-500 bg-yellow-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    <div className={`${size.size} font-medium text-gray-900 mb-1`}>Aa</div>
                    <div className="text-xs text-gray-600">{size.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Preview</h5>
              <div className={`${getFontSizeClass(previewSettings.fontSize)} text-gray-900`}>
                This is how your text will appear with the selected font size. The quick brown fox jumps over the lazy dog.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Accessibility Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Accessibility Features</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                key: 'reducedMotion',
                label: 'Reduced Motion',
                description: 'Minimize animations and transitions',
                icon: <RefreshCw className="h-5 w-5" />
              },
              {
                key: 'highContrast',
                label: 'High Contrast',
                description: 'Increase contrast for better visibility',
                icon: <Monitor className="h-5 w-5" />
              },
              {
                key: 'colorBlindSupport',
                label: 'Color Blind Support',
                description: 'Enhanced color differentiation',
                icon: <Eye className="h-5 w-5" />
              },
              {
                key: 'dyslexiaFriendly',
                label: 'Dyslexia Friendly',
                description: 'Optimized fonts and spacing',
                icon: <Settings className="h-5 w-5" />
              },
              {
                key: 'voiceNavigation',
                label: 'Voice Navigation',
                description: 'Navigate using voice commands',
                icon: <Smartphone className="h-5 w-5" />
              },
              {
                key: 'adhdFocusMode',
                label: 'ADHD Focus Mode',
                description: 'Reduced distractions and enhanced focus',
                icon: <Zap className="h-5 w-5" />
              },
              {
                key: 'screenReaderOptimized',
                label: 'Screen Reader Optimized',
                description: 'Enhanced compatibility with screen readers',
                icon: <Monitor className="h-5 w-5" />
              }
            ].map((feature) => (
              <motion.div
                key={feature.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{feature.label}</div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(preferences?.accessibility?.[feature.key]) || false}
                    onChange={(e) => onChange(`accessibility.${feature.key}`, e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Keyboard Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Keyboard Navigation</h4>
          </div>

          <div className="space-y-4">
            {[
              {
                value: 'standard',
                label: 'Standard Navigation',
                description: 'Default keyboard shortcuts and tab order'
              },
              {
                value: 'enhanced',
                label: 'Enhanced Navigation',
                description: 'Additional shortcuts and improved focus indicators'
              },
              {
                value: 'simplified',
                label: 'Simplified Navigation',
                description: 'Reduced shortcuts for easier navigation'
              }
            ].map((nav) => (
              <motion.button
                key={nav.value}
                onClick={() => onChange('accessibility.keyboardNavigation', nav.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                  preferences?.accessibility?.keyboardNavigation === nav.value
                    ? 'border-yellow-500 bg-yellow-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{nav.label}</div>
                    <div className="text-sm text-gray-600">{nav.description}</div>
                  </div>
                  {preferences?.accessibility?.keyboardNavigation === nav.value && (
                    <Check className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Motion Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">Motion Sensitivity</h4>
          </div>

          <div className="space-y-4">
            {[
              {
                value: 'normal',
                label: 'Normal Motion',
                description: 'Full animations and transitions'
              },
              {
                value: 'reduced',
                label: 'Reduced Motion',
                description: 'Fewer animations, essential transitions only'
              },
              {
                value: 'none',
                label: 'No Motion',
                description: 'Minimal animations, static interface'
              }
            ].map((motionOption) => (
              <motion.button
                key={motionOption.value}
                onClick={() => onChange('accessibility.motionSensitivity', motionOption.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                  preferences?.accessibility?.motionSensitivity === motionOption.value
                    ? 'border-yellow-500 bg-yellow-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{motionOption.label}</div>
                    <div className="text-sm text-gray-600">{motionOption.description}</div>
                  </div>
                  {preferences?.accessibility?.motionSensitivity === motionOption.value && (
                    <Check className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AccessibilityDisplaySection