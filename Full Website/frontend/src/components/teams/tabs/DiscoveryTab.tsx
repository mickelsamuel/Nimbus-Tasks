'use client';

import React from 'react';

const DiscoveryTab = () => {
  return (
    <div className="discovery-content">
      <h2 className="section-title">Team Discovery</h2>
      <p className="text-white/70">Find and join amazing teams that match your interests and goals.</p>
      
      {/* Search and filter components would go here */}
      <div className="mt-8 p-8 bg-white/5 rounded-lg border border-white/10">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
          <p className="text-white/60">Advanced team discovery features are being developed.</p>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryTab;