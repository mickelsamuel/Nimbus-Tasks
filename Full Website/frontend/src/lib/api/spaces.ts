import { VirtualSpace } from '@/types'
import { api } from './client'

export interface SpaceAnalytics {
  totalVisits: number
  currentUsers: number
  maxUsers: number
  occupancyPercentage: number
  occupancyStatus: 'low' | 'medium' | 'high'
  avgSessionDuration: number
  totalTimeSpent: number
  peakHour: string
  popularityScore: number
  activeUsers: Array<{
    name: string
    avatar: string
    activity: string
    status: string
    sessionDuration: number
  }>
}

export interface SpacesResponse {
  success: boolean
  data: VirtualSpace[]
  total: number
}

export interface SpaceResponse {
  success: boolean
  data: VirtualSpace
}

export interface SpaceAnalyticsResponse {
  success: boolean
  data: SpaceAnalytics
}

class SpacesAPI {
  // Get all available spaces
  async getSpaces(): Promise<SpacesResponse> {
    const response = await api.get('/spaces')
    return response.data
  }

  // Get specific space details
  async getSpace(spaceId: string): Promise<SpaceResponse> {
    const response = await api.get(`/spaces/${spaceId}`)
    return response.data
  }

  // Join a space
  async joinSpace(spaceId: string, activity?: string): Promise<SpaceResponse> {
    const response = await api.post(`/spaces/${spaceId}/join`, {
      activity: activity || 'exploring'
    })
    return response.data
  }

  // Leave a space
  async leaveSpace(spaceId: string): Promise<{ success: boolean; message: string; sessionDuration?: number }> {
    const response = await api.post(`/spaces/${spaceId}/leave`)
    return response.data
  }

  // Update user activity in space
  async updateActivity(spaceId: string, activity: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put(`/spaces/${spaceId}/activity`, {
      activity
    })
    return response.data
  }

  // Get space analytics
  async getSpaceAnalytics(spaceId: string): Promise<SpaceAnalyticsResponse> {
    const response = await api.get(`/spaces/${spaceId}/analytics`)
    return response.data
  }

  // Get users in a space (from space analytics)
  async getSpaceUsers(spaceId: string): Promise<{ success: boolean; users: any[] }> {
    try {
      const analyticsResponse = await this.getSpaceAnalytics(spaceId)
      if (analyticsResponse.success) {
        return {
          success: true,
          users: analyticsResponse.data.activeUsers.map(user => ({
            id: user.name,
            name: user.name,
            avatar: user.avatar,
            currentActivity: user.activity,
            status: user.status,
            position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }
          }))
        }
      }
      return { success: false, users: [] }
    } catch (error) {
      return { success: false, users: [] }
    }
  }

  // Search spaces
  async searchSpaces(query: string): Promise<SpacesResponse & { query: string }> {
    const response = await api.get(`/spaces/search/${encodeURIComponent(query)}`)
    return response.data
  }

  // Admin: Create new space
  async createSpace(spaceData: Partial<VirtualSpace>): Promise<SpaceResponse> {
    const response = await api.post('/spaces/admin/create', spaceData)
    return response.data
  }
}

export const spacesAPI = new SpacesAPI()
export default spacesAPI