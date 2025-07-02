'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Target, 
  Search, 
  CheckCircle,
  Star,
  Eye,
  Clock,
  User,
  Award,
  TrendingUp,
  Shield,
  Lightbulb
} from 'lucide-react'

interface BestPractice {
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
  estimatedReadTime: number
  createdBy: {
    firstName: string
    lastName: string
  }
  createdAt: string
  isFeatured: boolean
  tags: string[]
}

export default function BestPracticesPage() {
  const [practices, setPractices] = useState<BestPractice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const router = useRouter()

  const fetchBestPractices = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.append('category', 'practices')
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('type', selectedCategory)
      
      const response = await fetch(`/api/support/resources?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPractices(data.data.resources)
      }
    } catch (error) {
      console.error('Error fetching best practices:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    fetchBestPractices()
  }, [fetchBestPractices])

  const handlePracticeClick = (practiceId: string) => {
    router.push(`/help/best-practices/${practiceId}`)
  }

  const categories = [
    { value: '', label: 'All Practices', icon: Target, color: '#F59E0B' },
    { value: 'leadership', label: 'Leadership', icon: Award, color: '#10B981' },
    { value: 'risk', label: 'Risk Management', icon: Shield, color: '#EF4444' },
    { value: 'customer', label: 'Customer Service', icon: Star, color: '#3B82F6' },
    { value: 'innovation', label: 'Innovation', icon: Lightbulb, color: '#8B5CF6' },
    { value: 'performance', label: 'Performance', icon: TrendingUp, color: '#F97316' }
  ]

  // Mock featured practices for demonstration
  const featuredPractices = [
    {
      title: 'Client-Centric Approach',
      description: 'Putting client needs at the center of all banking decisions',
      metric: '23% increase in satisfaction',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Digital-First Strategy',
      description: 'Leveraging technology to enhance customer experience',
      metric: '40% efficiency improvement',
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Risk Assessment Excellence',
      description: 'Comprehensive risk evaluation frameworks',
      metric: '15% reduction in losses',
      color: 'from-red-500 to-pink-600'
    }
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
            <Target className="h-12 w-12 text-orange-400 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Best Practices
            </h1>
          </div>
          <p className="text-xl text-white/80">
            Industry standards and proven methodologies for banking excellence
          </p>
        </motion.div>

        {/* Featured Practices */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {featuredPractices.map((practice, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl bg-gradient-to-br ${practice.color} text-white relative overflow-hidden`}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10">
                <Award className="h-8 w-8 mb-3 opacity-80" />
                <h3 className="text-lg font-bold mb-2">{practice.title}</h3>
                <p className="text-white/90 text-sm mb-3">{practice.description}</p>
                <div className="text-xs bg-white/20 rounded-full px-3 py-1 inline-block">
                  {practice.metric}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Categories */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search best practices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-orange-400 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value} className="bg-gray-800">
                {cat.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {categories.slice(1).map((category) => (
            <motion.button
              key={category.value}
              onClick={() => setSelectedCategory(selectedCategory === category.value ? '' : category.value)}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-white/20 border-orange-400/50 text-white'
                  : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <category.icon 
                className="h-6 w-6 mx-auto mb-2" 
                style={{ color: category.color }}
              />
              <div className="text-sm font-semibold">{category.label}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Practices Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {practices.map((practice, index) => (
              <motion.div
                key={practice._id}
                className="cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handlePracticeClick(practice._id)}
              >
                <div className="p-6 rounded-2xl h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      practice.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      practice.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {practice.difficulty}
                    </span>
                    {practice.isFeatured && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                        <Award className="h-3 w-3" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {practice.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {practice.description}
                  </p>

                  {/* Tags */}
                  {practice.tags && practice.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {practice.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{practice.rating.averageRating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{practice.viewCount}</span>
                      </div>
                      {practice.estimatedReadTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{practice.estimatedReadTime}m</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-white/60" />
                      <span className="text-xs text-white/60">
                        {practice.createdBy.firstName} {practice.createdBy.lastName}
                      </span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {practices.length === 0 && !loading && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Target className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">No practices found</h3>
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