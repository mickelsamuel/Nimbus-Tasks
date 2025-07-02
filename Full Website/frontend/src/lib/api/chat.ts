import { apiClient } from './client';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'user' | 'agent' | 'ai';
  message: string;
  messageType: 'text' | 'file';
  timestamp: Date;
  isRead: boolean;
  metadata?: {
    confidence?: number;
    isFinancialQuery?: boolean;
    model?: string;
    generatedAt?: string;
    error?: string;
  };
  attachments?: Array<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  }>;
}

export interface ChatSession {
  sessionId: string;
  userId: string;
  assignedAgent?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'general' | 'technical' | 'billing' | 'account';
  status: 'waiting' | 'active' | 'resolved' | 'closed' | 'abandoned';
  messages: ChatMessage[];
  startedAt: Date;
  endedAt?: Date;
  satisfaction?: {
    rating: number;
    feedback: string;
    ratedAt: Date;
  };
  metadata: {
    userAgent: string;
    ipAddress: string;
    referrer?: string;
    department?: string;
  };
}

export interface StartChatRequest {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: 'general' | 'technical' | 'billing' | 'account';
  initialMessage: string;
}

export interface SendMessageRequest {
  message: string;
  attachments?: File[];
}

export interface ChatStats {
  period: string;
  totalChats: number;
  activeChats: number;
  avgWaitTime: number;
  avgResponseTime: number;
  avgSatisfaction: number;
  statusDistribution: Array<{ _id: string; count: number }>;
  categoryDistribution: Array<{ _id: string; count: number }>;
}

class ChatAPI {
  async startChat(data: StartChatRequest): Promise<{ success: boolean; data?: ChatSession; message?: string }> {
    try {
      const response = await apiClient.post('/chat/start', data);
      return response.data;
    } catch (error) {
      console.error('Error starting chat:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start chat'
      };
    }
  }

  async getChatSessions(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data?: {
      chats: ChatSession[];
      pagination: {
        current: number;
        pages: number;
        total: number;
      };
    };
    message?: string;
  }> {
    try {
      const response = await apiClient.get('/chat/sessions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch chat sessions'
      };
    }
  }

  async getChatSession(sessionId: string): Promise<{
    success: boolean;
    data?: ChatSession;
    message?: string;
  }> {
    try {
      const response = await apiClient.get(`/chat/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat session:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch chat session'
      };
    }
  }

  async sendMessage(sessionId: string, data: SendMessageRequest): Promise<{
    success: boolean;
    data?: ChatSession;
    message?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('message', data.message);
      
      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send message'
      };
    }
  }

  async updateChatStatus(sessionId: string, status: string): Promise<{
    success: boolean;
    data?: ChatSession;
    message?: string;
  }> {
    try {
      const response = await apiClient.patch(`/chat/sessions/${sessionId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating chat status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update chat status'
      };
    }
  }

  async rateChat(sessionId: string, rating: number, feedback?: string): Promise<{
    success: boolean;
    data?: { rating: number; feedback: string };
    message?: string;
  }> {
    try {
      const response = await apiClient.post(`/chat/sessions/${sessionId}/rate`, { rating, feedback });
      return response.data;
    } catch (error) {
      console.error('Error rating chat:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to rate chat'
      };
    }
  }

  async getChatStats(period: string = '30d'): Promise<{
    success: boolean;
    data?: ChatStats;
    message?: string;
  }> {
    try {
      const response = await apiClient.get('/chat/stats', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat statistics:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch chat statistics'
      };
    }
  }

  async getAIStatus(): Promise<{
    success: boolean;
    data?: {
      available: boolean;
      model: string;
      version: string;
      lastHealthCheck: string;
      features: Record<string, boolean>;
    };
    message?: string;
  }> {
    try {
      const response = await apiClient.get('/chat/ai/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching AI status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch AI status'
      };
    }
  }

  async testAI(question: string): Promise<{
    success: boolean;
    data?: {
      question: string;
      response: string;
      isFinancialQuery: boolean;
      confidence: number;
      metadata: Record<string, unknown>;
    };
    message?: string;
  }> {
    try {
      const response = await apiClient.post('/chat/ai/test', { question });
      return response.data;
    } catch (error) {
      console.error('Error testing AI:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test AI'
      };
    }
  }
}

export const chatAPI = new ChatAPI();