'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { ArrowLeft, BookOpen, Clock, Users, Award, PlayCircle, CheckCircle } from 'lucide-react'
import { Module } from '@/types/modules'
import { ModuleReviews } from '@/components/modules/ModuleReviews'

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const moduleId = params.id as string

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Use the centralized API client
        const { modulesApi } = await import('@/lib/api/modules')
        const response = await modulesApi.getModule(parseInt(moduleId))
        
        if (response.success) {
          setModule(response.module)
        } else {
          setError('Module not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load module')
      } finally {
        setLoading(false)
      }
    }

    if (moduleId) {
      fetchModule()
    }
  }, [moduleId])

  const handleStartModule = async () => {
    if (!module) return
    
    try {
      const { modulesApi } = await import('@/lib/api/modules')
      
      // If not enrolled, enroll first
      if (!module.userProgress?.isEnrolled) {
        const enrollResponse = await modulesApi.enrollInModule(module.id)
        
        if (!enrollResponse.success) {
          console.error('Failed to enroll in module')
          return
        }
      }
      
      // Navigate to the actual module content/lessons
      router.push(`/modules/${moduleId}/lessons`)
    } catch (err) {
      console.error('Error starting module:', err)
    }
  }

  const handleRatingSubmitted = async () => {
    // Refresh module data when a new review is submitted
    if (moduleId) {
      try {
        const { modulesApi } = await import('@/lib/api/modules')
        const response = await modulesApi.getModule(parseInt(moduleId))
        
        if (response.success) {
          setModule(response.module)
        }
      } catch (err) {
        console.error('Error refreshing module:', err)
      }
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  if (error || !module) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Module Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error || 'The requested module could not be found.'}
                </p>
                <button
                  onClick={() => router.push('/modules')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Modules
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/modules')}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Modules
            </button>
          </div>

          {/* Module Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Module Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                    {module.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    {module.difficulty}
                  </span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {module.title}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {module.description}
                </p>

                {/* Module Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>{module.totalDuration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-5 h-5" />
                    <span>{module.enrolled || 0} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Award className="w-5 h-5" />
                    <span>{module.points} XP</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-5 h-5" />
                    <span>{module.chapters?.length || 0} chapters</span>
                  </div>
                </div>

                {/* Progress Bar (if enrolled) */}
                {module.userProgress && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {module.userProgress.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.userProgress.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleStartModule}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-lg transition-colors"
                >
                  {module.userProgress ? (
                    module.userProgress.progress === 100 ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Review Module
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-5 h-5" />
                        Continue Learning
                      </>
                    )
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Start Module
                    </>
                  )}
                </button>
              </div>

              {/* Module Image/Icon */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
                  <BookOpen className="w-24 h-24 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">{module.category}</h3>
                  <p className="text-blue-100">Learning Module</p>
                </div>
              </div>
            </div>
          </div>

          {/* Module Chapters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Course Content
            </h2>
            
            <div className="space-y-4">
              {(module.chapters || []).map((chapter, index) => {
                const isCompleted = module.userProgress?.completedChapters?.includes(chapter._id || chapter.id?.toString() || '') || false
                
                return (
                  <div
                    key={chapter._id || chapter.id || index}
                    className={`p-4 rounded-xl border transition-colors ${
                      isCompleted 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {chapter.description}
                        </p>
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {chapter.duration} min
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Module Reviews */}
          <ModuleReviews
            moduleId={moduleId}
            averageRating={module.stats?.averageRating || module.rating || 0}
            totalReviews={module.stats?.reviewCount || module.reviews || 0}
            onRatingSubmitted={handleRatingSubmitted}
          />
        </div>
      </div>
    </ProtectedLayout>
  )
}