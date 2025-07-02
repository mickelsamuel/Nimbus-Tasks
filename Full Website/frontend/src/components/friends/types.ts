export interface User {
  id: number
  firstName: string
  lastName: string
  role: string
  department: string
  avatar: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastActive: string
  mutualFriends: number
  skills: string[]
  isOnline: boolean
  connectionDate: string
  messageCount: number
  collaborationScore: number
  collaborationHistory?: number
}

export interface ConnectionRequest {
  id: number
  from: User
  message: string
  timestamp: string
  mutualConnections: number
}

export interface FriendsStats {
  totalConnections: number
  newRequests: number
  onlineFriends: number
  mutualConnections: number
  weeklyGrowth: number
}

export interface RecentActivity {
  id: number
  type: 'connection' | 'message' | 'collaboration' | 'achievement' | string
  user: string
  action: string
  timestamp: string
  avatar: string
}

export interface FriendsData {
  stats: FriendsStats
  connections?: User[]
  colleagues?: User[]
  pendingRequests?: ConnectionRequest[]
  suggestedConnections?: User[]
  recentActivity: RecentActivity[]
}

export type TabType = 'overview' | 'find' | 'requests' | 'connections' | 'chat' | 'analytics'

export interface TabConfig {
  id: TabType
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

export interface SearchFilters {
  department: string
  skills: string[]
  status: string
  searchTerm: string
  departmentFilter: string
  mentorshipFilter: string
  statusFilter: string
  skillsFilter: string[]
}

export interface Colleague {
  id: number
  firstName: string
  lastName: string
  role: string
  department: string
  avatar: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastActive: string
  mutualFriends: number
  skills: string[]
  isOnline: boolean
  connectionDate: string
  messageCount: number
  collaborationScore: number
  collaborationHistory?: number
  yearsExperience?: number
  isConnected?: boolean
  projectsInCommon?: number
  connectionStrength?: number
  location?: string
  joinedAt?: string
  expertise: string[]
  professionalCertifications: Array<{
    name: string
    issuer: string
    date: string
  }>
  achievements: Array<{
    title: string
    description: string
    date: string
  }>
  mentorshipPotential: string
}

export interface NetworkingAnalytics {
  totalConnections: number
  connectionGrowth: number
  engagementRate: number
  networkingGrowth?: number
  professionalInfluence?: number
  topDepartments: Array<{
    name: string
    count: number
  }>
  monthlyActivity: Array<{
    month: string
    connections: number
    messages: number
  }>
}