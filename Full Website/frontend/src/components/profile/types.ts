export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  role: string
  jobTitle?: string
  joinDate: string
  location: string | { city?: string; province?: string; country?: string }
  avatar: string
  isOnline: boolean
  lastSeen: string
  stats: {
    xp: number
    totalXP?: number
    level: number
    coins: number
    tokens: number
    modulesCompleted: number
    learningHours: number
    currentStreak: number
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    activeSessions: number
  }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: 'en' | 'fr'
    timeFormat: '12h' | '24h'
    notifications: boolean
    emailNotifications?: boolean
    pushNotifications?: boolean
    sounds?: boolean
    doNotDisturb?: boolean
  }
  badges?: Array<{
    icon?: string
    name?: string
    title?: string
    color?: string
  }>
}

export type ProfilePanel = 'personal' | 'accessibility' | 'security' | 'activity' | 'notifications'

export interface ProfileProps {
  user: UserProfile
  onUserUpdate: (user: UserProfile) => void
}

export interface ProfilePanelProps extends ProfileProps {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

// Utility function to format location consistently
export function formatLocation(location: string | { city?: string; province?: string; country?: string } | undefined): string {
  if (!location) {
    return 'Location not set'
  }
  
  if (typeof location === 'string') {
    return location
  }
  
  if (typeof location === 'object') {
    const parts: string[] = []
    if (location.city) parts.push(location.city)
    if (location.province) parts.push(location.province)
    if (location.country) parts.push(location.country)
    return parts.length > 0 ? parts.join(', ') : 'Location not set'
  }
  
  return 'Location not set'
}

// Utility function to safely render any location value
export function safeRenderLocation(location: unknown): string {
  if (!location) {
    return 'Location not set'
  }
  
  if (typeof location === 'string') {
    return location
  }
  
  if (typeof location === 'object' && location !== null) {
    const loc = location as Record<string, unknown>
    const parts: string[] = []
    
    // Try common location properties
    if (typeof loc.city === 'string' && loc.city) parts.push(loc.city)
    if (typeof loc.province === 'string' && loc.province) parts.push(loc.province)
    if (typeof loc.state === 'string' && loc.state) parts.push(loc.state)
    if (typeof loc.country === 'string' && loc.country) parts.push(loc.country)
    
    return parts.length > 0 ? parts.join(', ') : 'Location not set'
  }
  
  // Fallback for any other type
  return 'Location not set'
}