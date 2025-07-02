import React from 'react'

// User Types
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  avatar: string
  level: number
  progress: number
  streak: number
  coins?: number
  tokens?: number
  xp?: number
  totalXP?: number
  lastLogin?: Date | string
  isActive?: boolean
  selectedMode?: 'standard' | 'gamified'
  jobTitle?: string
  collaborationHistory?: number
  coinsEarned?: number
  coinsSpent?: number
  name?: string
  createdAt?: string | Date
  phoneNumber?: string
  status?: 'active' | 'inactive' | 'offline'
  company?: string
  joinedAt?: string
  totalPoints?: number
  modulesCompleted?: number
  achievementsCount?: number
  completionRate?: number
  stats?: {
    level: number
    coins: number
    tokens: number
    totalXP?: number
    xp?: number
    modulesCompleted?: number
    learningHours?: number
    currentStreak?: number
  }
}

// Achievement Types
export interface Achievement {
  id: string
  title: string
  description: string
  detailedDescription: string
  impact: string
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic' | 'common' | 'rare' | 'epic' | 'legendary'
  category: 'learning' | 'performance' | 'social' | 'exploration' | 'milestones' | 'special'
  icon: React.ComponentType<{ className?: string }> | string
  progress: number
  maxProgress: number
  unlocked: boolean
  dateUnlocked?: string
  dateEarned?: Date
  xp?: number
  points?: number
  streak?: number
}

// Space Types
export interface VirtualSpace {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  environment: string
  currentUsers: number
  maxUsers: number
  difficulty?: string
  features: string[]
  achievements?: string[]
  category?: string
  status?: 'available' | 'busy' | 'reserved'
  occupancy?: number
  capacity?: number
  averageStayDuration?: number
  location?: string
  image?: string
  activities?: Array<{
    user: string
    action: string
    time: string
  }>
  ambiance?: string
  lighting?: string
  temperature?: string
}

// User in Space
export interface SpaceUser {
  id: string
  name: string
  avatar: string
  activity: string
  status: 'online' | 'away' | 'busy'
  x?: number
  y?: number
  opacity?: number
}

// Particle Types
export interface Particle {
  id: string
  x: number
  y: number
  opacity: number
}

// Timeline Event Types
export interface TimelineEvent {
  id: string
  year: number
  title: string
  date: string
  description: string
  type: 'milestone' | 'innovation' | 'achievement' | 'expansion' | 'social-impact'
  category: string
  era?: 'pioneer' | 'growth' | 'innovation' | 'digital'
  images?: string[]
  videos?: string[]
  relatedEvents?: string[]
  impact?: {
    metric: string
    value: string
  }[]
}

// Learning Module Types (renamed to avoid conflicts)
export interface LearningModule {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  progress: number
  completed: boolean
  locked: boolean
}

// Team Types
export interface Team {
  id: string
  name: string
  description: string
  members: User[]
  leader: User
  createdAt: Date
  isPublic: boolean
}

// Event Types
export interface Event {
  id: string
  title: string
  description: string
  date: Date
  type: 'workshop' | 'competition' | 'webinar' | 'networking'
  participants: number
  maxParticipants: number
  location: string
  isVirtual: boolean
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
  userId: string
}

// Shop Item Types
export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  currency: 'coins' | 'tokens'
  type: 'avatar' | 'theme' | 'badge' | 'powerup'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  image: string
  owned: boolean
}

// University Types
export interface Hackathon {
  id: number
  title: string
  description: string
  status: string
  participants: number
  maxParticipants: number
  prize: string
  startDate: string
  endDate: string
  technologies: string[]
  sponsors: string[]
  winners?: string[]
  location?: string
  difficulty?: string
  type?: string
  registrationDeadline?: string
  teamSize?: string
  submissions?: number
}

export interface UniversityEvent {
  id: number
  title: string
  description: string
  date: Date | string
  type: string
  participants: number
  maxParticipants: number
  location: string
  isVirtual: boolean
  tags?: string[]
  virtual?: boolean
  price?: string
}

export interface Project {
  id: number
  title: string
  team: string[]
  award: string
  technologies: string[]
  description: string
  github: string
  demo: string
  impact: string
  // Additional properties for innovation lab
  status?: string
  color?: string
  icon?: React.ComponentType<{ className?: string }>
  category?: string
  difficulty?: string
  sponsor?: string
  prize?: string
  timeLeft?: string
  participants?: number
  submissions?: number
  rating?: number
  progress?: number
  requirements?: string[]
}

// Portfolio Types
export interface Portfolio {
  id: string
  userId: string
  totalValue: number
  dailyChange: number
  positions: Position[]
}

export interface Position {
  id: string
  symbol: string
  name: string
  quantity: number
  price: number
  change: number
  value: number
}

// Market Data Types
export interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  lastUpdate: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  department: string
  employeeId?: string
  agreeToTerms: boolean
}

// Chat Types
export interface ChatMessage {
  id: string
  content: string
  sender: User
  timestamp: Date
  type: 'text' | 'image' | 'file'
  edited?: boolean
  reactions?: MessageReaction[]
}

export interface MessageReaction {
  emoji: string
  users: string[]
  count: number
}

export interface ChatRoom {
  id: string
  name: string
  description?: string
  type: 'public' | 'private' | 'direct'
  members: User[]
  lastMessage?: ChatMessage
  unreadCount: number
}

// Filter and Search Types
export interface FilterOptions {
  category?: string
  difficulty?: string
  status?: string
  dateRange?: {
    start: Date
    end: Date
  }
  search?: string
}

// Statistics Types
export interface UserStats {
  totalXP: number
  level: number
  modulesCompleted: number
  achievementsUnlocked: number
  streakDays: number
  totalLearningTime: number
  rank: string
}

export interface LeaderboardEntry {
  rank: number
  user: User
  score: number
  change: number
}

// Component Props Types
export interface PageProps {
  params?: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  hover?: boolean
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  accentColor: string
  fontSize: 'small' | 'medium' | 'large'
  animations: boolean
  sounds: boolean
}

// Navigation Types
export interface NavItem {
  id: string
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavItem[]
  locked?: boolean
}

export interface BreadcrumbItem {
  title: string
  href?: string
  active?: boolean
}

// Friends and Networking Types
export interface Colleague {
  id: number
  firstName: string
  lastName: string
  department: string
  role: string
  avatar: string
  skills: string[]
  status: 'online' | 'away' | 'busy' | 'offline'
  collaborationHistory: number
  mentorshipPotential: 'mentor' | 'mentee' | 'peer'
  joinedAt: string
  lastActive: string
  projectsInCommon: number
  expertise: string[]
  isConnected: boolean
  connectionStrength?: number
  achievements?: string[]
  yearsExperience?: number
  location?: string
  professionalCertifications?: string[]
  name?: string
  isOnline?: boolean
}

export interface ConnectionRequest {
  id: number
  from: Colleague
  to: number
  message: string
  endorsements: string[]
  mutualConnections?: number
  timestamp: string
  status: 'pending' | 'accepted' | 'declined'
  recommendationLetter?: string
  departmentVerified?: boolean
  projectRelevance?: string
  professionalEndorsements?: {
    endorser: string
    role: string
    endorsement: string
  }[]
  // Direct properties for compatibility
  name?: string
  avatar?: string
  role?: string
  sentDate?: string
}