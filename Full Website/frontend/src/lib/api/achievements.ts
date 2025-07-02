import { api } from './client'

export interface Achievement {
  id: number
  title: string
  description: string
  iconName: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: string
  createdAt: string
  members: number
  category: string
  points: number
}

export interface AchievementStats {
  total: number
  legendary: number
  completionRate: number
}

export interface TeamAchievementsResponse {
  success: boolean
  achievements: Achievement[]
  stats: AchievementStats
  message?: string
}

class AchievementsAPI {
  async getTeamAchievements(): Promise<TeamAchievementsResponse> {
    try {
      const response = await api.get('/achievements/team')
      return response.data
    } catch (error) {
      console.error('Failed to fetch team achievements:', error)
      throw error
    }
  }

  async getUserAchievements(): Promise<TeamAchievementsResponse> {
    try {
      const response = await api.get('/achievements/user')
      return response.data
    } catch (error) {
      console.error('Failed to fetch user achievements:', error)
      throw error
    }
  }

  async getAchievementDetails(achievementId: number) {
    try {
      const response = await api.get(`/achievements/${achievementId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch achievement details:', error)
      throw error
    }
  }
}

export const achievementsAPI = new AchievementsAPI()