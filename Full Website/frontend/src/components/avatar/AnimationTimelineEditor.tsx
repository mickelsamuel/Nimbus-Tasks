'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Play, Pause, SkipBack, SkipForward, 
  Clock, Layers, Eye, Download, Plus,
  Trash2
} from 'lucide-react'

interface AnimationKeyframe {
  id: string
  time: number // in seconds
  type: 'pose' | 'expression' | 'gesture' | 'movement'
  properties: {
    pose?: string
    expression?: string
    position?: { x: number; y: number; z: number }
    rotation?: { x: number; y: number; z: number }
    scale?: { x: number; y: number; z: number }
  }
  duration: number
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

interface PresetKeyframe {
  time: number
  type: 'pose' | 'expression' | 'gesture' | 'movement'
  properties: {
    pose?: string
    expression?: string
    position?: { x: number; y: number; z: number }
    rotation?: { x: number; y: number; z: number }
    scale?: { x: number; y: number; z: number }
  }
}

interface AnimationLayer {
  id: string
  name: string
  type: 'body' | 'face' | 'hands' | 'accessories'
  visible: boolean
  locked: boolean
  keyframes: AnimationKeyframe[]
  color: string
}

interface AnimationTimelineEditorProps {
  isOpen: boolean
  onClose: () => void
  onExport: (animation: AnimationLayer[]) => void
}

export default function AnimationTimelineEditor({ 
  isOpen, 
  onClose, 
  onExport 
}: AnimationTimelineEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(10) // 10 seconds
  const [selectedKeyframes, setSelectedKeyframes] = useState<string[]>([])
  const [layers, setLayers] = useState<AnimationLayer[]>([])
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const playbackRef = useRef<number | null>(null)

  // Professional animation presets for banking
  const animationPresets: { id: string; name: string; description: string; duration: number; keyframes: PresetKeyframe[] }[] = [
    {
      id: 'professional-greeting',
      name: 'Professional Greeting',
      description: 'Standard banking greeting gesture',
      duration: 3,
      keyframes: [
        { time: 0, type: 'pose' as const, properties: { pose: 'neutral-standing' } },
        { time: 0.5, type: 'expression' as const, properties: { expression: 'friendly-smile' } },
        { time: 1, type: 'gesture' as const, properties: { pose: 'greeting-wave' } },
        { time: 2.5, type: 'pose' as const, properties: { pose: 'neutral-standing' } }
      ]
    },
    {
      id: 'confident-presentation',
      name: 'Confident Presentation',
      description: 'Executive presentation stance',
      duration: 5,
      keyframes: [
        { time: 0, type: 'pose' as const, properties: { pose: 'confident-stance' } },
        { time: 1, type: 'gesture' as const, properties: { pose: 'presentation-gesture' } },
        { time: 3, type: 'expression' as const, properties: { expression: 'confident-speaking' } },
        { time: 4.5, type: 'pose' as const, properties: { pose: 'confident-stance' } }
      ]
    },
    {
      id: 'thoughtful-listening',
      name: 'Thoughtful Listening',
      description: 'Active listening posture',
      duration: 4,
      keyframes: [
        { time: 0, type: 'pose' as const, properties: { pose: 'attentive-stance' } },
        { time: 1, type: 'expression' as const, properties: { expression: 'thoughtful' } },
        { time: 2, type: 'gesture' as const, properties: { pose: 'nodding' } },
        { time: 3.5, type: 'pose' as const, properties: { pose: 'attentive-stance' } }
      ]
    }
  ]

  // Initialize layers
  useEffect(() => {
    const defaultLayers: AnimationLayer[] = [
      {
        id: 'body-layer',
        name: 'Body & Pose',
        type: 'body' as const,
        visible: true,
        locked: false,
        keyframes: [],
        color: '#3b82f6'
      },
      {
        id: 'face-layer',
        name: 'Facial Expression',
        type: 'face' as const,
        visible: true,
        locked: false,
        keyframes: [],
        color: '#10b981'
      },
      {
        id: 'hands-layer',
        name: 'Hand Gestures',
        type: 'hands' as const,
        visible: true,
        locked: false,
        keyframes: [],
        color: '#f59e0b'
      },
      {
        id: 'accessories-layer',
        name: 'Accessories',
        type: 'accessories' as const,
        visible: true,
        locked: false,
        keyframes: [],
        color: '#8b5cf6'
      }
    ]
    setLayers(defaultLayers)
    setSelectedLayer(defaultLayers[0].id)
  }, [])

  // Playback control
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - (currentTime * 1000)
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000
        
        if (elapsed >= totalDuration) {
          setCurrentTime(0)
          setIsPlaying(false)
        } else {
          setCurrentTime(elapsed)
          playbackRef.current = requestAnimationFrame(animate)
        }
      }
      
      playbackRef.current = requestAnimationFrame(animate)
    } else if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current)
    }

    return () => {
      if (playbackRef.current) {
        cancelAnimationFrame(playbackRef.current)
      }
    }
  }, [isPlaying, totalDuration, currentTime])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // Function to handle time changes if needed in future
  // const handleTimeChange = (time: number) => {
  //   setCurrentTime(time)
  // }

  const handleAddKeyframe = () => {
    if (!selectedLayer) return

    const newKeyframe: AnimationKeyframe = {
      id: `keyframe-${Date.now()}`,
      time: currentTime,
      type: 'pose' as const,
      properties: { pose: 'neutral-standing' },
      duration: 1,
      easing: 'ease-in-out'
    }

    setLayers(prev => prev.map(layer => 
      layer.id === selectedLayer 
        ? { ...layer, keyframes: [...layer.keyframes, newKeyframe].sort((a, b) => a.time - b.time) }
        : layer
    ))
  }

  const handleDeleteKeyframe = () => {
    setLayers(prev => prev.map(layer => ({
      ...layer,
      keyframes: layer.keyframes.filter(kf => !selectedKeyframes.includes(kf.id))
    })))
    setSelectedKeyframes([])
  }

  const handleLoadPreset = (preset: { id: string; name: string; description: string; duration: number; keyframes: PresetKeyframe[] }) => {
    const bodyLayer = layers.find(l => l.type === 'body')
    if (!bodyLayer) return

    const presetKeyframes: AnimationKeyframe[] = preset.keyframes.map((kf: PresetKeyframe, index: number) => ({
      id: `preset-${preset.id}-${index}`,
      time: kf.time,
      type: kf.type,
      properties: kf.properties,
      duration: 0.5,
      easing: 'ease-in-out' as const
    }))

    setLayers(prev => prev.map(layer => 
      layer.id === bodyLayer.id 
        ? { ...layer, keyframes: presetKeyframes }
        : layer
    ))

    setTotalDuration(preset.duration)
  }

  const handleExportAnimation = () => {
    onExport(layers)
  }

  if (!isOpen) return null

  return (
    <div className="timeline-editor-overlay">
      <div className="timeline-editor">
        {/* Header */}
        <div className="timeline-header">
          <div className="timeline-title">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Professional Animation Timeline</span>
          </div>
          
          <div className="timeline-actions">
            <button 
              onClick={handleExportAnimation}
              className="export-btn"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={onClose}
              className="close-btn"
            >
              ×
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="timeline-controls">
          <div className="playback-controls">
            <button 
              onClick={handleStop}
              className="control-btn"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button 
              onClick={handlePlay}
              className="control-btn play-btn"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleStop}
              className="control-btn"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="time-display">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{currentTime.toFixed(2)}s / {totalDuration}s</span>
          </div>

          <div className="keyframe-controls">
            <button 
              onClick={handleAddKeyframe}
              className="keyframe-btn"
              disabled={!selectedLayer}
            >
              <Plus className="w-4 h-4" />
              Add Keyframe
            </button>
            <button 
              onClick={handleDeleteKeyframe}
              className="keyframe-btn delete"
              disabled={selectedKeyframes.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Timeline Area */}
        <div className="timeline-area">
          {/* Layers Panel */}
          <div className="layers-panel">
            <div className="layers-header">
              <h4>Animation Layers</h4>
            </div>
            
            {layers.map((layer) => (
              <div 
                key={layer.id}
                className={`layer-item ${selectedLayer === layer.id ? 'selected' : ''}`}
                onClick={() => setSelectedLayer(layer.id)}
              >
                <div className="layer-color" style={{ backgroundColor: layer.color }}></div>
                <div className="layer-info">
                  <span className="layer-name">{layer.name}</span>
                  <span className="layer-keyframes">{layer.keyframes.length} keyframes</span>
                </div>
                <div className="layer-controls">
                  <button 
                    className={`layer-toggle ${layer.visible ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setLayers(prev => prev.map(l => 
                        l.id === layer.id ? { ...l, visible: !l.visible } : l
                      ))
                    }}
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Grid */}
          <div className="timeline-grid" ref={timelineRef}>
            {/* Time Ruler */}
            <div className="time-ruler">
              {Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => (
                <div key={i} className="time-mark">
                  <span>{i}s</span>
                </div>
              ))}
            </div>

            {/* Playhead */}
            <div 
              className="playhead"
              style={{ 
                left: `${(currentTime / totalDuration) * 100}%` 
              }}
            >
              <div className="playhead-line"></div>
              <div className="playhead-handle"></div>
            </div>

            {/* Layer Tracks */}
            {layers.map((layer) => (
              <div key={layer.id} className="track">
                {layer.keyframes.map((keyframe) => (
                  <div
                    key={keyframe.id}
                    className={`keyframe ${selectedKeyframes.includes(keyframe.id) ? 'selected' : ''}`}
                    style={{
                      left: `${(keyframe.time / totalDuration) * 100}%`,
                      backgroundColor: layer.color
                    }}
                    onClick={() => {
                      setSelectedKeyframes(prev => 
                        prev.includes(keyframe.id) 
                          ? prev.filter(id => id !== keyframe.id)
                          : [...prev, keyframe.id]
                      )
                    }}
                  >
                    <div className="keyframe-tooltip">
                      {keyframe.type} - {keyframe.time}s
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Animation Presets */}
        <div className="presets-panel">
          <h4>Professional Animation Presets</h4>
          <div className="presets-grid">
            {animationPresets.map((preset) => (
              <div key={preset.id} className="preset-card">
                <div className="preset-info">
                  <h5>{preset.name}</h5>
                  <p>{preset.description}</p>
                  <span className="preset-duration">{preset.duration}s</span>
                </div>
                <button 
                  onClick={() => handleLoadPreset(preset)}
                  className="preset-load-btn"
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Styles */}
        <style jsx>{`
          .timeline-editor-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .timeline-editor {
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
            border: 2px solid rgba(99, 102, 241, 0.3);
            border-radius: 20px;
            width: 95%;
            max-width: 1400px;
            height: 90%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .timeline-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
          }

          .timeline-title {
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            font-size: 1.2rem;
            font-weight: 700;
          }

          .timeline-actions {
            display: flex;
            gap: 10px;
          }

          .export-btn,
          .close-btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
          }

          .export-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .export-btn:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
          }

          .close-btn {
            background: rgba(239, 68, 68, 0.2);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.4);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
          }

          .timeline-controls {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
          }

          .playback-controls {
            display: flex;
            gap: 8px;
          }

          .control-btn {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .control-btn:hover {
            background: rgba(99, 102, 241, 0.2);
          }

          .control-btn.play-btn {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          }

          .time-display {
            display: flex;
            align-items: center;
            gap: 8px;
            color: rgba(255, 255, 255, 0.8);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
          }

          .keyframe-controls {
            display: flex;
            gap: 8px;
            margin-left: auto;
          }

          .keyframe-btn {
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.8rem;
            transition: all 0.2s ease;
          }

          .keyframe-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2);
          }

          .keyframe-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .keyframe-btn.delete {
            border-color: rgba(239, 68, 68, 0.4);
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
          }

          .timeline-area {
            flex: 1;
            display: flex;
            overflow: hidden;
          }

          .layers-panel {
            width: 250px;
            background: rgba(0, 0, 0, 0.4);
            border-right: 1px solid rgba(99, 102, 241, 0.2);
            overflow-y: auto;
          }

          .layers-header {
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .layers-header h4 {
            color: white;
            font-size: 1rem;
            margin: 0;
          }

          .layer-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .layer-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .layer-item.selected {
            background: rgba(99, 102, 241, 0.2);
            border-left: 3px solid #6366f1;
          }

          .layer-color {
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }

          .layer-info {
            flex: 1;
          }

          .layer-name {
            color: white;
            font-size: 0.9rem;
            font-weight: 600;
            display: block;
          }

          .layer-keyframes {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.7rem;
          }

          .layer-controls {
            display: flex;
            gap: 4px;
          }

          .layer-toggle {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .layer-toggle.active {
            background: rgba(59, 130, 246, 0.3);
            color: #3b82f6;
          }

          .timeline-grid {
            flex: 1;
            position: relative;
            background: 
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 100px,
                rgba(255, 255, 255, 0.05) 100px,
                rgba(255, 255, 255, 0.05) 101px
              );
            overflow: auto;
          }

          .time-ruler {
            height: 40px;
            display: flex;
            background: rgba(0, 0, 0, 0.5);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .time-mark {
            min-width: 100px;
            padding: 10px;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
          }

          .time-mark span {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.8rem;
            font-family: 'JetBrains Mono', monospace;
          }

          .playhead {
            position: absolute;
            top: 0;
            bottom: 0;
            z-index: 20;
            pointer-events: none;
          }

          .playhead-line {
            width: 2px;
            height: 100%;
            background: #ef4444;
            margin-left: -1px;
          }

          .playhead-handle {
            width: 12px;
            height: 12px;
            background: #ef4444;
            border-radius: 50%;
            position: absolute;
            top: 40px;
            left: -6px;
            pointer-events: auto;
            cursor: grab;
          }

          .track {
            height: 60px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
          }

          .keyframe {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            border: 2px solid rgba(255, 255, 255, 0.8);
            transition: all 0.2s ease;
          }

          .keyframe:hover {
            transform: translateY(-50%) scale(1.5);
          }

          .keyframe.selected {
            border-color: #fbbf24;
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
          }

          .keyframe-tooltip {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
          }

          .keyframe:hover .keyframe-tooltip {
            opacity: 1;
          }

          .presets-panel {
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            border-top: 1px solid rgba(99, 102, 241, 0.2);
            max-height: 200px;
            overflow-y: auto;
          }

          .presets-panel h4 {
            color: white;
            margin: 0 0 15px 0;
            font-size: 1rem;
          }

          .presets-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
          }

          .preset-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .preset-info h5 {
            color: white;
            margin: 0 0 5px 0;
            font-size: 0.9rem;
          }

          .preset-info p {
            color: rgba(255, 255, 255, 0.7);
            margin: 0 0 5px 0;
            font-size: 0.8rem;
          }

          .preset-duration {
            color: #3b82f6;
            font-size: 0.7rem;
            font-weight: 600;
          }

          .preset-load-btn {
            padding: 6px 12px;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            transition: all 0.2s ease;
          }

          .preset-load-btn:hover {
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          }
        `}</style>
      </div>
    </div>
  )
}