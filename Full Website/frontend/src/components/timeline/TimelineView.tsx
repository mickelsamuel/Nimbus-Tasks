import React, { useRef, useEffect, useState } from 'react';
import { TimelineEvent } from '@/types';
import TimelineEventCard from './TimelineEventCard';

interface TimelineViewProps {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
  setSelectedEvent: (event: TimelineEvent | null) => void;
  currentEventIndex: number;
  zoomLevel: number;
  startYear?: number;
  endYear?: number;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  selectedEvent,
  setSelectedEvent,
  currentEventIndex,
  zoomLevel,
  startYear = 1859,
  endYear = 2024
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const yearRange = endYear - startYear;
  const timelineWidth = 3000 * zoomLevel; // Base width scaled by zoom

  // Scroll to current event when it changes
  useEffect(() => {
    if (currentEventIndex >= 0 && currentEventIndex < events.length) {
      const element = document.getElementById(`timeline-event-${events[currentEventIndex].id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [currentEventIndex, events]);

  // Handle magnetic scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        
        // Find closest event to center
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        
        let closestEvent: HTMLElement | null = null;
        let minDistance = Infinity;
        
        events.forEach(event => {
          const element = document.getElementById(`timeline-event-${event.id}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(elementCenterX - centerX);
            
            if (distance < minDistance) {
              minDistance = distance;
              closestEvent = element;
            }
          }
        });
        
        // Snap to closest event if within threshold
        if (closestEvent && minDistance < 100) {
          (closestEvent as HTMLElement).scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center', 
            inline: 'center' 
          });
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [events]);

  return (
    <div className="timeline-view-container relative">
      {/* Timeline Container */}
      <div className="timeline-wrapper px-6 pb-12">
        <div className="max-w-full mx-auto">
          <div
            ref={scrollContainerRef}
            className="timeline-scroll-container overflow-x-auto overflow-y-hidden pb-4"
            style={{ 
              cursor: isScrolling ? 'grabbing' : 'grab'
            }}
          >
            <div 
              className="timeline-track relative"
              style={{ 
                width: `${timelineWidth}px`, 
                height: '600px',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'left center'
              }}
            >
              {/* Timeline Rail */}
              <div className="timeline-rail absolute top-1/2 left-0 right-0 h-2 transform -translate-y-1/2">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" 
                     style={{
                       backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(224,26,26,0.2) 50px, transparent 52px, transparent 100px)'
                     }} 
                />
              </div>

              {/* Year Markers */}
              {Array.from({ length: Math.floor((endYear - startYear) / 10) + 1 }, (_, i) => {
                const year = startYear + (i * 10);
                const position = ((year - startYear) / yearRange) * 100;
                
                return (
                  <div
                    key={year}
                    className="absolute top-1/2 transform -translate-y-1/2"
                    style={{ left: `${position}%` }}
                  >
                    <div className="relative">
                      <div className="w-1 h-8 bg-gray-400 transform -translate-x-1/2" />
                      <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium whitespace-nowrap">
                        {year}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Events */}
              {events.map((event, index) => {
                const position = ((event.year - startYear) / yearRange) * 100;
                const offset = index % 2 === 0 ? -280 : 280;
                const isCurrentEvent = index === currentEventIndex;

                return (
                  <div
                    key={event.id}
                    id={`timeline-event-${event.id}`}
                    className="absolute transition-all duration-300"
                    style={{
                      left: `${position}%`,
                      top: '50%',
                      transform: `translate(-50%, ${offset}px) ${isCurrentEvent ? 'scale(1.05)' : ''}`
                    }}
                  >
                    {/* Connection Line */}
                    <div
                      className={`absolute w-0.5 ${
                        isCurrentEvent ? 'bg-red-500' : 'bg-gray-300'
                      } transition-colors duration-300`}
                      style={{
                        height: `${Math.abs(offset) - 20}px`,
                        left: '50%',
                        top: offset > 0 ? `-${Math.abs(offset) - 20}px` : 'calc(100% + 20px)',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {/* Connection dot */}
                      <div 
                        className={`absolute w-3 h-3 rounded-full ${
                          isCurrentEvent ? 'bg-red-500' : 'bg-gray-400'
                        } transition-colors duration-300`}
                        style={{
                          left: '50%',
                          [offset > 0 ? 'bottom' : 'top']: '-6px',
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </div>

                    {/* Event Card */}
                    <TimelineEventCard
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                      isSelected={selectedEvent?.id === event.id}
                      viewMode="timeline"
                    />

                    {/* Year Marker on Rail */}
                    <div
                      className={`absolute w-4 h-4 rounded-full transition-all duration-300 ${
                        isCurrentEvent 
                          ? 'w-6 h-6 bg-red-600 shadow-lg' 
                          : 'bg-gray-500 hover:bg-red-500'
                      }`}
                      style={{
                        left: '50%',
                        bottom: offset > 0 ? `${Math.abs(offset) - 20}px` : 'auto',
                        top: offset < 0 ? `${Math.abs(offset) - 20}px` : 'auto',
                        transform: 'translate(-50%, 50%)'
                      }}
                    >
                      {isCurrentEvent && (
                        <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-30" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Era Backgrounds */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  { era: 'pioneer', start: 1859, end: 1900, color: 'from-amber-50/30 to-amber-100/30' },
                  { era: 'growth', start: 1900, end: 1950, color: 'from-blue-50/30 to-blue-100/30' },
                  { era: 'innovation', start: 1950, end: 2000, color: 'from-green-50/30 to-green-100/30' },
                  { era: 'digital', start: 2000, end: 2024, color: 'from-orange-50/30 to-orange-100/30' }
                ].map(({ era, start, end, color }) => {
                  const left = ((start - startYear) / yearRange) * 100;
                  const width = ((end - start) / yearRange) * 100;
                  
                  return (
                    <div
                      key={era}
                      className={`absolute top-0 bottom-0 bg-gradient-to-b ${color}`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicators */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg animate-pulse">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg animate-pulse">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;