import { Achievement } from '@/types'

export const useAchievementStyles = () => {
  const getRarityStyle = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'bronze':
        return {
          gradient: 'from-amber-600 to-amber-800',
          glow: 'shadow-amber-500/20',
          border: 'border-amber-500/30',
          bg: 'bg-amber-50 dark:bg-amber-950/20'
        }
      case 'silver':
        return {
          gradient: 'from-slate-400 to-slate-600',
          glow: 'shadow-slate-500/20',
          border: 'border-slate-500/30',
          bg: 'bg-slate-50 dark:bg-slate-950/20'
        }
      case 'gold':
        return {
          gradient: 'from-yellow-400 to-yellow-600',
          glow: 'shadow-yellow-500/20',
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-50 dark:bg-yellow-950/20'
        }
      case 'platinum':
        return {
          gradient: 'from-purple-400 to-purple-600',
          glow: 'shadow-purple-500/20',
          border: 'border-purple-500/30',
          bg: 'bg-purple-50 dark:bg-purple-950/20'
        }
      default:
        return {
          gradient: 'from-gray-400 to-gray-600',
          glow: 'shadow-gray-500/20',
          border: 'border-gray-500/30',
          bg: 'bg-gray-50 dark:bg-gray-950/20'
        }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning':
        return 'text-blue-600 dark:text-blue-400'
      case 'performance':
        return 'text-green-600 dark:text-green-400'
      case 'social':
        return 'text-purple-600 dark:text-purple-400'
      case 'exploration':
        return 'text-orange-600 dark:text-orange-400'
      case 'milestones':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return {
    getRarityStyle,
    getCategoryColor
  }
}