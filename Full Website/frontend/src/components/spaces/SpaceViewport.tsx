'use client'

import { VirtualSpace } from '@/types'
import { 
  Users, 
  Calendar, 
  Share2, 
  Maximize, 
  Camera, 
  Navigation 
} from 'lucide-react'

interface SpaceViewportProps {
  currentSpace: VirtualSpace | undefined
  isNavigating: boolean
  onJoinSpace?: () => void
  onScheduleMeeting?: () => void
  onInviteOthers?: () => void
}

export default function SpaceViewport({
  currentSpace,
  isNavigating,
  onJoinSpace,
  onScheduleMeeting,
  onInviteOthers
}: SpaceViewportProps) {
  const getEnvironmentGradient = (environment: string) => {
    switch (environment) {
      case 'premium-corporate':
        return 'from-gray-900 via-red-950 to-gray-900'
      case 'classical-elegant':
        return 'from-yellow-900 via-yellow-800 to-amber-900'
      case 'futuristic-tech':
        return 'from-blue-900 via-blue-800 to-indigo-900'
      case 'cozy-modern':
        return 'from-brown-900 via-amber-900 to-orange-900'
      case 'professional-stage':
        return 'from-purple-900 via-purple-800 to-indigo-900'
      case 'natural-wellness':
        return 'from-green-900 via-emerald-800 to-teal-900'
      case 'scholarly-gothic':
        return 'from-slate-900 via-gray-800 to-stone-900'
      case 'luxury-dining':
        return 'from-red-900 via-orange-900 to-amber-900'
      default:
        return 'from-gray-900 via-gray-800 to-gray-900'
    }
  }

  return (
    <div className="flex-1 relative">
      {/* Space Environment */}
      <div className={`space-viewport h-full bg-gradient-to-br ${getEnvironmentGradient(currentSpace?.environment || '')} relative overflow-hidden`}>
        {/* Atmospheric Effects */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Navigation Transition Overlay */}
        {isNavigating && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-800">
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <div className="text-xl font-semibold">Entering {currentSpace?.name}</div>
              <div className="text-sm opacity-75">Preparing virtual environment...</div>
            </div>
          </div>
        )}

        {/* 3D Space Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-content text-center text-white max-w-2xl">
            {/* Space Icon */}
            <div className="mb-6">
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: `#E01A1A20`,
                  boxShadow: `0 0 80px #E01A1A40`
                }}
              >
                {currentSpace && (
                  <currentSpace.icon 
                    className="h-16 w-16 text-red-500"
                  />
                )}
              </div>
            </div>

            {/* Space Information */}
            <h1 className="text-4xl font-bold mb-4">{currentSpace?.name}</h1>
            <p className="text-xl text-white/80 mb-6">{currentSpace?.description}</p>
            
            {/* Interactive Features */}
            <div className="features-grid grid grid-cols-2 gap-4 mt-8">
              {currentSpace?.features.map((feature, i) => (
                <div key={i} className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-sm font-medium">{feature}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons flex gap-4 mt-8 justify-center">
              <button 
                className="space-action-button"
                onClick={onJoinSpace}
              >
                <Users className="h-5 w-5 mr-2" />
                Join Space
              </button>
              <button 
                className="space-action-button-secondary"
                onClick={onScheduleMeeting}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Meeting
              </button>
              <button 
                className="space-action-button-secondary"
                onClick={onInviteOthers}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Invite Others
              </button>
            </div>
          </div>
        </div>

        {/* Space Controls Overlay */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="space-control-button">
            <Maximize className="h-4 w-4" />
          </button>
          <button className="space-control-button">
            <Camera className="h-4 w-4" />
          </button>
          <button className="space-control-button">
            <Navigation className="h-4 w-4" />
          </button>
        </div>

        {/* Current Occupants */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 p-3">
          <div className="text-xs text-white/80 font-medium mb-2">Current Occupants</div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(Math.min(currentSpace?.currentUsers || 0, 5))].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-white/20" />
              ))}
            </div>
            {(currentSpace?.currentUsers || 0) > 5 && (
              <div className="text-xs text-white/80">
                +{(currentSpace?.currentUsers || 0) - 5} more
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}