import { api } from './client'

export interface LeaderboardUser {
  id: number
  name: string
  department: string
  avatar: string
  score: number
  rank: number
  previousRank: number
  achievements: number
  streak: number
  completedModules: number
  averageScore: number
  trend: 'up' | 'down' | 'stable'
  badges: string[]
  country?: string
  team?: string
}

export interface LeaderboardData {
  global: LeaderboardUser[]
  department: LeaderboardUser[]
  team: LeaderboardUser[]
  achievements: LeaderboardUser[]
  liveEvents: LeaderboardUser[]
  seasonal: LeaderboardUser[]
}

export interface LeaderboardResponse {
  success: boolean
  leaderboards?: LeaderboardData
  leaderboard?: LeaderboardUser[]
  message?: string
}

// Get all leaderboards
export const getAllLeaderboards = async (): Promise<LeaderboardData> => {
  try {
    const response = await api.get('/leaderboards')
    return response.data.leaderboards || {
      global: [],
      department: [],
      team: [],
      achievements: [],
      liveEvents: [],
      seasonal: []
    }
  } catch (error) {
    // Only log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching leaderboards:', error)
    }
    throw error
  }
}

// Get specific leaderboard type
export const getLeaderboardByType = async (type: string): Promise<LeaderboardUser[]> => {
  try {
    const response = await api.get(`/leaderboards/${type}`)
    return response.data.leaderboard || []
  } catch (error) {
    console.error(`Error fetching ${type} leaderboard:`, error)
    return []
  }
}


// Update leaderboard entries (for real-time updates)
export const updateLeaderboardEntry = async (userId: number, score: number) => {
  try {
    const response = await api.patch(`/leaderboards/update`, { userId, score })
    return response.data
  } catch (error) {
    console.error('Error updating leaderboard entry:', error)
    throw error
  }
}

// Get user's position in leaderboards
export const getUserPosition = async (userId: number) => {
  try {
    const response = await api.get(`/leaderboards/user/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user position:', error)
    throw error
  }
}

// Get leaderboard analytics
export const getLeaderboardAnalytics = async () => {
  try {
    const response = await api.get('/leaderboards/analytics')
    return response.data
  } catch (error) {
    // Only log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching leaderboard analytics:', error)
    }
    throw error
  }
}