'use client'

import { useState, useEffect, useCallback } from 'react'
import { VirtualSpace, SpaceUser, Particle } from '@/types'
import { spacesAPI, SpaceAnalytics } from '@/lib/api/spaces'
import { transformSpaceData } from '@/utils/iconMapping'

export interface UseSpacesReturn {
  // State
  spaces: VirtualSpace[]
  selectedSpace: string
  currentSpace: VirtualSpace | undefined
  joinedSpace: string | null
  hoveredSpace: string | null
  isNavigating: boolean
  showJoinModal: boolean
  virtualUsers: SpaceUser[]
  particles: Particle[]
  userActivity: string
  analytics: SpaceAnalytics | null
  loading: boolean
  error: string | null

  // Actions
  setSelectedSpace: (spaceId: string) => void
  setHoveredSpace: (spaceId: string | null) => void
  setShowJoinModal: (show: boolean) => void
  handleSpaceNavigation: (spaceId: string) => void
  joinSpace: (spaceId: string) => Promise<void>
  leaveSpace: () => Promise<void>
  updateActivity: (activity: string) => Promise<void>
  refreshSpaces: () => Promise<void>
  searchSpaces: (query: string) => Promise<VirtualSpace[]>
}

export function useSpaces(): UseSpacesReturn {
  
  // State
  const [spaces, setSpaces] = useState<VirtualSpace[]>([])
  const [selectedSpace, setSelectedSpace] = useState<string>('virtual-office')
  const [joinedSpace, setJoinedSpace] = useState<string | null>(null)
  const [hoveredSpace, setHoveredSpace] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState<boolean>(false)
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false)
  const [virtualUsers, setVirtualUsers] = useState<SpaceUser[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [userActivity, setUserActivity] = useState<string>('idle')
  const [analytics, setAnalytics] = useState<SpaceAnalytics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Computed
  const currentSpace = spaces.find(space => space.id === selectedSpace)

  // Refresh spaces data
  const refreshSpaces = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await spacesAPI.getSpaces()
      if (response.success) {
        const transformedSpaces = response.data.map(transformSpaceData)
        setSpaces(transformedSpaces)
      } else {
        setError('Failed to load spaces')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load spaces')
    } finally {
      setLoading(false)
    }
  }, [])

  // Generate floating particles
  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i.toString(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2
      })
    }
    setParticles(newParticles)
  }, [])

  // Fetch real users in space from API
  const fetchSpaceUsers = useCallback(async () => {
    if (!joinedSpace) {
      setVirtualUsers([])
      return
    }

    try {
      const response = await spacesAPI.getSpaceUsers(joinedSpace)
      if (response.success && response.users) {
        const spaceUsers: SpaceUser[] = response.users.map(user => ({
          id: user.id,
          name: user.name || `${user.firstName} ${user.lastName}`,
          avatar: user.avatar2D || user.avatarPortrait || user.avatar || '/default-avatar.png',
          activity: user.currentActivity || 'Working',
          x: user.position?.x || Math.random() * 80 + 10,
          y: user.position?.y || Math.random() * 80 + 10,
          status: user.status || 'online'
        }))
        setVirtualUsers(spaceUsers)
      } else {
        setVirtualUsers([])
      }
    } catch (error) {
      console.error('Failed to fetch space users:', error)
      setVirtualUsers([])
    }
  }, [joinedSpace])

  // Handle space navigation
  const handleSpaceNavigation = useCallback((spaceId: string) => {
    setIsNavigating(true)
    setTimeout(() => {
      setSelectedSpace(spaceId)
      setIsNavigating(false)
      
      // Show join modal if not already in a space
      if (!joinedSpace) {
        setShowJoinModal(true)
      }
    }, 800)
  }, [joinedSpace])

  // Join a space
  const joinSpace = useCallback(async (spaceId: string) => {
    try {
      const response = await spacesAPI.joinSpace(spaceId, userActivity)
      if (response.success) {
        setJoinedSpace(spaceId)
        setSelectedSpace(spaceId)
        setShowJoinModal(false)
        setUserActivity('exploring')
        
        // Load analytics for the space
        const analyticsResponse = await spacesAPI.getSpaceAnalytics(spaceId)
        if (analyticsResponse.success) {
          setAnalytics(analyticsResponse.data)
        }
        
        // Refresh spaces to get updated occupancy
        await refreshSpaces()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join space')
    }
  }, [userActivity, refreshSpaces])

  // Leave a space
  const leaveSpace = useCallback(async () => {
    if (!joinedSpace) return

    try {
      const response = await spacesAPI.leaveSpace(joinedSpace)
      if (response.success) {
        setJoinedSpace(null)
        setUserActivity('idle')
        setVirtualUsers([])
        setAnalytics(null)
        
        // Refresh spaces to get updated occupancy
        await refreshSpaces()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave space')
    }
  }, [joinedSpace, refreshSpaces])

  // Update user activity
  const updateActivity = useCallback(async (activity: string) => {
    if (!joinedSpace) return

    try {
      const response = await spacesAPI.updateActivity(joinedSpace, activity)
      if (response.success) {
        setUserActivity(activity)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update activity')
    }
  }, [joinedSpace])

  // Search spaces
  const searchSpaces = useCallback(async (query: string): Promise<VirtualSpace[]> => {
    try {
      const response = await spacesAPI.searchSpaces(query)
      if (response.success) {
        return response.data.map(transformSpaceData)
      }
      return []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search spaces')
      return []
    }
  }, [])

  // Load spaces on mount
  useEffect(() => {
    refreshSpaces()
  }, [refreshSpaces])

  // Generate particles when space changes
  useEffect(() => {
    generateParticles()
  }, [selectedSpace, generateParticles])

  // Fetch space users when joined space changes
  useEffect(() => {
    if (joinedSpace) {
      fetchSpaceUsers()
      const interval = setInterval(fetchSpaceUsers, 30000) // Refresh every 30 seconds instead of 5
      return () => clearInterval(interval)
    }
  }, [joinedSpace, fetchSpaceUsers])

  return {
    // State
    spaces,
    selectedSpace,
    currentSpace,
    joinedSpace,
    hoveredSpace,
    isNavigating,
    showJoinModal,
    virtualUsers,
    particles,
    userActivity,
    analytics,
    loading,
    error,

    // Actions
    setSelectedSpace,
    setHoveredSpace,
    setShowJoinModal,
    handleSpaceNavigation,
    joinSpace,
    leaveSpace,
    updateActivity,
    refreshSpaces,
    searchSpaces
  }
}