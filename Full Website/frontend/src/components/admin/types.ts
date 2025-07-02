export type AdminTab = 'dashboard' | 'personnel' | 'education' | 'commerce' | 'achievements' | 'intelligence' | 'system' | 'security'

export interface SystemMetric {
  id: string
  label: string
  value: number | string
  change: number
  status: 'healthy' | 'warning' | 'critical'
  trend: number[]
  trendDirection?: 'up' | 'down' | 'stable' | 'neutral'
  unit?: string
  lastUpdated: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee'
  status: 'active' | 'inactive' | 'suspended'
  lastActive: string
  avatar: string
  department: string
  joinDate: string
  completionRate: number
  points: number
}

export interface AdminModule {
  id: string
  title: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  completionRate: number
  enrolledUsers: number
  status: 'active' | 'draft' | 'archived'
  createdDate: string
  lastUpdated: string
  ratings: number
  totalRatings: number
}

export interface Training {
  id: string
  userId: string
  userName: string
  moduleId: string
  moduleName: string
  progress: number
  status: 'in_progress' | 'completed' | 'failed' | 'not_started'
  startDate: string
  completionDate?: string
  timeSpent: number
  score?: number
}

export interface MetricCardProps {
  metric: SystemMetric
  index: number
}

export interface UserCardProps {
  user: User
  index: number
}

export interface ModuleCardProps {
  module: AdminModule
  index: number
}

// Export Module as an alias for AdminModule for backward compatibility
export type Module = AdminModule

export interface ActivityItem {
  id: number
  user: string
  action: string
  time: string
  type: 'completion' | 'warning' | 'social' | 'achievement' | 'system'
}