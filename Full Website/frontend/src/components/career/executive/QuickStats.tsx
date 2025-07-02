'use client'

import { Target, Heart, Network, BookOpen, Users, Trophy } from 'lucide-react';
import { PerformanceMetrics, ExecutiveProfile } from '@/types/career';

interface QuickStatsProps {
  metrics: PerformanceMetrics;
  profile: ExecutiveProfile;
  achievementsCount: number;
  className?: string;
}

export const QuickStats = ({ metrics, profile, achievementsCount, className = '' }: QuickStatsProps) => {
  // Safety check for data
  if (!metrics || !profile) {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-6 gap-4 mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="stat-card">
            <div className="w-6 h-6 bg-gray-300 rounded mb-2 animate-pulse" />
            <div className="h-6 bg-gray-300 rounded w-12 mb-1 animate-pulse" />
            <div className="h-3 bg-gray-300 rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-6 gap-4 mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 ${className}`}>
      <div className="stat-card">
        <Target className="w-6 h-6 text-red-500 mb-2" />
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.goalCompletion || 0}%</div>
        <div className="text-xs text-gray-500">Goals Met</div>
      </div>
      
      <div className="stat-card">
        <Heart className="w-6 h-6 text-pink-500 mb-2" />
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.clientSatisfaction || 0}%</div>
        <div className="text-xs text-gray-500">Client Sat.</div>
      </div>
      
      <div className="stat-card">
        <Network className="w-6 h-6 text-blue-500 mb-2" />
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.collaborationRating || 0}%</div>
        <div className="text-xs text-gray-500">Collaboration</div>
      </div>
      
      <div className="stat-card">
        <BookOpen className="w-6 h-6 text-green-500 mb-2" />
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.learningVelocity || 0}%</div>
        <div className="text-xs text-gray-500">Learning</div>
      </div>
      
      <div className="stat-card">
        <Users className="w-6 h-6 text-orange-500 mb-2" />
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.directReports || 0}</div>
        <div className="text-xs text-gray-500">Direct Reports</div>
      </div>
      
      <div className="stat-card">
        <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{achievementsCount}</div>
        <div className="text-xs text-gray-500">Achievements</div>
      </div>
    </div>
  );
};