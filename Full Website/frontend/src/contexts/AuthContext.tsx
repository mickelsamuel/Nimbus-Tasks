'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { apiUtils } from '@/lib/api/client'
import { tokenStorage } from '@/utils/tokenStorage'

// Types
interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'employee' | 'manager' | 'admin'
  department: string
  avatar: string
  avatar3D?: string
  avatar2D?: string
  avatarPortrait?: string
  stats: {
    level: number
    xp: number
    coins: number
    tokens: number
    totalXP?: number
    modulesCompleted?: number
    learningHours?: number
    currentStreak?: number
  }
  preferences: {
    theme: 'light' | 'dark'
    language: 'en' | 'fr'
    notifications: boolean
  }
  progress?: number
  coins?: number
  tokens?: number
  coinsEarned?: number
  coinsSpent?: number
  name?: string
  createdAt?: string | Date
  phoneNumber?: string
  level?: number
  xp?: number
  totalXP?: number
  streak: number
  joinedAt: string
  lastActive: string
  hasPolicyAccepted?: boolean
  selectedMode?: 'gamified' | 'standard' | null
  hasCompletedAvatarSetup?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; pendingApproval?: boolean; message?: string }>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  refreshToken: () => Promise<boolean>
  acceptPolicy: () => Promise<{ success: boolean; error?: string }>
  selectMode: (mode: 'gamified' | 'standard') => Promise<{ success: boolean; error?: string }>
  checkUserFlow: () => Promise<{ needsPolicyAcceptance: boolean; needsModeSelection: boolean; needsAvatarSetup: boolean; selectedMode?: string }>
  completeAvatarSetup: (avatarUrl: string) => Promise<{ success: boolean; error?: string }>
  refreshUserData: () => Promise<void>
  updateUserAvatar: (avatarUrl: string, forceUpdate?: boolean) => void
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  department: string
}

interface AuthProviderProps {
  children: ReactNode
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null)

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing token on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const token = tokenStorage.getAccessToken()
      if (!token || !tokenStorage.isTokenValid()) {
        tokenStorage.clearTokens()
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        apiUtils.setAuthToken(token)
      } else {
        // Token is invalid, remove it
        tokenStorage.clearTokens()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      tokenStorage.clearTokens()
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, rememberMe })
      })

      const data = await response.json()

      if (response.ok) {
        // Calculate token expiry
        const tokenExpiry = rememberMe 
          ? Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
          : Date.now() + (24 * 60 * 60 * 1000) // 24 hours

        // Store token with remember me preference
        tokenStorage.setTokens({
          token: data.token,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt || tokenExpiry,
          rememberMe
        })
        
        apiUtils.setAuthToken(data.token)
        
        // Set user data
        setUser(data.user)
        
        // Check flow status and redirect accordingly
        const flowStatus = await checkUserFlow()
        if (flowStatus.needsPolicyAcceptance) {
          router.push('/policy')
        } else if (flowStatus.needsModeSelection) {
          router.push('/choose-mode')
        } else {
          // User has completed flow, redirect to their selected mode
          if (flowStatus.selectedMode === 'gamified') {
            router.push('/gamified')
          } else {
            router.push('/dashboard')
          }
        }
        
        return { success: true }
      } else {
        if (data.pendingApproval) {
          return { success: false, error: data.message, pendingApproval: true }
        }
        return { success: false, error: data.message || data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        if (data.pendingApproval) {
          // User registered but needs admin approval
          return { 
            success: true, 
            pendingApproval: true,
            message: data.message || 'Registration submitted successfully. Your account is pending admin approval.'
          }
        } else {
          // Old flow for immediate approval (if any)
          const tokenExpiry = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          tokenStorage.setTokens({
            token: data.token,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresAt || tokenExpiry,
            rememberMe: false
          })
          apiUtils.setAuthToken(data.token)
          setUser(data.user)
          router.push('/policy')
          return { success: true }
        }
      } else {
        return { success: false, error: data.message || data.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = useCallback(() => {
    tokenStorage.clearTokens()
    apiUtils.removeAuthToken()
    setUser(null)
    router.push('/login')
  }, [router])

  // Update profile function
  const updateProfile = async (updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return { success: false, error: 'Not authenticated' }
      }

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Update failed' }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return false

      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('auth_token', data.token)
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return false
    }
  }, [logout])

  // Accept policy function
  const acceptPolicy = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return { success: false, error: 'Not authenticated' }
      }

      const response = await fetch(`${API_BASE}/auth/accept-policy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        // Update user data
        if (user) {
          setUser({
            ...user,
            hasPolicyAccepted: true
          })
        }
        return { success: true }
      } else {
        return { success: false, error: data.message || 'Policy acceptance failed' }
      }
    } catch (error) {
      console.error('Policy acceptance error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Select mode function
  const selectMode = async (mode: 'gamified' | 'standard') => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return { success: false, error: 'Not authenticated' }
      }

      const response = await fetch(`${API_BASE}/auth/select-mode`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mode })
      })

      const data = await response.json()

      if (response.ok) {
        // Update user data
        if (user) {
          setUser({
            ...user,
            selectedMode: mode
          })
        }
        return { success: true }
      } else {
        return { success: false, error: data.message || 'Mode selection failed' }
      }
    } catch (error) {
      console.error('Mode selection error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Check user flow function
  const checkUserFlow = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return { needsPolicyAcceptance: true, needsModeSelection: true, needsAvatarSetup: true }
      }

      const response = await fetch(`${API_BASE}/auth/flow-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        return data.flowStatus
      } else {
        return { needsPolicyAcceptance: true, needsModeSelection: true, needsAvatarSetup: true }
      }
    } catch (error) {
      console.error('Flow check error:', error)
      return { needsPolicyAcceptance: true, needsModeSelection: true, needsAvatarSetup: true }
    }
  }

  // Complete avatar setup function
  const completeAvatarSetup = async (avatarUrl: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return { success: false, error: 'Not authenticated' }
      }

      const response = await fetch(`${API_BASE}/avatar/complete-setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          avatar: avatarUrl,
          hasCompletedAvatarSetup: true 
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Update user data
        if (user) {
          setUser({
            ...user,
            avatar: avatarUrl,
            hasCompletedAvatarSetup: true
          })
        }
        return { success: true }
      } else {
        return { success: false, error: data.message || 'Avatar setup failed' }
      }
    } catch (error) {
      console.error('Avatar setup error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Refresh user data function
  const refreshUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return
      }

      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.success && data.user) {
          setUser(data.user)
          
          // Dispatch event to notify all components of fresh user data
          window.dispatchEvent(new CustomEvent('userDataRefreshed', {
            detail: { user: data.user }
          }))
        }
      } else {
        console.error('Failed to fetch user data, status:', response.status)
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }, [])

  // Update user avatar in context
  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      // Determine if this is a 3D (.glb) or 2D avatar URL and update all relevant fields
      const is3D = avatarUrl.includes('.glb')
      const is2D = avatarUrl.includes('.png') || avatarUrl.includes('.jpg') || avatarUrl.includes('.jpeg')
      
      const updatedUser = {
        ...user,
        avatar: avatarUrl,
        hasCompletedAvatarSetup: true
      }
      
      if (is3D) {
        updatedUser.avatar3D = avatarUrl
        updatedUser.avatar2D = avatarUrl.replace('.glb', '.png')
        
        // Generate portrait URL from 3D URL
        if (avatarUrl.includes('readyplayer.me')) {
          const avatarId = avatarUrl.match(/\/([a-zA-Z0-9]+)\.glb/)?.[1];
          if (avatarId) {
            updatedUser.avatarPortrait = `https://models.readyplayer.me/${avatarId}.png?textureAtlas=2048&morphTargets=ARKit`;
          } else {
            updatedUser.avatarPortrait = avatarUrl.replace('.glb', '.png');
          }
        }
      } else if (is2D) {
        updatedUser.avatar2D = avatarUrl
        updatedUser.avatarPortrait = avatarUrl // For 2D, portrait is same as 2D
        
        if (avatarUrl.includes('readyplayer.me') && avatarUrl.includes('.png')) {
          updatedUser.avatar3D = avatarUrl.replace('.png', '.glb')
        }
      }
      
      setUser(updatedUser)
      
      // Don't refresh immediately to prevent flickering - let the avatar page handle it
    }
  }

  // Auto-refresh token every 50 minutes and user data every 30 seconds
  useEffect(() => {
    if (user) {
      // Token refresh every 50 minutes
      const tokenInterval = setInterval(() => {
        refreshToken()
      }, 50 * 60 * 1000) // 50 minutes

      // User data refresh every 5 minutes for general sync
      const userDataInterval = setInterval(() => {
        refreshUserData()
      }, 5 * 60 * 1000) // 5 minutes

      return () => {
        clearInterval(tokenInterval)
        clearInterval(userDataInterval)
      }
    }
  }, [user, refreshToken, refreshUserData])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile,
    refreshToken,
    acceptPolicy,
    selectMode,
    checkUserFlow,
    completeAvatarSetup,
    refreshUserData,
    updateUserAvatar
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Backward compatibility export
export const useAuthContext = useAuth

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login')
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner" />
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}