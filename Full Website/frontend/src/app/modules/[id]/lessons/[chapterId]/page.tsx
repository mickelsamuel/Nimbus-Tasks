'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { modulesApi } from '@/lib/api/modules'
import { ChevronLeft, ChevronRight, Play, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Chapter {
  id: string
  title: string
  content: string
  videoUrl?: string
  duration: number
  completed: boolean
  moduleId: string
}

export default function ChapterPage() {
  const params = useParams()
  const moduleId = params.id as string
  const chapterId = params.chapterId as string
  
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true)
        const response = await modulesApi.getChapter(moduleId, chapterId)
        setChapter(response.data)
      } catch (err) {
        setError('Failed to load chapter content')
        console.error('Error fetching chapter:', err)
      } finally {
        setLoading(false)
      }
    }

    if (moduleId && chapterId) {
      fetchChapter()
    }
  }, [moduleId, chapterId])

  const handleMarkComplete = async () => {
    if (!chapter) return
    
    try {
      setCompleting(true)
      await modulesApi.markChapterComplete(moduleId, chapterId)
      setChapter(prev => prev ? { ...prev, completed: true } : null)
    } catch (err) {
      console.error('Error marking chapter complete:', err)
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Chapter not found'}
          </h1>
          <Link 
            href={`/modules/${moduleId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Module
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/modules/${moduleId}`}
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Module
            </Link>
            
            <div className="flex items-center gap-4">
              {!chapter.completed && (
                <button 
                  onClick={handleMarkComplete} 
                  disabled={completing}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {completing ? 'Marking Complete...' : 'Mark Complete'}
                </button>
              )}
              
              {chapter.completed && (
                <div className="flex items-center text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {chapter.title}
          </h1>
          
          {chapter.videoUrl && (
            <div className="mb-8">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Video Player Component
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Duration: {Math.floor(chapter.duration / 60)}:{(chapter.duration % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
          </div>
        </div>
      </div>
    </div>
  )
}