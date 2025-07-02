export interface TeamMember {
  id: string;
  avatar: string;
  isLeader: boolean;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  level?: number;
  isOnline?: boolean;
}

export interface TeamAchievement {
  icon: string;
  text: string;
  color: string;
}

export interface TeamActivity {
  text: string;
  time: string;
}

export interface Team {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  tagline?: string;
  avatar?: string;
  banner?: string;
  color?: string;
  department: string;
  category?: string;
  leader?: Record<string, unknown>;
  coLeaders?: Array<Record<string, unknown>>;
  members?: Array<Record<string, unknown>>;
  stats?: TeamStats;
  achievements?: Array<Record<string, unknown>>;
  badges?: Array<Record<string, unknown>>;
  goals?: Array<Record<string, unknown>>;
  focusAreas?: string[];
  tags?: string[];
  currentModules?: Array<Record<string, unknown>>;
  announcements?: Array<Record<string, unknown>>;
  settings?: {
    isPublic: boolean;
    allowJoinRequests: boolean;
    requireApproval: boolean;
    maxMembers: number;
    allowMemberInvites: boolean;
    showMemberStats: boolean;
    showTeamStats: boolean;
  };
  activityLog?: Array<Record<string, unknown>>;
  isActive?: boolean;
  isArchived?: boolean;
  createdAt?: Date;
  lastActivity?: Date;
  
  // UI-specific fields for display
  type?: string;
  logo?: string;
  status?: 'active' | 'rising' | 'idle';
  activity?: 'high-activity' | 'medium-activity' | 'low-activity';
  match?: number;
  collaboration?: number;
  projects?: number;
  rating?: number;
  uiAchievements?: TeamAchievement[];
  uiActivities?: TeamActivity[];
  uiMembers?: TeamMember[];
  recentActivity?: Record<string, unknown>[];
  leaderId?: string | number;
}

export interface TeamStats {
  memberCount: number;
  totalXP: number;
  totalModulesCompleted: number;
  averageProgress: number;
  weeklyActivity: number;
  monthlyActivity: number;
  rank: number;
  level: number;
  averagePerformance?: number;
  achievementCount?: number;
}

export interface CreateTeamData {
  name: string;
  description: string;
  department: string;
  category: string;
  isPublic: boolean;
  maxMembers: number;
}