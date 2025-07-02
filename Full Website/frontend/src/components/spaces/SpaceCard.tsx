'use client'

import { VirtualSpace } from '@/types'
import { LucideIcon } from 'lucide-react'
import styles from './spaces.module.css'

interface SpaceCardProps {
  space: VirtualSpace
  isActive: boolean
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}

export default function SpaceCard({
  space,
  isActive,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick
}: SpaceCardProps) {
  const SpaceIcon = space.icon as LucideIcon
  const occupancyPercentage = (space.currentUsers / space.maxUsers) * 100
  
  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage < 30) return 'text-green-500'
    if (percentage < 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div
      className={`${styles['space-card']} cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20' : ''
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: `#E01A1A20`,
              color: '#E01A1A'
            }}
          >
            <SpaceIcon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {space.name}
              </h3>
              {space.currentUsers > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className={`text-xs font-medium ${getOccupancyColor(space.currentUsers, space.maxUsers)}`}>
                    {space.currentUsers}
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {space.description}
            </p>
            
            {/* Occupancy Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Occupancy</span>
                <span>{space.currentUsers}/{space.maxUsers}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full transition-all duration-500 bg-red-600"
                  style={{ 
                    width: `${Math.min(occupancyPercentage, 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Features */}
            {isHovered && (
              <div className="mt-3 space-y-1 animate-fade-in">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {space.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}