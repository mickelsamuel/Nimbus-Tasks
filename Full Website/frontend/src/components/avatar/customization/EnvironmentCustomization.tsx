'use client'

import { Camera, Sun, Palette } from 'lucide-react'
import { AvatarConfiguration } from '@/lib/avatarApi'

interface EnvironmentCustomizationProps {
  configuration: AvatarConfiguration
  onConfigurationUpdate: (config: Partial<AvatarConfiguration>) => void
}

const BACKGROUNDS = [
  { id: 'office-premium', name: 'Premium Office', description: 'Executive office setting', preview: '🏢' },
  { id: 'conference-room', name: 'Conference Room', description: 'Professional meeting space', preview: '🏛️' },
  { id: 'bank-lobby', name: 'Bank Lobby', description: 'Banking environment', preview: '🏦' },
  { id: 'studio-neutral', name: 'Studio Neutral', description: 'Clean professional backdrop', preview: '📷' },
  { id: 'city-skyline', name: 'City Skyline', description: 'Urban business district', preview: '🌆' },
  { id: 'boardroom', name: 'Boardroom', description: 'Executive boardroom', preview: '🗣️' }
]

const LIGHTING_SETUPS = [
  { id: 'studio-professional', name: 'Studio Professional', description: 'Balanced professional lighting', warmth: 5500, intensity: 100 },
  { id: 'warm-executive', name: 'Warm Executive', description: 'Warm, welcoming light', warmth: 3200, intensity: 90 },
  { id: 'cool-corporate', name: 'Cool Corporate', description: 'Clean corporate lighting', warmth: 6500, intensity: 95 },
  { id: 'dramatic-leadership', name: 'Dramatic Leadership', description: 'Strong directional lighting', warmth: 4800, intensity: 110 },
  { id: 'soft-approachable', name: 'Soft Approachable', description: 'Gentle, flattering light', warmth: 4200, intensity: 85 },
  { id: 'golden-hour', name: 'Golden Hour', description: 'Natural warm lighting', warmth: 2800, intensity: 80 }
]

const CAMERA_ANGLES = [
  { id: 'front', name: 'Front View', description: 'Direct professional headshot', icon: '👤' },
  { id: 'three-quarter', name: '3/4 View', description: 'Dynamic angled perspective', icon: '📸' },
  { id: 'profile', name: 'Profile View', description: 'Side profile shot', icon: '👨‍💼' },
  { id: 'full-body', name: 'Full Body', description: 'Complete professional view', icon: '🧍' }
]

export default function EnvironmentCustomization({ configuration, onConfigurationUpdate }: EnvironmentCustomizationProps) {
  const updateEnvironment = (environmentUpdate: Partial<AvatarConfiguration['environment']>) => {
    onConfigurationUpdate({
      environment: { ...configuration.environment, ...environmentUpdate }
    })
  }

  const getLightingColor = (warmth: number) => {
    if (warmth < 3500) return 'text-orange-400'
    if (warmth < 5000) return 'text-yellow-400'
    if (warmth < 6000) return 'text-white'
    return 'text-blue-400'
  }

  const getCurrentLighting = () => {
    return LIGHTING_SETUPS.find(setup => setup.id === configuration.environment.lighting) || LIGHTING_SETUPS[0]
  }

  return (
    <div className="space-y-8">
      <div className="text-center border-b border-slate-700/50 pb-6">
        <h3 className="text-xl font-bold text-white mb-2">Studio Environment</h3>
        <p className="text-slate-400">Background, lighting, and camera settings</p>
      </div>

      {/* Background Selection */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Professional Backgrounds</h4>
        <div className="grid grid-cols-2 gap-4">
          {BACKGROUNDS.map((background) => (
            <button
              key={background.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                configuration.environment.background === background.id
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg scale-105'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
              onClick={() => updateEnvironment({ background: background.id })}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{background.preview}</div>
                <div className="text-sm font-semibold text-white mb-1">{background.name}</div>
                <div className="text-xs text-slate-400">{background.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lighting Setup */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Studio Lighting</h4>
        <div className="grid grid-cols-2 gap-4">
          {LIGHTING_SETUPS.map((lighting) => (
            <button
              key={lighting.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                configuration.environment.lighting === lighting.id
                  ? 'border-yellow-500 bg-yellow-500/20 shadow-lg scale-105'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
              onClick={() => updateEnvironment({ lighting: lighting.id })}
            >
              <div className="flex items-start space-x-3">
                <Sun className={`w-6 h-6 flex-shrink-0 mt-1 ${getLightingColor(lighting.warmth)}`} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white mb-1">{lighting.name}</div>
                  <div className="text-xs text-slate-400 mb-2">{lighting.description}</div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-300">Warmth:</span>
                      <span className={getLightingColor(lighting.warmth)}>{lighting.warmth}K</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-300">Intensity:</span>
                      <span className="text-blue-400">{lighting.intensity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Camera Angles */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Camera Angle</h4>
        <div className="grid grid-cols-2 gap-3">
          {CAMERA_ANGLES.map((angle) => (
            <button
              key={angle.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                configuration.environment.camera === angle.id
                  ? 'border-blue-500 bg-blue-500/20 shadow-lg scale-105'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
              onClick={() => updateEnvironment({ camera: angle.id })}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{angle.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{angle.name}</div>
                <div className="text-xs text-slate-400">{angle.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Lighting Preview */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-5 h-5 text-purple-400" />
          <h5 className="text-lg font-semibold text-white">Current Lighting Setup</h5>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Temperature</div>
            <div className={`text-lg font-bold ${getLightingColor(getCurrentLighting().warmth)}`}>
              {getCurrentLighting().warmth}K
            </div>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Intensity</div>
            <div className="text-lg font-bold text-blue-400">
              {getCurrentLighting().intensity}%
            </div>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Style</div>
            <div className="text-sm font-semibold text-white">
              {getCurrentLighting().name}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Standards */}
      <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <Camera className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-semibold text-blue-300 mb-1">Professional Photography Standards</h5>
            <p className="text-xs text-blue-200 opacity-80">
              Banking industry prefers clean, professional backgrounds with balanced lighting. 
              Avoid overly dramatic or casual settings for formal business use.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}