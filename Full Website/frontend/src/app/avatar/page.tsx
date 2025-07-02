'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { useAuth } from '@/contexts/AuthContext'

export default function AvatarPage() {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const { user, updateUserAvatar, refreshUserData } = useAuth()

  // Get iframe URL with user's existing avatar - memoized to prevent infinite loops
  const iframeUrl = useMemo(() => {
    const params = new URLSearchParams({
      frameApi: 'true'
    })
    
    // If user has an avatar, extract the avatar ID and load it for editing
    if (user?.avatar && user.avatar.includes('readyplayer.me')) {
      // Extract avatar ID from URL (works for both .glb and .png URLs)
      const avatarIdMatch = user.avatar.match(/\/([a-zA-Z0-9]+)\.(?:glb|png)/)
      if (avatarIdMatch && avatarIdMatch[1]) {
        const avatarId = avatarIdMatch[1]
        
        // Use the correct ReadyPlayerMe parameter 'id' for loading existing avatars
        params.append('id', avatarId)
      }
    }
    
    const finalUrl = `https://readyplayer.me/avatar?${params.toString()}`
    return finalUrl
  }, [user?.avatar]) // Only recalculate when avatar actually changes


  // Move handleSaveAvatar before the useEffect that uses it
  const handleSaveAvatar = useCallback(async (avatarUrl?: string) => {
    const urlToSave = avatarUrl || currentAvatarUrl
    
    if (!urlToSave) {
      setSaveStatus('error')
      return
    }

    // Check if user is available
    if (!user) {
      console.error('Cannot save avatar: user not authenticated')
      setSaveStatus('error')
      return
    }

    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const token = localStorage.getItem('auth_token')

      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_BASE}/avatar/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatarUrl: urlToSave,
          avatarConfiguration: {
            selectedTemplate: 'custom-rpm',
            role: 'employee',
            gender: 'neutral',
            name: 'Custom Avatar',
            description: 'Professional avatar created with Ready Player Me'
          }
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSaveStatus('success')
        
        // Mark avatar as recently updated for cache busting
        const updateTimestamp = Date.now()
        sessionStorage.setItem('recentAvatarUpdate', JSON.stringify({
          url: urlToSave,
          timestamp: updateTimestamp,
          forceRefresh: true // Force refresh even if URL is same
        }))
        
        // Always update auth context even if URL is the same (the avatar content may have changed)
        if (updateUserAvatar) {
          updateUserAvatar(urlToSave, true) // Add force parameter
        }
        
        // Dispatch single immediate UI update event
        window.dispatchEvent(new CustomEvent('avatarUpdated', { 
          detail: { avatarUrl: urlToSave, timestamp: updateTimestamp, forceRefresh: true } 
        }))
        
        // Refresh user data from server after a delay - no additional events needed
        if (refreshUserData) {
          setTimeout(() => {
            refreshUserData()
          }, 1000)
        }
        
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        throw new Error(data.message || 'Failed to save avatar')
      }
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }, [currentAvatarUrl, user, updateUserAvatar, refreshUserData])

  // Handle Ready Player Me frameApi messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Allow messages from both demo and production ReadyPlayerMe
      if (event.origin !== 'https://readyplayer.me' && event.origin !== 'https://demo.readyplayer.me') return
      
      // Handle different message formats from Ready Player Me
      if (typeof event.data === 'string' && event.data.includes('readyplayer.me') && event.data.includes('.glb')) {
        // Direct URL format
        const avatarUrl = event.data
        setCurrentAvatarUrl(avatarUrl)
        // Delay save to ensure user is loaded
        setTimeout(() => {
          handleSaveAvatar(avatarUrl)
        }, 100)
        return
      }
      
      // Standard frameApi object format
      const { eventName, data } = event.data || {}
      
      if (eventName === 'v1.avatar.exported') {
        setCurrentAvatarUrl(data.url)
        // Delay save to ensure user is loaded
        setTimeout(() => {
          handleSaveAvatar(data.url)
        }, 100)
      } else if (eventName === 'v1.frame.ready') {
        setIsLoading(false)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [user, handleSaveAvatar])

  // Load existing avatar from user context
  useEffect(() => {
    if (user?.avatar) {
      setCurrentAvatarUrl(user.avatar)
    }
  }, [user])

  // Disable scrolling when avatar page is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [])


  // Wait for user to be loaded before rendering
  if (!user) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-700 dark:text-white font-medium">Loading...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="h-[calc(100vh-72px)] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Floating Save Status */}
        {saveStatus !== 'idle' && (
          <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-2">
            <div className={`px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm ${
              saveStatus === 'success' 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}>
              <div className="flex items-center gap-2">
                {isSaving && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span className="font-medium">
                  {isSaving 
                    ? 'Saving...' 
                    : saveStatus === 'success' 
                      ? 'Avatar Saved!' 
                      : 'Save Failed'
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Full-page iframe container */}
        <div className="absolute inset-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-700 dark:text-white font-medium">Loading Avatar Creator...</p>
              </div>
            </div>
          )}
          
          <iframe
            id="rpm-frame"
            src={iframeUrl}
            className="w-full h-full border-0"
            allow="camera; microphone; clipboard-write"
            title="Ready Player Me Avatar Creator"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </ProtectedLayout>
  )
}