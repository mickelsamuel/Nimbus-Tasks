'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Key, 
  Smartphone, 
  Clock, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Lock,
  Settings,
  type LucideIcon
} from 'lucide-react'
import { UserProfile } from '../types'

interface SecurityPanelProps {
  user: UserProfile
}

export default function SecurityPanel({ user }: SecurityPanelProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  const SecurityCard = ({ 
    icon: Icon, 
    title, 
    description, 
    status, 
    action, 
    statusColor = 'green' 
  }: {
    icon: LucideIcon
    title: string
    description: string
    status: string
    action?: React.ReactNode
    statusColor?: 'green' | 'yellow' | 'red'
  }) => {
    const statusColors = {
      green: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
    }

    return (
      <motion.div
        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[statusColor]}`}>
                {status}
              </span>
              {action}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Security & Privacy
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage your account security settings and privacy preferences
        </p>
      </div>

      {/* Security Status Overview */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-medium text-green-900 dark:text-green-100">Account Security: Good</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your account has strong security measures in place
            </p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="space-y-4">
        {/* Password */}
        <SecurityCard
          icon={Key}
          title="Password"
          description="Last changed on March 15, 2024"
          status="Strong"
          statusColor="green"
          action={
            <motion.button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Change Password
            </motion.button>
          }
        />

        {/* Two Factor Authentication */}
        <SecurityCard
          icon={Smartphone}
          title="Two-Factor Authentication"
          description="Extra security for your account using your mobile device"
          status={user.security?.twoFactorEnabled ? "Enabled" : "Disabled"}
          statusColor={user.security?.twoFactorEnabled ? "green" : "yellow"}
          action={
            <motion.button
              className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {user.security?.twoFactorEnabled ? "Manage" : "Enable"}
            </motion.button>
          }
        />

        {/* Active Sessions */}
        <SecurityCard
          icon={Clock}
          title="Active Sessions"
          description={`You have ${user.security?.activeSessions || 1} active session(s)`}
          status="Current session"
          statusColor="green"
          action={
            <motion.button
              className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All
            </motion.button>
          }
        />

        {/* Privacy Settings */}
        <SecurityCard
          icon={Shield}
          title="Privacy Settings"
          description="Control who can see your profile and activity"
          status="Private"
          statusColor="green"
          action={
            <motion.button
              className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-3 h-3 inline mr-1" />
              Manage
            </motion.button>
          }
        />
      </div>

      {/* Password Change Form */}
      {showPasswordForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Change Password</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <motion.button
                onClick={async () => {
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    alert('Please fill in all password fields')
                    return
                  }
                  
                  if (newPassword !== confirmPassword) {
                    alert('New passwords do not match')
                    return
                  }
                  
                  if (newPassword.length < 8) {
                    alert('Password must be at least 8 characters long')
                    return
                  }
                  
                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/user/change-password`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        currentPassword,
                        newPassword,
                        confirmPassword
                      })
                    })

                    if (response.ok) {
                      alert('Password updated successfully!')
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                      setShowPasswordForm(false)
                    } else {
                      const errorData = await response.json()
                      alert('Failed to update password: ' + (errorData.message || 'Unknown error'))
                    }
                  } catch (error) {
                    console.error('Error updating password:', error)
                    alert('Failed to update password. Please try again.')
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Update Password
              </motion.button>
              <motion.button
                onClick={() => {
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setShowPasswordForm(false)
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Security Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Use a unique password for your account</li>
              <li>• Enable two-factor authentication for extra security</li>
              <li>• Review your active sessions regularly</li>
              <li>• Never share your login credentials with others</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}