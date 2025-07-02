'use client'

import { Network, ChevronRight } from 'lucide-react';
import { NetworkConnections } from '@/types/career';
import { NetworkSection } from './NetworkSection';

interface NetworkPreviewProps {
  networkConnections: NetworkConnections;
  className?: string;
}

export const NetworkPreview = ({ networkConnections, className = '' }: NetworkPreviewProps) => {
  // Safety check for networkConnections data
  if (!networkConnections) {
    return (
      <div className={`dashboard-glassmorphism rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-500" />
            Professional Network
          </h2>
          <div className="h-6 bg-gray-300 rounded w-32 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4">
              <div className="h-6 bg-gray-300 rounded w-24 mb-4 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-glassmorphism rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Network className="w-8 h-8 text-blue-500" />
          Professional Network
        </h2>
        <button className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors">
          Expand Network
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <NetworkSection
          title="Direct Reports"
          people={networkConnections.directReports || []}
          iconType="directReports"
          gradientFrom="from-blue-400"
          gradientTo="to-blue-600"
        />
        
        <NetworkSection
          title="Peers"
          people={networkConnections.peers || []}
          iconType="peers"
          gradientFrom="from-green-400"
          gradientTo="to-green-600"
        />
        
        <NetworkSection
          title="Mentors"
          people={networkConnections.mentors || []}
          iconType="mentors"
          gradientFrom="from-purple-400"
          gradientTo="to-purple-600"
        />
        
        <NetworkSection
          title="Mentees"
          people={networkConnections.mentees || []}
          iconType="mentees"
          gradientFrom="from-orange-400"
          gradientTo="to-orange-600"
        />
      </div>
    </div>
  );
};