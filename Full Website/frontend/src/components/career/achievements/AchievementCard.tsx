'use client'

import { Crown, Gem, Shield, Award } from 'lucide-react';
import { Achievement } from '@/types/career';

interface AchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
  className?: string;
}

export const AchievementCard = ({ achievement, onClick, className = '' }: AchievementCardProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'platinum': return 'from-purple-400 to-pink-400';
      case 'gold': return 'from-yellow-400 to-amber-500';
      case 'silver': return 'from-gray-300 to-gray-500';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'platinum': return Crown;
      case 'gold': return Gem;
      case 'silver': return Shield;
      default: return Award;
    }
  };

  const IconComponent = getRarityIcon(achievement.rarity);

  return (
    <div 
      className={`achievement-card p-6 rounded-xl border-2 border-transparent bg-gradient-to-r ${getRarityColor(achievement.rarity)} hover:scale-105 transition-all cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{achievement.date}</span>
              <span>•</span>
              <span>{achievement.impact}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
              {achievement.rarity.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};