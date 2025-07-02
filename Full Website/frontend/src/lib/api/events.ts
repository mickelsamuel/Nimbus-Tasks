import { Event, EventStatus, EventCategory } from '@/components/events/types/event.types'
import api from './client'

export interface EventsQueryParams {
  status?: EventStatus
  category?: EventCategory
  search?: string
  page?: number
  limit?: number
  userId?: string
}

export interface CreateEventData {
  title: string
  description: string
  category: EventCategory
  startDate: Date
  endDate: Date
  maxParticipants: number
  image?: string
  rewards: {
    coins: number
    experience: number
    badges: string[]
  }
}

export interface RegisterEventData {
  userId: string
  teamId?: string
}

export interface EventFeedback {
  rating: number
  comment: string
  suggestions?: string
}

class EventsAPI {
  async getEvents(params?: EventsQueryParams): Promise<Event[]> {
    try {
      const response = await api.get('/events', { params })
      return response.data?.events || response.data || []
    } catch (error) {
      console.error('Failed to fetch events:', error)
      throw error
    }
  }

  async getEventById(eventId: number): Promise<Event> {
    try {
      const response = await api.get(`/events/${eventId}`)
      return response.data.event
    } catch (error) {
      console.error('Failed to fetch event:', error)
      throw error
    }
  }

  async createEvent(data: CreateEventData): Promise<Event> {
    try {
      const response = await api.post('/events', data)
      return response.data.event
    } catch (error) {
      console.error('Failed to create event:', error)
      throw error
    }
  }

  async updateEvent(eventId: number, data: Partial<CreateEventData>): Promise<Event> {
    try {
      const response = await api.put(`/events/${eventId}`, data)
      return response.data.event
    } catch (error) {
      console.error('Failed to update event:', error)
      throw error
    }
  }

  async deleteEvent(eventId: number): Promise<void> {
    try {
      await api.delete(`/events/${eventId}`)
    } catch (error) {
      console.error('Failed to delete event:', error)
      throw error
    }
  }

  async registerForEvent(eventId: number, data: RegisterEventData): Promise<void> {
    try {
      await api.post(`/events/${eventId}/register`, data)
    } catch (error) {
      console.error('Failed to register for event:', error)
      throw error
    }
  }

  async cancelRegistration(eventId: number, userId: string): Promise<void> {
    try {
      await api.delete(`/events/${eventId}/register/${userId}`)
    } catch (error) {
      console.error('Failed to cancel registration:', error)
      throw error
    }
  }

  async markAttendance(eventId: number, userId: string): Promise<void> {
    try {
      await api.post(`/events/${eventId}/attendance`, { userId })
    } catch (error) {
      console.error('Failed to mark attendance:', error)
      throw error
    }
  }

  async submitFeedback(eventId: number, userId: string, feedback: EventFeedback): Promise<void> {
    try {
      await api.post(`/events/${eventId}/feedback`, {
        userId,
        ...feedback
      })
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      throw error
    }
  }

  async getEventLeaderboard(eventId: number): Promise<Event['leaderboard']> {
    try {
      const response = await api.get(`/events/${eventId}/leaderboard`)
      return response.data.leaderboard
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      throw error
    }
  }

  async getUserEvents(userId: string): Promise<Event[]> {
    try {
      const response = await api.get(`/users/${userId}/events`)
      return response.data?.events || response.data || []
    } catch (error) {
      console.error('Failed to fetch user events:', error)
      throw error
    }
  }

  async getLiveEventCount(): Promise<number> {
    try {
      const response = await api.get('/events/stats/live-count')
      return response.data.count
    } catch (error) {
      console.error('Failed to fetch live event count:', error)
      return 0
    }
  }

  async getEventStats(): Promise<{
    liveEvents: number
    activeParticipants: number
    todayChampionships: number
  }> {
    try {
      const response = await api.get('/events/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch event stats:', error)
      throw error
    }
  }
}

export const eventsAPI = new EventsAPI()