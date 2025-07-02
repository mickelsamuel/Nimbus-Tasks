'use client';

import React, { memo } from 'react';

interface Achievement {
  name: string;
  description: string;
  unlockedAt: string;
}

interface AchievementMonumentsProps {
  achievements?: Achievement[];
}

const AchievementMonuments = memo(({ achievements = [] }: AchievementMonumentsProps) => {
  // Map real achievements to monuments, fallback to default if no achievements
  const monuments = achievements.length > 0 
    ? achievements.slice(0, 3).map((achievement, index) => ({
        type: achievement.name.toLowerCase().replace(/\s+/g, '-'),
        icon: index === 0 ? '🏆' : index === 1 ? '💡' : '🤝',
        label: achievement.name,
        className: `achievement-monument ${achievement.name.toLowerCase().replace(/\s+/g, '-')}`
      }))
    : [
        {
          type: 'trophy',
          icon: '🏆',
          label: 'Championship Trophy',
          className: 'achievement-monument trophy'
        },
        {
          type: 'innovation',
          icon: '💡',
          label: 'Innovation Award',
          className: 'achievement-monument innovation'
        },
        {
          type: 'collaboration',
          icon: '🤝',
          label: 'Team Spirit',
          className: 'achievement-monument collaboration'
        }
      ];

  return (
    <>
      {monuments.map((monument) => (
        <div 
          key={monument.type} 
          className={monument.className}
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="monument-base">
            <div className="monument-icon">{monument.icon}</div>
            <div className="monument-glow"></div>
          </div>
          <div className="monument-label">{monument.label}</div>
        </div>
      ))}
    </>
  );
});

AchievementMonuments.displayName = 'AchievementMonuments';

export default AchievementMonuments;