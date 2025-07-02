import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Star } from 'lucide-react'
import { Badge } from './hooks/useAchievementData'

interface BadgeDetailModalProps {
  badge: Badge | null
  onClose: () => void
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'from-gray-500 to-gray-600'
    case 'uncommon': return 'from-green-500 to-green-600'
    case 'rare': return 'from-blue-500 to-blue-600'
    case 'epic': return 'from-purple-500 to-purple-600'
    case 'legendary': return 'from-yellow-500 to-orange-500'
    default: return 'from-gray-500 to-gray-600'
  }
}

export function BadgeDetailModal({ badge, onClose }: BadgeDetailModalProps) {
  if (!badge) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Header with gradient background */}
          <div className={`relative px-8 pt-12 pb-8 bg-gradient-to-br ${getRarityColor(badge.rarity)} text-white`}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
              <div className="absolute inset-0 bg-white rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
            </div>
            
            {/* Badge Icon */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                {badge.icon}
              </motion.div>
              
              {/* Rarity Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold"
              >
                <Star className="w-4 h-4" />
                {badge.rarity.toUpperCase()}
              </motion.div>
            </div>

            {/* Status indicator */}
            {badge.earned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-green-500 rounded-full text-xs font-bold"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                EARNED
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Badge Name */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {badge.name}
              </h2>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {badge.description}
              </p>

              {/* Category */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                  {badge.category}
                </span>
              </div>

              {/* Earned date */}
              {badge.earned && badge.earnedAt && (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Earned on {new Date(badge.earnedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {badge.requirements && badge.requirements.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {badge.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}