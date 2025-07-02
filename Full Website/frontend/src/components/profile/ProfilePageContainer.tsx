'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileHeader from './sections/ProfileHeader'
import ProfileNavigation from './sections/ProfileNavigation'
import PersonalInfoPanel from './panels/PersonalInfoPanel'
import AccessibilityPanel from './panels/AccessibilityPanel'
import SecurityPanel from './panels/SecurityPanel'
import ActivityPanel from './panels/ActivityPanel'
import NotificationPanel from './panels/NotificationPanel'
import { UserProfile, ProfilePanel } from './types'

// API Functions
import { profileApi } from '@/lib/api/profile'

const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    return await profileApi.getProfile()
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

const updateUserProfile = async (user: UserProfile): Promise<UserProfile> => {
  try {
    const locationObj = typeof user.location === 'string' 
      ? { city: user.location }
      : user.location
    
    return await profileApi.updateProfile({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phone,
      location: locationObj
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return user
  }
}

// Removed mock data - using proper error handling instead

export default function ProfilePageContainer() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activePanel, setActivePanel] = useState<ProfilePanel>('personal')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      setError(null)
      try {
        const userData = await fetchUserProfile()
        if (userData) {
          // Ensure required fields with safe defaults
          const safeUserData = {
            ...userData,
            security: userData.security || {
              twoFactorEnabled: false,
              lastPasswordChange: new Date().toISOString(),
              activeSessions: 1
            },
            preferences: userData.preferences || {
              theme: 'light' as const,
              language: 'en' as const,
              timeFormat: '12h' as const,
              notifications: true,
              emailNotifications: true,
              pushNotifications: false,
              sounds: true
            },
            stats: userData.stats ? {
              ...userData.stats,
              xp: userData.stats.xp || userData.stats.totalXP || 0,
              totalXP: userData.stats.totalXP || userData.stats.xp || 0
            } : {
              xp: 0,
              totalXP: 0,
              level: 1,
              coins: 0,
              tokens: 0,
              modulesCompleted: 0,
              learningHours: 0,
              currentStreak: 0
            }
          }
          setUser(safeUserData)
          setEditedUser(safeUserData)
        } else {
          throw new Error('No user data received from API')
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
        setError('Unable to load your profile. Please check your connection and try again.')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleSave = async () => {
    if (!editedUser) return
    
    // Add loading state for save operation
    setLoading(true)
    
    try {
      setError(null)
      const updatedUser = await updateUserProfile(editedUser)
      setUser(updatedUser)
      setEditedUser(updatedUser)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to save profile:', error)
      let errorMessage = 'Failed to save profile. Please try again.'
      
      // Better error handling based on error type
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('validation')) {
          errorMessage = 'Please check your input and try again.'
        } else if (error.message.includes('unauthorized')) {
          errorMessage = 'Your session has expired. Please log in again.'
        }
      }
      
      setError(errorMessage)
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setEditedUser(user)
      setIsEditing(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB')
      setTimeout(() => setError(null), 5000)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      setTimeout(() => setError(null), 5000)
      return
    }

    setUploadingAvatar(true)
    setError(null)
    try {
      const result = await profileApi.uploadPhoto(file)
      const updatedUser = { ...user, avatar: result.avatar }
      setUser(updatedUser)
      setEditedUser(updatedUser)
      setSuccessMessage('Avatar updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      let errorMessage = 'Failed to upload avatar. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('size')) {
          errorMessage = 'File size too large. Please choose a smaller image.'
        } else if (error.message.includes('type')) {
          errorMessage = 'Invalid file type. Please choose an image file.'
        }
      }
      
      setError(errorMessage)
      setTimeout(() => setError(null), 5000)
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your profile information...</p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    )
  }

  // No user data state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Profile Data</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load profile information.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Profile Header */}
      <ProfileHeader
        user={user}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProfileNavigation
                activePanel={activePanel}
                onPanelChange={setActivePanel}
              />
            </div>
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePanel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                >
                  {activePanel === 'personal' && (
                    <PersonalInfoPanel
                      user={user}
                      editedUser={editedUser}
                      setEditedUser={setEditedUser}
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  )}
                  
                  {activePanel === 'accessibility' && (
                    <AccessibilityPanel
                      user={user}
                      setUser={setUser}
                    />
                  )}
                  
                  {activePanel === 'security' && (
                    <SecurityPanel user={user} />
                  )}
                  
                  {activePanel === 'activity' && (
                    <ActivityPanel user={user} />
                  )}
                  
                  {activePanel === 'notifications' && (
                    <NotificationPanel
                      user={user}
                      setUser={setUser}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success/Error Notifications */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            className="fixed top-6 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg max-w-sm border border-green-400/20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            className="fixed top-6 right-6 z-50 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-lg max-w-sm border border-red-400/20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}