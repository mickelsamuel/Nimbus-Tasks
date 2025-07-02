'use client';

import React from 'react';
import { TeamActivity } from '../../../types/team';

interface TeamActivityFeedProps {
  activities: TeamActivity[];
}

const TeamActivityFeed: React.FC<TeamActivityFeedProps> = ({ activities }) => {
  return (
    <div className="team-activity-feed">
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          <div className="activity-indicator"></div>
          <span>{activity.text}</span>
          <span className="activity-time">{activity.time}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamActivityFeed;