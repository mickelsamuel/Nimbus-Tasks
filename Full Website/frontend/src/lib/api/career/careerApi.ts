import { CareerData, ExecutiveProfile, PerformanceMetrics, Achievement, NetworkConnections } from '@/types/career';
import { apiClient } from '../client';

class CareerApi {

  // Get all career data
  async getAllCareerData(): Promise<CareerData> {
    const response = await apiClient.get('/career');
    return response.data.data;
  }

  // Get career data by employee ID
  async getCareerDataById(employeeId: string): Promise<CareerData> {
    const response = await apiClient.get(`/career/${employeeId}`);
    return response.data.data;
  }

  // Get executive profile
  async getExecutiveProfile(): Promise<ExecutiveProfile> {
    const response = await apiClient.get('/career/profile');
    return response.data.data;
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const response = await apiClient.get('/career/performance');
    return response.data.data;
  }

  // Get achievements
  async getAchievements(): Promise<Achievement[]> {
    const response = await apiClient.get('/career/achievements');
    return response.data.data;
  }

  // Get network connections
  async getNetworkConnections(): Promise<NetworkConnections> {
    const response = await apiClient.get('/career/network');
    return response.data.data;
  }

  // Update performance metrics
  async updatePerformanceMetrics(metrics: Partial<PerformanceMetrics>): Promise<PerformanceMetrics> {
    const response = await apiClient.put('/career/performance', metrics);
    return response.data.data;
  }

  // Add new achievement
  async addAchievement(achievement: Omit<Achievement, 'id' | 'date'>): Promise<Achievement> {
    const response = await apiClient.post('/career/achievements', achievement);
    return response.data.data;
  }
}

export const careerApi = new CareerApi();