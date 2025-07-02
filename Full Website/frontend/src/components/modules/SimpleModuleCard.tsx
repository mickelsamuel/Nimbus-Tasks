'use client'

import React from 'react'
import { 
  BookOpen, Clock, Star, Users, 
  Calendar, CheckCircle2, AlertCircle,
  Lock, PlayCircle, ChevronRight
} from 'lucide-react'
import { Module } from '@/types/modules'

interface SimpleModuleCardProps {
  module: Module & {
    dueDate?: Date
    isLocked?: boolean
    prerequisites?: string[]
    isMandatory?: boolean
    assignedBy?: string
  }
  index: number
  onEnroll?: (moduleId: number) => void
  onStart?: (moduleId: number) => void
}

export function SimpleModuleCard({ module, index, onEnroll, onStart }: SimpleModuleCardProps) {
  const isCompleted = module.userProgress?.progress === 100
  const hasProgress = module.userProgress && module.userProgress.progress > 0
  const progressPercentage = module.userProgress?.progress || 0

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`
  }

  const getDaysUntilDue = (dueDate?: Date) => {
    if (!dueDate) return null
    const now = new Date()
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = module.dueDate ? getDaysUntilDue(module.dueDate) : null
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0
  const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Expert':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      case 'Advanced':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    }
  }

  return (
    <div
      className={`dashboard-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
        module.isLocked ? 'opacity-75' : ''
      } ${isOverdue ? 'ring-2 ring-red-500' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header Section */}
      <div className="p-6 pb-4">
        {/* Top Row - Title and Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {module.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              {module.instructor} • {module.category}
            </p>
          </div>
          {isCompleted && (
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          )}
          {module.isLocked && (
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          )}
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
            {module.difficulty}
          </span>
          {module.isMandatory && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              Mandatory
            </span>
          )}
          {isOverdue && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
              Overdue
            </span>
          )}
          {isDueSoon && !isOverdue && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              Due Soon
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(module.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{module.enrolled.toLocaleString()} enrolled</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span>{module.rating} rating</span>
          </div>
          {module.dueDate && (
            <div className={`flex items-center gap-2 ${
              isOverdue ? 'text-red-600 dark:text-red-400' :
              isDueSoon ? 'text-orange-600 dark:text-orange-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                 daysUntilDue === 0 ? 'Due today' :
                 `${daysUntilDue} days left`}
              </span>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {module.prerequisites && module.prerequisites.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Prerequisites: {module.prerequisites.join(', ')}
            </p>
          </div>
        )}

        {/* Assigned By */}
        {module.assignedBy && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Assigned by: {module.assignedBy}
          </div>
        )}
      </div>

      {/* Progress Section */}
      {hasProgress && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercentage === 100 ? 'bg-green-500' :
                isOverdue ? 'bg-red-500' :
                isDueSoon ? 'bg-orange-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {module.userProgress?.lastAccessed && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last accessed: {new Date(module.userProgress.lastAccessed).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Action Section */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        {module.isLocked ? (
          <button 
            disabled
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            Complete Prerequisites
          </button>
        ) : (
          <button 
            onClick={() => module.userProgress ? onStart?.(module.id) : onEnroll?.(module.id)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
              isOverdue 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {module.userProgress ? (
              <>
                <PlayCircle className="w-4 h-4" />
                {isCompleted ? 'Review' : 'Continue'}
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                Start Module
              </>
            )}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}