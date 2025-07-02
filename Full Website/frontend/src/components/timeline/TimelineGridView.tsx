import React from 'react';
import { TimelineEvent } from '@/types';
import TimelineEventCard from './TimelineEventCard';

interface TimelineGridViewProps {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
  setSelectedEvent: (event: TimelineEvent | null) => void;
}

const TimelineGridView: React.FC<TimelineGridViewProps> = ({
  events,
  selectedEvent,
  setSelectedEvent
}) => {
  return (
    <div className="timeline-grid-view px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="animate-fadeInUp"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <TimelineEventCard
                event={event}
                onClick={() => setSelectedEvent(event)}
                isSelected={selectedEvent?.id === event.id}
                viewMode="grid"
              />
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default TimelineGridView;