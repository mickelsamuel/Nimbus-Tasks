'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Filter, Star, Users, TrendingUp, ChevronDown, Loader2 } from 'lucide-react';
import TeamCard from './cards/TeamCard';
import { useTeamCategories } from '@/lib/api/teamCategories';

interface Team {
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

interface TeamDiscoveryProps {
  teams: Team[];
  isDark: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const TeamDiscovery: React.FC<TeamDiscoveryProps> = ({
  teams,
  isDark,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}) => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'performance'>('performance');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [joiningTeam, setJoiningTeam] = useState<string | null>(null);

  const handleJoinTeam = async (teamId: string) => {
    try {
      setJoiningTeam(teamId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert('Successfully joined the team!');
        // Refresh teams data or update local state
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to join team');
      }
    } catch (error) {
      console.error('Failed to join team:', error);
      alert('Failed to join team. Please try again.');
    } finally {
      setJoiningTeam(null);
    }
  };

  const { categories: categoryData, loading: categoriesLoading } = useTeamCategories();
  const categories = ['all', ...(!categoriesLoading ? categoryData.map(cat => cat.name) : ['Trading', 'Learning', 'Innovation', 'Research'])];
  const statuses = ['all', 'active', 'recruiting', 'inactive'];

  const filteredAndSortedTeams = teams
    .filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           team.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || team.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesStatus = selectedStatus === 'all' || team.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return b.memberCount - a.memberCount;
        case 'performance':
          return b.performance - a.performance;
        default:
          return 0;
      }
    });

  const featuredTeams = teams.filter(team => team.performance >= 90 && !team.isJoined).slice(0, 3);

  return (
    <div className="space-y-8">
      
      {/* Discovery Header */}
      <div className={`rounded-2xl p-6 backdrop-blur-xl border ${
        isDark 
          ? 'bg-slate-800/60 border-slate-700/50' 
          : 'bg-white/80 border-slate-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Title Section */}
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Discover Teams
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Find the perfect team to accelerate your growth
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            
            {/* Search */}
            <div className={`relative min-w-[300px] rounded-xl border backdrop-blur-xl ${
              isDark 
                ? 'bg-slate-800/50 border-slate-700/50' 
                : 'bg-white/70 border-slate-200/50'
            }`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search teams by name or description..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border-none outline-none ${
                  isDark ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'
                }`}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isDark
                  ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600/50'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${
                showFilters ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-slate-700/50"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className={`w-full p-3 rounded-xl border backdrop-blur-xl ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white' 
                        : 'bg-white/70 border-slate-200/50 text-slate-900'
                    }`}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={`w-full p-3 rounded-xl border backdrop-blur-xl ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white' 
                        : 'bg-white/70 border-slate-200/50 text-slate-900'
                    }`}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'members' | 'performance')}
                    className={`w-full p-3 rounded-xl border backdrop-blur-xl ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white' 
                        : 'bg-white/70 border-slate-200/50 text-slate-900'
                    }`}
                  >
                    <option value="performance">Performance</option>
                    <option value="members">Member Count</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Featured Teams */}
      {featuredTeams.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Star className={`w-6 h-6 ${
              isDark ? 'text-yellow-400' : 'text-yellow-500'
            }`} />
            <h3 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Featured Teams
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TeamCard 
                  team={team} 
                  isDark={isDark} 
                  onJoin={handleJoinTeam}
                  onView={(teamId) => {
                    router.push(`/teams/${teamId}`);
                  }}
                  isJoining={joiningTeam === team.id}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Teams */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            All Teams ({filteredAndSortedTeams.length})
          </h3>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDark ? 'bg-slate-700/30' : 'bg-slate-100/50'
            }`}>
              <Users className={`w-4 h-4 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {teams.filter(t => t.status === 'recruiting').length} Recruiting
              </span>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDark ? 'bg-slate-700/30' : 'bg-slate-100/50'
            }`}>
              <TrendingUp className={`w-4 h-4 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {Math.round(teams.reduce((sum, t) => sum + t.performance, 0) / teams.length)}% Avg
              </span>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {filteredAndSortedTeams.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TeamCard 
                  team={team} 
                  isDark={isDark} 
                  onJoin={handleJoinTeam}
                  onView={(teamId) => {
                    router.push(`/teams/${teamId}`);
                  }}
                  isJoining={joiningTeam === team.id}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`col-span-full text-center py-20 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDark 
              ? 'border-slate-700 bg-slate-800/20' 
              : 'border-slate-300 bg-slate-50/50'
          }`}>
            <Search className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              No teams found
            </h3>
            <p className={`mb-6 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
                setSelectedStatus('all');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDiscovery;