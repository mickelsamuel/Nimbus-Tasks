'use client';

import React from 'react';
import Team3DVisualization from '../3d/Team3DVisualization';
import TeamCardsGrid from '../cards/TeamCardsGrid';

const MyTeamsTab = () => {
  return (
    <div className="my-teams-content">
      <h2 className="section-title">My Teams Hub</h2>
      
      {/* Enhanced 3D Team Visualization */}
      <Team3DVisualization />
      
      {/* Elite Team Cards */}
      <TeamCardsGrid />
    </div>
  );
};

export default MyTeamsTab;