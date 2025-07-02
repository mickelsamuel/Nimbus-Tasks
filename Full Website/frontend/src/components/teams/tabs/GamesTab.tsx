'use client';

import React from 'react';

const GamesTab = () => {
  return (
    <div className="games-content">
      <h2 className="section-title">Team Games</h2>
      <p className="text-white/70">Fun team-building games and collaborative challenges.</p>
      
      <div className="mt-8 p-8 bg-white/5 rounded-lg border border-white/10">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
          <p className="text-white/60">Team games and challenges are being developed.</p>
        </div>
      </div>
    </div>
  );
};

export default GamesTab;