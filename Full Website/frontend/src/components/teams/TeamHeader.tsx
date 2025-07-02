'use client';

import React from 'react';
import { Users, Trophy, MessageCircle, TrendingUp, Search } from 'lucide-react';

interface TeamHeaderProps {
  onCreateTeam: () => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ onCreateTeam }) => {
  return (
    <div className="team-arena-header">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="collaboration-title">
              Elite Team Collaboration Arena
            </h1>
            <p className="text-lg text-white/70 mt-2">
              Championship-level team dynamics and collaboration excellence
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="collaboration-metrics">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">247</div>
                <div className="text-sm text-white/60">Active Teams</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Discovery Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="spotlight-card">
            <div className="p-6">
              <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Team of the Week</h3>
              <p className="text-white/70 text-sm">Alpha Squad - 95% collaboration score</p>
            </div>
          </div>
          <div className="spotlight-card">
            <div className="p-6">
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Rising Stars</h3>
              <p className="text-white/70 text-sm">Delta Force - 200% growth this month</p>
            </div>
          </div>
          <div className="spotlight-card">
            <div className="p-6">
              <Users className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Most Active</h3>
              <p className="text-white/70 text-sm">Gamma Team - 150 activities today</p>
            </div>
          </div>
        </div>

        {/* Quick Action Command Bar */}
        <div className="quick-actions-bar">
          <button className="action-button primary" onClick={onCreateTeam}>
            <Users className="w-5 h-5" />
            Create Team
          </button>
          <button className="action-button secondary">
            <Search className="w-5 h-5" />
            Find Teams
          </button>
          <button className="action-button secondary">
            <MessageCircle className="w-5 h-5" />
            Team Chat
          </button>
          <button className="action-button secondary">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </button>
        </div>
      </div>

      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element floating-1"></div>
        <div className="floating-element floating-2"></div>
        <div className="floating-element floating-3"></div>
      </div>
    </div>
  );
};

export default TeamHeader;