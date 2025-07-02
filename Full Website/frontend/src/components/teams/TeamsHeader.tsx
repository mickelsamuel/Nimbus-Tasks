'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Trophy, 
  TrendingUp, 
  Star, 
  Zap, 
  Target,
  Rocket,
  Award,
  Sparkles,
  Globe,
  Brain,
  Shield,
  Crown
} from 'lucide-react';

interface TeamsHeaderProps {
  isDark: boolean;
  teamsCount: number;
  myTeamsCount: number;
  onCreateTeam: () => void;
  stats?: {
    successRate?: number;
    activeTeams?: number;
  };
}

const TeamsHeader: React.FC<TeamsHeaderProps> = ({ 
  isDark, 
  teamsCount, 
  myTeamsCount, 
  onCreateTeam,
  stats 
}) => {
  return (
    <div className={`relative rounded-4xl p-10 backdrop-blur-xl border overflow-hidden transition-all duration-500 shadow-2xl ${
      isDark 
        ? 'bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-indigo-900/60 border-slate-700/50' 
        : 'bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/70 border-slate-200/60'
    }`}>
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs */}
        <motion.div 
          className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-25 ${
            isDark ? 'bg-gradient-to-br from-blue-500 to-cyan-400' : 'bg-gradient-to-br from-blue-400 to-cyan-300'
          }`}
          animate={{ 
            scale: [1, 1.3, 1.1, 1],
            rotate: [0, 180, 270, 360],
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20 ${
            isDark ? 'bg-gradient-to-tr from-purple-500 to-pink-400' : 'bg-gradient-to-tr from-purple-400 to-pink-300'
          }`}
          animate={{ 
            scale: [1, 1.2, 1.4, 1],
            rotate: [360, 180, 90, 0],
            x: [0, -25, 15, 0],
            y: [0, 20, -5, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Additional accent orbs */}
        <motion.div 
          className={`absolute top-1/2 left-1/3 w-32 h-32 rounded-full blur-2xl opacity-15 ${
            isDark ? 'bg-gradient-to-r from-green-400 to-teal-400' : 'bg-gradient-to-r from-green-300 to-teal-300'
          }`}
          animate={{ 
            scale: [1, 1.5, 0.8, 1],
            rotate: [0, -90, -180, -360],
            opacity: [0.15, 0.25, 0.1, 0.15]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDark ? 'bg-white/20' : 'bg-slate-900/10'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Enhanced Header Content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Enhanced Title Section */}
          <div className="space-y-6 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, type: "spring" }}
            >
              <div className="flex items-center gap-4 mb-3">
                <motion.div
                  className={`p-3 rounded-2xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                      : 'bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200'
                  }`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Crown className={`w-8 h-8 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                </motion.div>
                
                <motion.div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    isDark 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    isDark ? 'bg-green-400' : 'bg-green-500'
                  }`} />
                  Elite Teams Platform
                </motion.div>
              </div>
              
              <h1 className={`text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight ${
                isDark 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600'
              }`}>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Team
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  Excellence
                  <motion.div
                    className={`absolute -top-2 -right-8 ${
                      isDark ? 'text-yellow-400' : 'text-yellow-500'
                    }`}
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className={`text-xl lg:text-2xl font-medium leading-relaxed ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Build exceptional teams, achieve remarkable results,
                <br className="hidden lg:block" /> 
                and unlock unprecedented collaboration
              </p>
              
              <div className="flex items-center gap-6 flex-wrap">
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <Globe className="w-4 h-4" />
                  <span>Global Teams</span>
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <Brain className="w-4 h-4" />
                  <span>AI-Powered Insights</span>
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <Shield className="w-4 h-4" />
                  <span>Enterprise Security</span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Quick Stats */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className={`flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                  isDark 
                    ? 'bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20'
                    : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className={`p-3 rounded-xl ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-200'
                }`}>
                  <Users className={`w-6 h-6 ${
                    isDark ? 'text-blue-400' : 'text-blue-700'
                  }`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {myTeamsCount}
                  </div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    Teams Joined
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className={`flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                  isDark 
                    ? 'bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20'
                    : 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className={`p-3 rounded-xl ${
                  isDark ? 'bg-purple-500/20' : 'bg-purple-200'
                }`}>
                  <Trophy className={`w-6 h-6 ${
                    isDark ? 'text-purple-400' : 'text-purple-700'
                  }`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {teamsCount}
                  </div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-purple-300' : 'text-purple-700'
                  }`}>
                    Available
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className={`flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                  isDark 
                    ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20'
                    : 'bg-green-50 border border-green-200 hover:bg-green-100'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className={`p-3 rounded-xl ${
                  isDark ? 'bg-green-500/20' : 'bg-green-200'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    isDark ? 'text-green-400' : 'text-green-700'
                  }`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {stats?.successRate ? `${stats.successRate}%` : myTeamsCount > 0 ? `${Math.round((myTeamsCount / teamsCount) * 100)}%` : '0%'}
                  </div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-green-300' : 'text-green-700'
                  }`}>
                    Success Rate
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className={`flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                  isDark 
                    ? 'bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20'
                    : 'bg-orange-50 border border-orange-200 hover:bg-orange-100'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className={`p-3 rounded-xl ${
                  isDark ? 'bg-orange-500/20' : 'bg-orange-200'
                }`}>
                  <Rocket className={`w-6 h-6 ${
                    isDark ? 'text-orange-400' : 'text-orange-700'
                  }`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {stats?.activeTeams || teamsCount}
                  </div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-orange-300' : 'text-orange-700'
                  }`}>
                    Active Teams
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Action Section */}
          <motion.div 
            className="flex flex-col gap-6 lg:items-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            
            {/* Enhanced Feature Highlights */}
            <div className={`grid grid-cols-2 lg:grid-cols-1 gap-3 p-6 rounded-3xl backdrop-blur-sm border ${
              isDark 
                ? 'bg-slate-800/60 border-slate-700/50' 
                : 'bg-white/70 border-slate-200/60'
            }`}>
              <motion.div 
                className="flex items-center gap-3 text-sm font-medium"
                whileHover={{ x: 4 }}
              >
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
                }`}>
                  <Star className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Elite Collaboration
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 text-sm font-medium"
                whileHover={{ x: 4 }}
              >
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <Zap className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Real-time Analytics
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 text-sm font-medium"
                whileHover={{ x: 4 }}
              >
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                  <Target className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Goal Tracking
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 text-sm font-medium"
                whileHover={{ x: 4 }}
              >
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <Award className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Achievement System
                </span>
              </motion.div>
            </div>

            {/* Enhanced Create Team Button */}
            <motion.button
              onClick={onCreateTeam}
              className={`group relative px-10 py-5 rounded-3xl font-bold text-white text-lg transition-all duration-400 overflow-hidden shadow-2xl ${
                isDark
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              }`}
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: isDark 
                  ? "0 25px 50px rgba(59, 130, 246, 0.4)"
                  : "0 25px 50px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Enhanced shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Pulsing background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/10 rounded-3xl"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Plus className="w-6 h-6" />
                </motion.div>
                <span>Create Elite Team</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Rocket className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.button>
          </motion.div>
        </div>
        
        {/* Bottom accent line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
            isDark 
              ? 'from-blue-500 via-purple-500 to-cyan-500'
              : 'from-blue-400 via-purple-400 to-cyan-400'
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default TeamsHeader;