'use client'

import { useState, useEffect, useCallback } from 'react'
import { workspacesAPI, WorkspaceRoom, BookingRequest, Booking, RoomMetrics, UtilizationAlert } from '@/lib/api/workspaces'

export interface UseWorkspacesReturn {
  // State
  rooms: WorkspaceRoom[]
  userBookings: Booking[]
  roomMetrics: RoomMetrics[]
  alerts: UtilizationAlert[]
  overallStats: {
    totalRooms: number
    averageUtilization: number
    totalBookings: number
    underutilizedRooms: number
  } | null
  loading: boolean
  error: string | null
  submitting: boolean

  // Actions
  refreshRooms: () => Promise<void>
  refreshBookings: () => Promise<void>
  refreshMetrics: (period?: 'today' | 'week' | 'month') => Promise<void>
  refreshAlerts: () => Promise<void>
  refreshStats: () => Promise<void>
  bookRoom: (bookingData: BookingRequest) => Promise<boolean>
  cancelBooking: (bookingId: string) => Promise<boolean>
  getRoomAvailability: (roomId: string, date: string) => Promise<void>
  searchRooms: (criteria: any) => Promise<WorkspaceRoom[]>
}

export function useWorkspaces(): UseWorkspacesReturn {
  const [rooms, setRooms] = useState<WorkspaceRoom[]>([])
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [roomMetrics, setRoomMetrics] = useState<RoomMetrics[]>([])
  const [alerts, setAlerts] = useState<UtilizationAlert[]>([])
  const [overallStats, setOverallStats] = useState<{
    totalRooms: number
    averageUtilization: number
    totalBookings: number
    underutilizedRooms: number
  } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Refresh rooms
  const refreshRooms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await workspacesAPI.getRooms()
      if (response.success) {
        setRooms(response.data)
      } else {
        setError('Failed to load rooms')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh user bookings
  const refreshBookings = useCallback(async () => {
    try {
      const response = await workspacesAPI.getUserBookings()
      if (response.success) {
        setUserBookings(response.data)
      }
    } catch (err) {
      console.error('Failed to load bookings:', err)
    }
  }, [])

  // Refresh room metrics
  const refreshMetrics = useCallback(async (period: 'today' | 'week' | 'month' = 'week') => {
    try {
      const response = await workspacesAPI.getRoomMetrics(period)
      if (response.success) {
        setRoomMetrics(response.data)
      }
    } catch (err) {
      console.error('Failed to load metrics:', err)
    }
  }, [])

  // Refresh alerts
  const refreshAlerts = useCallback(async () => {
    try {
      const response = await workspacesAPI.getUtilizationAlerts()
      if (response.success) {
        setAlerts(response.data)
      }
    } catch (err) {
      console.error('Failed to load alerts:', err)
    }
  }, [])

  // Refresh overall stats
  const refreshStats = useCallback(async () => {
    try {
      const response = await workspacesAPI.getOverallStats()
      if (response.success) {
        setOverallStats(response.data)
      }
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }, [])

  // Book a room
  const bookRoom = useCallback(async (bookingData: BookingRequest): Promise<boolean> => {
    try {
      setSubmitting(true)
      setError(null)
      const response = await workspacesAPI.bookRoom(bookingData)
      if (response.success) {
        await refreshRooms()
        await refreshBookings()
        return true
      } else {
        setError(response.message || 'Failed to book room')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book room')
      return false
    } finally {
      setSubmitting(false)
    }
  }, [refreshRooms, refreshBookings])

  // Cancel a booking
  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    try {
      setSubmitting(true)
      const response = await workspacesAPI.cancelBooking(bookingId)
      if (response.success) {
        await refreshRooms()
        await refreshBookings()
        return true
      } else {
        setError(response.message || 'Failed to cancel booking')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking')
      return false
    } finally {
      setSubmitting(false)
    }
  }, [refreshRooms, refreshBookings])

  // Get room availability
  const getRoomAvailability = useCallback(async (roomId: string, date: string) => {
    try {
      const response = await workspacesAPI.getRoomAvailability(roomId, date)
      if (response.success) {
        // Update the specific room's time slots
        setRooms(prevRooms => 
          prevRooms.map(room => 
            room.id === roomId 
              ? { ...room, timeSlots: response.data }
              : room
          )
        )
      }
    } catch (err) {
      console.error('Failed to load room availability:', err)
    }
  }, [])

  // Search rooms
  const searchRooms = useCallback(async (criteria: any): Promise<WorkspaceRoom[]> => {
    try {
      const response = await workspacesAPI.searchRooms(criteria)
      if (response.success) {
        return response.data
      }
      return []
    } catch (err) {
      console.error('Failed to search rooms:', err)
      return []
    }
  }, [])

  // Load initial data
  useEffect(() => {
    refreshRooms()
    refreshBookings()
    refreshMetrics()
    refreshAlerts()
    refreshStats()
  }, [refreshRooms, refreshBookings, refreshMetrics, refreshAlerts, refreshStats])

  return {
    // State
    rooms,
    userBookings,
    roomMetrics,
    alerts,
    overallStats,
    loading,
    error,
    submitting,

    // Actions
    refreshRooms,
    refreshBookings,
    refreshMetrics,
    refreshAlerts,
    refreshStats,
    bookRoom,
    cancelBooking,
    getRoomAvailability,
    searchRooms
  }
}