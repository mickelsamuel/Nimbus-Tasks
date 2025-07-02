'use client';

import React from 'react';

interface EnvironmentStatsProps {
  teamStats?: {
    totalPoints: number;
    level: number;
    memberCount: number;
  };
  memberCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EnvironmentStats: React.FC<EnvironmentStatsProps> = ({ teamStats: _teamStats, memberCount: _memberCount }) => {
  const stats = [
    {
      icon: '⚡',
      label: 'Team Energy',
      value: 'High'
    },
    {
      icon: '🌊',
      label: 'Collaboration Flow',
      value: 'Active'
    },
    {
      icon: '🎭',
      label: 'Team Mood',
      value: 'Motivated'
    }
  ];

  return (
    <div className="environment-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-3d">
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-info">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnvironmentStats;