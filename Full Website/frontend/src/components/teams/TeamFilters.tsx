'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Users, Trophy, Target, Clock } from 'lucide-react';

interface TeamFiltersProps {
  isDark: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const TeamFilters: React.FC<TeamFiltersProps> = ({
  isDark,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange
}) => {
  const categories = [
    { value: 'all', label: 'All Categories', icon: Target },
    { value: 'Trading', label: 'Trading', icon: Trophy },
    { value: 'Learning', label: 'Learning', icon: Users },
    { value: 'Innovation', label: 'Innovation', icon: Target },
    { value: 'Research', label: 'Research', icon: Clock }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'recruiting', label: 'Recruiting' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const sortOptions = [
    { value: 'performance', label: 'Performance' },
    { value: 'members', label: 'Member Count' },
    { value: 'name', label: 'Name' },
    { value: 'recent', label: 'Recently Active' }
  ];

  return (
    <div className={`rounded-2xl p-6 backdrop-blur-xl border ${
      isDark 
        ? 'bg-slate-800/60 border-slate-700/50' 
        : 'bg-white/80 border-slate-200/50'
    }`}>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className={`w-5 h-5 ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`} />
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Filters
        </h3>
      </div>

      <div className="space-y-6">
        
        {/* Category Filter */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.value;
              
              return (
                <motion.button
                  key={category.value}
                  onClick={() => onCategoryChange(category.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : isDark
                        ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Status and Sort Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Status Filter */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`w-full p-3 rounded-xl border backdrop-blur-xl ${
                isDark 
                  ? 'bg-slate-800/50 border-slate-700/50 text-white' 
                  : 'bg-white/70 border-slate-200/50 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className={`w-full p-3 rounded-xl border backdrop-blur-xl ${
                isDark 
                  ? 'bg-slate-800/50 border-slate-700/50 text-white' 
                  : 'bg-white/70 border-slate-200/50 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Quick Filters
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'High Performance', action: () => onSortChange('performance') },
              { label: 'Most Popular', action: () => onSortChange('members') },
              { label: 'Recently Active', action: () => onSortChange('recent') },
              { label: 'Recruiting', action: () => onStatusChange('recruiting') }
            ].map((filter) => (
              <motion.button
                key={filter.label}
                onClick={filter.action}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFilters;