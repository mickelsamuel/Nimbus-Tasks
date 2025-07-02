'use client'

import { Target, Users, Zap } from 'lucide-react'
import { AvatarConfiguration } from '@/lib/avatarApi'

interface PoseCustomizationProps {
  configuration: AvatarConfiguration
  onConfigurationUpdate: (config: Partial<AvatarConfiguration>) => void
}

const STANDING_POSES = [
  { id: 'confident-stance', name: 'Confident Stance', description: 'Professional and assertive', confidence: 90 },
  { id: 'approachable', name: 'Approachable', description: 'Friendly and welcoming', confidence: 75 },
  { id: 'executive-power', name: 'Executive Power', description: 'Leadership presence', confidence: 95 },
  { id: 'professional-neutral', name: 'Professional Neutral', description: 'Standard business posture', confidence: 80 }
]

const GESTURES = [
  { id: 'professional-handshake', name: 'Professional Handshake', description: 'Business greeting' },
  { id: 'presenting', name: 'Presenting', description: 'Explaining or demonstrating' },
  { id: 'thoughtful', name: 'Thoughtful', description: 'Contemplative gesture' },
  { id: 'welcoming', name: 'Welcoming', description: 'Open and inviting' },
  { id: 'crossed-arms-professional', name: 'Professional Crossed Arms', description: 'Confident but approachable' },
  { id: 'hands-clasped', name: 'Hands Clasped', description: 'Formal and respectful' }
]

const CONFIDENCE_LEVELS = [
  { range: [90, 100], label: 'Very High', color: 'text-green-400', bg: 'bg-green-500/20' },
  { range: [80, 89], label: 'High', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { range: [70, 79], label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { range: [60, 69], label: 'Professional', color: 'text-purple-400', bg: 'bg-purple-500/20' }
]

export default function PoseCustomization({ configuration, onConfigurationUpdate }: PoseCustomizationProps) {
  const updatePose = (poseUpdate: Partial<AvatarConfiguration['pose']>) => {
    onConfigurationUpdate({
      pose: { ...configuration.pose, ...poseUpdate }
    })
  }

  const getConfidenceLabel = (confidence: number) => {
    const level = CONFIDENCE_LEVELS.find(level => 
      confidence >= level.range[0] && confidence <= level.range[1]
    )
    return level || CONFIDENCE_LEVELS[3]
  }

  const currentConfidenceLevel = getConfidenceLabel(configuration.pose.confidence)

  return (
    <div className="space-y-8">
      <div className="text-center border-b border-slate-700/50 pb-6">
        <h3 className="text-xl font-bold text-white mb-2">Pose & Presence</h3>
        <p className="text-slate-400">Professional posture and body language</p>
      </div>

      {/* Standing Poses */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Standing Posture</h4>
        <div className="grid grid-cols-2 gap-4">
          {STANDING_POSES.map((pose) => (
            <button
              key={pose.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                configuration.pose.standing === pose.id
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg scale-105'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
              onClick={() => updatePose({ standing: pose.id, confidence: pose.confidence })}
            >
              <div className="flex items-start space-x-3">
                <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white mb-1">{pose.name}</div>
                  <div className="text-xs text-slate-400 mb-2">{pose.description}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-300">Confidence:</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getConfidenceLabel(pose.confidence).bg} ${getConfidenceLabel(pose.confidence).color}`}>
                      {pose.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Professional Gestures */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Professional Gestures</h4>
        <div className="grid grid-cols-2 gap-3">
          {GESTURES.map((gesture) => (
            <button
              key={gesture.id}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                configuration.pose.gesture === gesture.id
                  ? 'border-blue-500 bg-blue-500/20 shadow-lg scale-105'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
              onClick={() => updatePose({ gesture: gesture.id })}
            >
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">{gesture.name}</div>
                  <div className="text-xs text-slate-400">{gesture.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Confidence Level Adjustment */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Confidence Level</h4>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-300">Current Level:</span>
            <div className={`px-3 py-2 rounded-lg font-semibold ${currentConfidenceLevel.bg} ${currentConfidenceLevel.color}`}>
              {configuration.pose.confidence}% - {currentConfidenceLevel.label}
            </div>
          </div>
          
          <div className="space-y-4">
            <input
              type="range"
              min="60"
              max="100"
              value={configuration.pose.confidence}
              onChange={(e) => updatePose({ confidence: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <div className="flex justify-between text-xs text-slate-400">
              <span>Professional (60%)</span>
              <span>Moderate (70%)</span>
              <span>High (80%)</span>
              <span>Very High (90%)</span>
              <span>Executive (100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Impact */}
      <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-start space-x-3">
          <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-semibold text-purple-300 mb-1">Confidence Impact</h5>
            <p className="text-xs text-purple-200 opacity-80">
              Higher confidence levels project leadership and authority, while moderate levels appear more approachable. 
              Adjust based on your role and professional context.
            </p>
          </div>
        </div>
      </div>

      {/* Banking Standards Notice */}
      <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <Target className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-semibold text-blue-300 mb-1">Professional Body Language</h5>
            <p className="text-xs text-blue-200 opacity-80">
              Banking industry values confident but approachable body language. Avoid overly casual or aggressive poses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}