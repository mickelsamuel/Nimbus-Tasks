'use client'

import { Crown, Shield, Lock } from 'lucide-react'
import { AvatarConfiguration } from '@/lib/avatarApi'

interface HairCustomizationProps {
  configuration: AvatarConfiguration
  onConfigurationUpdate: (config: Partial<AvatarConfiguration>) => void
}

const HAIR_STYLES = [
  { id: 'executive-cut', name: 'Executive Cut', professional: true, locked: false, rarity: 'common' },
  { id: 'business-casual', name: 'Business Casual', professional: true, locked: false, rarity: 'common' },
  { id: 'classic-professional', name: 'Classic Professional', professional: true, locked: true, rarity: 'rare' },
  { id: 'modern-executive', name: 'Modern Executive', professional: true, locked: true, rarity: 'epic' },
  { id: 'senior-leadership', name: 'Senior Leadership', professional: true, locked: true, rarity: 'legendary' },
  { id: 'creative-professional', name: 'Creative Professional', professional: true, locked: false, rarity: 'uncommon' }
]

const HAIR_COLORS = [
  { id: 'black', color: '#2C2C2C', name: 'Black' },
  { id: 'dark-brown', color: '#4A3C28', name: 'Dark Brown' },
  { id: 'brown', color: '#6B4423', name: 'Brown' },
  { id: 'light-brown', color: '#8B6F47', name: 'Light Brown' },
  { id: 'blonde', color: '#D4B86A', name: 'Blonde' },
  { id: 'gray', color: '#7C7C7C', name: 'Gray' },
  { id: 'silver', color: '#B8B8B8', name: 'Silver' }
]

const FACIAL_HAIR_OPTIONS = [
  { id: 'clean-shaven', name: 'Clean Shaven', preview: '🧔‍♂️' },
  { id: 'light-stubble', name: 'Light Stubble', preview: '🧔' },
  { id: 'professional-beard', name: 'Professional Beard', preview: '👨‍💼' },
  { id: 'mustache', name: 'Mustache', preview: '👨' }
]

export default function HairCustomization({ configuration, onConfigurationUpdate }: HairCustomizationProps) {
  const updateHair = (hairUpdate: Partial<AvatarConfiguration['hair']>) => {
    onConfigurationUpdate({
      hair: { ...configuration.hair, ...hairUpdate }
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10'
      case 'epic': return 'border-purple-500 bg-purple-500/10'
      case 'rare': return 'border-blue-500 bg-blue-500/10'
      case 'uncommon': return 'border-green-500 bg-green-500/10'
      default: return 'border-slate-600 bg-slate-800/50'
    }
  }

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500 text-yellow-900'
      case 'epic': return 'bg-purple-500 text-white'
      case 'rare': return 'bg-blue-500 text-white'
      case 'uncommon': return 'bg-green-500 text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center border-b border-slate-700/50 pb-6">
        <h3 className="text-xl font-bold text-white mb-2">Hair & Style</h3>
        <p className="text-slate-400">Professional hairstyles and grooming</p>
      </div>

      {/* Professional Hairstyles */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Professional Styles</h4>
        <div className="grid grid-cols-2 gap-4">
          {HAIR_STYLES.map((style) => (
            <button
              key={style.id}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                configuration.hair.style === style.id
                  ? `${getRarityColor(style.rarity)} shadow-lg scale-105`
                  : `${getRarityColor(style.rarity)} hover:scale-102 opacity-80 hover:opacity-100`
              } ${style.locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !style.locked && updateHair({ style: style.id })}
              disabled={style.locked}
            >
              <div className="text-center">
                <div className="relative mb-3">
                  <Crown className="w-8 h-8 text-purple-400 mx-auto" />
                  {style.locked && (
                    <div className="absolute -top-1 -right-1">
                      <Lock className="w-4 h-4 text-yellow-400" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-white mb-1">{style.name}</div>
                
                {/* Rarity and Professional Badges */}
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {style.professional && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold border border-green-500/30">
                      PRO
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getRarityBadgeColor(style.rarity)}`}>
                    {style.rarity.toUpperCase()}
                  </span>
                </div>
                
                {style.locked && (
                  <div className="mt-2 text-xs text-yellow-400 font-medium">
                    🔒 Unlock Required
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hair Color Options */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Hair Color</h4>
        <div className="grid grid-cols-4 gap-3">
          {HAIR_COLORS.map((color) => (
            <button
              key={color.id}
              className={`relative aspect-square rounded-xl border-4 transition-all duration-200 hover:scale-110 ${
                configuration.hair.color === color.id
                  ? 'border-white shadow-lg'
                  : 'border-slate-600 hover:border-slate-400'
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
              onClick={() => updateHair({ color: color.id })}
            >
              {configuration.hair.color === color.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-800">✓</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Facial Hair */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Facial Hair</h4>
        <div className="grid grid-cols-2 gap-3">
          {FACIAL_HAIR_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                configuration.hair.facial === option.id
                  ? 'border-orange-500 bg-orange-500/20 shadow-lg scale-105'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
              onClick={() => updateHair({ facial: option.id })}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{option.preview}</div>
                <span className="text-sm font-medium text-white">{option.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Professional Grooming Tips */}
      <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-semibold text-blue-300 mb-1">Professional Grooming Standards</h5>
            <p className="text-xs text-blue-200 opacity-80">
              Banking industry requires well-groomed, conservative hairstyles. Extreme colors or styles may not meet compliance standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}