'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Star,
  Eye,
  Clock,
  User
} from 'lucide-react'

interface Resource {
  _id: string
  title: string
  description: string
  type: string
  category: string
  difficulty: string
  rating: {
    averageRating: number
    ratingCount: number
  }
  viewCount: number
  downloadCount: number
  estimatedReadTime: number
  createdBy: {
    firstName: string
    lastName: string
  }
  createdAt: string
}

export default function DocsPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchResources = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty)
      
      const response = await fetch(`/api/support/resources?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setResources(data.data.resources)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
    }
    
    fetchResources()
  }, [searchQuery, selectedCategory, selectedDifficulty])

  const handleResourceClick = (resourceId: string) => {
    router.push(`/help/docs/${resourceId}`)
  }

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'handbook', label: 'Executive Handbook' },
    { value: 'training', label: 'Training Materials' },
    { value: 'community', label: 'Community Guidelines' },
    { value: 'practices', label: 'Best Practices' },
    { value: 'technical', label: 'Technical Documentation' }
  ]

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
            <BookOpen className="h-12 w-12 text-teal-400 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Documentation Hub
            </h1>
          </div>
          <p className="text-xl text-white/80">
            Comprehensive guides and resources for platform excellence
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-teal-400 transition-all"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value} className="bg-gray-800">
                {cat.label}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-teal-400 transition-all"
          >
            {difficulties.map(diff => (
              <option key={diff.value} value={diff.value} className="bg-gray-800">
                {diff.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {resources.map((resource, index) => (
              <motion.div
                key={resource._id}
                className="cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleResourceClick(resource._id)}
              >
                <div className="p-6 rounded-2xl h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                  {/* Resource Type Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      resource.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      resource.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {resource.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-400">
                      {resource.type}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{resource.rating.averageRating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{resource.viewCount}</span>
                      </div>
                      {resource.estimatedReadTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{resource.estimatedReadTime}m</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-white/60" />
                      <span className="text-xs text-white/60">
                        {resource.createdBy.firstName} {resource.createdBy.lastName}
                      </span>
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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