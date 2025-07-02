'use client'

import { VirtualSpace } from '@/types'

interface SpaceMiniMapProps {
  spaces: VirtualSpace[]
  selectedSpace: string
  onSpaceNavigation: (spaceId: string) => void
}

export default function SpaceMiniMap({ spaces, selectedSpace, onSpaceNavigation }: SpaceMiniMapProps) {
  return (
    <div className="absolute bottom-4 right-4 w-48 h-32 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 p-3">
      <div className="text-xs text-white/80 font-medium mb-2">Space Overview</div>
      <div className="grid grid-cols-3 gap-1 h-full">
        {spaces.slice(0, 6).map((space) => (
          <div
            key={space.id}
            className={`w-full h-full rounded border cursor-pointer transition-all ${
              space.id === selectedSpace 
                ? 'bg-red-500 border-red-400' 
                : 'bg-white/20 border-white/30 hover:bg-white/30'
            }`}
            onClick={() => onSpaceNavigation(space.id)}
          />
        ))}
      </div>
    </div>
  )
}