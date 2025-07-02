'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Target, 
  Activity, 
  Zap, 
  Crown
} from 'lucide-react';

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

interface TeamStatsProps {
  teams: Team[];
  isDark: boolean;
}

const TeamStats: React.FC<TeamStatsProps> = ({ teams, isDark }) => {
  const totalMembers = teams.reduce((sum, team) => sum + team.memberCount, 0);
  const avgPerformance = teams.length > 0 ? Math.round(teams.reduce((sum, team) => sum + team.performance, 0) / teams.length) : 0;
  const totalAchievements = teams.reduce((sum, team) => sum + team.achievements, 0);
  const activeTeams = teams.filter(team => team.status === 'active').length;

  const stats = [
    {
      icon: Users,
      label: 'Team Members',
      value: totalMembers,
      color: isDark ? 'text-blue-400' : 'text-blue-600',
      bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
      borderColor: isDark ? 'border-blue-500/30' : 'border-blue-200',
      description: 'Active collaborators',
      trend: totalMembers > 0 ? `${totalMembers} total` : '0 total',
      trendColor: 'text-green-500',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      label: 'Performance',
      value: `${avgPerformance}%`,
      color: isDark ? 'text-purple-400' : 'text-purple-600',
      bgColor: isDark ? 'bg-purple-500/20' : 'bg-purple-100',
      borderColor: isDark ? 'border-purple-500/30' : 'border-purple-200',
      description: 'Success rate',
      trend: avgPerformance > 0 ? `${avgPerformance}% avg` : '0% avg',
      trendColor: 'text-green-500',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Trophy,
      label: 'Achievements',
      value: totalAchievements,
      color: isDark ? 'text-yellow-400' : 'text-yellow-600',
      bgColor: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
      borderColor: isDark ? 'border-yellow-500/30' : 'border-yellow-200',
      description: 'Total earned',
      trend: totalAchievements > 0 ? `${totalAchievements} earned` : '0 earned',
      trendColor: 'text-green-500',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      label: 'Active Teams',
      value: activeTeams,
      color: isDark ? 'text-green-400' : 'text-green-600',
      bgColor: isDark ? 'bg-green-500/20' : 'bg-green-100',
      borderColor: isDark ? 'border-green-500/30' : 'border-green-200',
      description: 'Currently engaged',
      trend: activeTeams > 0 ? `${activeTeams} active` : '0 active',
      trendColor: 'text-green-500',
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className={`p-3 rounded-2xl ${
          isDark 
            ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30'
            : 'bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200'
        }`}>
          <Activity className={`w-6 h-6 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Team Performance Overview
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Real-time insights and metrics from your teams
          </p>
        </div>
      </motion.div>
      
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              className={`relative rounded-3xl p-6 backdrop-blur-xl border transition-all duration-500 hover:scale-105 group cursor-pointer overflow-hidden ${
                isDark 
                  ? 'bg-slate-800/70 border-slate-700/50 hover:border-slate-600/70 hover:bg-slate-800/90' 
                  : 'bg-white/90 border-slate-200/60 hover:border-slate-300/80 hover:bg-white/95'
              }`}
              whileHover={{ y: -8 }}
            >
              {/* Enhanced Background Gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl bg-gradient-to-br ${stat.gradient}/10`} />
              
              {/* Performance Ring */}
              <motion.div
                className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${stat.gradient}/20`}
                animate={{
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Floating particles for high-performing stats */}
              {typeof stat.value === 'number' && stat.value > 80 && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 rounded-full bg-yellow-400/60`}
                      initial={{
                        x: Math.random() * 200,
                        y: Math.random() * 150,
                        opacity: 0
                      }}
                      animate={{
                        y: [null, -30],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}

              <div className="relative z-10">
                {/* Enhanced Icon with Animation */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`inline-flex p-4 rounded-2xl border ${stat.bgColor} ${stat.borderColor}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </motion.div>
                  
                  {/* Trend Indicator */}
                  <motion.div
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      isDark 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-green-100 text-green-700 border-green-200'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.5, type: "spring" }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </motion.div>
                </div>

                {/* Enhanced Value with Counter Animation */}
                <motion.div 
                  className={`text-4xl font-black mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>

                {/* Enhanced Label and Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {stat.label}
                    </span>
                    {typeof stat.value === 'number' && stat.value > 90 && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown className={`w-4 h-4 ${
                          isDark ? 'text-yellow-400' : 'text-yellow-500'
                        }`} />
                      </motion.div>
                    )}
                  </div>
                  
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {stat.description}
                  </p>
                  
                  {/* Progress Bar for percentage values */}
                  {typeof stat.value === 'string' && stat.value.includes('%') && (
                    <div className={`w-full h-2 rounded-full mt-3 ${
                      isDark ? 'bg-slate-700' : 'bg-slate-200'
                    }`}>
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${parseInt(stat.value)}%` }}
                        transition={{ delay: index * 0.15 + 0.8, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamStats;