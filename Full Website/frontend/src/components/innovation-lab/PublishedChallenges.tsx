'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Clock, ArrowRight, Filter, Search, Tag, TrendingUp, Star } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  deadline: string;
  teamSize: number;
  rewards: string;
  author: string;
  authorAvatar: string;
  tags: string[];
  participants: number;
  status: 'active' | 'upcoming' | 'completed';
  featured: boolean;
}

export default function PublishedChallenges() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - in real app, this would come from an API
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'AI-Powered Customer Service Bot',
      description: 'Develop an intelligent chatbot that can handle 80% of customer inquiries without human intervention.',
      category: 'Technology Innovation',
      difficulty: 'Advanced',
      deadline: '2024-03-15',
      teamSize: 4,
      rewards: '$10,000 + Implementation Support',
      author: 'Sarah Chen',
      authorAvatar: '/avatars/sarah.jpg',
      tags: ['AI', 'Machine Learning', 'Customer Service'],
      participants: 23,
      status: 'active',
      featured: true
    },
    {
      id: '2',
      title: 'Zero-Waste Office Initiative',
      description: 'Create a comprehensive plan to achieve zero waste in our office spaces within 6 months.',
      category: 'Sustainability',
      difficulty: 'Intermediate',
      deadline: '2024-04-01',
      teamSize: 3,
      rewards: '$5,000 + Green Champion Award',
      author: 'Mike Johnson',
      authorAvatar: '/avatars/mike.jpg',
      tags: ['Sustainability', 'Green', 'Office'],
      participants: 15,
      status: 'active',
      featured: false
    },
    {
      id: '3',
      title: 'Remote Team Collaboration Platform',
      description: 'Design a new platform that enhances collaboration for distributed teams across time zones.',
      category: 'Employee Experience',
      difficulty: 'Expert',
      deadline: '2024-03-30',
      teamSize: 5,
      rewards: '$15,000 + 6-month mentorship',
      author: 'Lisa Wang',
      authorAvatar: '/avatars/lisa.jpg',
      tags: ['Remote Work', 'Collaboration', 'Platform'],
      participants: 34,
      status: 'active',
      featured: true
    },
    {
      id: '4',
      title: 'Data Analytics Dashboard',
      description: 'Build a real-time analytics dashboard for tracking key business metrics.',
      category: 'Data & Analytics',
      difficulty: 'Advanced',
      deadline: '2024-04-15',
      teamSize: 3,
      rewards: '$8,000 + AWS Credits',
      author: 'David Kim',
      authorAvatar: '/avatars/david.jpg',
      tags: ['Data', 'Analytics', 'Dashboard'],
      participants: 19,
      status: 'upcoming',
      featured: false
    }
  ];

  const categories = ['all', ...new Set(challenges.map(c => c.category))];

  const filteredChallenges = challenges
    .filter(challenge => {
      if (selectedCategory !== 'all' && challenge.category !== selectedCategory) return false;
      if (searchQuery && !challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !challenge.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'participants') return b.participants - a.participants;
      if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return 0;
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-orange-400 bg-orange-400/20';
      case 'Expert': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'upcoming': return 'text-blue-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
          >
            <option value="newest" className="bg-gray-900">Newest First</option>
            <option value="participants" className="bg-gray-900">Most Popular</option>
            <option value="deadline" className="bg-gray-900">Deadline Soon</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-purple-400/50"
          >
            {/* Featured Badge */}
            {challenge.featured && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2">
                <Star className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${getStatusColor(challenge.status)}`}>
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {challenge.title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2">
                {challenge.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {challenge.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-4 h-4" />
                <span>Max team size: {challenge.teamSize} • {challenge.participants} participating</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Trophy className="w-4 h-4" />
                <span>{challenge.rewards}</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                <span className="text-sm text-gray-300">{challenge.author}</span>
              </div>
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span className="text-sm">View Details</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No challenges found</h3>
          <p className="text-gray-400">Try adjusting your filters or search query</p>
        </motion.div>
      )}
    </div>
  );
}