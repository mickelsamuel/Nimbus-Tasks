'use client'

import { useState, useEffect, useCallback } from 'react'
import { meetingsAPI, Meeting, CreateMeetingRequest } from '@/lib/api/meetings'

export interface UseMeetingsReturn {
  // State
  meetings: Meeting[]
  availableRooms: string[]
  loading: boolean
  error: string | null
  submitting: boolean

  // Actions
  refreshMeetings: () => Promise<void>
  refreshRooms: () => Promise<void>
  createMeeting: (meetingData: CreateMeetingRequest) => Promise<boolean>
  joinMeeting: (meetingId: string) => Promise<string | null>
  cancelMeeting: (meetingId: string) => Promise<boolean>
}

export function useMeetings(): UseMeetingsReturn {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [availableRooms, setAvailableRooms] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Refresh meetings
  const refreshMeetings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingsAPI.getUpcomingMeetings()
      if (response.success) {
        setMeetings(response.data)
      } else {
        setError('Failed to load meetings')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh available rooms
  const refreshRooms = useCallback(async () => {
    try {
      const response = await meetingsAPI.getAvailableRooms()
      if (response.success) {
        setAvailableRooms(response.data)
      }
    } catch (err) {
      console.error('Failed to load rooms:', err)
    }
  }, [])

  // Create a new meeting
  const createMeeting = useCallback(async (meetingData: CreateMeetingRequest): Promise<boolean> => {
    try {
      setSubmitting(true)
      setError(null)
      const response = await meetingsAPI.createMeeting(meetingData)
      if (response.success) {
        await refreshMeetings()
        return true
      } else {
        setError('Failed to create meeting')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create meeting')
      return false
    } finally {
      setSubmitting(false)
    }
  }, [refreshMeetings])

  // Join a meeting
  const joinMeeting = useCallback(async (meetingId: string): Promise<string | null> => {
    try {
      const response = await meetingsAPI.joinMeeting(meetingId)
      if (response.success && response.joinUrl) {
        return response.joinUrl
      } else {
        setError(response.message || 'Failed to join meeting')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join meeting')
      return null
    }
  }, [])

  // Cancel a meeting
  const cancelMeeting = useCallback(async (meetingId: string): Promise<boolean> => {
    try {
      setSubmitting(true)
      const response = await meetingsAPI.cancelMeeting(meetingId)
      if (response.success) {
        await refreshMeetings()
        return true
      } else {
        setError(response.message || 'Failed to cancel meeting')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel meeting')
      return false
    } finally {
      setSubmitting(false)
    }
  }, [refreshMeetings])

  // Load initial data
  useEffect(() => {
    refreshMeetings()
    refreshRooms()
  }, [refreshMeetings, refreshRooms])

  return {
    // State
    meetings,
    availableRooms,
    loading,
    error,
    submitting,

    // Actions
    refreshMeetings,
    refreshRooms,
    createMeeting,
    joinMeeting,
    cancelMeeting
  }
}