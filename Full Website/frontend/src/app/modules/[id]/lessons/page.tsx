'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { useAuth } from '@/contexts/AuthContext'
import QuizComponent from '@/components/modules/QuizComponent'

interface Chapter {
  _id: string
  id: number
  title: string
  content: string
  type: 'lesson' | 'quiz' | 'practical'
  duration: number
  videoUrl?: string
  attachments?: string[]
  completed?: boolean
}

interface Module {
  _id: string
  title: string
  description: string
  chapters: Chapter[]
  estimatedDuration: number
  difficulty: string
  category: string
}

export default function ModuleLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const moduleId = params?.id as string

  const [module, setModule] = useState<Module | null>(null)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [completedChapters, setCompletedChapters] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Fetch module data and user progress
  useEffect(() => {
    if (!moduleId) return

    const fetchModuleData = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        
        // Fetch module details
        const moduleResponse = await fetch(`${baseURL}/api/modules/${moduleId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!moduleResponse.ok) {
          throw new Error('Failed to load module')
        }

        const moduleData = await moduleResponse.json()
        setModule(moduleData)

        // Fetch user progress
        const progressResponse = await fetch(`${baseURL}/api/modules/${moduleId}/progress`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          setCompletedChapters(progressData.completedChapters || [])
          setCurrentChapterIndex(progressData.currentChapter || 0)
        }

      } catch (err) {
        console.error('Error fetching module data:', err)
        setError('Failed to load module content')
      } finally {
        setLoading(false)
      }
    }

    fetchModuleData()
  }, [moduleId])

  // Mark chapter as completed
  const markChapterCompleted = async (chapterIndex: number) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      const response = await fetch(`${baseURL}/api/modules/${moduleId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentChapter: chapterIndex,
          completedChapters: [...completedChapters, chapterIndex]
        })
      })

      if (response.ok) {
        setCompletedChapters(prev => [...prev, chapterIndex])
      }
    } catch (err) {
      console.error('Error updating progress:', err)
    }
  }

  // Navigate to next chapter
  const goToNextChapter = () => {
    if (module && currentChapterIndex < module.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
    }
  }

  // Navigate to previous chapter
  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading lesson content...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  if (error || !module) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Module not found'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  const currentChapter = module.chapters[currentChapterIndex]
  const isChapterCompleted = completedChapters.includes(currentChapterIndex)
  const progress = (completedChapters.length / module.chapters.length) * 100

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/modules/${moduleId}`)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Module
                </button>
                <div className="border-l border-gray-300 dark:border-gray-600 h-6"></div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {module.title}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chapter {currentChapterIndex + 1} of {module.chapters.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar - Chapter List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Chapters
                </h3>
                <div className="space-y-2">
                  {module.chapters.map((chapter, index) => (
                    <button
                      key={chapter._id}
                      onClick={() => setCurrentChapterIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentChapterIndex === index
                          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          completedChapters.includes(index)
                            ? 'bg-green-500 text-white'
                            : currentChapterIndex === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}>
                          {completedChapters.includes(index) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {chapter.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {chapter.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChapterIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
                >
                  {/* Chapter Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {currentChapter.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {currentChapter.duration} minutes
                          </span>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                            {currentChapter.type}
                          </span>
                        </div>
                      </div>
                      
                      {isChapterCompleted && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chapter Content */}
                  <div className="p-6">
                    {currentChapter.videoUrl && (
                      <div className="mb-6">
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                          <div className="aspect-video flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Play className="w-8 h-8 text-white" />
                              </div>
                              <p className="text-white mb-2">Video Lesson</p>
                              <p className="text-gray-400 text-sm">
                                {currentChapter.duration} minute lesson
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Chapter Content */}
                    {currentChapter.type === 'quiz' ? (
                      <QuizComponent
                        questions={[
                          {
                            id: '1',
                            question: 'What is the primary role of commercial banking?',
                            options: [
                              'Investment management',
                              'Accepting deposits and providing loans',
                              'Stock trading',
                              'Insurance services'
                            ],
                            correctAnswer: 1,
                            explanation: 'Commercial banks primarily focus on accepting deposits from customers and providing loans to individuals and businesses.'
                          },
                          {
                            id: '2',
                            question: 'Which of the following is NOT a type of deposit account?',
                            options: [
                              'Checking account',
                              'Savings account',
                              'Certificate of deposit',
                              'Mutual fund'
                            ],
                            correctAnswer: 3,
                            explanation: 'Mutual funds are investment products, not deposit accounts offered by banks.'
                          }
                        ]}
                        onComplete={(score, total) => {
                          console.log(`Quiz completed: ${score}/${total}`)
                          if (score >= total * 0.7) { // 70% passing grade
                            markChapterCompleted(currentChapterIndex)
                          }
                        }}
                        title={`${currentChapter.title} Quiz`}
                      />
                    ) : (
                      <div className="prose dark:prose-invert max-w-none">
                        <div className="text-gray-900 dark:text-gray-100">
                          {currentChapter.content ? (
                            <div dangerouslySetInnerHTML={{ __html: currentChapter.content }} />
                          ) : (
                            <div>
                              <h3>Chapter Content</h3>
                              <p>This chapter covers important concepts in banking and finance. The content includes:</p>
                              <ul>
                                <li>Key theoretical foundations</li>
                                <li>Practical applications</li>
                                <li>Real-world examples</li>
                                <li>Interactive exercises</li>
                              </ul>
                              <p>Complete this chapter to move forward in your learning journey.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chapter Actions */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={goToPreviousChapter}
                        disabled={currentChapterIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          currentChapterIndex === 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex items-center gap-3">
                        {!isChapterCompleted && (
                          <button
                            onClick={() => markChapterCompleted(currentChapterIndex)}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </button>
                        )}
                        
                        <button
                          onClick={goToNextChapter}
                          disabled={currentChapterIndex >= module.chapters.length - 1}
                          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                            currentChapterIndex >= module.chapters.length - 1
                              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}