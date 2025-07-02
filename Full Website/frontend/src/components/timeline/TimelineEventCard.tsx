import React from 'react';
import { TimelineEvent } from '@/types';
import { 
  Trophy, 
  Rocket, 
  Heart, 
  Globe,
  Award,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface TimelineEventCardProps {
  event: TimelineEvent;
  onClick?: () => void;
  isSelected?: boolean;
  viewMode?: 'timeline' | 'grid' | 'list';
  style?: React.CSSProperties;
}

const TimelineEventCard: React.FC<TimelineEventCardProps> = ({ 
  event, 
  onClick, 
  isSelected = false,
  viewMode = 'timeline',
  style
}) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'milestone':
        return <Trophy className="w-6 h-6" />;
      case 'innovation':
        return <Rocket className="w-6 h-6" />;
      case 'achievement':
        return <Award className="w-6 h-6" />;
      case 'expansion':
        return <Globe className="w-6 h-6" />;
      case 'social-impact':
        return <Heart className="w-6 h-6" />;
      default:
        return <Calendar className="w-6 h-6" />;
    }
  };

  const getEventIconColor = () => {
    switch (event.type) {
      case 'milestone':
        return 'bg-amber-100 text-amber-600';
      case 'innovation':
        return 'bg-blue-100 text-blue-600';
      case 'achievement':
        return 'bg-green-100 text-green-600';
      case 'expansion':
        return 'bg-purple-100 text-purple-600';
      case 'social-impact':
        return 'bg-pink-100 text-pink-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getEraStyle = () => {
    switch (event.era) {
      case 'pioneer':
        return 'timeline-era-pioneer';
      case 'growth':
        return 'timeline-era-growth';
      case 'innovation':
        return 'timeline-era-innovation';
      case 'digital':
        return 'timeline-era-digital';
      default:
        return '';
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className={`timeline-event-list bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:translate-x-2 ${
          isSelected ? 'ring-2 ring-red-500' : ''
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        <div className="flex items-start gap-4">
          <div className={`event-icon p-3 rounded-lg ${getEventIconColor()}`}>
            {getEventIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
              <span className="text-lg font-semibold text-red-600">{event.year}</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{event.date}</p>
            <p className="text-gray-700">{event.description}</p>
            {event.impact && event.impact.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-4">
                {event.impact.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{metric.metric}:</span>
                    <span className="font-semibold text-gray-900">{metric.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div
        onClick={onClick}
        className={`timeline-event-grid bg-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
          isSelected ? 'ring-2 ring-red-500' : ''
        } ${getEraStyle()}`}
        style={style}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`event-icon p-3 rounded-lg ${getEventIconColor()}`}>
            {getEventIcon()}
          </div>
          <span className="text-xl font-bold text-red-600">{event.year}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{event.date}</p>
        <p className="text-gray-700 line-clamp-3">{event.description}</p>
      </div>
    );
  }

  // Timeline view (default)
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${event.title}, ${event.year}`}
      className={`timeline-event-card bg-white rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
        isSelected ? 'ring-4 ring-red-500 ring-opacity-50' : ''
      } ${getEraStyle()}`}
      style={{
        ...style,
        width: '320px'
      }}
    >
      {/* Event Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`event-icon p-3 rounded-lg ${getEventIconColor()} transform transition-transform group-hover:scale-110`}>
          {getEventIcon()}
        </div>
        <span className="text-2xl font-bold text-red-600">{event.year}</span>
      </div>

      {/* Event Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
        {event.title}
      </h3>
      <p className="text-gray-600 text-sm mb-3">{event.date}</p>
      <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>

      {/* Impact Metrics */}
      {event.impact && event.impact.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {event.impact.slice(0, 2).map((metric, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">{metric.metric}</p>
              <p className="text-sm font-semibold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Era Badge */}
      {event.era && (
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          event.era === 'pioneer' ? 'bg-amber-100 text-amber-700' :
          event.era === 'growth' ? 'bg-blue-100 text-blue-700' :
          event.era === 'innovation' ? 'bg-green-100 text-green-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {event.era.charAt(0).toUpperCase() + event.era.slice(1)}
        </div>
      )}
    </div>
  );
};

export default TimelineEventCard;