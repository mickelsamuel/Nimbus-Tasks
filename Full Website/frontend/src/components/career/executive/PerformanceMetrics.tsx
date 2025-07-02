'use client'

import { Star, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { PerformanceMetrics as PerformanceMetricsType } from '@/types/career';

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsType;
  className?: string;
}

export const PerformanceMetrics = ({ metrics, className = '' }: PerformanceMetricsProps) => {
  // Safety check for metrics data
  if (!metrics) {
    return (
      <div className={`flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="performance-metric">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
            </div>
            <div className="h-8 bg-gray-300 rounded w-16 animate-pulse mb-2" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-300 h-2 rounded-full w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <div className="performance-metric">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Rating</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {metrics.overallRating || 0}
          <span className="text-lg text-gray-500">/5.0</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${((metrics.overallRating || 0) / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="performance-metric">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Promotion Ready</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {metrics.promotionReadiness || 0}
          <span className="text-lg text-gray-500">%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${metrics.promotionReadiness || 0}%` }}
          />
        </div>
      </div>

      <div className="performance-metric">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Leadership</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {metrics.leadershipScore || 0}
          <span className="text-lg text-gray-500">%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${metrics.leadershipScore || 0}%` }}
          />
        </div>
      </div>

      <div className="performance-metric">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Innovation</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {metrics.innovationIndex || 0}
          <span className="text-lg text-gray-500">%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${metrics.innovationIndex || 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};