// Shared types for layout components
import React from 'react'

export interface NavItem {
  id: string
  title: string
  icon: React.ReactNode
  href: string
  badge?: string | number
  badgeType?: 'info' | 'success' | 'warning' | 'danger'
  progress?: number
  locked?: boolean
  new?: boolean
  live?: boolean
  color?: string
}

export interface NavSection {
  id: string
  title: string
  items: NavItem[]
  icon?: React.ReactNode
}

export interface SidebarUser {
  id: number
  firstName: string
  lastName: string
  role: string
  department: string
  avatar: string
  level: number
  progress: number
  streak: number
}