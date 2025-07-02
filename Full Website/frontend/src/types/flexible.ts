// Flexible types to handle API inconsistencies temporarily
// This file provides compatibility types to reduce TypeScript errors
// while maintaining type safety where possible

export type FlexibleUser = {
  id: number
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  role?: string
  department?: string
  avatar?: string
  level?: number
  xp?: number
  totalXP?: number
  phoneNumber?: string
  phone?: string
  createdAt?: string
  joinDate?: string
  location?: string | { city?: string; province?: string; country?: string }
  jobTitle?: string
  progress?: number
  stats?: {
    level?: number
    xp?: number
    totalXP?: number
    coins?: number
    tokens?: number
    modulesCompleted?: number
    learningHours?: number
    currentStreak?: number
    [key: string]: unknown
  }
  [key: string]: any
}

export type FlexibleData = {
  [key: string]: unknown
}

export type FlexibleProps = {
  [key: string]: unknown
}

// Helper function to safely access nested properties
export function safeGet(obj: Record<string, unknown>, path: string, fallback: unknown = undefined): unknown {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : fallback
  }, obj)
}

// Helper function to safely render any value as string
export function safeString(value: unknown, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return fallback
    }
  }
  return fallback
}

// Helper to safely access array methods
export function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : []
}

// Helper for safe number access
export function safeNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? fallback : parsed
  }
  return fallback
}