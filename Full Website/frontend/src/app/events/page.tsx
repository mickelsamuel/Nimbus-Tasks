'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import EventsHero from '@/components/events/EventsHero'
import EventTabs, { EventTabType } from '@/components/events/EventTabs'
import EventFilters from '@/components/events/EventFilters'
import EventCard from '@/components/events/EventCard'
import EventsLoading from '@/components/events/shared/EventsLoading'
import EventsStatsBar from '@/components/events/EventsStatsBar'
import EventsQuickActions from '@/components/events/EventsQuickActions'
import { Event, EventCategory, EventStatus } from '@/components/events/types/event.types'
import { useAuthContext } from '@/contexts/AuthContext'
import { eventsAPI } from '@/lib/api/events'

export default function EventsPage() {
  const { user } = useAuthContext()
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<EventTabType>('live')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [stats, setStats] = useState({
    liveEvents: 0,
    activeParticipants: 0,
    todayChampionships: 0,
    satisfactionRate: 0
  })

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Determine status filter based on active tab
      let statusFilter: EventStatus | undefined
      if (activeTab === 'live') statusFilter = 'live'
      else if (activeTab === 'past') statusFilter = 'ended'
      else if (activeTab === 'upcoming') statusFilter = 'upcoming'
      
      // Fetch events from API
      const response = await eventsAPI.getEvents({
        status: statusFilter,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined
      })
      
      setEvents(response)
    } catch (error) {
      console.error('Failed to fetch events:', error)
      setError('Failed to load events. Please try again later.')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [activeTab, searchTerm, selectedCategory])

  const fetchStats = useCallback(async () => {
    try {
      const data = await eventsAPI.getEventStats()
      setStats({
        ...data,
        satisfactionRate: ('satisfactionRate' in data && typeof data.satisfactionRate === 'number') ? data.satisfactionRate : 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      // Use fallback stats if API fails
      setStats({
        liveEvents: 0,
        activeParticipants: 0,
        todayChampionships: 0,
        satisfactionRate: 0
      })
    }
  }, [])

  useEffect(() => {
    fetchEvents()
    fetchStats()
  }, [fetchEvents, fetchStats])

  const handleJoinEvent = async (eventId: number) => {
    if (!user) {
      setError('Please log in to join events')
      return
    }
    
    try {
      await eventsAPI.registerForEvent(eventId, { userId: user.id.toString() })
      // Refresh events to update participant count
      await fetchEvents()
    } catch (error) {
      console.error('Failed to join event:', error)
      setError('Failed to join event. Please try again.')
    }
  }

  const handleNotifyEvent = async (eventId: number) => {
    if (!user) {
      setError('Please log in to set notifications')
      return
    }
    
    // TODO: Implement event notifications when backend endpoint is available
    setError('Event reminders feature coming soon!')
    setTimeout(() => setError(''), 3000)
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const tabCounts = {
    live: activeTab === 'live' ? filteredEvents.length : stats.liveEvents,
    upcoming: activeTab === 'upcoming' ? filteredEvents.length : 0,
    past: activeTab === 'past' ? filteredEvents.length : 0,
    my: activeTab === 'my' ? filteredEvents.length : 0
  }

  return (
    <ProtectedLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/20 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 50, 0],
              y: [0, -25, 0],
              rotate: [0, 90, 180]
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-400/5 to-blue-500/5 dark:from-purple-600/10 dark:to-blue-700/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -40, 0],
              y: [0, 30, 0],
              rotate: [180, 90, 0]
            }}
            transition={{ 
              duration: 35, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-red-500/5 dark:from-pink-600/10 dark:to-red-700/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-400/3 via-orange-500/3 to-transparent dark:from-yellow-600/5 dark:via-orange-700/5 rounded-full"
          />
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <EventsHero
            liveEventCount={stats.liveEvents}
            activeParticipants={stats.activeParticipants}
            todayChampionships={stats.todayChampionships}
            satisfactionRate={stats.satisfactionRate}
          />
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
          {/* Navigation & Stats */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-6 mb-8"
          >
            <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-3xl p-2 shadow-2xl shadow-purple-500/10 dark:shadow-purple-900/20">
              <EventTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabCounts={tabCounts}
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <EventsStatsBar stats={stats} />
            </motion.div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Filters & Controls */}
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/30 overflow-hidden relative"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10" />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <EventFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </motion.div>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <EventsQuickActions
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    eventCount={filteredEvents.length}
                    onRefresh={fetchEvents}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: -50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-red-50/90 dark:bg-red-900/40 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 text-red-700 dark:text-red-400 px-8 py-5 rounded-2xl max-w-md text-center font-medium shadow-2xl shadow-red-500/20">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {error}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Events Display */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventsLoading />
                  </motion.div>
                ) : filteredEvents.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center min-h-[400px] text-center"
                  >
                    <div className="max-w-md backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-3xl p-12 border border-white/30 dark:border-slate-700/30 shadow-2xl">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-6"
                      >
                        🔍
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No events found</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">Try adjusting your filters or search terms</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="events"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`grid gap-8 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}
                  >
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 300
                        }}
                        whileHover={{ 
                          y: -8, 
                          scale: 1.02,
                          transition: { type: "spring", stiffness: 400 }
                        }}
                      >
                        <EventCard 
                          event={event} 
                          index={index}
                          viewMode={viewMode}
                          onJoin={handleJoinEvent}
                          onNotify={handleNotifyEvent}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </ProtectedLayout>
  )
}