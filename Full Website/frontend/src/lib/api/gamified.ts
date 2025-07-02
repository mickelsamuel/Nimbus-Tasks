import { api } from './client'

export interface AchievementData {
  id: string
  name: string
  description: string
  icon: string
  category: string
  tier: string
  rarity: string
  rewards: {
    xp: number
    coins: number
  }
  userProgress: {
    progress: number
    unlockedAt: string | null
    tier: string | null
  }
}

export interface LeaderboardData {
  rank: number
  userId: string
  name: string
  avatar: string
  achievementsUnlocked: number
  totalAchievementPoints: number
}

export interface GameStats {
  level: number
  xp: number
  coins: number
  tokens: number
  streak: number
  achievementsUnlocked: number
  modulesCompleted: number
}

// Fetch user achievements
export const fetchAchievements = async (): Promise<AchievementData[]> => {
  try {
    const response = await api.get('/achievements')
    return response.data.data || []
  } catch (error) {
    console.error('Failed to fetch achievements:', error)
    return []
  }
}

// Fetch achievements by category
export const fetchAchievementsByCategory = async (category: string): Promise<AchievementData[]> => {
  try {
    const response = await api.get(`/achievements/category/${category}`)
    return response.data.data || []
  } catch (error) {
    console.error(`Failed to fetch achievements for category ${category}:`, error)
    return []
  }
}

// Check for new achievements
export const checkAchievements = async (): Promise<AchievementData[]> => {
  try {
    const response = await api.post('/achievements/check')
    return response.data.data || []
  } catch (error) {
    console.error('Failed to check achievements:', error)
    return []
  }
}

// Fetch achievement statistics
export const fetchAchievementStats = async () => {
  try {
    const response = await api.get('/achievements/stats/overview')
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch achievement stats:', error)
    return null
  }
}

// Fetch leaderboard
export const fetchLeaderboard = async (type: string = 'overall'): Promise<LeaderboardData[]> => {
  try {
    console.log(`Fetching leaderboard: ${type}`)
    const response = await api.get(`/leaderboards/${type}`)
    console.log(`Leaderboard response:`, response.data)
    return response.data.leaderboard || []
  } catch (error: any) {
    console.error(`Failed to fetch ${type} leaderboard:`, {
      status: error?.status,
      message: error?.message,
      response: error?.response?.data
    })
    
    // If it's an auth error, the token might be invalid
    if (error?.status === 401) {
      console.warn('Authentication failed - token may be expired or invalid')
      // Clear potentially invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
      }
    }
    
    return []
  }
}

// Fetch all leaderboards
export const fetchAllLeaderboards = async () => {
  try {
    const response = await api.get('/leaderboards')
    return response.data.leaderboards
  } catch (error) {
    console.error('Failed to fetch leaderboards:', error)
    return {}
  }
}

// Fetch achievement leaderboard
export const fetchAchievementLeaderboard = async (limit: number = 10): Promise<LeaderboardData[]> => {
  try {
    const response = await api.get(`/achievements/leaderboard/top?limit=${limit}`)
    return response.data.data || []
  } catch (error) {
    console.error('Failed to fetch achievement leaderboard:', error)
    return []
  }
}

// Get user game statistics (from user profile or dashboard)
export const fetchUserGameStats = async (): Promise<GameStats | null> => {
  try {
    const response = await api.get('/dashboard/stats')
    const stats = response.data.stats
    
    return {
      level: Math.floor((stats.xp || 0) / 500) + 1,
      xp: stats.xp || 0,
      coins: stats.coins || 0,
      tokens: stats.tokens || 0,
      streak: stats.streak || 0,
      achievementsUnlocked: stats.achievementsUnlocked || 0,
      modulesCompleted: stats.modulesCompleted || 0
    }
  } catch (error) {
    console.error('Failed to fetch user game stats:', error)
    return null
  }
}

// Update user progress (e.g., when completing modules)
export const updateUserProgress = async (progressData: {
  modulesCompleted?: number
  points?: number
  streak?: number
}) => {
  try {
    const response = await api.post('/api/dashboard/progress', progressData)
    return response.data
  } catch (error) {
    console.error('Failed to update user progress:', error)
    return null
  }
}