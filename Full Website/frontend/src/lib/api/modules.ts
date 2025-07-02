import api from './client'
import { Module, ModulesResponse, ModuleFilters } from '@/types/modules'

export const modulesApi = {
  getModules: async (filters: ModuleFilters = {}): Promise<ModulesResponse> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await api.get(`/modules?${params.toString()}`)
    return response.data
  },

  getModule: async (id: number): Promise<{ success: boolean; module: Module }> => {
    const response = await api.get(`/modules/${id}`)
    return response.data
  },

  enrollInModule: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/modules/${id}/enroll`)
    return response.data
  },

  updateProgress: async (
    id: number, 
    chapterId: number, 
    completed: boolean
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/modules/${id}/progress`, {
      chapterId,
      completed
    })
    return response.data
  },

  getEnrolledModules: async (): Promise<{ success: boolean; modules: Module[] }> => {
    const response = await api.get('/modules/user/enrolled')
    return response.data
  },

  getRecommendations: async (): Promise<{ success: boolean; modules: Module[] }> => {
    const response = await api.get('/modules/recommendations')
    return response.data
  },

  toggleBookmark: async (id: number): Promise<{ 
    success: boolean; 
    bookmarked: boolean; 
    message: string 
  }> => {
    const response = await api.post(`/modules/${id}/bookmark`)
    return response.data
  },

  toggleLike: async (id: number): Promise<{ 
    success: boolean; 
    liked: boolean; 
    likeCount: number; 
    message: string 
  }> => {
    const response = await api.post(`/modules/${id}/like`)
    return response.data
  }
}