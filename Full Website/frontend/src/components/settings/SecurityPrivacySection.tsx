'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSettingsContext } from '@/components/settings/SettingsProvider'
import { 
  Shield, 
  Key, 
  Smartphone, 
  AlertTriangle,
  Fingerprint,
  Eye,
  Clock,
  Settings,
  Phone,
  Mail,
  Check
} from 'lucide-react'




const SecurityPrivacySection: React.FC = () => {
  const { preferences, updatePreferences, isLoading } = useSettingsContext()
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  
  const onChange = (path: string, value: boolean | string | number) => {
    updatePreferences({ [path]: value })
  }
  
  const onShowPasswordModal = () => {
    // TODO: Implement password change modal
  }
  
  // Show loading state if preferences aren't loaded yet
  if (!preferences) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading security settings...</p>
        </div>
      </div>
    )
  }

  const securityFeatures = [
    {
      key: 'twoFactorEnabled',
      label: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: <Smartphone className="h-5 w-5" />,
      critical: true
    },
    {
      key: 'deviceTracking',
      label: 'Device Tracking',
      description: 'Monitor and track devices accessing your account',
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      key: 'loginNotifications',
      label: 'Login Notifications',
      description: 'Get notified of new login attempts',
      icon: <Mail className="h-5 w-5" />
    },
    {
      key: 'autoLogout',
      label: 'Auto Logout',
      description: 'Automatically log out after inactivity',
      icon: <Clock className="h-5 w-5" />
    }
  ]

  const biometricOptions = [
    {
      key: 'fingerprint',
      label: 'Fingerprint',
      description: 'Use fingerprint for quick authentication',
      icon: <Fingerprint className="h-5 w-5" />
    },
    {
      key: 'faceRecognition',
      label: 'Face Recognition',
      description: 'Use facial recognition for secure access',
      icon: <Eye className="h-5 w-5" />
    },
    {
      key: 'voiceRecognition',
      label: 'Voice Recognition',
      description: 'Use voice patterns for authentication',
      icon: <Phone className="h-5 w-5" />
    }
  ]

  const privacySettings = [
    {
      key: 'showStats',
      label: 'Show Statistics',
      description: 'Display your learning statistics to others'
    },
    {
      key: 'showAchievements',
      label: 'Show Achievements',
      description: 'Display your badges and accomplishments'
    },
    {
      key: 'showActivity',
      label: 'Show Activity',
      description: 'Show your recent activity to others'
    }
  ]

  const riskLevels = [
    {
      value: 'low',
      label: 'Low Risk',
      description: 'Maximum security, frequent verification',
      color: 'green'
    },
    {
      value: 'medium',
      label: 'Medium Risk',
      description: 'Balanced security and convenience',
      color: 'yellow'
    },
    {
      value: 'high',
      label: 'High Risk',
      description: 'Convenience focused, minimal verification',
      color: 'red'
    }
  ]

  const twoFactorMethods = [
    {
      value: 'sms',
      label: 'SMS',
      description: 'Receive codes via text message',
      icon: <Phone className="h-5 w-5" />
    },
    {
      value: 'email',
      label: 'Email',
      description: 'Receive codes via email',
      icon: <Mail className="h-5 w-5" />
    },
    {
      value: 'app',
      label: 'Authenticator App',
      description: 'Use an authenticator app',
      icon: <Smartphone className="h-5 w-5" />
    }
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          Security & Privacy
        </h2>
        <p className="text-gray-600">Manage your account security and privacy settings</p>
      </motion.div>

      <div className="space-y-8">
        {/* Password Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Key className="h-5 w-5 text-slate-600" />
            <h4 className="text-lg font-semibold text-gray-900">Password Security</h4>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-600">Update your account password regularly for better security</div>
            </div>
            <button
              onClick={onShowPasswordModal}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              <Key className="h-4 w-4" />
              Change Password
            </button>
          </div>
        </motion.div>

        {/* Two-Factor Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="h-5 w-5 text-slate-600" />
            <h4 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Enable 2FA</div>
                <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.security?.twoFactorEnabled || false}
                  onChange={(e) => onChange('security.twoFactorEnabled', e.target.checked)}
                  disabled={isLoading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
              </label>
            </div>

            {preferences?.security?.twoFactorEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">2FA Method</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {twoFactorMethods.map((method) => (
                      <motion.button
                        key={method.value}
                        onClick={() => onChange('security.twoFactorMethod', method.value)}
                        className={`p-3 rounded-lg border-2 text-left transition-all duration-300 ${
                          preferences?.security?.twoFactorMethod === method.value
                            ? 'border-slate-500 bg-slate-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            {method.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{method.label}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div className="font-medium text-yellow-800">Backup Codes</div>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Save these backup codes in a secure location. You can use them to access your account if you lose your 2FA device.
                  </p>
                  <button
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                  >
                    {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
                  </button>
                  
                  {showBackupCodes && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 p-3 bg-white rounded border font-mono text-sm"
                    >
                      {preferences?.security?.backupCodes?.map((code: string, index: number) => (
                        <div key={index} className="py-1">{code}</div>
                      )) || (
                        <div className="text-gray-500">No backup codes generated</div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-slate-600" />
            <h4 className="text-lg font-semibold text-gray-900">Security Features</h4>
          </div>

          <div className="space-y-4">
            {securityFeatures.map((feature) => (
              <motion.div
                key={feature.key}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  feature.critical ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    feature.critical ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {feature.label}
                      {feature.critical && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(preferences?.security?.[feature.key]) || false}
                    onChange={(e) => onChange(`security.${feature.key}`, e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Biometric Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint className="h-5 w-5 text-slate-600" />
            <h4 className="text-lg font-semibold text-gray-900">Biometric Authentication</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {biometricOptions.map((option) => (
              <motion.div
                key={option.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(preferences?.security?.biometrics?.[option.key]) || false}
                    onChange={(e) => onChange(`security.biometrics.${option.key}`, e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Risk Tolerance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-5 w-5 text-slate-600" />
            <h4 className="text-lg font-semibold text-gray-900">Security Risk Tolerance</h4>
          </div>

          <div className="space-y-3">
            {riskLevels.map((level) => (
              <motion.button
                key={level.value}
                onClick={() => onChange('security.riskTolerance', level.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                  preferences?.security?.riskTolerance === level.value
                    ? 'border-slate-500 bg-slate-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium text-${level.color}-700`}>{level.label}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </div>
                  {preferences?.security?.riskTolerance === level.value && (
                    <Check className="h-5 w-5 text-slate-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Eye className="h-5 w-5 text-slate-600" />
            <h4 className="text-lg font-semibold text-gray-900">Privacy Settings</h4>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Profile Visibility</label>
              <select
                value={preferences?.privacy?.profileVisibility || 'public'}
                onChange={(e) => onChange('privacy.profileVisibility', e.target.value)}
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="public">Public - Visible to everyone</option>
                <option value="friends">Friends Only - Visible to connections</option>
                <option value="private">Private - Hidden from others</option>
              </select>
            </div>

            <div className="space-y-4">
              {privacySettings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{setting.label}</div>
                    <div className="text-sm text-gray-600">{setting.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(preferences?.privacy?.[setting.key]) || false}
                      onChange={(e) => onChange(`privacy.${setting.key}`, e.target.checked)}
                      disabled={isLoading}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Session Timeout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-slate-600" />
            <h4 className="text-lg font-semibold text-gray-900">Session Management</h4>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Session Timeout: {preferences?.security?.sessionTimeout || 30} minutes
            </label>
            <input
              type="range"
              min="5"
              max="480"
              step="5"
              value={preferences?.security?.sessionTimeout || 30}
              onChange={(e) => onChange('security.sessionTimeout', parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 min</span>
              <span>8 hours</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SecurityPrivacySection