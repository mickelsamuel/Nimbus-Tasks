'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Video, 
  Search, 
  Play,
  Star,
  Eye,
  User,
  Award
} from 'lucide-react'

interface VideoResource {
  _id: string
  title: string
  description: string
  type: string
  category: string
  difficulty: string
  duration: number
  videoUrl: string
  rating: {
    averageRating: number
    ratingCount: number
  }
  viewCount: number
  estimatedReadTime: number
  createdBy: {
    firstName: string
    lastName: string
  }
  createdAt: string
  isFeatured: boolean
}

export default function TrainingVideosPage() {
  const [videos, setVideos] = useState<VideoResource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchVideos = async () => {
    try {
      const params = new URLSearchParams()
      params.append('type', 'video')
      if (searchQuery) params.append('search', searchQuery)
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty)
      
      const response = await fetch(`/api/support/resources?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setVideos(data.data.resources)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
    }
    
    fetchVideos()
  }, [searchQuery, selectedDifficulty])

  const handleVideoClick = (videoId: string) => {
    router.push(`/help/training-videos/${videoId}`)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const difficulties = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

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
            <Video className="h-12 w-12 text-purple-400 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Masterclass Series
            </h1>
          </div>
          <p className="text-xl text-white/80">
            Professional video tutorials for banking excellence
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search training videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-all"
          >
            {difficulties.map(diff => (
              <option key={diff.value} value={diff.value} className="bg-gray-800">
                {diff.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {videos.map((video, index) => (
              <motion.div
                key={video._id}
                className="cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleVideoClick(video._id)}
              >
                <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                  {/* Video Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20" />
                    <motion.div
                      className="relative z-10 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="h-8 w-8 text-white ml-1" />
                    </motion.div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded text-white text-xs font-semibold">
                      {formatDuration(video.duration)}
                    </div>
                    
                    {/* Featured Badge */}
                    {video.isFeatured && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/80 rounded text-black text-xs font-semibold flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        video.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        video.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {video.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
                        Masterclass
                      </span>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">
                      {video.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span>{video.rating.averageRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{video.viewCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-white/60" />
                        <span className="text-xs text-white/60">
                          {video.createdBy.firstName} {video.createdBy.lastName}
                        </span>
                      </div>
                      <div className="text-xs text-white/60">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {videos.length === 0 && !loading && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Video className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">No videos found</h3>
            <p className="text-white/40">Try adjusting your search criteria</p>
          </motion.div>
        )}

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