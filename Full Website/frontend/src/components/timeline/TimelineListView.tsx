import React from 'react';
import { TimelineEvent } from '@/types';
import TimelineEventCard from './TimelineEventCard';

interface TimelineListViewProps {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
  setSelectedEvent: (event: TimelineEvent | null) => void;
}

const TimelineListView: React.FC<TimelineListViewProps> = ({
  events,
  selectedEvent,
  setSelectedEvent
}) => {
  // Group events by era for better organization
  const eventsByEra = events.reduce((acc, event) => {
    const era = event.era || 'other';
    if (!acc[era]) acc[era] = [];
    acc[era].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const eraOrder = ['pioneer', 'growth', 'innovation', 'digital', 'other'];
  const eraNames: Record<string, string> = {
    pioneer: 'Pioneer Era (1859-1900)',
    growth: 'Growth Era (1900-1950)',
    innovation: 'Innovation Era (1950-2000)',
    digital: 'Digital Era (2000-Present)',
    other: 'Other Events'
  };

  const eraColors: Record<string, string> = {
    pioneer: 'border-amber-500 bg-amber-50',
    growth: 'border-blue-500 bg-blue-50',
    innovation: 'border-green-500 bg-green-50',
    digital: 'border-orange-500 bg-orange-50',
    other: 'border-gray-500 bg-gray-50'
  };

  return (
    <div className="timeline-list-view px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        {eraOrder.map(era => {
          const eraEvents = eventsByEra[era];
          if (!eraEvents || eraEvents.length === 0) return null;

          return (
            <div key={era} className="mb-8">
              {/* Era Header */}
              <div className={`mb-4 p-3 rounded-lg border-l-4 ${eraColors[era]}`}>
                <h3 className="text-lg font-bold text-gray-900">
                  {eraNames[era]}
                </h3>
                <p className="text-sm text-gray-600">
                  {eraEvents.length} event{eraEvents.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Events in this era */}
              <div className="space-y-4">
                {eraEvents
                  .sort((a, b) => a.year - b.year)
                  .map((event, index) => (
                    <div
                      key={event.id}
                      className="animate-slideIn"
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <TimelineEventCard
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                        isSelected={selectedEvent?.id === event.id}
                        viewMode="list"
                      />
                    </div>
                  ))}
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default TimelineListView;