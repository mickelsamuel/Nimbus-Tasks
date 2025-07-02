import { api } from './client';

export interface TeamCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Fetch all team categories
export async function fetchTeamCategories(): Promise<TeamCategory[]> {
  try {
    const response = await api.get('/team-categories');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch team categories');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching team categories:', error);
    // Fallback to default categories if API fails
    return [
      {
        id: 'trading',
        name: 'Trading',
        description: 'Teams focused on trading strategies and market analysis',
        icon: 'TrendingUp',
        color: 'from-green-500 to-emerald-600'
      },
      {
        id: 'learning',
        name: 'Learning',
        description: 'Teams dedicated to continuous learning and skill development',
        icon: 'BookOpen',
        color: 'from-blue-500 to-indigo-600'
      },
      {
        id: 'innovation',
        name: 'Innovation',
        description: 'Teams working on innovative projects and new technologies',
        icon: 'Zap',
        color: 'from-purple-500 to-pink-600'
      },
      {
        id: 'research',
        name: 'Research',
        description: 'Teams conducting market research and analysis',
        icon: 'Brain',
        color: 'from-orange-500 to-red-600'
      },
      {
        id: 'networking',
        name: 'Networking',
        description: 'Teams focused on building professional relationships',
        icon: 'Users',
        color: 'from-teal-500 to-cyan-600'
      }
    ];
  }
}

// Hook for using team categories
import { useState, useEffect } from 'react';

export function useTeamCategories() {
  const [categories, setCategories] = useState<TeamCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTeamCategories()
      .then(setCategories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}