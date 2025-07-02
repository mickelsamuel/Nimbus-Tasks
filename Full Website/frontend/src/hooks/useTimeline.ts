import { useState, useEffect, useCallback, useMemo } from 'react';
import { TimelineEvent } from '@/types';
import { timelineAPI } from '@/lib/api/timeline';

interface UseTimelineOptions {
  era?: string;
  type?: string;
  search?: string;
  autoPlay?: boolean;
  playSpeed?: number;
}

interface TimelineFilters {
  era: string;
  type: string;
  search: string;
}

interface TimelineStats {
  totalEvents: number;
  visitedEvents: Set<string>;
  bookmarkedEvents: Set<string>;
  achievements: string[];
}

export const useTimeline = (options: UseTimelineOptions = {}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(options.autoPlay || false);
  const [filters, setFilters] = useState<TimelineFilters>({
    era: options.era || 'all',
    type: options.type || 'all',
    search: options.search || ''
  });
  const [stats, setStats] = useState<TimelineStats>({
    totalEvents: 0,
    visitedEvents: new Set(),
    bookmarkedEvents: new Set(),
    achievements: []
  });

  // Fetch timeline events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = {
        ...(filters.era !== 'all' && { era: filters.era }),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.search && { search: filters.search })
      };
      
      const data = await timelineAPI.getEvents(filterParams);
      setEvents(data);
      setStats(prev => ({ ...prev, totalEvents: data.length }));
    } catch (err) {
      setError('Failed to load timeline events');
      console.error('Timeline fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Filtered events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesEra = filters.era === 'all' || event.era === filters.era;
      const matchesType = filters.type === 'all' || event.type === filters.type;
      const matchesSearch = !filters.search || 
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesEra && matchesType && matchesSearch;
    });
  }, [events, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TimelineFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Navigate to specific event
  const navigateToEvent = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(filteredEvents.length - 1, index));
    setCurrentEventIndex(newIndex);
    
    if (filteredEvents[newIndex]) {
      const event = filteredEvents[newIndex];
      setSelectedEvent(event);
      
      // Mark as visited
      setStats(prev => ({
        ...prev,
        visitedEvents: new Set(prev.visitedEvents).add(event.id)
      }));
      
      // Track view in backend
      timelineAPI.trackEventView(event.id).catch(console.error);
    }
  }, [filteredEvents]);

  // Navigate to next/previous event
  const navigateEvent = useCallback((direction: 1 | -1) => {
    navigateToEvent(currentEventIndex + direction);
  }, [currentEventIndex, navigateToEvent]);

  // Toggle bookmark for an event
  const toggleBookmark = useCallback(async (eventId: string) => {
    try {
      const bookmarked = await timelineAPI.toggleBookmark(eventId);
      setStats(prev => {
        const newBookmarks = new Set(prev.bookmarkedEvents);
        if (bookmarked) {
          newBookmarks.add(eventId);
        } else {
          newBookmarks.delete(eventId);
        }
        return { ...prev, bookmarkedEvents: newBookmarks };
      });
      return bookmarked;
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      return false;
    }
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || filteredEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentEventIndex(prev => {
        const next = prev + 1;
        return next >= filteredEvents.length ? 0 : next;
      });
    }, options.playSpeed || 3000);

    return () => clearInterval(interval);
  }, [isPlaying, filteredEvents.length, options.playSpeed]);

  // Achievement tracking
  useEffect(() => {
    const achievements: string[] = [];
    
    // History Buff: View all events
    if (stats.visitedEvents.size === events.length && events.length > 0) {
      achievements.push('History Buff');
    }
    
    // Era Expert: Visit events from all eras
    const visitedEras = new Set(
      Array.from(stats.visitedEvents).map(id => 
        events.find(e => e.id === id)?.era
      ).filter(Boolean)
    );
    if (visitedEras.size >= 4) {
      achievements.push('Era Expert');
    }
    
    // Bookworm: Bookmark 10+ events
    if (stats.bookmarkedEvents.size >= 10) {
      achievements.push('Bookworm');
    }
    
    // Detective: Use search functionality
    if (filters.search.length > 3) {
      achievements.push('Detective');
    }
    
    setStats(prev => ({ ...prev, achievements }));
  }, [stats.visitedEvents, stats.bookmarkedEvents, events, filters.search]);

  // Load initial events
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Load bookmarked events on mount
  useEffect(() => {
    timelineAPI.getBookmarkedEvents()
      .then(bookmarked => {
        setStats(prev => ({
          ...prev,
          bookmarkedEvents: new Set(bookmarked.map(e => e.id))
        }));
      })
      .catch(console.error);
  }, []);

  return {
    // Data
    events: filteredEvents,
    allEvents: events,
    selectedEvent,
    currentEventIndex,
    loading,
    error,
    
    // Filters
    filters,
    updateFilters,
    
    // Navigation
    navigateToEvent,
    navigateEvent,
    setSelectedEvent,
    
    // Playback
    isPlaying,
    setIsPlaying,
    
    // Stats & Features
    stats,
    toggleBookmark,
    isBookmarked: (eventId: string) => stats.bookmarkedEvents.has(eventId),
    
    // Utilities
    refresh: fetchEvents,
    getEventById: (id: string) => events.find(e => e.id === id),
    getRandomEvent: () => {
      const randomIndex = Math.floor(Math.random() * filteredEvents.length);
      return filteredEvents[randomIndex];
    }
  };
};