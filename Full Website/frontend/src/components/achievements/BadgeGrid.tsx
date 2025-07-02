import { motion } from 'framer-motion'
import { Badge } from './hooks/useAchievementData'
import { BadgeCard } from './BadgeCard'

interface BadgeGridProps {
  badges: Badge[]
  onSelectBadge?: (badge: Badge) => void
  viewMode?: 'grid' | 'list'
}

export function BadgeGrid({ badges, onSelectBadge, viewMode = 'grid' }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No badges yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete activities and achievements to earn your first badge!
        </p>
      </div>
    )
  }

  const gridClass = viewMode === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'flex flex-col gap-4'

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={gridClass}
        >
          {badges.map((badge, index) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              onClick={() => onSelectBadge?.(badge)}
              delay={index * 0.05}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}