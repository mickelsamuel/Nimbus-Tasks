import { SystemMetric, User, Module, Training } from '@/components/admin/types'
import { apiClient } from './client'

class AdminAPI {

  // System Metrics
  async getSystemMetrics(): Promise<SystemMetric[]> {
    const response = await apiClient.get('/admin/metrics')
    return response.data
  }

  // User Management
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/users')
    return response.data
  }

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, data)
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  }

  // Module Management
  async getModules(): Promise<Module[]> {
    const response = await apiClient.get('/modules')
    return response.data
  }

  async getModuleById(id: string): Promise<Module> {
    const response = await apiClient.get(`/modules/${id}`)
    return response.data
  }

  async createModule(data: Partial<Module>): Promise<Module> {
    const response = await apiClient.post('/modules', data)
    return response.data
  }

  async updateModule(id: string, data: Partial<Module>): Promise<Module> {
    const response = await apiClient.put(`/modules/${id}`, data)
    return response.data
  }

  async deleteModule(id: string): Promise<void> {
    await apiClient.delete(`/modules/${id}`)
  }

  // Training Progress
  async getTrainingProgress(): Promise<Training[]> {
    const response = await apiClient.get('/training/progress')
    return response.data
  }

  // Admin Overview
  async getAdminOverview(): Promise<Record<string, unknown>> {
    const response = await apiClient.get('/admin')
    return response.data
  }

  // Analytics
  async getAnalytics(): Promise<Record<string, unknown>> {
    const response = await apiClient.get('/analytics')
    return response.data
  }

  // Export Data
  async exportData(type: string, format: string = 'json'): Promise<Blob> {
    const response = await apiClient.post('/admin/export', { type, format }, {
      responseType: 'blob'
    })
    return response.data
  }
}

export const adminAPI = new AdminAPI()