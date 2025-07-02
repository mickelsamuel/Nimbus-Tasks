import React, { useMemo } from 'react';
import { TimelineEvent } from '@/types';

interface TimelineMinimapProps {
  events: TimelineEvent[];
  currentEventIndex: number;
  onEventClick: (index: number) => void;
  startYear?: number;
  endYear?: number;
}

const TimelineMinimap: React.FC<TimelineMinimapProps> = ({ 
  events, 
  currentEventIndex, 
  onEventClick,
  startYear = 1859,
  endYear = 2024
}) => {
  const yearRange = endYear - startYear;

  // Era definitions with colors
  const eras = useMemo(() => [
    { name: 'Pioneer', start: 1859, end: 1900, color: '#D97706' },
    { name: 'Growth', start: 1900, end: 1950, color: '#3B82F6' },
    { name: 'Innovation', start: 1950, end: 2000, color: '#10B981' },
    { name: 'Digital', start: 2000, end: 2024, color: '#F59E0B' }
  ], []);

  // Calculate position for each event
  const eventPositions = useMemo(() => {
    return events.map(event => ({
      ...event,
      position: ((event.year - startYear) / yearRange) * 100
    }));
  }, [events, startYear, yearRange]);

  return (
    <div className="timeline-minimap-container space-y-4">
      {/* Timeline Scrubber */}
      <div className="timeline-scrubber bg-white/95 backdrop-blur-xl rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 min-w-[3rem]">{startYear}</span>
          
          <div className="flex-1 relative h-10">
            {/* Era Background */}
            <div className="absolute inset-0 flex rounded-lg overflow-hidden">
              {eras.map((era) => {
                const width = ((era.end - era.start) / yearRange) * 100;
                const left = ((era.start - startYear) / yearRange) * 100;
                return (
                  <div
                    key={era.name}
                    className="h-full opacity-20"
                    style={{
                      width: `${width}%`,
                      backgroundColor: era.color,
                      position: 'absolute',
                      left: `${left}%`
                    }}
                  />
                );
              })}
            </div>

            {/* Progress Track */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg opacity-30" />
            
            {/* Current Position Indicator */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-red-600 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all z-20"
              style={{ 
                left: `${eventPositions[currentEventIndex]?.position || 0}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={`Current: ${events[currentEventIndex]?.title}`}
            >
              <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-30" />
            </div>
            
            {/* Era Markers */}
            {eras.map((era) => {
              const position = ((era.start - startYear) / yearRange) * 100;
              return (
                <div
                  key={era.name}
                  className="absolute top-0 bottom-0 w-0.5 opacity-40"
                  style={{ 
                    left: `${position}%`, 
                    backgroundColor: era.color 
                  }}
                />
              );
            })}

            {/* Event Dots */}
            {eventPositions.map((event, index) => (
              <button
                key={event.id}
                onClick={() => onEventClick(index)}
                className={`absolute top-1/2 transform -translate-y-1/2 rounded-full hover:scale-150 transition-all z-10 ${
                  index === currentEventIndex 
                    ? 'w-4 h-4 bg-red-500' 
                    : 'w-2 h-2 bg-gray-600 hover:bg-red-400'
                }`}
                style={{ 
                  left: `${event.position}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={`${event.year}: ${event.title}`}
                aria-label={`Navigate to ${event.title} (${event.year})`}
              />
            ))}
          </div>
          
          <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-right">{endYear}</span>
        </div>
        
        {/* Era Labels */}
        <div className="flex justify-between mt-3 text-xs">
          {eras.map((era) => (
            <button
              key={era.name}
              onClick={() => {
                const eraEvents = events.filter(e => 
                  e.year >= era.start && e.year <= era.end
                );
                if (eraEvents.length > 0) {
                  const firstEventIndex = events.indexOf(eraEvents[0]);
                  onEventClick(firstEventIndex);
                }
              }}
              className="text-gray-600 hover:text-red-600 transition-colors font-medium"
              style={{ color: era.color }}
            >
              {era.name} Era
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Minimap */}
      <div className="timeline-minimap bg-white/95 backdrop-blur-xl rounded-xl p-4 shadow-lg">
        <div className="relative h-16">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-green-100 to-blue-100 rounded-lg opacity-30" />
          
          {/* Event markers with preview */}
          {eventPositions.map((event, index) => {
            const isCurrentEvent = index === currentEventIndex;
            return (
              <button
                key={event.id}
                onClick={() => onEventClick(index)}
                className={`absolute top-1/2 transform -translate-y-1/2 rounded-full transition-all group ${
                  isCurrentEvent
                    ? 'w-4 h-4 bg-red-500 z-20'
                    : 'w-3 h-3 bg-gray-500 hover:bg-red-400 hover:scale-150 z-10'
                }`}
                style={{ 
                  left: `${event.position}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Pulse effect for current event */}
                {isCurrentEvent && (
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50" />
                )}
                
                {/* Preview tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                  <div className="bg-gray-900 text-white rounded-lg p-3 text-xs whitespace-nowrap shadow-xl">
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-gray-300">{event.year}</div>
                    <div className="text-gray-400 max-w-[200px] truncate">{event.description}</div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                </div>
              </button>
            );
          })}

          {/* Year markers */}
          {[1900, 1950, 2000].map(year => {
            const position = ((year - startYear) / yearRange) * 100;
            return (
              <div
                key={year}
                className="absolute top-0 bottom-0 flex items-center"
                style={{ left: `${position}%` }}
              >
                <div className="w-px h-full bg-gray-400 opacity-50" />
                <span className="absolute -top-5 transform -translate-x-1/2 text-xs text-gray-500">
                  {year}
                </span>
              </div>
            );
          })}
        </div>

        {/* Event density visualization */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
          <span>Event Density:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span>Low</span>
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span>Medium</span>
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineMinimap;