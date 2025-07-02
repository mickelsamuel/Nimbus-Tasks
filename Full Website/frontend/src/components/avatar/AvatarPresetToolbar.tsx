'use client'

import { Crown, Undo, Redo, Save, Download, Share2, Play, Target, Loader2 } from 'lucide-react'

interface PresetOption {
  id: string
  name: string
  description: string
}

interface HistoryAction {
  id: string
  timestamp: number
  action: string
  data: Record<string, unknown>
}

interface AvatarPresetToolbarProps {
  selectedPreset: string
  onPresetSelect: (presetId: string) => void
  undoStack: HistoryAction[]
  redoStack: HistoryAction[]
  onUndo: () => void
  onRedo: () => void
  saving: boolean
  onSave: () => void
  onExport: () => void
  onShare: () => void
  onShowTimelineEditor: () => void
}

const PRESET_OPTIONS: PresetOption[] = [
  { id: 'executive', name: 'Executive Suite', description: 'Senior leadership appearance' },
  { id: 'banking-professional', name: 'Banking Professional', description: 'Industry standard look' },
  { id: 'creative-professional', name: 'Creative Professional', description: 'Modern business casual' },
  { id: 'leadership-team', name: 'Leadership Team', description: 'Executive team styling' }
]

export default function AvatarPresetToolbar({
  selectedPreset,
  onPresetSelect,
  undoStack,
  redoStack,
  onUndo,
  onRedo,
  saving,
  onSave,
  onExport,
  onShare,
  onShowTimelineEditor
}: AvatarPresetToolbarProps) {
  return (
    <div className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Avatar Presets */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Professional Presets</h3>
            <div className="flex items-center space-x-3">
              {PRESET_OPTIONS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onPresetSelect(preset.id)}
                  className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedPreset === preset.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/50'
                  }`}
                >
                  <Crown className="w-4 h-4 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">{preset.name}</div>
                    <div className="text-xs opacity-80">{preset.description}</div>
                  </div>
                  {selectedPreset === preset.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2 ml-8">
            {/* Undo/Redo Group */}
            <div className="flex items-center space-x-1 bg-slate-800/50 rounded-lg p-1">
              <button 
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  undoStack.length === 0 
                    ? 'text-slate-500 cursor-not-allowed' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                disabled={undoStack.length === 0}
                onClick={onUndo}
              >
                <Undo className="w-4 h-4" />
                <span>Undo</span>
              </button>
              <button 
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  redoStack.length === 0 
                    ? 'text-slate-500 cursor-not-allowed' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                disabled={redoStack.length === 0}
                onClick={onRedo}
              >
                <Redo className="w-4 h-4" />
                <span>Redo</span>
              </button>
            </div>
            
            <div className="w-px h-8 bg-slate-600" />
            
            {/* Main Actions Group */}
            <div className="flex items-center space-x-1">
              <button 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  saving 
                    ? 'bg-green-600/50 text-green-300 cursor-wait' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                }`}
                onClick={onSave}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                onClick={onExport}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                onClick={onShare}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            <div className="w-px h-8 bg-slate-600" />

            {/* Advanced Features */}
            <div className="flex items-center space-x-1">
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                onClick={onShowTimelineEditor}
              >
                <Play className="w-4 h-4" />
                <span>Animations</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all">
                <Target className="w-4 h-4" />
                <span>QA Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}