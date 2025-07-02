import { useState, useEffect, useCallback } from 'react';
import { CareerData, PerformanceMetrics, Achievement } from '@/types/career';
import { careerApi } from '@/lib/api/career/careerApi';

interface UseCareerDataReturn {
  careerData: CareerData | null;
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => Promise<void>;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'date'>) => Promise<void>;
}

export const useCareerData = (employeeId?: string): UseCareerDataReturn => {
  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCareerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = employeeId 
        ? await careerApi.getCareerDataById(employeeId)
        : await careerApi.getAllCareerData();
      
      setCareerData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch career data');
      console.error('Career data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  const updatePerformanceMetrics = async (metrics: Partial<PerformanceMetrics>) => {
    try {
      const updatedMetrics = await careerApi.updatePerformanceMetrics(metrics);
      if (careerData) {
        setCareerData({
          ...careerData,
          performance: updatedMetrics
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update performance metrics');
      console.error('Performance metrics update error:', err);
    }
  };

  const addAchievement = async (achievement: Omit<Achievement, 'id' | 'date'>) => {
    try {
      const newAchievement = await careerApi.addAchievement(achievement);
      if (careerData) {
        setCareerData({
          ...careerData,
          achievements: [...careerData.achievements, newAchievement]
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add achievement');
      console.error('Achievement add error:', err);
    }
  };

  useEffect(() => {
    fetchCareerData();
  }, [employeeId, fetchCareerData]);

  return {
    careerData,
    loading,
    error,
    refetchData: fetchCareerData,
    updatePerformanceMetrics,
    addAchievement
  };
};