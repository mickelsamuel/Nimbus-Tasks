import api, { ApiResponse } from './client'
import { UserProfile, formatLocation } from '@/components/profile/types'
import { AvatarConfiguration } from '@/lib/avatarApi'

export interface ProfileUpdateData {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  bio?: string
  location?: {
    city?: string
    province?: string
    country?: string
  }
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AvatarUploadResponse {
  avatar: string
}

export interface AvatarUpdateResponse {
  success: boolean
  avatar: string
  message?: string
}

export interface ProfileAnalytics {
  learningProgress: {
    modulesCompleted: number
    totalHours: number
    currentStreak: number
    averageScore: number
  }
  engagement: {
    loginFrequency: number
    sessionDuration: number
    featuresUsed: string[]
    lastActive: string
  }
  achievements: {
    totalEarned: number
    recentUnlocks: Array<{
      id: string
      name: string
      earnedDate: string
    }>
  }
  performance: {
    skillsGrowth: Array<{
      skill: string
      progress: number
      trend: 'up' | 'down' | 'stable'
    }>
    competencyScores: Record<string, number>
  }
}

// Profile API functions
export const profileApi = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<ApiResponse<UserProfile>>('/profile')
    const profile = (response.data as any).data || response.data as any
    
    // Ensure location is consistently formatted as a string
    if (profile && typeof (profile as any).location === 'object') {
      (profile as any).location = formatLocation((profile as any).location)
    }
    
    return profile as UserProfile
  },

  // Update user profile
  updateProfile: async (data: ProfileUpdateData): Promise<UserProfile> => {
    const response = await api.put<ApiResponse<UserProfile>>('/profile', data)
    const profile = (response.data as any).data || response.data as any
    
    // Ensure location is consistently formatted as a string
    if (profile && typeof (profile as any).location === 'object') {
      (profile as any).location = formatLocation((profile as any).location)
    }
    
    return profile as UserProfile
  },

  // Change password
  changePassword: async (data: PasswordChangeData): Promise<void> => {
    await api.put('/profile/password', data)
  },

  // Update avatar configuration
  updateAvatar: async (avatarConfiguration: AvatarConfiguration): Promise<AvatarUpdateResponse> => {
    const response = await api.put<ApiResponse<AvatarUpdateResponse>>('/profile/avatar', { avatarConfiguration })
    return (response.data as any).data || response.data as any
  },

  // Upload profile photo
  uploadPhoto: async (file: File): Promise<AvatarUploadResponse> => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post<ApiResponse<AvatarUploadResponse>>(
      '/profile/upload-photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return (response.data as any).data || response.data as any
  },

  // Get user analytics
  getAnalytics: async (timeframe = 'month'): Promise<ProfileAnalytics> => {
    const response = await api.get<ApiResponse<ProfileAnalytics>>(`/profile/analytics?timeframe=${timeframe}`)
    return (response.data as any).data || response.data as any
  }
}

export default profileApi