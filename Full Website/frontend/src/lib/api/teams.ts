import { CreateTeamData, Team } from '../../types/team';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class TeamsAPI {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async getAllTeams(): Promise<{ success: boolean; teams: Team[] }> {
    return this.request<{ success: boolean; teams: Team[] }>('/teams');
  }

  static async getTeamById(id: string): Promise<{ success: boolean; team: Team }> {
    return this.request<{ success: boolean; team: Team }>(`/teams/${id}`);
  }

  static async createTeam(teamData: CreateTeamData): Promise<{ success: boolean; team: Team }> {
    return this.request<{ success: boolean; team: Team }>('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  static async joinTeam(teamId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/teams/${teamId}/join`, {
      method: 'POST',
    });
  }

  static async leaveTeam(teamId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/teams/${teamId}/leave`, {
      method: 'POST',
    });
  }

  static async updateTeam(
    teamId: string, 
    updates: Partial<CreateTeamData>
  ): Promise<{ success: boolean; team: Team }> {
    return this.request<{ success: boolean; team: Team }>(`/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async deleteTeam(teamId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/teams/${teamId}`, {
      method: 'DELETE',
    });
  }

  static async searchTeams(query: {
    search?: string;
    department?: string;
    category?: string;
    sortBy?: string;
  }): Promise<{ success: boolean; teams: Team[] }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/teams?${queryString}` : '/teams';
    
    return this.request<{ success: boolean; teams: Team[] }>(endpoint);
  }
}