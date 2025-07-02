export interface DashboardData {
  welcome: {
    greeting: string
    motivationalMessage: string
    weatherAware: boolean
    achievements: string[]
  }
  stats: {
    assignedModules: number
    inProgressModules: number
    completedModules: number
    xpEarned: number
    pointsEarned: number // Added for compatibility
    weeklyProgress: number
    streak: number
    level: number
    nextLevelProgress: number
  }
  quickActions: Array<{
    id: number
    title: string
    subtitle: string
    icon: string
    href: string
    progress?: number
    priority: string
    badge?: string
    participants?: number
  }>
  learningProgress: {
    currentPath: string
    completedModules: number
    totalModules: number
    estimatedCompletion: string
    nextMilestone: string
    xpGained: number
    xpToNextLevel: number
  }
  recentActivity: Array<{
    id: number
    type: string
    title: string
    timestamp: Date | string
    xp: number
    points: number // Added for compatibility
    icon: string
  }>
  insights: {
    weeklyPerformance: string
    strongestSkill: string
    improvementArea: string
    recommendations: string[]
  }
  teamActivity: Array<{
    id: number
    user: string
    avatar: string
    action: string
    timestamp: Date | string
    xp: number
    points: number // Added for compatibility
  }>
}

export interface DashboardStats {
  assignedModules: number
  inProgressModules: number
  completedModules: number
  xpEarned: number
  pointsEarned: number // Added for compatibility
  weeklyProgress: number
  streak: number
  level: number
  nextLevelProgress: number
}

export interface QuickAction {
  id: number
  title: string
  subtitle: string
  icon: string
  href: string
  progress?: number
  priority: string
  badge?: string
  participants?: number
}

export interface LearningProgress {
  currentPath: string
  completedModules: number
  totalModules: number
  estimatedCompletion: string
  nextMilestone: string
  xpGained: number
  xpToNextLevel: number
}

export interface Activity {
  id: number
  type: string
  title: string
  timestamp: Date | string
  xp: number
  points: number // Added for compatibility
  icon: string
}

export interface TeamActivity {
  id: number
  user: string
  avatar: string
  action: string
  timestamp: Date | string
  xp: number
  points: number // Added for compatibility
}

export interface Insights {
  weeklyPerformance: string
  strongestSkill: string
  improvementArea: string
  recommendations: string[]
}