// TypeScript Interfaces for Manager System
export interface TeamMember {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
  performance: number
  completedModules: number
  totalModules: number
  lastActive: Date
  status: 'active' | 'away' | 'offline'
  skills: string[]
}

export interface TeamMetrics {
  totalMembers: number
  activeToday: number
  completionRate: number
  averagePerformance: number
  pendingAssignments: number
  upcomingDeadlines: number
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  completionRate: number
}

export type ManagerTab = 'overview' | 'analytics' | 'training' | 'achievements' | 'development' | 'settings'

export interface ManagerPageProps {
  activeTab: ManagerTab
  setActiveTab: (tab: ManagerTab) => void
  teamMembers: TeamMember[]
  teamMetrics: TeamMetrics
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDepartment: string
  setSelectedDepartment: (dept: string) => void
}