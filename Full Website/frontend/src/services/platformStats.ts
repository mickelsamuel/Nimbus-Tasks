// Platform statistics service
// This service provides centralized platform statistics that can be used across components

import { api } from '@/lib/api/client';

export interface PlatformStats {
  activeProfessionals: string;
  successRate: string;
  userRating: string;
  ratingScale: string;
  totalModules: string;
  totalExperts: string;
  totalCertifications: string;
  countries: string;
  foundedYear: string;
}

// Fetch platform statistics from the backend API
export async function fetchPlatformStats(): Promise<PlatformStats> {
  try {
    const response = await api.get('/platform/stats');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch platform stats');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    
    // Fallback to default values if API fails
    return {
      activeProfessionals: '12,500+',
      successRate: '92%',
      userRating: '4.7',
      ratingScale: '/5',
      totalModules: '350+',
      totalExperts: '2,800+',
      totalCertifications: '25+',
      countries: '25+',
      foundedYear: '1864'
    };
  }
}

// Hook for using platform stats in components
import { useState, useEffect } from 'react';

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPlatformStats()
      .then(setStats)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}