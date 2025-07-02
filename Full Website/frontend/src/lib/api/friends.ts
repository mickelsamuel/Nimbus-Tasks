import api from './client'

export interface Colleague {
  id: number
  firstName: string
  lastName: string
  name?: string
  department: string
  role: string
  avatar: string
  skills: string[]
  status: 'online' | 'away' | 'busy' | 'offline'
  isOnline: boolean
  collaborationHistory: number
  collaborationScore: number
  mentorshipPotential: 'mentor' | 'peer' | 'mentee'
  joinedAt: string
  lastActive: string
  projectsInCommon: number
  expertise: string[]
  isConnected: boolean
  connectionStrength: number
  achievements: string[]
  yearsExperience: number
  location: string
  professionalCertifications: string[]
  mutualConnections?: number
  mutualFriends: number
  connectionDate: string
  messageCount: number
}

export interface ConnectionRequest {
  id: number
  from: Colleague
  to: Colleague
  message: string
  timestamp: string
  type: 'colleague' | 'mentorship' | 'collaboration'
  name?: string
  mutualConnections?: number
  avatar?: string
  role?: string
  sentDate?: string
}

export interface NetworkingAnalytics {
  totalConnections: number
  connectionGrowth: number
  departmentBreakdown: Array<{
    department: string
    count: number
    percentage: number
  }>
  skillsNetwork: Array<{
    skill: string
    connections: number
    growth: number
  }>
  activityScore: number
  networkHealth: number
  influenceScore: number
}

export interface FriendsData {
  colleagues: Colleague[]
  connections?: Colleague[]
  connectionRequests: ConnectionRequest[]
  pendingRequests?: ConnectionRequest[]
  analytics: NetworkingAnalytics
  recommendedConnections: Colleague[]
  suggestedConnections?: Colleague[]
  recentActivity: Array<{
    id: number
    type: string
    user: string
    action: string
    timestamp: Date
  }>
}

export const friendsApi = {
  // Get all friends/networking data
  getFriendsData: async (): Promise<{ success: boolean; data: FriendsData }> => {
    const response = await api.get('/friends')
    return response.data
  },

  // Send connection request
  sendConnectionRequest: async (
    colleagueId: number, 
    message: string, 
    type: 'colleague' | 'mentorship' | 'collaboration' = 'colleague'
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/friends/connect', {
      colleagueId,
      message,
      type
    })
    return response.data
  },

  // Accept connection request
  acceptConnection: async (requestId: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/friends/accept/${requestId}`)
    return response.data
  },

  // Decline connection request  
  declineConnection: async (requestId: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/friends/decline/${requestId}`)
    return response.data
  },

  // Remove connection
  removeConnection: async (colleagueId: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/friends/connection/${colleagueId}`)
    return response.data
  },

  // Get colleague recommendations
  getRecommendations: async (): Promise<{ success: boolean; data: Colleague[] }> => {
    const response = await api.get('/friends/recommendations')
    return response.data
  },

  // Search colleagues
  searchColleagues: async (query: string): Promise<{ success: boolean; data: Colleague[] }> => {
    const response = await api.get(`/friends/search?q=${encodeURIComponent(query)}`)
    return response.data
  },

  // Get networking analytics
  getAnalytics: async (): Promise<{ success: boolean; data: NetworkingAnalytics }> => {
    const response = await api.get('/friends/analytics')
    return response.data
  }
}