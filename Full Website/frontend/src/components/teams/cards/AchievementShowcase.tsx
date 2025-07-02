'use client';

import React from 'react';
import { Trophy, Users, TrendingUp, Shield, Lightbulb, Zap } from 'lucide-react';
import { TeamAchievement } from '../../../types/team';

interface AchievementShowcaseProps {
  achievements: TeamAchievement[];
}

const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({ achievements }) => {
  const getIcon = (iconName: string) => {
    const iconMap = {
      Trophy,
      Users,
      TrendingUp,
      Shield,
      Lightbulb,
      Zap
    };
    
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || Trophy;
  };

  return (
    <div className="achievement-showcase">
      {achievements.map((achievement, index) => {
        const IconComponent = getIcon(achievement.icon);
        return (
          <div key={index} className="achievement-item">
            <IconComponent className={`w-4 h-4 ${achievement.color}`} />
            <span>{achievement.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AchievementShowcase;