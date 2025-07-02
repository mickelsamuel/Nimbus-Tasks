'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MessageSquare, 
  Users, 
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Eye,
  Clock,
  User,
  Star,
  Award
} from 'lucide-react'

interface ForumPost {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    firstName: string
    lastName: string
    role: string
    department?: string
  }
  category: string
  commentCount: number
  votes: {
    upvotes: number
    downvotes: number
  }
  views: {
    count: number
  }
  createdAt: string
  lastActivity: string
  isPinned: boolean
  isVerified: boolean
  verifiedBy?: {
    firstName: string
    lastName: string
  }
  lastActivityBy?: {
    firstName: string
    lastName: string
  }
}

interface CategoryInfo {
  category: string
  count: number
  totalViews: number
  totalComments: number
  latestActivity: string
}

export default function CommunityForumPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ value: string; label: string; count: number }[]>([
    { value: '', label: 'All Categories', count: 0 }
  ])

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (selectedCategory) params.append('category', selectedCategory)
        params.append('sortBy', 'activity')
        params.append('limit', '20')
        
        const response = await fetch(`/api/forum/posts?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch forum posts: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.data && data.data.posts) {
          setForumPosts(data.data.posts)
        } else {
          setForumPosts([])
        }
      } catch (error) {
        console.error('Error fetching forum posts:', error)
        setError('Unable to load forum posts. Please try again later.')
        setForumPosts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchForumPosts()
  }, [selectedCategory])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/forum/categories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.success && data.data) {
            const totalCount = data.data.reduce((sum: number, cat: CategoryInfo) => sum + cat.count, 0)
            const formattedCategories = [
              { value: '', label: 'All Categories', count: totalCount },
              ...data.data.map((cat: CategoryInfo) => ({
                value: cat.category,
                label: cat.category,
                count: cat.count
              }))
            ]
            setCategories(formattedCategories)
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    fetchCategories()
  }, [])

  const filteredPosts = forumPosts

  return (
    <div 
      className="min-h-screen px-4 py-12"
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1E40AF 50%, #0D9488 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-green-400 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Executive Network
            </h1>
          </div>
          <p className="text-xl text-white/80">
            Connect, collaborate, and share insights with fellow banking professionals
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <MessageSquare className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {categories.find(cat => cat.value === '')?.count || 0}
            </div>
            <div className="text-white/60">Total Posts</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {categories.length - 1}
            </div>
            <div className="text-white/60">Active Categories</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">Growing</div>
            <div className="text-white/60">Community</div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === category.value
                    ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/20'
                }`}
              >
                <div>{category.label}</div>
                <div className="text-xs opacity-70">
                  {category.count} {category.count === 1 ? 'post' : 'posts'}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Forum Posts */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          </div>
        ) : error ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MessageSquare className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Posts</h3>
            <p className="text-white/70 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredPosts.map((post, index) => (
            <motion.div
              key={post._id}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {post.isPinned && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                        Pinned
                      </span>
                    )}
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                    {post.isVerified && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <Star className="h-3 w-3" />
                        <span className="text-xs">Verified</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 hover:text-green-300 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author.firstName} {post.author.lastName}</span>
                      <span className="text-white/40">•</span>
                      <span>{post.author.role}</span>
                      {post.author.department && (
                        <>
                          <span className="text-white/40">•</span>
                          <span>{post.author.department}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.votes.upvotes} {post.votes.upvotes === 1 ? 'upvote' : 'upvotes'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views.count} {post.views.count === 1 ? 'view' : 'views'}</span>
                  </div>
                </div>
                
                <div className="text-xs text-white/60">
                  Last activity: {new Date(post.lastActivity).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}

        {filteredPosts.length === 0 && !loading && !error && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MessageSquare className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">No Forum Posts Yet</h3>
            <p className="text-white/40 mb-4">
              {selectedCategory 
                ? `No posts found in the ${selectedCategory} category.`
                : 'Be the first to start a discussion in our community forum!'}
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                View All Categories
              </button>
            )}
          </motion.div>
        )}

        {/* Coming Soon Notice */}
        <motion.div
          className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-white/20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Full Forum Coming Soon</h3>
          <p className="text-white/70 mb-4">
            We&apos;re building a comprehensive community platform where you can create posts, participate in discussions, and connect with colleagues.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/60">
            <span>✨ Real-time messaging</span>
            <span>🎯 Expert verification</span>
            <span>🏆 Reputation system</span>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/help')}
          className="flex items-center gap-2 mt-8 px-4 py-2 text-white/70 hover:text-white transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </motion.button>
      </div>
    </div>
  )
}