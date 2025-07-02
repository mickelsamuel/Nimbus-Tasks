import { useState, useEffect } from 'react';
import { TeamsAPI } from '../lib/api/teams';
import { Team, CreateTeamData } from '../types/team';
import { useAuth } from '../contexts/AuthContext';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await TeamsAPI.getAllTeams();
      if (response.success) {
        setTeams(response.teams);
      } else {
        setError('Failed to fetch teams');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: CreateTeamData) => {
    try {
      const response = await TeamsAPI.createTeam(teamData);
      if (response.success) {
        setTeams(prev => [...prev, response.team]);
        return response.team;
      } else {
        throw new Error('Failed to create team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
      throw err;
    }
  };

  const joinTeam = async (teamId: string) => {
    try {
      const response = await TeamsAPI.joinTeam(teamId);
      if (response.success) {
        // Refresh teams to get updated member count
        await fetchTeams();
        return true;
      } else {
        throw new Error('Failed to join team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join team');
      throw err;
    }
  };

  const leaveTeam = async (teamId: string) => {
    try {
      const response = await TeamsAPI.leaveTeam(teamId);
      if (response.success) {
        // Refresh teams to get updated member count
        await fetchTeams();
        return true;
      } else {
        throw new Error('Failed to leave team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave team');
      throw err;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeams();
    } else {
      setTeams([]);
      setLoading(false);
      setError(null);
    }
  }, [isAuthenticated]);

  const updateTeam = async (teamId: string, updates: Partial<CreateTeamData>) => {
    try {
      const response = await TeamsAPI.updateTeam(teamId, updates);
      if (response.success) {
        // Refresh teams to get updated data
        await fetchTeams();
        return response.team;
      } else {
        throw new Error('Failed to update team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team');
      throw err;
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const response = await TeamsAPI.deleteTeam(teamId);
      if (response.success) {
        // Remove team from local state
        setTeams(prev => prev.filter(team => team.id !== teamId));
        return true;
      } else {
        throw new Error('Failed to delete team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team');
      throw err;
    }
  };

  // Compute derived data
  const myTeams = teams.filter(team => 
    team.members?.some(member => {
      const memberData = member.userId || member;
      const userId = (memberData as any)?._id || (memberData as any)?.id || memberData;
      return userId?.toString() === (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
    })
  );

  return {
    teams,
    myTeams,
    loading,
    error,
    refetch: fetchTeams,
    createTeam,
    joinTeam,
    leaveTeam,
    updateTeam,
    deleteTeam
  };
};

export const useTeamSearch = () => {
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchTeams = async (query: {
    search?: string;
    department?: string;
    category?: string;
    sortBy?: string;
  }) => {
    try {
      setSearching(true);
      setSearchError(null);
      const response = await TeamsAPI.searchTeams(query);
      if (response.success) {
        setSearchResults(response.teams);
      } else {
        setSearchError('Search failed');
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed');
      console.error('Error searching teams:', err);
    } finally {
      setSearching(false);
    }
  };

  return {
    searchResults,
    searching,
    searchError,
    searchTeams
  };
};