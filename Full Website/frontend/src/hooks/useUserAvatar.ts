'use client'

import { useState, useEffect } from 'react'

interface UserAvatarData {
  avatar: string | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export default function useUserAvatar(): UserAvatarData {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAvatar = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        setAvatar(null)
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAvatar(data.data?.avatar || null)
      } else {
        setError('Failed to fetch avatar')
        setAvatar(null)
      }
    } catch (err) {
      setError('Error loading avatar')
      setAvatar(null)
      console.error('Avatar fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAvatar()
  }, [])

  return {
    avatar,
    isLoading,
    error,
    refetch: fetchAvatar
  }
}