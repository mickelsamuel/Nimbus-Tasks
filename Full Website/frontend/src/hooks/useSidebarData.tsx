'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Home,
  BookOpen,
  TrendingUp,
  Users,
  UserPlus,
  Calendar,
  Trophy,
  MapPin,
  Clock,
  User,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Shield,
  Star,
  Zap,
  BarChart3,
  Building2
} from 'lucide-react'
import { SidebarUser, NavSection } from '@/components/layout/types'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api/client'

interface SidebarData {
  user: SidebarUser | null
  navSections: NavSection[]
  isLoading: boolean
  error: string | null
}

interface NotificationCounts {
  modules?: number
  events?: string | number
  teams?: number
  friends?: number
  shop?: string | number
}

interface ProgressStats {
  level?: number
  progress?: number
  streak?: number
  completedModules?: number
  totalModules?: number
}

export function useSidebarData() {
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth()
  
  const [data, setData] = useState<SidebarData>({
    user: null,
    navSections: [],
    isLoading: true,
    error: null
  })

  // Convert AuthContext user to SidebarUser format
  const mapAuthUserToSidebarUser = useCallback((authUser: any, stats?: ProgressStats): SidebarUser | null => {
    if (!authUser) return null

    return {
      id: authUser.id,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      role: authUser.role,
      department: authUser.department,
      avatar: authUser.avatar || authUser.avatar3D || authUser.avatar2D || '',
      level: stats?.level || authUser.stats?.level || 0,
      progress: stats?.progress || authUser.progress || 0,
      streak: stats?.streak || authUser.streak || 0
    }
  }, [])

  // Fetch progress statistics from API
  const fetchProgressStats = useCallback(async (): Promise<ProgressStats | null> => {
    if (!isAuthenticated) return null

    try {
      const response = await api.get('/dashboard/stats')
      const statsData = response.data

      if (statsData.success && statsData.data) {
        const data = statsData.data
        return {
          level: data.level,
          progress: data.completedModules && data.totalModules 
            ? Math.round((data.completedModules / Math.max(data.totalModules, 1)) * 100) 
            : data.progress,
          streak: data.streak,
          completedModules: data.completedModules,
          totalModules: data.totalModules
        }
      }
    } catch (error) {
      console.warn('Failed to fetch progress stats:', error)
    }

    return null
  }, [isAuthenticated])

  // Fetch notification counts for badges
  const fetchNotificationCounts = useCallback(async (): Promise<NotificationCounts> => {
    if (!isAuthenticated) return {}

    try {
      const response = await api.get('/notifications/unread-count')
      const data = response.data

      if (data.success && data.data) {
        const categories = data.data.categories || data.categories || {}
        return {
          modules: categories.learning > 0 ? categories.learning : undefined,
          events: categories.events > 0 ? 'LIVE' : undefined,
          teams: categories.social > 0 ? categories.social : undefined,
          friends: categories.social > 0 ? categories.social : undefined,
          shop: categories.shop > 0 ? categories.shop : undefined
        }
      }
    } catch (error) {
      console.warn('Failed to fetch notification counts:', error)
    }

    return {}
  }, [isAuthenticated])

  // Build navigation sections with dynamic data
  const buildNavSections = useCallback(async (user: SidebarUser): Promise<NavSection[]> => {
    const counts = await fetchNotificationCounts()
    
    const sections: NavSection[] = [
      {
        id: 'core',
        title: 'Core Learning',
        icon: <Zap className="h-4 w-4" />,
        items: [
          { id: 'dashboard', title: 'Dashboard', icon: <Home className="h-5 w-5" />, href: '/dashboard' },
          { 
            id: 'modules', 
            title: 'Modules', 
            icon: <BookOpen className="h-5 w-5" />, 
            href: '/modules', 
            ...(counts.modules && { badge: counts.modules, badgeType: 'info' as const })
          },
          { id: 'simulation', title: 'Simulation', icon: <TrendingUp className="h-5 w-5" />, href: '/simulation' },
          { 
            id: 'career', 
            title: 'Career Map', 
            icon: <MapPin className="h-5 w-5" />, 
            href: '/career',
            ...(user.progress && { progress: user.progress })
          },
          { id: 'spaces', title: 'Virtual Spaces', icon: <Building2 className="h-5 w-5" />, href: '/spaces' }
        ]
      },
      {
        id: 'social',
        title: 'Social Features',
        icon: <Users className="h-4 w-4" />,
        items: [
          { 
            id: 'teams', 
            title: 'Teams', 
            icon: <Users className="h-5 w-5" />, 
            href: '/teams',
            ...(counts.teams && { badge: counts.teams, badgeType: 'success' as const })
          },
          { 
            id: 'friends', 
            title: 'Friends', 
            icon: <UserPlus className="h-5 w-5" />, 
            href: '/friends',
            ...(counts.friends && { badge: counts.friends, badgeType: 'warning' as const })
          },
          { 
            id: 'events', 
            title: 'Events', 
            icon: <Calendar className="h-5 w-5" />, 
            href: '/events',
            ...(counts.events && { badge: counts.events, badgeType: 'danger' as const })
          },
          { id: 'innovation-lab', title: 'Innovation Lab', icon: <Sparkles className="h-5 w-5" />, href: '/innovation-lab' }
        ]
      },
      {
        id: 'progress',
        title: 'Progress',
        icon: <BarChart3 className="h-4 w-4" />,
        items: [
          { id: 'leaderboards', title: 'Leaderboards', icon: <Trophy className="h-5 w-5" />, href: '/leaderboards' },
          { id: 'timeline', title: 'Timeline', icon: <Clock className="h-5 w-5" />, href: '/timeline' },
          { id: 'achievements', title: 'Achievements', icon: <Star className="h-5 w-5" />, href: '/achievements' }
        ]
      },
      {
        id: 'personal',
        title: 'Personal',
        icon: <User className="h-4 w-4" />,
        items: [
          { id: 'profile', title: 'Profile', icon: <User className="h-5 w-5" />, href: '/profile' },
          { id: 'avatar', title: 'Avatar', icon: <Sparkles className="h-5 w-5" />, href: '/avatar' },
          { 
            id: 'shop', 
            title: 'Shop', 
            icon: <ShoppingBag className="h-5 w-5" />, 
            href: '/shop',
            ...(counts.shop && { badge: counts.shop, badgeType: 'warning' as const })
          },
          { id: 'chat', title: 'Chat', icon: <MessageSquare className="h-5 w-5" />, href: '/chat' }
        ]
      }
    ]

    // Add management section for managers
    if (user.role?.toLowerCase() === 'manager') {
      sections.push({
        id: 'management',
        title: 'Management',
        icon: <Shield className="h-4 w-4" />,
        items: [
          { id: 'manager', title: 'Manager Panel', icon: <BarChart3 className="h-5 w-5" />, href: '/manager' }
        ]
      })
    }

    // Add administration section for admins only
    if (user.role?.toLowerCase() === 'admin') {
      sections.push({
        id: 'administration', 
        title: 'Administration',
        icon: <Shield className="h-4 w-4" />,
        items: [
          { id: 'admin', title: 'Admin Panel', icon: <Shield className="h-5 w-5" />, href: '/admin' }
        ]
      })
    }

    return sections
  }, [fetchNotificationCounts])

  // Load all sidebar data
  const loadSidebarData = useCallback(async () => {
    if (authLoading) return

    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }))
      
      if (!isAuthenticated || !authUser) {
        setData({
          user: null,
          navSections: [],
          isLoading: false,
          error: 'User not authenticated'
        })
        return
      }

      // Fetch progress stats from API
      const progressStats = await fetchProgressStats()
      
      // Convert auth user to sidebar user format
      const sidebarUser = mapAuthUserToSidebarUser(authUser, progressStats || undefined)
      
      if (!sidebarUser) {
        throw new Error('Failed to process user data')
      }
      
      const navSections = await buildNavSections(sidebarUser)
      
      setData({
        user: sidebarUser,
        navSections,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Error loading sidebar data:', error)
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load sidebar data'
      }))
    }
  }, [authLoading, isAuthenticated, authUser, fetchProgressStats, mapAuthUserToSidebarUser, buildNavSections])

  // Load data when auth state changes
  useEffect(() => {
    loadSidebarData()
  }, [loadSidebarData])

  // Set up periodic refresh for notification counts (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      loadSidebarData()
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [isAuthenticated, loadSidebarData])

  return {
    ...data,
    refresh: loadSidebarData
  }
}