import React from 'react';
import {
  Search,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Grid3x3,
  List,
  Filter
} from 'lucide-react';

interface TimelineControlsProps {
  viewMode: 'timeline' | 'grid' | 'list';
  setViewMode: (mode: 'timeline' | 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  particlesEnabled: boolean;
  setParticlesEnabled: (enabled: boolean) => void;
  onRandomEvent: () => void;
  searchResults?: number;
  selectedEra: string;
  setSelectedEra: (era: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  isPlaying,
  setIsPlaying,
  zoomLevel,
  setZoomLevel,
  audioEnabled,
  setAudioEnabled,
  particlesEnabled,
  setParticlesEnabled,
  onRandomEvent,
  searchResults,
  selectedEra,
  setSelectedEra,
  selectedType,
  setSelectedType
}) => {
  const eras = ['all', 'pioneer', 'growth', 'innovation', 'digital'];
  const types = ['all', 'milestone', 'innovation', 'achievement', 'expansion', 'social-impact'];

  return (
    <div className="timeline-controls bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* View Mode Selector */}
        <div className="flex items-center gap-2" role="group" aria-label="View mode selector">
          <button
            onClick={() => setViewMode('timeline')}
            aria-label="Timeline view"
            aria-pressed={viewMode === 'timeline'}
            className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
              viewMode === 'timeline' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Clock className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
              viewMode === 'grid' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
              viewMode === 'list' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <label htmlFor="timeline-search" className="sr-only">Search timeline events</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            <input
              id="timeline-search"
              type="text"
              placeholder="Search events, years, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-describedby="search-results"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
            <div id="search-results" className="sr-only" aria-live="polite">
              {searchQuery && searchResults !== undefined && `${searchResults} events found for "${searchQuery}"`}
            </div>
          </div>
        </div>

        {/* Playback and View Controls */}
        <div className="flex items-center gap-2" role="group" aria-label="Timeline playback and view controls">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
            className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              aria-label={`Zoom out (current: ${Math.round(zoomLevel * 100)}%)`}
              disabled={zoomLevel <= 0.5}
              className="p-2 rounded hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm font-medium text-gray-700 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
              aria-label={`Zoom in (current: ${Math.round(zoomLevel * 100)}%)`}
              disabled={zoomLevel >= 2}
              className="p-2 rounded hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
            aria-pressed={audioEnabled}
            className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
              audioEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setParticlesEnabled(!particlesEnabled)}
            aria-label={particlesEnabled ? 'Disable particle effects' : 'Enable particle effects'}
            aria-pressed={particlesEnabled}
            className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
              particlesEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </button>
          
          <button
            onClick={onRandomEvent}
            aria-label="Show random event"
            className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all transform hover:scale-105 shadow-md"
            title="Surprise me!"
          >
            <span className="text-lg">🎲</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* Era Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Era:</span>
            <div className="flex gap-1">
              {eras.map(era => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedEra === era
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {era.charAt(0).toUpperCase() + era.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Type:</span>
            <div className="flex flex-wrap gap-1">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedType === type
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineControls;