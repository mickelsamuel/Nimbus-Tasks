import { motion } from 'framer-motion'
import { Trophy, Star, Sparkles, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface AchievementCelebrationProps {
  achievement: {
    title: string
    description: string
    points: number
    rarity: string
    icon?: string
  }
  onClose: () => void
}

export function AchievementCelebration({ achievement, onClose }: AchievementCelebrationProps) {
  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-orange-400 to-orange-600'
      default: return 'from-purple-600 to-blue-600'
    }
  }

  const getCategoryIcon = (icon?: string) => {
    return icon || '🏆'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(achievement.rarity)} blur-3xl opacity-50 scale-150`} />
        
        {/* Card */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }} />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Content */}
          <div className="relative text-center">
            {/* Icon */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block mb-6"
            >
              <div className={`w-24 h-24 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-3xl flex items-center justify-center text-5xl shadow-2xl`}>
                {getCategoryIcon(achievement.icon)}
              </div>
            </motion.div>

            {/* Sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2"
            >
              <Sparkles className="w-32 h-32 text-yellow-400 opacity-20" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Achievement Unlocked!
            </motion.h2>

            {/* Achievement Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white rounded-full text-lg font-medium mb-4`}
            >
              <Trophy className="w-5 h-5" />
              {achievement.title}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm mx-auto"
            >
              {achievement.description}
            </motion.p>

            {/* Points */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-6 py-3 rounded-xl mb-6"
            >
              <Star className="w-6 h-6" />
              <span className="text-2xl font-bold">+{achievement.points} XP</span>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}