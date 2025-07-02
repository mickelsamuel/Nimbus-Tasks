'use client';

import React from 'react';

interface PerformanceMetricsProps {
  collaboration: number;
  projects: number;
  rating: number;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  collaboration,
  projects,
  rating
}) => {
  return (
    <div className="performance-metrics">
      <div className="metric">
        <div className="metric-value">{collaboration}%</div>
        <div className="metric-label">Collaboration</div>
      </div>
      <div className="metric">
        <div className="metric-value">{projects}</div>
        <div className="metric-label">Projects</div>
      </div>
      <div className="metric">
        <div className="metric-value">{rating}</div>
        <div className="metric-label">Rating</div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;