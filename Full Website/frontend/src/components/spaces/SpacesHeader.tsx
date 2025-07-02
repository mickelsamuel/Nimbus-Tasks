'use client'

import { 
  Building2, 
  Volume2, 
  VolumeX, 
  Settings 
} from 'lucide-react'

interface SpacesHeaderProps {
  currentUsers: number
  activeSpaces?: number
  todaysVisits?: number
  isAudioEnabled: boolean
  onAudioToggle: () => void
  viewMode: '3d' | '2d' | 'map'
  onViewModeChange: (mode: '3d' | '2d' | 'map') => void
}

export default function SpacesHeader({
  currentUsers,
  activeSpaces = 0,
  todaysVisits = 0,
  isAudioEnabled,
  onAudioToggle,
  viewMode,
  onViewModeChange
}: SpacesHeaderProps) {
  return (
    <div className="spaces-header backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Virtual Spaces Branding */}
        <div className="branding flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="space-title text-2xl font-bold">Virtual Spaces</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Premium Corporate Metaverse Experience
            </p>
          </div>
        </div>

        {/* Real-time Analytics */}
        <div className="analytics-section flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Online Now</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{currentUsers}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Active Spaces</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeSpaces}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Today&apos;s Visits</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{todaysVisits}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls flex items-center gap-3">
          <button
            onClick={onAudioToggle}
            className="control-button"
          >
            {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('3d')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === '3d' ? 'bg-red-600 text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              3D
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'map' ? 'bg-red-600 text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              MAP
            </button>
          </div>
          
          <button className="control-button">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}