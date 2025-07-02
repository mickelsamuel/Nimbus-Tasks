import { useState, useEffect, useCallback } from 'react'
import { Event, EventCategory, EventStatus } from '@/components/events/types/event.types'
import { eventsAPI, EventsQueryParams } from '@/lib/api/events'
import { useAuthContext } from '@/contexts/AuthContext'

interface UseEventsOptions {
  status?: EventStatus
  category?: EventCategory
  search?: string
  page?: number
  limit?: number
  myEventsOnly?: boolean
}

export function useEvents(options: UseEventsOptions = {}) {
  const { user } = useAuthContext()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    liveEvents: 0,
    activeParticipants: 0,
    todayChampionships: 0
  })

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params: EventsQueryParams = {
        status: options.status,
        category: options.category,
        search: options.search,
        page: options.page,
        limit: options.limit
      }

      if (options.myEventsOnly && user) {
        params.userId = user.id.toString()
      }

      const data = await eventsAPI.getEvents(params)
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }, [options.status, options.category, options.search, options.page, options.limit, options.myEventsOnly, user])

  const fetchStats = useCallback(async () => {
    try {
      const data = await eventsAPI.getEventStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch event stats:', err)
    }
  }, [])

  const registerForEvent = useCallback(async (eventId: number) => {
    if (!user) {
      setError('You must be logged in to register for events')
      return
    }

    try {
      await eventsAPI.registerForEvent(eventId, { userId: user.id.toString() })
      // Refresh events to update participant count
      await fetchEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register for event')
    }
  }, [user, fetchEvents])

  const cancelRegistration = useCallback(async (eventId: number) => {
    if (!user) {
      setError('You must be logged in')
      return
    }

    try {
      await eventsAPI.cancelRegistration(eventId, user.id.toString())
      await fetchEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel registration')
    }
  }, [user, fetchEvents])

  const submitFeedback = useCallback(async (
    eventId: number, 
    rating: number, 
    comment: string, 
    suggestions?: string
  ) => {
    if (!user) {
      setError('You must be logged in to submit feedback')
      return
    }

    try {
      await eventsAPI.submitFeedback(eventId, user.id.toString(), {
        rating,
        comment,
        suggestions
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback')
    }
  }, [user])

  useEffect(() => {
    fetchEvents()
    fetchStats()
  }, [fetchEvents, fetchStats])

  return {
    events,
    loading,
    error,
    stats,
    registerForEvent,
    cancelRegistration,
    submitFeedback,
    refetch: fetchEvents
  }
}

export function useEvent(eventId: number) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await eventsAPI.getEventById(eventId)
        setEvent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  return { event, loading, error }
}