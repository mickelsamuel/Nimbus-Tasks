'use client';

import React, { memo, Suspense } from 'react';
import AchievementMonuments from './AchievementMonuments';
import MemberActivity3D from './MemberActivity3D';
import WorkspaceAreas from './WorkspaceAreas';
import SceneControls from './SceneControls';
import EnvironmentStats from './EnvironmentStats';

interface Team {
  _id: string;
  name: string;
  members: Array<{
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
      avatar?: string;
      lastActivity?: string;
    };
    role: string;
    joinedAt: string;
    status: 'active' | 'inactive';
  }>;
  achievements?: Array<{
    name: string;
    description: string;
    unlockedAt: string;
  }>;
  stats?: {
    totalPoints: number;
    level: number;
    memberCount: number;
  };
}

interface Team3DVisualizationProps {
  teams?: Team[];
  selectedTeam?: Team | null;
}

const Team3DVisualization = memo(({ teams = [], selectedTeam }: Team3DVisualizationProps) => {
  // Use the selected team or the first team if available
  const activeTeam = selectedTeam || teams[0];
  const members = activeTeam?.members || [];
  return (
    <div className="team-space-3d-container">
      <h3 className="visualization-title">
        🌌 3D Team Environment
        {activeTeam && <span className="team-name"> - {activeTeam.name}</span>}
      </h3>
      
      <div className="team-3d-workspace">
        <div className="team-3d-scene">
          <div className="team-space-3d" style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}>
            <Suspense fallback={<div className="loading-3d">Loading 3D Environment...</div>}>
              <AchievementMonuments achievements={activeTeam?.achievements} />
              <MemberActivity3D members={members} />
              <WorkspaceAreas teamStats={activeTeam?.stats} />
            </Suspense>
            
            {/* Dynamic Lighting Effects - Optimized */}
            <div className="ambient-light primary" style={{ willChange: 'opacity' }}></div>
            <div className="ambient-light secondary" style={{ willChange: 'opacity' }}></div>
            <div className="ambient-light accent" style={{ willChange: 'opacity' }}></div>
          </div>

          <Suspense fallback={<div>Loading controls...</div>}>
            <SceneControls />
          </Suspense>
        </div>

        <Suspense fallback={<div>Loading stats...</div>}>
          <EnvironmentStats teamStats={activeTeam?.stats} memberCount={members.length} />
        </Suspense>
      </div>
    </div>
  );
});

Team3DVisualization.displayName = 'Team3DVisualization';

export default Team3DVisualization;