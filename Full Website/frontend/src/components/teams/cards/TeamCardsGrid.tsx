'use client';

import React from 'react';
import TeamCard from './TeamCard';
import { useTeams } from '../../../hooks/useTeams';
import { useAuth } from '../../../contexts/AuthContext';

// Use TeamCard's local Team interface for display
interface DisplayTeam {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  category: string;
  status: 'active' | 'recruiting' | 'inactive';
  performance: number;
  achievements: number;
  avatar: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
    isOnline: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
  tags: string[];
  isJoined: boolean;
  isOwner: boolean;
}

const TeamCardsGrid = () => {
  const { teams, loading, error } = useTeams();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="teams-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="elite-team-card">
            <div className="animate-pulse">
              <div className="h-20 bg-white/10 rounded-lg mb-4"></div>
              <div className="h-24 bg-white/10 rounded-lg mb-4"></div>
              <div className="h-16 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="teams-grid">
        <div className="col-span-full text-center py-12">
          <p className="text-white/70 mb-4">Error loading teams: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="action-button primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="teams-grid">
        <div className="col-span-full text-center py-12">
          <p className="text-white/70 mb-4">No teams found. Create your first team!</p>
        </div>
      </div>
    );
  }

  // Convert API teams to display format
  const displayTeams: DisplayTeam[] = teams.length > 0 ? teams.map(team => {
    const currentUserId = user?.id?.toString();
    
    return {
      id: team.id || team._id || Math.random().toString(),
      name: team.name || 'Untitled Team',
      description: team.description || 'No description available',
      category: team.category || team.department || 'General',
      avatar: team.avatar || team.name?.substring(0, 2).toUpperCase() || 'TM',
      status: (team.status === 'idle' ? 'inactive' : 
               team.status === 'rising' ? 'recruiting' : 
               team.status || 'active') as 'active' | 'recruiting' | 'inactive',
      memberCount: team.stats?.memberCount || team.members?.length || 0,
      maxMembers: team.settings?.maxMembers || 10,
      // Calculate performance based on team stats
      performance: team.stats?.averagePerformance || 
                  (team.stats?.totalXP ? Math.min(100, Math.round(team.stats.totalXP / 100)) : 0) ||
                  75, // Default reasonable performance
      achievements: team.achievements?.length || team.stats?.achievementCount || 0,
      members: (team.members || []).slice(0, 5).map((member: Record<string, unknown>, index: number) => {
        const userId = member.userId as Record<string, unknown> | undefined;
        const memberRole = member.role as string | undefined;
        
        return {
          id: (userId?._id as string) || (typeof userId === 'string' ? userId : `member-${index}`),
          name: userId?.firstName && userId?.lastName 
            ? `${userId.firstName} ${userId.lastName}` 
            : userId?.name as string || `Member ${index + 1}`,
          avatar: (userId?.avatar as string) || '/api/placeholder/32/32',
          role: memberRole || 'member',
          isOnline: (userId?.isOnline as boolean) ?? false
        };
      }),
      recentActivity: (team.recentActivity as any[] || []).slice(0, 3).map((activity: any, idx: number) => ({
        id: activity.id || activity._id || `activity-${idx}`,
        type: activity.type || 'update',
        message: activity.message || activity.description || 'Recent team activity',
        timestamp: activity.timestamp || activity.createdAt || new Date().toISOString()
      })),
      tags: team.focusAreas || team.tags || ['Team'],
      isJoined: team.members?.some((m: Record<string, unknown>) => {
        const userId = m.userId as Record<string, unknown> | string | undefined;
        const memberId = typeof userId === 'object' ? (userId?._id as string) : (userId as string);
        return memberId === currentUserId;
      }) || false,
      isOwner: (() => {
        const leader = team.leader as Record<string, unknown> | string | undefined;
        const leaderId = typeof leader === 'object' ? (leader?._id as string) : (leader as string);
        return leaderId === currentUserId;
      })()
    };
  }) : [];

  return (
    <div className="teams-grid">
      {displayTeams.map((team) => (
        <TeamCard key={team.id} team={team} isDark={true} />
      ))}
    </div>
  );
};

export default TeamCardsGrid;