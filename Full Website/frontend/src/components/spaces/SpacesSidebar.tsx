'use client'

import { Search, Filter } from 'lucide-react'
import { VirtualSpace } from '@/types'
import SpaceCard from './SpaceCard'

interface SpacesSidebarProps {
  spaces: VirtualSpace[]
  selectedSpace: string
  hoveredSpace: string | null
  onSpaceHover: (spaceId: string | null) => void
  onSpaceNavigation: (spaceId: string) => void
}

export default function SpacesSidebar({
  spaces,
  selectedSpace,
  hoveredSpace,
  onSpaceHover,
  onSpaceNavigation
}: SpacesSidebarProps) {
  // Calculate analytics from spaces data
  const mostPopularSpace = spaces.length > 0 ? spaces.reduce((max, space) => 
    (space.currentUsers || 0) > ((max as any).currentUsers || 0) ? space : max
  ) : { name: 'None' };
  
  const avgStayDuration = Math.round(
    spaces.reduce((sum, space) => sum + (space.averageStayDuration || 0), 0) / Math.max(spaces.length, 1)
  );
  
  const peakHour = '10:00 AM'; // This would come from backend analytics
  return (
    <div className="spaces-sidebar w-80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 overflow-y-auto">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Available Spaces</h2>
          <div className="flex gap-2">
            <button className="control-button-small">
              <Search className="h-4 w-4" />
            </button>
            <button className="control-button-small">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Space Cards */}
        <div className="space-y-3">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              isActive={selectedSpace === space.id}
              isHovered={hoveredSpace === space.id}
              onMouseEnter={() => onSpaceHover(space.id)}
              onMouseLeave={() => onSpaceHover(null)}
              onClick={() => onSpaceNavigation(space.id)}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Today&apos;s Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Most Popular:</span>
              <span className="font-medium text-red-600 dark:text-red-400">{mostPopularSpace?.name || 'None'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Peak Hour:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{peakHour}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Avg. Stay:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{avgStayDuration} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}