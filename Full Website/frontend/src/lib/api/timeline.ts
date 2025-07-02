import api from './client';
import { TimelineEvent, ApiResponse } from '@/types';

export const timelineAPI = {
  // Get all timeline events
  getEvents: async (filters?: {
    era?: string;
    type?: string;
    search?: string;
    year?: number;
    limit?: number;
    offset?: number;
  }): Promise<TimelineEvent[]> => {
    const response = await api.get<ApiResponse<TimelineEvent[]>>('/timeline', {
      params: filters
    });
    return (response.data as any).data || response.data as any;
  },

  // Get a single event by ID
  getEvent: async (id: string): Promise<TimelineEvent> => {
    const response = await api.get<ApiResponse<TimelineEvent>>(`/timeline/${id}`);
    return (response.data as any).data || response.data as any;
  },

  // Create a new timeline event (admin only)
  createEvent: async (event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> => {
    const response = await api.post<ApiResponse<TimelineEvent>>('/timeline', event);
    return (response.data as any).data || response.data as any;
  },

  // Update an existing event (admin only)
  updateEvent: async (id: string, event: Partial<TimelineEvent>): Promise<TimelineEvent> => {
    const response = await api.put<ApiResponse<TimelineEvent>>(`/timeline/${id}`, event);
    return (response.data as any).data || response.data as any;
  },

  // Delete an event (admin only)
  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/timeline/${id}`);
  },

  // Get related events
  getRelatedEvents: async (id: string): Promise<TimelineEvent[]> => {
    const response = await api.get<ApiResponse<TimelineEvent[]>>(`/timeline/${id}/related`);
    return (response.data as any).data || response.data as any;
  },

  // Search timeline events
  searchEvents: async (query: string): Promise<TimelineEvent[]> => {
    const response = await api.get<ApiResponse<TimelineEvent[]>>('/timeline/search', {
      params: { q: query }
    });
    return (response.data as any).data || response.data as any;
  },

  // Get events by era
  getEventsByEra: async (era: string): Promise<TimelineEvent[]> => {
    const response = await api.get<ApiResponse<TimelineEvent[]>>(`/timeline/era/${era}`);
    return (response.data as any).data || response.data as any;
  },

  // Get timeline statistics
  getStats: async (): Promise<{
    totalEvents: number;
    eventsByEra: Record<string, number>;
    eventsByType: Record<string, number>;
    yearsSpanned: number;
  }> => {
    const response = await api.get<ApiResponse<{ totalEvents: number; eventsByEra: Record<string, number>; eventsByType: Record<string, number>; yearsSpanned: number }>>('/timeline/stats');
    return (response.data as any).data || response.data as any;
  },

  // Track event view (for analytics)
  trackEventView: async (eventId: string): Promise<void> => {
    await api.post(`/timeline/${eventId}/view`);
  },

  // Get user's bookmarked events
  getBookmarkedEvents: async (): Promise<TimelineEvent[]> => {
    const response = await api.get<ApiResponse<TimelineEvent[]>>('/timeline/bookmarks');
    return (response.data as any).data || response.data as any;
  },

  // Bookmark/unbookmark an event
  toggleBookmark: async (eventId: string): Promise<boolean> => {
    const response = await api.post<ApiResponse<{ bookmarked: boolean }>>(`/timeline/${eventId}/bookmark`);
    const data = (response.data as any).data || response.data;
    return (data as any).bookmarked;
  }
};