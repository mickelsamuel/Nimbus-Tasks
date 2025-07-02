'use client'

import { AvatarConfiguration } from '@/lib/avatarApi'

interface FaceCustomizationProps {
  configuration: AvatarConfiguration
  onConfigurationUpdate: (config: Partial<AvatarConfiguration>) => void
}

const FACE_SHAPES = [
  { id: 'professional', name: 'Professional', icon: '👔' },
  { id: 'executive', name: 'Executive', icon: '💼' },
  { id: 'confident', name: 'Confident', icon: '😊' },
  { id: 'approachable', name: 'Approachable', icon: '😌' }
]

const SKIN_TONES = [
  { id: 'light', color: '#F4C2A1', name: 'Light' },
  { id: 'medium-light', color: '#E8B888', name: 'Medium Light' },
  { id: 'medium', color: '#D4A574', name: 'Medium' },
  { id: 'medium-dark', color: '#B8936E', name: 'Medium Dark' },
  { id: 'dark', color: '#8B6F47', name: 'Dark' },
  { id: 'deep', color: '#6B5B45', name: 'Deep' }
]

const EYE_EXPRESSIONS = [
  { id: 'confident', name: 'Confident', preview: '👁️' },
  { id: 'friendly', name: 'Friendly', preview: '😊' },
  { id: 'focused', name: 'Focused', preview: '🧐' },
  { id: 'approachable', name: 'Approachable', preview: '😌' }
]

export default function FaceCustomization({ configuration, onConfigurationUpdate }: FaceCustomizationProps) {
  const updateFace = (faceUpdate: Partial<AvatarConfiguration['face']>) => {
    onConfigurationUpdate({
      face: { ...configuration.face, ...faceUpdate }
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center border-b border-slate-700/50 pb-6">
        <h3 className="text-xl font-bold text-white mb-2">Facial Features</h3>
        <p className="text-slate-400">Professional appearance customization</p>
      </div>

      {/* Face Shape Selection */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Face Shape</h4>
        <div className="grid grid-cols-2 gap-3">
          {FACE_SHAPES.map((shape) => (
            <button
              key={shape.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                configuration.face.shape === shape.id
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg scale-105'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
              onClick={() => updateFace({ shape: shape.id })}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{shape.icon}</div>
                <span className="text-sm font-medium text-white">{shape.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Skin Tone Selection */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Skin Tone</h4>
        <div className="grid grid-cols-3 gap-3">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.id}
              className={`relative aspect-square rounded-xl border-4 transition-all duration-200 hover:scale-110 ${
                configuration.face.skinTone === tone.id
                  ? 'border-white shadow-lg'
                  : 'border-slate-600 hover:border-slate-400'
              }`}
              style={{ backgroundColor: tone.color }}
              title={tone.name}
              onClick={() => updateFace({ skinTone: tone.id })}
            >
              {configuration.face.skinTone === tone.id && (
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

      {/* Eyes & Expression */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Eyes & Expression</h4>
        <div className="grid grid-cols-2 gap-3">
          {EYE_EXPRESSIONS.map((eye) => (
            <button
              key={eye.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                configuration.face.eyes === eye.id
                  ? 'border-blue-500 bg-blue-500/20 shadow-lg scale-105'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
              onClick={() => updateFace({ eyes: eye.id })}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{eye.preview}</div>
                <span className="text-sm font-medium text-white">{eye.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Eye Color */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Eye Color</h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'brown', color: '#8B4513', name: 'Brown' },
            { id: 'blue', color: '#4169E1', name: 'Blue' },
            { id: 'green', color: '#228B22', name: 'Green' },
            { id: 'hazel', color: '#DAA520', name: 'Hazel' },
            { id: 'gray', color: '#708090', name: 'Gray' },
            { id: 'amber', color: '#FFBF00', name: 'Amber' }
          ].map((color) => (
            <button
              key={color.id}
              className={`aspect-square rounded-full border-4 transition-all duration-200 hover:scale-110 ${
                configuration.face.eyeColor === color.id
                  ? 'border-white shadow-lg'
                  : 'border-slate-600 hover:border-slate-400'
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
              onClick={() => updateFace({ eyeColor: color.id })}
            >
              {configuration.face.eyeColor === color.id && (
                <div className="w-3 h-3 bg-white rounded-full mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}