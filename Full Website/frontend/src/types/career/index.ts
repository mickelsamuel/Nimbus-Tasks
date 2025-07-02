// Career related type definitions

export interface ExecutiveProfile {
  name: string;
  title: string;
  department: string;
  employeeId: string;
  startDate: string;
  level: string;
  yearsOfService: number;
  profileImage: string;
  reportingManager: string;
  directReports: number;
  currentLocation: string;
  workStyle: string;
  nextReview: string;
  currentRole?: string;
}

export interface PerformanceMetrics {
  overallRating: number;
  promotionReadiness: number;
  leadershipScore: number;
  innovationIndex: number;
  collaborationRating: number;
  clientSatisfaction: number;
  goalCompletion: number;
  learningVelocity: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  type: 'performance' | 'innovation' | 'leadership' | 'client';
  rarity: 'platinum' | 'gold' | 'silver' | 'bronze';
  date: string;
  impact: string;
  category: string;
}

export interface NetworkPerson {
  name: string;
  role: string;
  department: string;
}

export interface NetworkConnections {
  directReports: NetworkPerson[];
  peers: NetworkPerson[];
  mentors: NetworkPerson[];
  mentees: NetworkPerson[];
}

export interface CareerData {
  profile: ExecutiveProfile;
  performance: PerformanceMetrics;
  achievements: Achievement[];
  network: NetworkConnections;
  skills?: Record<string, unknown>;
  mentorship?: Record<string, unknown>;
  goals?: Record<string, unknown>;
  currentPath?: Record<string, unknown>;
  alternativePaths?: Record<string, unknown>;
}

export type ViewType = 'overview' | 'skills' | 'paths' | 'analytics';