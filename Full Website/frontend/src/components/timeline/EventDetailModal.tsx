import React from 'react';
import Image from 'next/image';
import { TimelineEvent } from '@/types';
import {
  X,
  Trophy,
  Rocket,
  Heart,
  Globe,
  Award,
  MapPin,
  Bookmark,
  Share2,
  Calendar,
  TrendingUp,
  Clock,
  Users,
  Building2
} from 'lucide-react';

interface EventDetailModalProps {
  event: TimelineEvent;
  onClose: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  relatedEvents?: TimelineEvent[];
  onRelatedEventClick?: (event: TimelineEvent) => void;
  onViewOnTimeline?: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onBookmark,
  isBookmarked = false,
  relatedEvents = [],
  onRelatedEventClick,
  onViewOnTimeline
}) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'milestone':
        return <Trophy className="w-8 h-8" />;
      case 'innovation':
        return <Rocket className="w-8 h-8" />;
      case 'achievement':
        return <Award className="w-8 h-8" />;
      case 'expansion':
        return <Globe className="w-8 h-8" />;
      case 'social-impact':
        return <Heart className="w-8 h-8" />;
      default:
        return <Calendar className="w-8 h-8" />;
    }
  };

  const getEventIconColor = () => {
    switch (event.type) {
      case 'milestone':
        return 'text-amber-300';
      case 'innovation':
        return 'text-blue-300';
      case 'achievement':
        return 'text-green-300';
      case 'expansion':
        return 'text-purple-300';
      case 'social-impact':
        return 'text-pink-300';
      default:
        return 'text-gray-300';
    }
  };

  const getEraGradient = () => {
    switch (event.era) {
      case 'pioneer':
        return 'from-amber-500 to-orange-500';
      case 'growth':
        return 'from-blue-500 to-indigo-500';
      case 'innovation':
        return 'from-green-500 to-emerald-500';
      case 'digital':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-red-500 to-orange-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="event-modal max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Gradient */}
        <div className={`relative h-64 bg-gradient-to-br ${getEraGradient()} p-8`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all group"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
          </button>

          {/* Event Header Content */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-start gap-4">
              <div className={`event-icon p-4 rounded-xl bg-white/20 backdrop-blur-sm ${getEventIconColor()}`}>
                {getEventIcon()}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{event.title}</h2>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Year {event.year}
                  </span>
                  {event.era && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {event.era.charAt(0).toUpperCase() + event.era.slice(1)} Era
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl transform -translate-x-24 translate-y-24" />
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              Overview
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Impact Metrics */}
          {event.impact && event.impact.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                Key Impact & Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {event.impact.map((metric, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-600 mb-2">{metric.metric}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                Related Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedEvents.slice(0, 4).map(relatedEvent => (
                  <button
                    key={relatedEvent.id}
                    onClick={() => onRelatedEventClick?.(relatedEvent)}
                    className="p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-red-500 mt-1">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                          {relatedEvent.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{relatedEvent.year} • {relatedEvent.type}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Media Gallery (if images/videos exist) */}
          {(event.images?.length || event.videos?.length) && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Media Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.images?.map((image, idx) => (
                  <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                    <Image
                      src={image}
                      alt={`${event.title} - Image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onBookmark}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                isBookmarked
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Bookmarked' : 'Save to Collection'}
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all transform hover:scale-105">
              <Share2 className="w-5 h-5" />
              Share Event
            </button>
            
            {onViewOnTimeline && (
              <button
                onClick={onViewOnTimeline}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all transform hover:scale-105"
              >
                <MapPin className="w-5 h-5" />
                View on Timeline
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventDetailModal;