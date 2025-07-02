import { motion } from 'framer-motion'
import { Badge } from './hooks/useAchievementData'

interface BadgeCardProps {
  badge: Badge
  onClick?: () => void
  delay?: number
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

const getRarityBg = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    case 'uncommon': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
    case 'rare': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
    case 'epic': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700'
    case 'legendary': return 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700'
    default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  }
}

export function BadgeCard({ badge, onClick, delay = 0 }: BadgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${getRarityBg(badge.rarity)}
        ${badge.earned 
          ? 'shadow-lg hover:shadow-xl' 
          : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
        }
      `}
    >
      {/* Rarity indicator */}
      <div className={`absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)}`} />
      
      {/* Earned indicator */}
      {badge.earned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          className="absolute top-3 left-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      {/* Badge Icon */}
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(badge.rarity)}`}>
          {badge.rarity.toUpperCase()}
        </div>
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">{badge.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{badge.description}</p>
        
        {badge.earnedAt && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Hover glow effect */}
      {badge.earned && (
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getRarityColor(badge.rarity)} opacity-0 blur-xl`}
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}