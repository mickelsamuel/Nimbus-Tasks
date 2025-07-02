import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Clock, 
  Ticket, Video, Mic, BookOpen,
  ArrowRight, Plus
} from 'lucide-react';
import { useUniversityData } from '@/hooks/useUniversityData';

const UpcomingEvents = () => {
  const { data: universityData, loading, error } = useUniversityData();

  // Fallback events data for when API is unavailable
  const fallbackEvents = [
    {
      id: 1,
      title: 'Innovation Summit 2024',
      type: 'Conference',
      date: '2024-02-15',
      time: '09:00 AM',
      location: 'Main Auditorium',
      virtual: false,
      capacity: 500,
      registered: 342,
      price: 'Free',
      image: '/api/placeholder/400/250',
      description: 'Join industry leaders discussing the future of technology and innovation.',
      speakers: ['Dr. Sarah Kim', 'Prof. Michael Chen', 'Emily Johnson'],
      tags: ['Technology', 'Innovation', 'Networking'],
      featured: true
    },
    {
      id: 2,
      title: 'Virtual Career Fair',
      type: 'Career Event',
      date: '2024-02-20',
      time: '10:00 AM',
      location: 'Online Platform',
      virtual: true,
      capacity: 1000,
      registered: 678,
      price: 'Free',
      image: '/api/placeholder/400/250',
      description: 'Connect with top employers and explore career opportunities.',
      speakers: ['HR Directors', 'Talent Acquisition Teams'],
      tags: ['Career', 'Networking', 'Jobs'],
      featured: false
    },
    {
      id: 3,
      title: 'Research Symposium',
      type: 'Academic',
      date: '2024-02-25',
      time: '01:00 PM',
      location: 'Science Building',
      virtual: false,
      capacity: 200,
      registered: 156,
      price: '$25',
      image: '/api/placeholder/400/250',
      description: 'Showcase of cutting-edge research projects by our students and faculty.',
      speakers: ['Research Students', 'Faculty Members'],
      tags: ['Research', 'Science', 'Academic'],
      featured: false
    },
    {
      id: 4,
      title: 'Alumni Reunion Gala',
      type: 'Social',
      date: '2024-03-05',
      time: '06:00 PM',
      location: 'Grand Ballroom',
      virtual: false,
      capacity: 400,
      registered: 289,
      price: '$75',
      image: '/api/placeholder/400/250',
      description: 'Celebrate achievements and reconnect with fellow alumni.',
      speakers: ['Distinguished Alumni', 'University President'],
      tags: ['Alumni', 'Networking', 'Celebration'],
      featured: false
    }
  ];

  // Use API data if available, otherwise fallback to mock data
  const events = universityData?.events?.length ? universityData.events : fallbackEvents;

  const eventTypes = [
    { name: 'All Events', count: events.length, active: true },
    { name: 'Conferences', count: 1, active: false },
    { name: 'Career Events', count: 1, active: false },
    { name: 'Academic', count: 1, active: false },
    { name: 'Social', count: 1, active: false }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressPercentage = (registered: number, capacity: number) => {
    return Math.min((registered / capacity) * 100, 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading upcoming events...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Upcoming Events
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
          Stay connected with our vibrant community through exciting events and opportunities
        </p>
        
        {/* Show data source indicator */}
        {error && (
          <div className="text-sm text-red-500 mb-4">
            ⚠️ Unable to load live data - showing sample events
          </div>
        )}
        {!error && universityData?.events?.length && (
          <div className="text-sm text-green-600 dark:text-green-400">
            ✓ Showing {universityData.events.length} live events
          </div>
        )}
      </motion.div>

      {/* Event Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {eventTypes.map((type, index) => (
          <motion.button
            key={type.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
              type.active
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            {type.name}
            <span className={`text-xs px-2 py-1 rounded-full ${
              type.active 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {type.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Featured Event */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl overflow-hidden mb-12"
      >
        <div className="relative p-8 lg:p-12">
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              FEATURED
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {events[0].title}
              </h3>
              <p className="text-lg text-indigo-100 mb-6">
                {events[0].description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6 text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(events[0].date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{events[0].time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{events[0].location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {events[0].tags?.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Register Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="aspect-video bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                  <Mic className="w-16 h-16 text-white/60" />
                </div>
                <div className="text-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Registration Progress</span>
                    <span className="text-sm">{events[0].registered}/{events[0].capacity}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(events[0].registered, events[0].capacity)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {events.slice(1).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Event Image */}
            <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-600 overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                {event.virtual ? (
                  <Video className="w-16 h-16 text-white/60" />
                ) : (
                  <BookOpen className="w-16 h-16 text-white/60" />
                )}
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 text-gray-900 text-xs font-semibold rounded-full">
                  {event.type}
                </span>
              </div>
              {event.virtual && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                    VIRTUAL
                  </span>
                </div>
              )}
            </div>

            {/* Event Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {event.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.date)} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{event.registered}/{event.capacity} registered</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(event.registered, event.capacity)}%` }}
                  />
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{event.price}</span>
                </div>
                <button className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-sm">
                  Register
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add to Calendar CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 text-center"
      >
        <Calendar className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Never Miss an Event
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Subscribe to our event calendar to stay updated with all upcoming events, workshops, and special programs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Subscribe to Calendar
          </button>
          <button className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            View All Events
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UpcomingEvents;