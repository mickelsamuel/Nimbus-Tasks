'use client'

import { User } from 'lucide-react'
import AvatarViewer3D from './AvatarViewer3D'
import { AvatarConfiguration } from '@/lib/avatarApi'

interface AvatarViewportProps {
  currentAvatarUrl: string
  isAnimating: boolean
  currentView: string
  configuration: AvatarConfiguration
  onViewChange: (view: string) => void
  onAnimationToggle: () => void
}

export default function AvatarViewport({
  currentAvatarUrl,
  isAnimating,
  currentView,
  configuration,
  onViewChange,
  onAnimationToggle
}: AvatarViewportProps) {
  return (
    <div className="flex-1 relative bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Avatar Display */}
      {currentAvatarUrl ? (
        <AvatarViewer3D
          avatarUrl={currentAvatarUrl}
          isAnimating={isAnimating}
          currentView={currentView}
          onViewChange={onViewChange}
          onAnimationToggle={onAnimationToggle}
          configuration={configuration}
        />
      ) : (
        /* Fallback Avatar Display */
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Professional Avatar Placeholder */}
            <div className="relative mb-8">
              <div className="w-80 h-80 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center border-4 border-purple-500/30 backdrop-blur-sm">
                <div className="w-64 h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-inner">
                  <User className="w-32 h-32 text-purple-300" />
                </div>
              </div>
              
              {/* Animated Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
              <div className="absolute inset-4 rounded-full border border-blue-500/20 animate-pulse" />
            </div>
            
            {/* Professional Info Panel */}
            <div className="bg-slate-800/80 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Professional Avatar Studio</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Status</div>
                  <div className="text-lg font-semibold text-green-400">Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Quality</div>
                  <div className="text-lg font-semibold text-blue-400">4K Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Style</div>
                  <div className="text-lg font-semibold text-purple-400">Select Preset</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-slate-300 mb-4">
                  Choose a professional preset to begin customizing your avatar
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>Banking Compliant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>Professional Standards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}