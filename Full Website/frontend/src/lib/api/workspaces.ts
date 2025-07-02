import { api } from './client'

export interface BookingTimeSlot {
  time: string
  available: boolean
  bookedBy?: string
  bookingId?: string
}

export interface WorkspaceRoom {
  id: string
  name: string
  type: 'meeting' | 'focus' | 'collaboration' | 'phone' | 'training'
  capacity: number
  floor: number
  building: string
  equipment: string[]
  amenities: string[]
  timeSlots: BookingTimeSlot[]
  hourlyRate?: number
  description?: string
  images?: string[]
}

export interface BookingRequest {
  roomId: string
  date: string
  startTime: string
  duration: number
  purpose?: string
  attendees?: number
}

export interface Booking {
  id: string
  roomId: string
  room: WorkspaceRoom
  date: string
  startTime: string
  endTime: string
  duration: number
  userId: string
  purpose?: string
  attendees?: number
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
}

export interface RoomMetrics {
  roomId: string
  roomName: string
  floor: number
  capacity: number
  hoursBooked: number
  totalHours: number
  utilizationRate: number
  averageOccupancy: number
  peakHours: string[]
  frequentBookers: string[]
  weeklyTrend: number[]
}

export interface UtilizationAlert {
  type: 'underutilized' | 'overbooked' | 'maintenance' | 'popular'
  roomName: string
  message: string
  priority: 'high' | 'medium' | 'low'
}

export interface WorkspaceResponse<T> {
  success: boolean
  data: T
  message?: string
}

class WorkspacesAPI {
  // Get all available rooms
  async getRooms(): Promise<WorkspaceResponse<WorkspaceRoom[]>> {
    const response = await api.get('/workspaces/rooms')
    return response.data
  }

  // Get room by ID
  async getRoom(roomId: string): Promise<WorkspaceResponse<WorkspaceRoom>> {
    const response = await api.get(`/workspaces/rooms/${roomId}`)
    return response.data
  }

  // Get room availability for a specific date
  async getRoomAvailability(roomId: string, date: string): Promise<WorkspaceResponse<BookingTimeSlot[]>> {
    const response = await api.get(`/workspaces/rooms/${roomId}/availability?date=${date}`)
    return response.data
  }

  // Book a room
  async bookRoom(bookingData: BookingRequest): Promise<WorkspaceResponse<Booking>> {
    const response = await api.post('/workspaces/bookings', bookingData)
    return response.data
  }

  // Get user's bookings
  async getUserBookings(): Promise<WorkspaceResponse<Booking[]>> {
    const response = await api.get('/workspaces/bookings/my')
    return response.data
  }

  // Cancel booking
  async cancelBooking(bookingId: string): Promise<WorkspaceResponse<{ message: string }>> {
    const response = await api.delete(`/workspaces/bookings/${bookingId}`)
    return response.data
  }

  // Get room utilization metrics
  async getRoomMetrics(period: 'today' | 'week' | 'month' = 'week'): Promise<WorkspaceResponse<RoomMetrics[]>> {
    const response = await api.get(`/workspaces/analytics/metrics?period=${period}`)
    return response.data
  }

  // Get utilization alerts
  async getUtilizationAlerts(): Promise<WorkspaceResponse<UtilizationAlert[]>> {
    const response = await api.get('/workspaces/analytics/alerts')
    return response.data
  }

  // Get overall statistics
  async getOverallStats(): Promise<WorkspaceResponse<{
    totalRooms: number
    averageUtilization: number
    totalBookings: number
    underutilizedRooms: number
  }>> {
    const response = await api.get('/workspaces/analytics/stats')
    return response.data
  }

  // Search rooms by criteria
  async searchRooms(criteria: {
    type?: string
    capacity?: number
    floor?: number
    building?: string
    equipment?: string[]
    date?: string
    startTime?: string
    duration?: number
  }): Promise<WorkspaceResponse<WorkspaceRoom[]>> {
    const queryParams = new URLSearchParams()
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(`${key}[]`, v))
        } else {
          queryParams.append(key, value.toString())
        }
      }
    })
    
    const response = await api.get(`/workspaces/rooms/search?${queryParams.toString()}`)
    return response.data
  }
}

export const workspacesAPI = new WorkspacesAPI()
export default workspacesAPI