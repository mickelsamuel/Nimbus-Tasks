'use client'

import { Trophy, ChevronRight } from 'lucide-react';
import { Achievement } from '@/types/career';
import { AchievementCard } from './AchievementCard';

interface AchievementsShowcaseProps {
  achievements: Achievement[];
  onAchievementClick: (achievement: Achievement) => void;
  className?: string;
}

export const AchievementsShowcase = ({ 
  achievements, 
  onAchievementClick, 
  className = '' 
}: AchievementsShowcaseProps) => {
  return (
    <div className={`dashboard-glassmorphism rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Recent Achievements
        </h2>
        <button className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {achievements.slice(0, 2).map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onClick={() => onAchievementClick(achievement)}
          />
        ))}
      </div>
    </div>
  );
};