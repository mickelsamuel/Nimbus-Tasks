import { TeamMember, TeamMetrics } from '@/components/manager/types'
import { apiClient } from './client'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface TeamOverviewResponse {
  members: TeamMember[]
  metrics: TeamMetrics
  departments: string[]
}

export interface AnalyticsData {
  performanceTrends: number[]
  departmentComparison: {
    dept: string
    score: number
    change: string
    members: number
  }[]
  insights: {
    type: string
    metric: string
    description: string
    confidence?: string
    trend?: string
    priority?: string
  }[]
  weeklyPoints?: number
  activeCompetitors?: number
  recentActivities?: any[]
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: string
  completionRate: number
  recommended: boolean
  prerequisites?: string[]
  skills?: string[]
}

export interface TrainingModulesResponse {
  modules: TrainingModule[]
  categories: string[]
  difficulties: string[]
}

export interface TrainingAssignment {
  id: string
  moduleIds: string[]
  memberIds: string[]
  schedule: string
  deadline?: string
  createdAt: string
  status: string
  assignedBy: string
}

export interface Achievement {
  id: number
  title: string
  description: string
  rarity: string
  date: string
  members: number
  icon: string
}

export interface AchievementsResponse {
  achievements: Achievement[]
  stats: {
    totalAchievements: number
    legendaryBadges: number
    goalCompletion: number
  }
}

// Team Management API
export const managerApi = {
  // Get team overview with optional filters
  getTeamOverview: async (filters?: {
    department?: string
    status?: string
    search?: string
  }): Promise<TeamOverviewResponse> => {
    try {
      const response = await apiClient.get('/manager/team', { params: filters })
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch team overview')
      }
      
      return response.data.data
    } catch (error) {
      console.error('Error fetching team overview:', error)
      throw error
    }
  },

  // Get team analytics
  getAnalytics: async (period = '7d'): Promise<AnalyticsData> => {
    try {
      const response = await apiClient.get('/manager/analytics', { params: { period } })
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch analytics')
      }
      
      return response.data.data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  },

  // Get training modules
  getTrainingModules: async (filters?: {
    category?: string
    difficulty?: string
    recommended?: boolean
  }): Promise<TrainingModulesResponse> => {
    const params = new URLSearchParams()
    
    if (filters?.category) params.append('category', filters.category)
    if (filters?.difficulty) params.append('difficulty', filters.difficulty)
    if (filters?.recommended) params.append('recommended', 'true')
    
    const queryString = params.toString()
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    const url = `${API_BASE}/manager/training/modules${queryString ? `?${queryString}` : ''}`
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result: ApiResponse<TrainingModulesResponse> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch training modules')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching training modules:', error)
      throw error
    }
  },

  // Assign training to team members
  assignTraining: async (assignment: {
    moduleIds: string[]
    memberIds: string[]
    schedule?: string
    deadline?: string
  }): Promise<TrainingAssignment> => {
    try {
      const response = await apiClient.post('/manager/training/assign', assignment)
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to assign training')
      }
      
      return response.data.data
    } catch (error) {
      console.error('Error assigning training:', error)
      throw error
    }
  },

  // Get team achievements
  getAchievements: async (): Promise<AchievementsResponse> => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await fetch(`${API_BASE}/manager/achievements`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result: ApiResponse<AchievementsResponse> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch achievements')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching achievements:', error)
      throw error
    }
  },

  // Get individual team member details
  getMemberDetails: async (memberId: string): Promise<TeamMember & {
    recentActivity: Array<{
      type: string
      module?: string
      achievement?: string
      date: string
    }>
    performanceHistory: number[]
    goals: Array<{
      id: number
      title: string
      progress: number
      dueDate: string
    }>
  }> => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await fetch(`${API_BASE}/manager/member/${memberId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch member details')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching member details:', error)
      throw error
    }
  },

  // Update team member
  updateMember: async (memberId: string, updates: Partial<TeamMember>): Promise<TeamMember> => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await fetch(`${API_BASE}/manager/member/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse<TeamMember> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to update member')
      }
      
      return result.data
    } catch (error) {
      console.error('Error updating member:', error)
      throw error
    }
  }
}

export default managerApi