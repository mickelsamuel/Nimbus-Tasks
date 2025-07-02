import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Types
export interface Project {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  assignees: string[];
  priority: 'high' | 'medium' | 'low';
  completion: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  attendees: string[];
  type: 'standup' | 'planning' | 'review' | 'retrospective';
  link?: string;
  recurring: boolean;
}

export interface Discussion {
  id: string;
  title: string;
  author: string;
  lastReply: Date;
  replies: number;
  category: 'general' | 'project' | 'help' | 'announcement';
  isResolved: boolean;
  isPinned: boolean;
}

interface TeamCollaborationData {
  projects: Project[];
  meetings: Meeting[];
  discussions: Discussion[];
}

interface CollaborationError {
  projects?: string;
  meetings?: string;
  discussions?: string;
  general?: string;
}

export const useTeamCollaboration = (teamId: string) => {
  const [data, setData] = useState<TeamCollaborationData>({
    projects: [],
    meetings: [],
    discussions: []
  });
  
  const [loading, setLoading] = useState({
    projects: false,
    meetings: false,
    discussions: false
  });
  
  const [error, setError] = useState<CollaborationError>({});
  const { isAuthenticated } = useAuth();

  // Generic API request function
  const makeRequest = async <T>(endpoint: string): Promise<T> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  };

  // Fetch projects
  const fetchProjects = async () => {
    if (!teamId || !isAuthenticated) return;
    
    try {
      setLoading(prev => ({ ...prev, projects: true }));
      setError(prev => ({ ...prev, projects: undefined }));
      
      const response = await makeRequest<{ success: boolean; projects: any[] }>(`/teams/${teamId}/projects`);
      
      if (response.success) {
        // Transform API response to match component interface
        const transformedProjects: Project[] = response.projects.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          dueDate: new Date(project.dueDate),
          status: project.status as Project['status'],
          assignees: project.teamMembers?.map((member: any) => member.name) || [],
          priority: project.priority || 'medium' as Project['priority'],
          completion: project.progress || 0
        }));
        
        setData(prev => ({ ...prev, projects: transformedProjects }));
      } else {
        setError(prev => ({ ...prev, projects: 'Failed to load projects' }));
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(prev => ({ ...prev, projects: err instanceof Error ? err.message : 'Failed to load projects' }));
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  };

  // Fetch meetings
  const fetchMeetings = async () => {
    if (!teamId || !isAuthenticated) return;
    
    try {
      setLoading(prev => ({ ...prev, meetings: true }));
      setError(prev => ({ ...prev, meetings: undefined }));
      
      const response = await makeRequest<{ success: boolean; meetings: any[] }>(`/teams/${teamId}/meetings`);
      
      if (response.success) {
        // Transform API response to match component interface
        const transformedMeetings: Meeting[] = response.meetings.map(meeting => ({
          id: meeting.id.toString(),
          title: meeting.title,
          date: new Date(meeting.startTime),
          time: new Date(meeting.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          duration: Math.round((new Date(meeting.endTime).getTime() - new Date(meeting.startTime).getTime()) / (1000 * 60)), // Convert to minutes
          attendees: meeting.attendees?.map((attendee: any) => attendee.name || attendee.userId) || [],
          type: meeting.type === 'team-standup' ? 'standup' : 
                meeting.type === 'project-planning' ? 'planning' :
                meeting.type === 'code-review' ? 'review' : 
                meeting.type === 'sprint-retrospective' ? 'retrospective' : 'standup' as Meeting['type'],
          link: meeting.roomId ? `/meetings/${meeting.id}/room` : undefined,
          recurring: meeting.isRecurring || false
        }));
        
        setData(prev => ({ ...prev, meetings: transformedMeetings }));
      } else {
        setError(prev => ({ ...prev, meetings: 'Failed to load meetings' }));
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError(prev => ({ ...prev, meetings: err instanceof Error ? err.message : 'Failed to load meetings' }));
    } finally {
      setLoading(prev => ({ ...prev, meetings: false }));
    }
  };

  // Fetch discussions
  const fetchDiscussions = async () => {
    if (!teamId || !isAuthenticated) return;
    
    try {
      setLoading(prev => ({ ...prev, discussions: true }));
      setError(prev => ({ ...prev, discussions: undefined }));
      
      const response = await makeRequest<{ success: boolean; discussions: any[] }>(`/teams/${teamId}/discussions`);
      
      if (response.success) {
        // Transform API response to match component interface
        const transformedDiscussions: Discussion[] = response.discussions.map(discussion => ({
          id: discussion.id.toString(),
          title: discussion.title,
          author: discussion.author?.name || discussion.authorName || 'Unknown User',
          lastReply: new Date(discussion.lastReply || discussion.updatedAt),
          replies: discussion.replyCount || discussion.replies || 0,
          category: discussion.category as Discussion['category'] || 'general',
          isResolved: discussion.isResolved || false,
          isPinned: discussion.isPinned || false
        }));
        
        setData(prev => ({ ...prev, discussions: transformedDiscussions }));
      } else {
        setError(prev => ({ ...prev, discussions: 'Failed to load discussions' }));
      }
    } catch (err) {
      console.error('Error fetching discussions:', err);
      setError(prev => ({ ...prev, discussions: err instanceof Error ? err.message : 'Failed to load discussions' }));
    } finally {
      setLoading(prev => ({ ...prev, discussions: false }));
    }
  };

  // Fetch all data
  const fetchAll = async () => {
    if (!teamId || !isAuthenticated) return;
    
    await Promise.all([
      fetchProjects(),
      fetchMeetings(),
      fetchDiscussions()
    ]);
  };

  // Create project
  const createProject = async (projectData: {
    name: string;
    description: string;
    dueDate: string;
    priority?: string;
  }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        await fetchProjects(); // Refresh projects
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  // Create meeting
  const createMeeting = async (meetingData: {
    title: string;
    date: string;
    time: string;
    duration: number;
    type?: string;
  }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      // Combine date and time
      const startTime = new Date(`${meetingData.date}T${meetingData.time}`);
      const endTime = new Date(startTime.getTime() + meetingData.duration * 60000);
      
      const payload = {
        title: meetingData.title,
        description: `Team meeting scheduled for ${meetingData.title}`,
        type: meetingData.type || 'team-meeting',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        teamId: teamId,
        attendees: []
      };
      
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchMeetings(); // Refresh meetings
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to schedule meeting');
      }
    } catch (err) {
      console.error('Error creating meeting:', err);
      throw err;
    }
  };

  // Create discussion
  const createDiscussion = async (discussionData: {
    title: string;
    category: string;
    message: string;
  }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(discussionData)
      });

      if (response.ok) {
        await fetchDiscussions(); // Refresh discussions
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start discussion');
      }
    } catch (err) {
      console.error('Error creating discussion:', err);
      throw err;
    }
  };

  // Load data when teamId or authentication changes
  useEffect(() => {
    if (teamId && isAuthenticated) {
      fetchAll();
    } else {
      // Clear data when not authenticated or no teamId
      setData({ projects: [], meetings: [], discussions: [] });
      setLoading({ projects: false, meetings: false, discussions: false });
      setError({});
    }
  }, [teamId, isAuthenticated, fetchAll]);

  const isLoading = loading.projects || loading.meetings || loading.discussions;
  const hasError = !!(error.projects || error.meetings || error.discussions || error.general);

  return {
    // Data
    ...data,
    
    // Loading states
    loading,
    isLoading,
    
    // Error states
    error,
    hasError,
    
    // Actions
    refetch: fetchAll,
    refetchProjects: fetchProjects,
    refetchMeetings: fetchMeetings,
    refetchDiscussions: fetchDiscussions,
    createProject,
    createMeeting,
    createDiscussion
  };
};