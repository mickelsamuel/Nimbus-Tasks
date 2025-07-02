'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Clock, Star, Users, BookOpen, Target, Award } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedLayout from '@/components/layout/ProtectedLayout'

export default function ModulePreviewPage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.id
  const [loading, setLoading] = useState(true)
  interface Prerequisite {
    title: string;
  }
  
  interface Chapter {
    title: string;
    description?: string;
    duration?: number;
  }
  
  interface ModuleStats {
    enrolledCount: number;
    averageRating: number;
  }
  
  interface UserProgress {
    isEnrolled: boolean;
    progress?: number;
    completedChapters?: string[];
    lastAccessed?: string;
  }

  interface Module {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    rarity?: string;
    totalDuration: number;
    points: number;
    stats?: ModuleStats;
    prerequisites?: Prerequisite[];
    tags?: string[];
    chapters: Chapter[];
    userProgress?: UserProgress;
  }
  
  const [moduleData, setModuleData] = useState<Module | null>(null)

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/modules/${moduleId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const { module } = await response.json()
          setModuleData(module)
        }
      } catch (error) {
        console.error('Error fetching module:', error)
      } finally {
        setLoading(false)
      }
    }

    if (moduleId) {
      fetchModule()
    }
  }, [moduleId])

  const handleEnroll = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/modules/${moduleId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        router.push(`/modules/${moduleId}`)
      }
    } catch (error) {
      console.error('Error enrolling in module:', error)
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedLayout>
    )
  }

  if (!moduleData) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Module Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">The module you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/modules')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Modules
            </button>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.push('/modules')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Modules
            </button>
          </motion.div>

          {/* Module Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Module Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    {moduleData.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    moduleData.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    moduleData.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {moduleData.difficulty}
                  </span>
                  {moduleData.rarity && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                      {moduleData.rarity}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {moduleData.title}
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {moduleData.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-5 w-5" />
                    <span>{moduleData.totalDuration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="h-5 w-5" />
                    <span>{moduleData.stats?.enrolledCount || 0} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Star className="h-5 w-5" />
                    <span>{moduleData.stats?.averageRating || 0}/5</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Award className="h-5 w-5" />
                    <span>{moduleData.points} points</span>
                  </div>
                </div>

                {/* Prerequisites */}
                {moduleData.prerequisites && moduleData.prerequisites.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Prerequisites
                    </h3>
                    <div className="space-y-2">
                      {moduleData.prerequisites.map((prereq, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Target className="h-4 w-4" />
                          <span>{prereq.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {moduleData.tags && moduleData.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Topics Covered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {moduleData.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Panel */}
              <div className="lg:w-80">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Ready to Learn?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Start this module and earn {moduleData.points} points
                    </p>
                  </div>

                  {moduleData.userProgress?.isEnrolled ? (
                    <button
                      onClick={() => router.push(`/modules/${moduleId}`)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors mb-4"
                    >
                      <Play className="h-5 w-5" />
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors mb-4"
                    >
                      <Play className="h-5 w-5" />
                      Enroll Now
                    </button>
                  )}

                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Free • Unlimited access • Certificate upon completion
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chapters Overview */}
          {moduleData.chapters && moduleData.chapters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Course Content
              </h2>
              
              <div className="space-y-4">
                {moduleData.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {chapter.description || 'Chapter content'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {chapter.duration || 15} min
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}