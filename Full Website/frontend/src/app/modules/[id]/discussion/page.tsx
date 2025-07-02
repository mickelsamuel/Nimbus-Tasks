'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, Send, ThumbsUp, Reply } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import ProtectedLayout from '@/components/layout/ProtectedLayout'

export default function ModuleDiscussionPage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.id
  const [loading, setLoading] = useState(true)
  interface User {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }
  
  interface Reply {
    id: string;
    user: User;
    message: string;
    timestamp: Date;
    likes: number;
  }
  
  interface Discussion {
    id: string;
    user: User;
    message: string;
    timestamp: Date;
    likes: number;
    replies: Reply[];
  }
  
  interface Module {
    id: string;
    title: string;
  }
  
  const [moduleData, setModuleData] = useState<Module | null>(null)
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const fetchModuleAndDiscussions = async () => {
      try {
        setLoading(true)
        
        // Fetch module data
        const moduleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/modules/${moduleId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        })

        if (moduleResponse.ok) {
          const { module } = await moduleResponse.json()
          setModuleData(module)
        }

        // Fetch module discussions from API
        const discussionsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/modules/${moduleId}/discussions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        })

        if (discussionsResponse.ok) {
          const { discussions } = await discussionsResponse.json()
          setDiscussions(discussions || [])
        } else {
          setDiscussions([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (moduleId) {
      fetchModuleAndDiscussions()
    }
  }, [moduleId])

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/modules/${moduleId}/discussions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: newMessage
          })
        })

        if (response.ok) {
          const { discussion } = await response.json()
          setDiscussions(prev => [discussion, ...prev])
          setNewMessage('')
        }
      } catch (error) {
        console.error('Error posting message:', error)
      }
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
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

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
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
            
            <div className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Discussion
                </h1>
              </div>
              {moduleData && (
                <p className="text-gray-600 dark:text-gray-400">
                  {moduleData.title}
                </p>
              )}
            </div>
          </motion.div>

          {/* New Message Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Start a Discussion
            </h2>
            
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your thoughts, ask questions, or help others..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              />
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  Post Message
                </button>
              </div>
            </form>
          </motion.div>

          {/* Discussions List */}
          <div className="space-y-6">
            {discussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
              >
                {/* Main Discussion */}
                <div className="flex gap-4">
                  <Image
                    src={discussion.user.avatar}
                    alt={discussion.user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {discussion.user.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {discussion.user.role}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        •
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(discussion.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {discussion.message}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm">{discussion.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <Reply className="h-4 w-4" />
                        <span className="text-sm">Reply</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {discussion.replies.length > 0 && (
                  <div className="ml-14 mt-6 space-y-4">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <Image
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {reply.user.name}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {reply.user.role}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              •
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(reply.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                            {reply.message}
                          </p>
                          
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="h-3 w-3" />
                            <span className="text-xs">{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {discussions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No discussions yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to start a conversation about this module!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}