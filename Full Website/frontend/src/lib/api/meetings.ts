import { api } from './client'

export interface Meeting {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  attendees: string[]
  room: string
  type: 'in-person' | 'hybrid' | 'virtual'
  agenda?: string[]
  status: 'scheduled' | 'confirmed' | 'cancelled'
  organizer: string
  description?: string
}

export interface MeetingInvite {
  email: string
  name: string
  role?: string
  required: boolean
}

export interface CreateMeetingRequest {
  title: string
  date: string
  startTime: string
  endTime: string
  type: 'in-person' | 'hybrid' | 'virtual'
  room?: string
  agenda: string[]
  description?: string
  attendees: MeetingInvite[]
}

export interface MeetingsResponse {
  success: boolean
  data: Meeting[]
  total: number
}

export interface MeetingResponse {
  success: boolean
  data: Meeting
}

export interface RoomsResponse {
  success: boolean
  data: string[]
}

class MeetingsAPI {
  // Get upcoming meetings
  async getUpcomingMeetings(): Promise<MeetingsResponse> {
    const response = await api.get('/meetings/upcoming')
    return response.data
  }

  // Get available rooms
  async getAvailableRooms(): Promise<RoomsResponse> {
    const response = await api.get('/meetings/rooms')
    return response.data
  }

  // Create a new meeting
  async createMeeting(meetingData: CreateMeetingRequest): Promise<MeetingResponse> {
    const response = await api.post('/meetings', meetingData)
    return response.data
  }

  // Update meeting
  async updateMeeting(id: string, meetingData: Partial<CreateMeetingRequest>): Promise<MeetingResponse> {
    const response = await api.put(`/meetings/${id}`, meetingData)
    return response.data
  }

  // Cancel meeting
  async cancelMeeting(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/meetings/${id}`)
    return response.data
  }

  // Join meeting
  async joinMeeting(id: string): Promise<{ success: boolean; joinUrl?: string; message: string }> {
    const response = await api.post(`/meetings/${id}/join`)
    return response.data
  }

  // Get meeting details
  async getMeeting(id: string): Promise<MeetingResponse> {
    const response = await api.get(`/meetings/${id}`)
    return response.data
  }
}

export const meetingsAPI = new MeetingsAPI()
export default meetingsAPI