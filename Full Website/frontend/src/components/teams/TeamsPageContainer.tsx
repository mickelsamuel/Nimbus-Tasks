'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  TrendingUp,
  Sparkles,
  Filter,
  Grid3X3,
  List,
  Activity,
  Layers
} from 'lucide-react';

// Import updated components
import TeamsHeader from './TeamsHeader';
import TeamCard from './cards/TeamCard';
import CreateTeamModal from './CreateTeamModal';
import TeamDiscovery from './TeamDiscovery';
import TeamStats from './TeamStats';
import QuickActions from './QuickActions';
import { TeamCollaboration } from './TeamCollaboration';
import { TeamPerformance } from './TeamPerformance';
import { TeamCommunication } from './TeamCommunication';
import { useTeams } from '../../hooks/useTeams';
import { useAuth } from '../../contexts/AuthContext';
import { Team as TeamType } from '../../types/team';

interface TeamUIData {
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

// Team collaboration data will be fetched from API

// Generate a professional team avatar URL based on team category
const generateTeamAvatar = (teamName: string, category: string): string => {
  const teamAvatars = {
    'Trading': [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop&crop=face'
    ],
    'Learning': [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    ],
    'Innovation': [
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=face'
    ],
    'Research': [
      'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face'
    ],
    'Risk Management': [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=face'
    ]
  };

  const categoryAvatars = teamAvatars[category as keyof typeof teamAvatars] || teamAvatars['Learning'];
  const hash = teamName.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a & a}, 0);
  const index = Math.abs(hash) % categoryAvatars.length;
  return categoryAvatars[index];
};

// Transform API teams to match our interface
const transformApiTeams = (apiTeams: TeamType[], currentUser: { id?: string | number } | null): TeamUIData[] => {
  return apiTeams.map(team => ({
    id: team._id || team.id || '',
    name: team.name,
    description: team.description || '',
    memberCount: team.stats?.memberCount || team.members?.length || 0,
    maxMembers: team.settings?.maxMembers || 50,
    category: team.category || 'Learning',
    status: team.isActive ? 'active' : 'inactive',
    performance: Math.round((team.stats?.totalPoints || 0) / 100) || 75,
    achievements: team.achievements?.length || 0,
    avatar: team.avatar || generateTeamAvatar(team.name, team.category || 'Learning'),
    members: (team.members || []).map((member: Record<string, unknown>, index: number) => {
      // Handle different member structure possibilities
      const memberData = member.userId || member;
      const memberDataObj = typeof memberData === 'object' && memberData !== null 
        ? memberData as Record<string, unknown>
        : null;
      const memberId = memberDataObj 
        ? (memberDataObj._id as string) || (memberDataObj.id as string) 
        : (memberData as string);
      const memberName = memberDataObj
        ? (memberDataObj.firstName && memberDataObj.lastName 
          ? `${memberDataObj.firstName} ${memberDataObj.lastName}` 
          : (memberDataObj.name as string) || `Team Member ${index + 1}`)
        : `Team Member ${index + 1}`;
      const memberAvatar = memberDataObj
        ? ((memberDataObj.avatar as string) || '/avatars/default.jpg')
        : '/avatars/default.jpg';
      const memberRole = member
        ? ((member.role as string) || 'member')
        : 'member';
        
      return {
        id: memberId?.toString() || `member-${index}`,
        name: memberName,
        avatar: memberAvatar,
        role: memberRole,
        isOnline: Math.random() > 0.5 // Random for demo
      };
    }),
    recentActivity: [
      { id: '1', type: 'activity', message: 'Recent team activity', timestamp: '1 hour ago' }
    ],
    tags: team.focusAreas || ['Collaboration'],
    isJoined: team.members?.some((m: Record<string, unknown>) => {
      const memberData = m.userId || m;
      const memberDataObj = typeof memberData === 'object' && memberData !== null 
        ? memberData as Record<string, unknown>
        : null;
      const memberId = memberDataObj 
        ? (memberDataObj._id as string) || (memberDataObj.id as string) 
        : (memberData as string);
      return memberId?.toString() === currentUser?.id?.toString();
    }) || false,
    isOwner: (() => {
      const leaderObj = typeof team.leader === 'object' && team.leader !== null
        ? team.leader as Record<string, unknown>
        : null;
      const leaderId = leaderObj
        ? (leaderObj._id as string) || (leaderObj.id as string)
        : (typeof team.leader === 'string' ? team.leader : '');
      return leaderId?.toString() === currentUser?.id?.toString();
    })() || false
  }));
};

const TeamsPageContainer: React.FC = () => {
  const [activeView, setActiveView] = useState<'my-teams' | 'discover' | 'collaboration' | 'performance' | 'communication'>('my-teams');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'performance' | 'activity' | 'members' | 'achievements'>('performance');
  
  // Use real teams hook
  const { teams: apiTeams, loading, error, createTeam: createTeamAPI } = useTeams();
  const { user, isAuthenticated } = useAuth();
  
  // Transform API teams to match our interface
  const teams = isAuthenticated && !loading && apiTeams.length > 0 ? transformApiTeams(apiTeams, user) : [];

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkDarkMode();
    
    // Observer for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  const myTeams = teams.filter(team => team.isJoined);
  const availableTeams = teams.filter(team => !team.isJoined);

  const containerClasses = `min-h-screen transition-all duration-500 ${
    isDark 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900/20' 
      : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20'
  }`;

  return (
    <div className={containerClasses}>
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-blue-400/20' : 'bg-blue-500/10'
            }`}
            initial={{
              x: Math.random() * 1200,
              y: 800,
              opacity: 0
            }}
            animate={{
              y: -50,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Enhanced Teams Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <TeamsHeader 
            isDark={isDark}
            teamsCount={teams.length}
            myTeamsCount={myTeams.length}
            onCreateTeam={() => setShowCreateModal(true)}
          />
        </motion.div>

        {/* Enhanced Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-3xl p-1.5 backdrop-blur-xl border transition-all duration-300 shadow-xl ${
            isDark 
              ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50' 
              : 'bg-white/95 border-slate-300/60 shadow-slate-200/60'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
            {[
              { id: 'my-teams', label: 'My Teams', icon: Users, count: myTeams.length, gradient: 'from-blue-500 to-cyan-500' },
              { id: 'discover', label: 'Discover', icon: Search, count: availableTeams.length, gradient: 'from-purple-500 to-pink-500' },
              { id: 'collaboration', label: 'Collaboration', icon: Layers, gradient: 'from-green-500 to-teal-500' },
              { id: 'performance', label: 'Performance', icon: TrendingUp, gradient: 'from-orange-500 to-red-500' },
              { id: 'communication', label: 'Communication', icon: Activity, gradient: 'from-indigo-500 to-purple-500' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as 'my-teams' | 'discover' | 'collaboration' | 'performance' | 'communication')}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105`
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-102'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 hover:scale-102'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated background effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${tab.gradient}`} />
                  
                  <div className="relative z-10 flex items-center gap-2">
                    <motion.div
                      animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Icon size={18} />
                    </motion.div>
                    <span className="hidden sm:inline font-semibold">{tab.label}</span>
                    {tab.count !== undefined && (
                      <motion.span 
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isDark
                              ? 'bg-slate-600 text-slate-200'
                              : 'bg-slate-200 text-slate-700'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        {tab.count}
                      </motion.span>
                    )}
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-1/2 w-8 h-1 bg-white/50 rounded-full transform -translate-x-1/2"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            
            {/* Enhanced My Teams View */}
            {activeView === 'my-teams' && (
              <div className="space-y-8">
                {/* Enhanced Team Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <TeamStats teams={myTeams} isDark={isDark} />
                </motion.div>
                
                {/* Enhanced Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <QuickActions 
                    isDark={isDark}
                    onCreateTeam={() => setShowCreateModal(true)}
                  />
                </motion.div>
                
                {/* Enhanced Teams Grid Section */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {/* Enhanced Header with Controls */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Sparkles className={`w-6 h-6 ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <h2 className={`text-3xl font-bold bg-gradient-to-r ${
                          isDark 
                            ? 'from-white via-blue-100 to-purple-200' 
                            : 'from-slate-900 via-blue-800 to-purple-900'
                        } bg-clip-text text-transparent`}>
                          Your Teams ({myTeams.length})
                        </h2>
                      </div>
                      
                      {/* Activity Indicator */}
                      <motion.div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                          isDark 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-green-100 text-green-700 border border-green-200'
                        }`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          isDark ? 'bg-green-400' : 'bg-green-500'
                        }`} />
                        Live
                      </motion.div>
                    </div>
                    
                    {/* Enhanced Search and Controls */}
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                      {/* Advanced Search */}
                      <div className={`relative flex-1 lg:flex-none lg:w-80 rounded-2xl border backdrop-blur-xl shadow-lg transition-all duration-300 ${
                        isDark 
                          ? 'bg-slate-800/60 border-slate-700/50 focus-within:border-blue-500/50' 
                          : 'bg-white/90 border-slate-300/60 focus-within:border-blue-500/50'
                      }`}>
                        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`} />
                        <input
                          type="text"
                          placeholder="Search teams, members, or skills..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-transparent border-none outline-none font-medium placeholder-opacity-75 ${
                            isDark ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'
                          }`}
                        />
                      </div>
                      
                      {/* View Mode Toggle */}
                      <div className={`flex items-center rounded-xl border backdrop-blur-xl p-1 ${
                        isDark 
                          ? 'bg-slate-800/60 border-slate-700/50' 
                          : 'bg-white/90 border-slate-300/60'
                      }`}>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            viewMode === 'grid'
                              ? isDark
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-blue-500 text-white shadow-lg'
                              : isDark
                                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                          }`}
                        >
                          <Grid3X3 size={18} />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            viewMode === 'list'
                              ? isDark
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-blue-500 text-white shadow-lg'
                              : isDark
                                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                          }`}
                        >
                          <List size={18} />
                        </button>
                      </div>
                      
                      {/* Sort & Filter */}
                      <div className="flex items-center gap-2">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as 'performance' | 'activity' | 'members' | 'achievements')}
                          className={`px-4 py-2.5 rounded-xl border backdrop-blur-xl font-medium cursor-pointer transition-all ${
                            isDark 
                              ? 'bg-slate-800/60 border-slate-700/50 text-white focus:border-blue-500/50' 
                              : 'bg-white/90 border-slate-300/60 text-slate-900 focus:border-blue-500/50'
                          }`}
                        >
                          <option value="performance">⚡ Performance</option>
                          <option value="activity">📊 Activity</option>
                          <option value="members">👥 Members</option>
                          <option value="achievements">🏆 Achievements</option>
                        </select>
                        
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className={`p-2.5 rounded-xl border backdrop-blur-xl transition-all duration-200 ${
                            showFilters
                              ? isDark
                                ? 'bg-blue-600 text-white border-blue-500/50'
                                : 'bg-blue-500 text-white border-blue-400/50'
                              : isDark
                                ? 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                                : 'bg-white/90 border-slate-300/60 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                          }`}
                        >
                          <Filter size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Advanced Filters Panel */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-2xl border backdrop-blur-xl p-6 ${
                          isDark 
                            ? 'bg-slate-800/60 border-slate-700/50' 
                            : 'bg-white/90 border-slate-300/60'
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>Category</label>
                            <select className={`w-full px-3 py-2 rounded-lg border ${
                              isDark 
                                ? 'bg-slate-700/50 border-slate-600/50 text-white' 
                                : 'bg-white border-slate-300 text-slate-900'
                            }`}>
                              <option>All Categories</option>
                              <option>Trading</option>
                              <option>Learning</option>
                              <option>Innovation</option>
                              <option>Research</option>
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>Status</label>
                            <select className={`w-full px-3 py-2 rounded-lg border ${
                              isDark 
                                ? 'bg-slate-700/50 border-slate-600/50 text-white' 
                                : 'bg-white border-slate-300 text-slate-900'
                            }`}>
                              <option>All Status</option>
                              <option>Active</option>
                              <option>Recruiting</option>
                              <option>Inactive</option>
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>Size</label>
                            <select className={`w-full px-3 py-2 rounded-lg border ${
                              isDark 
                                ? 'bg-slate-700/50 border-slate-600/50 text-white' 
                                : 'bg-white border-slate-300 text-slate-900'
                            }`}>
                              <option>Any Size</option>
                              <option>Small (1-5)</option>
                              <option>Medium (6-10)</option>
                              <option>Large (11+)</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <button className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                              isDark 
                                ? 'bg-slate-700 text-white hover:bg-slate-600' 
                                : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                            }`}>
                              Reset Filters
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Loading State */}
                  {isAuthenticated && loading && (
                    <div className="flex items-center justify-center py-20">
                      <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                        isDark ? 'border-white' : 'border-slate-900'
                      }`}></div>
                    </div>
                  )}

                  {/* Error State */}
                  {isAuthenticated && error && (
                    <div className={`text-center py-10 rounded-2xl border shadow-sm ${
                      isDark 
                        ? 'border-red-500/30 bg-red-500/10 text-red-400' 
                        : 'border-red-300/60 bg-red-50/80 text-red-600'
                    }`}>
                      <p>Error loading teams: {error}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Not Authenticated State */}
                  {!isAuthenticated && (
                    <div className={`text-center py-10 rounded-2xl border shadow-sm ${
                      isDark 
                        ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' 
                        : 'border-yellow-300/60 bg-yellow-50/80 text-yellow-600'
                    }`}>
                      <p>Please log in to view your teams.</p>
                    </div>
                  )}

                  {/* Enhanced Teams Display */}
                  <div className={`transition-all duration-500 ${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
                      : 'space-y-4'
                  }`}>
                    {myTeams.length > 0 ? (
                      myTeams
                        .filter(team => 
                          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                        )
                        .sort((a, b) => {
                          switch (sortBy) {
                            case 'performance': return b.performance - a.performance;
                            case 'activity': return b.achievements - a.achievements;
                            case 'members': return b.memberCount - a.memberCount;
                            case 'achievements': return b.achievements - a.achievements;
                            default: return 0;
                          }
                        })
                        .map((team, index) => (
                        <motion.div
                          key={team.id}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            delay: index * 0.1, 
                            duration: 0.5,
                            type: "spring",
                            stiffness: 100
                          }}
                          whileHover={{ y: -5 }}
                          className="group"
                        >
                          <div className="relative">
                            {/* Performance glow effect */}
                            {team.performance >= 90 && (
                              <motion.div
                                className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl opacity-20 blur-sm"
                                animate={{ 
                                  scale: [1, 1.05, 1],
                                  opacity: [0.2, 0.3, 0.2]
                                }}
                                transition={{ 
                                  duration: 3, 
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}
                            <TeamCard team={team} isDark={isDark} />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        className={`col-span-full text-center py-24 rounded-3xl border-2 border-dashed transition-all duration-500 relative overflow-hidden group ${
                          isDark 
                            ? 'border-slate-700 bg-slate-800/20' 
                            : 'border-slate-300 bg-slate-100/60'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {/* Animated background */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className={`absolute inset-0 bg-gradient-to-br ${
                            isDark 
                              ? 'from-blue-600/5 via-purple-600/5 to-cyan-600/5' 
                              : 'from-blue-500/3 via-purple-500/3 to-cyan-500/3'
                          }`} />
                        </div>
                        
                        <div className="relative z-10">
                          <motion.div
                            animate={{ 
                              rotate: [0, 5, -5, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              duration: 4, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className={`inline-flex p-6 rounded-full mb-6 ${
                              isDark 
                                ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20' 
                                : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                            }`}
                          >
                            <Users className={`w-20 h-20 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`} />
                          </motion.div>
                          
                          <h3 className={`text-2xl font-bold mb-3 ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          }`}>
                            Ready to Build Something Amazing?
                          </h3>
                          <p className={`text-lg mb-8 max-w-md mx-auto ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            Create your first team or discover existing ones to start collaborating with brilliant minds
                          </p>
                          
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                              onClick={() => setShowCreateModal(true)}
                              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Plus size={24} />
                              Create Your First Team
                            </motion.button>
                            
                            <motion.button
                              onClick={() => setActiveView('discover')}
                              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-300 ${
                                isDark 
                                  ? 'border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-700/30' 
                                  : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-100/50'
                              }`}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Search size={20} />
                              Explore Teams
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Enhanced Discovery View */}
            {activeView === 'discover' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <TeamDiscovery 
                  teams={availableTeams}
                  isDark={isDark}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </motion.div>
            )}

            {/* Enhanced Collaboration View */}
            {activeView === 'collaboration' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <TeamCollaboration />
              </motion.div>
            )}

            {/* Enhanced Performance View */}
            {activeView === 'performance' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <TeamPerformance />
              </motion.div>
            )}

            {/* Enhanced Communication View */}
            {activeView === 'communication' && (
              <motion.div
                initial={{ opacity: 0, rotateY: 10 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -10 }}
                transition={{ duration: 0.5 }}
              >
                <TeamCommunication />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Create Team Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateTeamModal 
              isDark={isDark}
              onClose={() => setShowCreateModal(false)}
              onCreateTeam={async (teamData) => {
                try {
                  // Transform modal data to API format
                  const apiTeamData = {
                    name: teamData.name,
                    description: teamData.description,
                    department: teamData.category, // Use category as department
                    category: teamData.category,
                    isPublic: teamData.privacy === 'public',
                    maxMembers: teamData.maxMembers
                  };
                  await createTeamAPI(apiTeamData);
                  setShowCreateModal(false);
                } catch (err) {
                  console.error('Failed to create team:', err);
                  // Modal will show error state
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamsPageContainer;