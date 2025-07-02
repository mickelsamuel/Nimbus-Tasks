'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Search, MessageSquare, Trophy, Zap, Star } from 'lucide-react';

interface QuickActionsProps {
  isDark: boolean;
  onCreateTeam: () => void;
  onSwitchTab?: (tab: string) => void;
  stats?: {
    activeProjects?: number;
    meetingsToday?: number;
    pendingTasks?: number;
  };
}

const QuickActions: React.FC<QuickActionsProps> = ({ isDark, onCreateTeam, onSwitchTab, stats }) => {
  const router = useRouter();
  const actions = [
    {
      icon: Plus,
      label: 'Create Team',
      description: 'Start a new collaboration',
      action: onCreateTeam,
      primary: true,
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Search,
      label: 'Find Teams',
      description: 'Discover new opportunities',
      action: () => {
        if (onSwitchTab) {
          onSwitchTab('discover');
        } else {
          router.push('/teams#discover');
        }
      },
      primary: false,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MessageSquare,
      label: 'Team Chat',
      description: 'Connect with teammates',
      action: () => {
        if (onSwitchTab) {
          onSwitchTab('communication');
        } else {
          router.push('/chat');
        }
      },
      primary: false,
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Trophy,
      label: 'Leaderboard',
      description: 'View team rankings',
      action: () => {
        router.push('/leaderboards');
      },
      primary: false,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Quick Actions
        </h2>
        
        <div className={`flex items-center gap-2 text-sm ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <Zap className="w-4 h-4" />
          <span>Boost your productivity</span>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.action}
              className={`group relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-105 text-left overflow-hidden ${
                action.primary
                  ? `bg-gradient-to-br ${action.color} text-white border-transparent shadow-lg hover:shadow-xl`
                  : isDark
                    ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600/70 hover:bg-slate-800/80'
                    : 'bg-white/80 border-slate-200/50 hover:border-slate-300/70 hover:bg-white/90'
              }`}
            >
              
              {/* Background Effect for non-primary buttons */}
              {!action.primary && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${action.color} opacity-5`} />
              )}

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                  action.primary
                    ? 'bg-white/20'
                    : isDark
                      ? 'bg-slate-700/50'
                      : 'bg-slate-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    action.primary
                      ? 'text-white'
                      : isDark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                  }`} />
                </div>

                {/* Content */}
                <h3 className={`font-bold text-lg mb-2 ${
                  action.primary
                    ? 'text-white'
                    : isDark
                      ? 'text-white'
                      : 'text-slate-900'
                }`}>
                  {action.label}
                </h3>
                
                <p className={`text-sm ${
                  action.primary
                    ? 'text-white/80'
                    : isDark
                      ? 'text-slate-400'
                      : 'text-slate-600'
                }`}>
                  {action.description}
                </p>

                {/* Action Indicator */}
                <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${
                  action.primary
                    ? 'text-white/90'
                    : isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                }`}>
                  <span>Click to {action.label.toLowerCase()}</span>
                  <motion.div
                    className="w-1 h-1 rounded-full bg-current"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Team Resources */}
      <div className={`rounded-2xl p-6 backdrop-blur-xl border ${
        isDark 
          ? 'bg-slate-800/40 border-slate-700/50' 
          : 'bg-white/60 border-slate-200/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-lg ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Team Resources
          </h3>
          <Star className={`w-5 h-5 ${
            isDark ? 'text-blue-400' : 'text-blue-500'
          }`} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`text-center p-4 rounded-xl ${
            isDark ? 'bg-slate-700/30' : 'bg-slate-100/50'
          }`}>
            <div className={`text-2xl font-bold mb-1 ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`}>
              {stats?.activeProjects || 0}
            </div>
            <div className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Active Projects
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-xl ${
            isDark ? 'bg-slate-700/30' : 'bg-slate-100/50'
          }`}>
            <div className={`text-2xl font-bold mb-1 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {stats?.meetingsToday || 0}
            </div>
            <div className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Meetings Today
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-xl ${
            isDark ? 'bg-slate-700/30' : 'bg-slate-100/50'
          }`}>
            <div className={`text-2xl font-bold mb-1 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {stats?.pendingTasks || 0}
            </div>
            <div className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Pending Tasks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;