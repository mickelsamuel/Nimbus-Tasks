export interface Chapter {
  _id: string
  id?: number
  title: string
  description: string
  duration: number
  completed?: boolean
  content?: string
  order?: number
}

export interface UserProgress {
  moduleId: number
  progress: number
  completedChapters: string[]
  lastAccessed: string | null
  lastAccessedAt?: string
  isEnrolled?: boolean
  finalScore?: number
  xpEarned?: number
  streakDays?: number
  completedAt?: string
}

export interface Module {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  totalDuration: number
  xp: number
  points?: number
  thumbnail: string
  status: string
  rarity: string
  completed: boolean
  chapters: Chapter[]
  prerequisites: number[]
  learningObjectives: string[]
  tags: string[]
  enrolled: number
  rating: number
  reviews: number
  instructor: string
  lastUpdated: string
  createdAt?: string
  dueDate?: string
  isRequired?: boolean
  isBookmarked?: boolean
  certificateExpiry?: string
  stats?: {
    enrolledCount: number
    averageRating: number
    reviewCount: number
  }
  userProgress?: UserProgress
}

export interface ModulesResponse {
  success: boolean
  modules: Module[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: {
    categories: string[]
    difficulties: string[]
    rarities: string[]
  }
  stats: {
    totalModules: number
    filteredCount: number
  }
}

export interface ModuleFilters {
  category?: string
  difficulty?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  rarity?: string
}