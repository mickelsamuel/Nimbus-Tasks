import api from './client'

export interface SupportTicketData {
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: string
  subject: string
  description: string
  attachments?: File[]
}

export interface ChatSessionData {
  priority: string
  category: string
  initialMessage: string
}

export const helpApi = {
  // Chat functionality
  async startChatSession(data: ChatSessionData) {
    try {
      const response = await api.post('/chat/start', data)
      return response.data
    } catch (error) {
      console.error('Error starting chat session:', error)
      throw error
    }
  },

  // Support ticket functionality
  async createSupportTicket(ticketData: SupportTicketData) {
    try {
      const formData = new FormData()
      formData.append('priority', ticketData.priority)
      formData.append('category', ticketData.category)
      formData.append('subject', ticketData.subject)
      formData.append('description', ticketData.description)
      
      // Add attachments if any
      if (ticketData.attachments) {
        ticketData.attachments.forEach((file) => {
          formData.append('attachments', file)
        })
      }
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers,
        body: formData
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error creating support ticket:', error)
      throw error
    }
  },

  // FAQ functionality
  async getFAQs(params?: { category?: string; search?: string }) {
    try {
      const queryParams = new URLSearchParams()
      if (params?.category) queryParams.append('category', params.category)
      if (params?.search) queryParams.append('search', params.search)
      
      const response = await api.get(`/support/faq?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      throw error
    }
  },

  async voteFAQ(faqId: string, helpful: boolean) {
    try {
      const response = await api.post(`/support/faq/${faqId}/vote`, { helpful })
      return response.data
    } catch (error) {
      console.error('Error voting on FAQ:', error)
      throw error
    }
  },

  // Resource functionality
  async getSupportResources() {
    try {
      const response = await api.get('/support/resources')
      return response.data
    } catch (error) {
      console.error('Error fetching support resources:', error)
      throw error
    }
  }
}

export default helpApi