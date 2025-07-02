'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageCircle, ThumbsUp, Filter } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
  isHelpful?: boolean
  department?: string
}

interface ModuleReviewsProps {
  moduleId: string
  averageRating: number
  totalReviews: number
  onRatingSubmitted?: () => void
}

export function ModuleReviews({ 
  moduleId, 
  averageRating, 
  totalReviews,
  onRatingSubmitted 
}: ModuleReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all') // all, recent, helpful
  const [userHasReviewed, setUserHasReviewed] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [moduleId, filter, fetchReviews])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/modules/${moduleId}/reviews?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        setUserHasReviewed(data.userHasReviewed || false)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!newRating || newRating < 1) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/modules/${moduleId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment.trim()
        })
      })

      if (response.ok) {
        setShowReviewForm(false)
        setNewRating(0)
        setNewComment('')
        fetchReviews()
        onRatingSubmitted?.()
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      await fetch(`/api/modules/${moduleId}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      fetchReviews()
    } catch (error) {
      console.error('Error marking helpful:', error)
    }
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Reviews & Ratings
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          </div>

          {user && !userHasReviewed && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write Review
            </button>
          )}
        </div>

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Share Your Experience
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  {renderStars(newRating, true, setNewRating)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this module..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {newComment.length}/500 characters
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitReview}
                    disabled={!newRating || submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    onClick={() => {
                      setShowReviewForm(false)
                      setNewRating(0)
                      setNewComment('')
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-gray-500" />
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'recent', label: 'Most Recent' },
            { id: 'helpful', label: 'Most Helpful' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === filterOption.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                    <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                  <div className="w-3/4 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={review.userAvatar || '/avatars/default.jpg'}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {review.department} • {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {review.comment}
                </p>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleHelpfulClick(review.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    review.isHelpful
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share your experience with this module!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}