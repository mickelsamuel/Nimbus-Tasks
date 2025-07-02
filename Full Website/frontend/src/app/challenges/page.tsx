'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Trophy, 
  Clock, 
  Users, 
  Search, 
  DollarSign,
  Target,
  Sparkles,
  Rocket,
  Star,
  Zap,
  Code,
  Brain,
  Globe,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  deadline: string;
  maxTeamSize: number;
  rewards: string;
  prizePool: number;
  tags: string[];
  creator: {
    name: string;
    avatar?: string;
  };
  submissionCount: number;
  viewCount: number;
  featured: boolean;
  daysRemaining: number;
  isExpired: boolean;
}

export default function PublicChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'all',
    'Process Improvement',
    'Technology Innovation',
    'Sustainability',
    'Employee Experience',
    'Customer Success',
    'Product Development',
    'Cost Optimization',
    'Data & Analytics'
  ];

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        status: 'active'
      });

      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/challenges/public?${params}`);
      const data = await response.json();

      setChallenges(data.challenges);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty, sortBy, currentPage, searchQuery]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return {
        bg: 'from-emerald-500/20 to-green-500/20',
        border: 'border-emerald-400/30',
        text: 'text-emerald-300',
        glow: 'shadow-emerald-500/20'
      };
      case 'Intermediate': return {
        bg: 'from-amber-500/20 to-yellow-500/20',
        border: 'border-amber-400/30',
        text: 'text-amber-300',
        glow: 'shadow-amber-500/20'
      };
      case 'Advanced': return {
        bg: 'from-orange-500/20 to-red-500/20',
        border: 'border-orange-400/30',
        text: 'text-orange-300',
        glow: 'shadow-orange-500/20'
      };
      case 'Expert': return {
        bg: 'from-red-500/20 to-pink-500/20',
        border: 'border-red-400/30',
        text: 'text-red-300',
        glow: 'shadow-red-500/20'
      };
      default: return {
        bg: 'from-gray-500/20 to-slate-500/20',
        border: 'border-gray-400/30',
        text: 'text-gray-300',
        glow: 'shadow-gray-500/20'
      };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technology Innovation': return <Rocket className="w-5 h-5" />;
      case 'Sustainability': return <Globe className="w-5 h-5" />;
      case 'Data & Analytics': return <Brain className="w-5 h-5" />;
      case 'Process Improvement': return <Zap className="w-5 h-5" />;
      case 'Employee Experience': return <Users className="w-5 h-5" />;
      case 'Customer Success': return <Trophy className="w-5 h-5" />;
      case 'Product Development': return <Code className="w-5 h-5" />;
      case 'Cost Optimization': return <Target className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Technology Innovation': return 'from-purple-500 to-indigo-600';
      case 'Sustainability': return 'from-green-500 to-emerald-600';
      case 'Data & Analytics': return 'from-blue-500 to-cyan-600';
      case 'Process Improvement': return 'from-yellow-500 to-orange-600';
      case 'Employee Experience': return 'from-pink-500 to-rose-600';
      case 'Customer Success': return 'from-indigo-500 to-purple-600';
      case 'Product Development': return 'from-teal-500 to-green-600';
      case 'Cost Optimization': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  // Memoize filtered challenges for performance
  const filteredChallenges = useMemo(() => challenges, [challenges]);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-slate-950 to-indigo-950/50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-8"
            >
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium">Premium Innovation Platform</span>
              <Trophy className="w-4 h-4 text-yellow-400" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Innovation
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Challenges
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Transform groundbreaking ideas into reality. Join thousands of innovators competing for 
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-semibold"> life-changing rewards</span> while solving tomorrow&apos;s biggest challenges.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
            >
              {[
                { icon: Rocket, value: `${filteredChallenges.length}+`, label: 'Live Challenges', gradient: 'from-orange-500 to-red-500' },
                { icon: DollarSign, value: '$2M+', label: 'Prize Pool', gradient: 'from-green-500 to-emerald-500' },
                { icon: Users, value: '50k+', label: 'Global Solvers', gradient: 'from-blue-500 to-purple-500' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -m-1 from-purple-500/20 to-blue-500/20" />
                  <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                onClick={() => document.getElementById('challenges-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Explore Challenges
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-4 h-4 bg-purple-500 rounded-full opacity-60"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 right-20 w-6 h-6 bg-blue-500 rounded-full opacity-40"
          />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 right-10 w-3 h-3 bg-cyan-500 rounded-full opacity-50"
          />
        </div>
      </section>

      {/* Filters Section */}
      <section id="challenges-section" className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-slate-800 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-slate-800 transition-all duration-300"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-800">
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-slate-800 transition-all duration-300"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff} className="bg-slate-800">
                  {diff === 'all' ? 'All Levels' : diff}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-slate-800 transition-all duration-300"
            >
              <option value="featured" className="bg-slate-800">Featured</option>
              <option value="newest" className="bg-slate-800">Newest First</option>
              <option value="deadline" className="bg-slate-800">Deadline Soon</option>
              <option value="prize" className="bg-slate-800">Highest Prize</option>
              <option value="popular" className="bg-slate-800">Most Popular</option>
            </select>
          </div>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="relative max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredChallenges.map((challenge, index) => {
                const difficultyColors = getDifficultyColor(challenge.difficulty);
                const categoryGradient = getCategoryGradient(challenge.category);
                
                return (
                  <motion.div
                    key={challenge._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group relative"
                  >
                    <Link href={`/challenges/${challenge._id}`}>
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -m-2" />
                      
                      <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden h-full flex flex-col group-hover:border-slate-600/50 transition-all duration-300">
                        {/* Featured Badge */}
                        {challenge.featured && (
                          <div className="absolute top-4 right-4 z-10">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                              <Star className="w-3 h-3" />
                              Featured
                            </div>
                          </div>
                        )}

                        {/* Category Header */}
                        <div className={`h-2 bg-gradient-to-r ${categoryGradient}`} />

                        {/* Content */}
                        <div className="p-6 flex-1">
                          {/* Category & Difficulty */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              {getCategoryIcon(challenge.category)}
                              <span className="text-sm font-medium">{challenge.category}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold border bg-gradient-to-r ${difficultyColors.bg} ${difficultyColors.border} ${difficultyColors.text} shadow-lg ${difficultyColors.glow}`}>
                              {challenge.difficulty}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                            {challenge.title}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                            {challenge.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {challenge.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-600">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Meta Info */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-6 text-sm">
                              <span className="flex items-center gap-2 text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span className={challenge.daysRemaining <= 7 ? 'text-orange-400 font-medium' : ''}>
                                  {challenge.daysRemaining} days left
                                </span>
                              </span>
                              <span className="flex items-center gap-2 text-slate-400">
                                <Users className="w-4 h-4" />
                                <span>Team of {challenge.maxTeamSize}</span>
                              </span>
                            </div>
                            
                            {challenge.prizePool > 0 && (
                              <div className="flex items-center gap-2 text-green-400 font-semibold">
                                <DollarSign className="w-4 h-4" />
                                <span>${challenge.prizePool.toLocaleString()} Prize Pool</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${categoryGradient} flex items-center justify-center`}>
                                <span className="text-white font-bold text-sm">
                                  {challenge.creator.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Posted by</p>
                                <p className="text-sm font-medium text-slate-200">{challenge.creator.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-slate-400">
                                {challenge.submissionCount || 0} submissions
                              </div>
                              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-all duration-300"
            >
              Previous
            </motion.button>
            
            <div className="flex items-center gap-2">
              {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                let pageNumber = i + 1;
                if (totalPages > 7) {
                  if (currentPage <= 4) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNumber = totalPages - 6 + i;
                  } else {
                    pageNumber = currentPage - 3 + i;
                  }
                }
                
                return (
                  <motion.button
                    key={pageNumber}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all duration-300 ${
                      currentPage === pageNumber
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pageNumber}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-all duration-300"
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative mt-32 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-slate-900 to-indigo-900/50" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium">Join the Innovation Revolution</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Ready to Solve the
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Next Big Challenge?
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of innovators solving real-world challenges. 
              Apply your skills and compete for amazing rewards.
            </p>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl font-bold text-white hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300"
                onClick={() => document.getElementById('challenges-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-3">
                  <Search className="w-6 h-6" />
                  Explore More Challenges
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}