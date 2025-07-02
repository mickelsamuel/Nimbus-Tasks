'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  Calendar, 
  Filter, 
  Search, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Bookmark,
  Share2,
  Grid3X3,
  List,
  GitBranch,
  Trophy,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Star,
  TrendingUp,
  Target,
  MousePointer,
  Eye,
  Heart,
  Infinity,
  Building,
  Cpu,
  Smartphone,
  Diamond,
  Rocket,
  Palette,
  Waves,
  Compass
} from 'lucide-react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { useTimeline } from '@/hooks/useTimeline'
import { TimelineEvent } from '@/types'

interface TimelinePageProps {}

export default function TimelinePage({}: TimelinePageProps) {
  const {
    events,
    selectedEvent,
    currentEventIndex,
    loading,
    error,
    navigateToEvent,
    navigateEvent,
    setSelectedEvent,
    isPlaying,
    setIsPlaying,
    toggleBookmark,
    isBookmarked,
  } = useTimeline()

  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'list'>('timeline')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEra, setSelectedEra] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const displayEvents = events

  const filteredEvents = displayEvents.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEra = selectedEra === 'all' || event.era === selectedEra
    const matchesType = selectedType === 'all' || event.type === selectedType
    return matchesSearch && matchesEra && matchesType
  })

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event)
    const index = filteredEvents.findIndex(e => e.id === event.id)
    if (index !== -1) {
      navigateToEvent(index)
    }
  }


  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50 dark:from-slate-900 dark:via-violet-900/20 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-violet-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-violet-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center relative z-10"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                className="w-20 h-20 mx-auto mb-4 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-rose-500 rounded-full opacity-20 animate-ping" />
                <div className="absolute inset-2 bg-gradient-to-r from-violet-500 to-rose-500 rounded-full opacity-40 animate-ping" style={{animationDelay: '0.5s'}} />
                <div className="absolute inset-4 bg-gradient-to-r from-violet-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-rose-600 to-violet-600 bg-clip-text text-transparent mb-3"
            >
              Loading Timeline
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-300 text-lg"
            >
              Preparing your journey through 165 years of excellence...
            </motion.p>
            
            {/* Loading dots */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center space-x-2 mt-6"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                  className="w-2 h-2 bg-gradient-to-r from-violet-500 to-rose-500 rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </ProtectedLayout>
    )
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-violet-50 dark:from-slate-900 dark:via-rose-900/10 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-rose-400/10 to-red-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-violet-400/10 to-rose-400/10 rounded-full blur-3xl" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="text-center max-w-md mx-auto p-8 relative z-10"
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Clock className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-3"
            >
              Timeline Unavailable
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400 mb-8 text-lg"
            >
              {error}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="w-full px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Try Again
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="w-full px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Go Back
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50 dark:from-slate-900 dark:via-violet-900/10 dark:to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-400/5 via-transparent to-rose-400/5 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/5 via-transparent to-violet-400/5 rounded-full"
          />
          
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                y: [-100, -1000, -100],
                x: [0, Math.sin(i) * 50, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5
              }}
              className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${[
                'from-violet-400 to-rose-400',
                'from-blue-400 to-violet-400',
                'from-rose-400 to-red-400',
                'from-violet-400 to-blue-400'
              ][i % 4]}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
        
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-rose-600/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/5 via-transparent to-transparent" />
          <div className="relative px-6 py-16">
            <div className="max-w-7xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-50 to-rose-50 dark:from-violet-900/20 dark:to-rose-900/20 rounded-full border border-violet-200 dark:border-violet-800 mb-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                  >
                    <Diamond className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </motion.div>
                  <span className="text-sm font-semibold bg-gradient-to-r from-violet-700 to-rose-700 dark:from-violet-300 dark:to-rose-300 bg-clip-text text-transparent">
                    165 Years of Excellence
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </motion.div>
                </motion.div>
                
                {/* Main Title */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl lg:text-8xl font-black bg-gradient-to-r from-violet-600 via-rose-600 to-violet-700 bg-clip-text text-transparent mb-6 tracking-tight leading-tight"
                >
                  National Bank
                  <br />
                  <span className="text-5xl lg:text-7xl font-light italic">
                    Timeline
                  </span>
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed"
                >
                  Journey through 165 years of{' '}
                  <span className="font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                    innovation
                  </span>
                  ,{' '}
                  <span className="font-semibold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
                    growth
                  </span>
                  , and{' '}
                  <span className="font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                    community impact
                  </span>
                </motion.p>
              </motion.div>

              {/* Enhanced Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
              >
                {[
                  { label: 'Historical Events', value: filteredEvents.length, icon: Calendar, gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20' },
                  { label: 'Years of Service', value: '165+', icon: Clock, gradient: 'from-rose-500 to-pink-600', bg: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20' },
                  { label: 'Major Milestones', value: filteredEvents.filter(e => e.type === 'milestone').length, icon: Trophy, gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20' },
                  { label: 'Innovations', value: filteredEvents.filter(e => e.type === 'innovation').length, icon: Sparkles, gradient: 'from-blue-500 to-cyan-600', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`group relative p-6 bg-gradient-to-br ${stat.bg} backdrop-blur-sm rounded-3xl border border-white/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden`}
                  >
                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                    
                    {/* Icon with Animation */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} p-3 mx-auto mb-4 shadow-lg`}
                    >
                      <stat.icon className="w-full h-full text-white" />
                    </motion.div>
                    
                    {/* Value with Counter Animation */}
                    <motion.div 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + index * 0.1, type: 'spring', stiffness: 300 }}
                      className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
                    >
                      {stat.value}
                    </motion.div>
                    
                    {/* Label */}
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">
                      {stat.label}
                    </div>
                    
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-5 dark:opacity-10">
                      <stat.icon className="w-full h-full text-gray-900 dark:text-white" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Auto-play Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 backdrop-blur-sm ${
                    isAutoPlaying 
                      ? 'bg-gradient-to-r from-violet-600 to-rose-600 text-white border-transparent shadow-lg hover:shadow-xl' 
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                  }`}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="font-medium">
                    {isAutoPlaying ? 'Auto-Playing' : 'Start Auto-Play'}
                  </span>
                  {isAutoPlaying && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                    >
                      <Infinity className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-violet-200/50 dark:border-violet-800/50 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              {/* Enhanced Search & Filters */}
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400 dark:text-violet-500 group-hover:text-violet-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search through history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 w-80 bg-white/80 dark:bg-gray-800/80 border-2 border-violet-200 dark:border-violet-800 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-xs text-gray-600 dark:text-gray-400">×</span>
                    </motion.button>
                  )}
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 font-medium backdrop-blur-sm ${
                    isFiltersOpen 
                      ? 'bg-gradient-to-r from-violet-600 to-rose-600 text-white border-transparent shadow-lg'
                      : 'bg-white/80 dark:bg-gray-800/80 border-violet-200 dark:border-violet-800 text-gray-700 dark:text-gray-300 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-lg'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  <motion.div
                    animate={{ rotate: isFiltersOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                  {(selectedEra !== 'all' || selectedType !== 'all') && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-rose-400 rounded-full"
                    />
                  )}
                </motion.button>
              </div>

              {/* Enhanced View Mode & Controls */}
              <div className="flex items-center gap-4">
                {/* View Mode Selector */}
                <div className="flex items-center bg-gradient-to-r from-violet-50 to-rose-50 dark:from-violet-900/20 dark:to-rose-900/20 rounded-2xl p-2 border border-violet-200 dark:border-violet-800 backdrop-blur-sm">
                  {[
                    { mode: 'timeline', icon: GitBranch, label: 'Timeline', color: 'violet' },
                    { mode: 'grid', icon: Grid3X3, label: 'Grid', color: 'rose' },
                    { mode: 'list', icon: List, label: 'List', color: 'blue' }
                  ].map(({ mode, icon: Icon, label }) => (
                    <motion.button
                      key={mode}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode(mode as 'timeline' | 'grid' | 'list')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                        viewMode === mode
                          ? 'bg-gradient-to-r from-violet-600 to-rose-600 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm">{label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-2 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateEvent(-1)}
                    disabled={currentEventIndex === 0}
                    className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-violet-100 hover:to-violet-200 dark:hover:from-violet-800 dark:hover:to-violet-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 disabled:hover:scale-100"
                  >
                    <SkipBack className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-700 hover:to-rose-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateEvent(1)}
                    disabled={currentEventIndex === filteredEvents.length - 1}
                    className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-violet-100 hover:to-violet-200 dark:hover:from-violet-800 dark:hover:to-violet-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 disabled:hover:scale-100"
                  >
                    <SkipForward className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Filters Panel */}
              <AnimatePresence>
                {isFiltersOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full mt-6 pt-6 border-t border-gradient-to-r from-violet-200 to-rose-200 dark:from-violet-800 dark:to-rose-800"
                  >
                    <div className="flex flex-wrap items-center gap-6">
                      {/* Era Filter */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Compass className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                          Era:
                        </label>
                        <select
                          value={selectedEra}
                          onChange={(e) => setSelectedEra(e.target.value)}
                          className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 border-2 border-violet-200 dark:border-violet-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium min-w-[160px]"
                        >
                          <option value="all">All Eras</option>
                          <option value="pioneer">🚂 Pioneer (1859-1920)</option>
                          <option value="growth">🏗️ Growth (1920-1970)</option>
                          <option value="innovation">💡 Innovation (1970-2000)</option>
                          <option value="digital">🚀 Digital (2000-Present)</option>
                        </select>
                      </motion.div>
                      
                      {/* Type Filter */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3"
                      >
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Palette className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          Type:
                        </label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 border-2 border-rose-200 dark:border-rose-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium min-w-[160px]"
                        >
                          <option value="all">All Types</option>
                          <option value="milestone">🏆 Milestones</option>
                          <option value="expansion">📈 Expansion</option>
                          <option value="innovation">✨ Innovation</option>
                          <option value="social-impact">❤️ Social Impact</option>
                        </select>
                      </motion.div>
                      
                      {/* Clear Button */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedEra('all')
                          setSelectedType('all')
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-700 backdrop-blur-sm"
                      >
                        <Waves className="w-4 h-4" />
                        Clear All
                      </motion.button>
                      
                      {/* Results Count */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-rose-50 dark:from-violet-900/20 dark:to-rose-900/20 rounded-xl border border-violet-200 dark:border-violet-800 backdrop-blur-sm"
                      >
                        <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {filteredEvents.length} events found
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative">
          {viewMode === 'timeline' && <HorizontalTimeline events={filteredEvents} onEventClick={handleEventClick} selectedEvent={selectedEvent} />}
          {viewMode === 'grid' && <GridView events={filteredEvents} onEventClick={handleEventClick} selectedEvent={selectedEvent} />}
          {viewMode === 'list' && <ListView events={filteredEvents} onEventClick={handleEventClick} selectedEvent={selectedEvent} />}
        </div>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <EventModal 
              event={selectedEvent} 
              onClose={() => setSelectedEvent(null)}
              onBookmark={() => toggleBookmark(selectedEvent.id)}
              isBookmarked={isBookmarked(selectedEvent.id)}
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedLayout>
  )
}

// Revolutionary Timeline Component - Immersive Experience!
function HorizontalTimeline({ events, onEventClick, selectedEvent }: { events: TimelineEvent[], onEventClick: (event: TimelineEvent) => void, selectedEvent: TimelineEvent | null }) {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [visibleEvents, setVisibleEvents] = useState(new Set<string>())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleEvents(prev => new Set([...Array.from(prev), entry.target.id]))
          }
        })
      },
      { threshold: 0.2 }
    )

    const eventElements = document.querySelectorAll('[data-event-id]')
    eventElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [events])

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            background: [
              'radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              'radial-gradient(ellipse at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
              'radial-gradient(ellipse at 50% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
              'radial-gradient(ellipse at 50% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
            ]
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' }}
          className="absolute inset-0"
        />
        
        {/* Floating Orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 6
            }}
            className={`absolute w-24 md:w-32 h-24 md:h-32 rounded-full blur-2xl ${
              ['bg-violet-400/15', 'bg-rose-400/15', 'bg-blue-400/15', 'bg-purple-400/15'][i % 4]
            }`}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`
            }}
          />
        ))}
      </div>
      
      {/* Revolutionary Era Showcase */}
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Journey Through Time
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore four transformative eras of innovation and growth
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              era: 'pioneer', 
              label: 'Pioneer Era', 
              years: '1859-1920', 
              icon: Building,
              description: 'Foundation & Growth',
              gradient: 'from-amber-500 to-orange-600',
              bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
              events: events.filter(e => e.era === 'pioneer').length
            },
            { 
              era: 'growth', 
              label: 'Growth Era', 
              years: '1920-1970', 
              icon: TrendingUp,
              description: 'Expansion & Service',
              gradient: 'from-green-500 to-emerald-600',
              bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
              events: events.filter(e => e.era === 'growth').length
            },
            { 
              era: 'innovation', 
              label: 'Innovation Era', 
              years: '1970-2000', 
              icon: Cpu,
              description: 'Technology & Progress',
              gradient: 'from-blue-500 to-indigo-600',
              bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
              events: events.filter(e => e.era === 'innovation').length
            },
            { 
              era: 'digital', 
              label: 'Digital Era', 
              years: '2000-Present', 
              icon: Smartphone,
              description: 'Digital Revolution',
              gradient: 'from-purple-500 to-violet-600',
              bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
              events: events.filter(e => e.era === 'digital').length
            }
          ].map((era, index) => {
            const IconComponent = era.icon
            return (
              <motion.div
                key={era.era}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`group relative overflow-hidden text-center p-6 rounded-3xl bg-gradient-to-br ${era.bgGradient} shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white/50 dark:border-gray-700/50`}
              >
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${era.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                />
                
                {/* Floating Icon */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                  className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${era.gradient} p-4 shadow-lg group-hover:shadow-xl`}
                >
                  <IconComponent className="w-full h-full text-white" />
                </motion.div>
              
                {/* Content */}
                <div className="relative">
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${era.gradient} bg-clip-text text-transparent mb-2`}>
                    {era.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {era.years}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                    {era.description}
                  </p>
                  
                  {/* Event Count */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">{era.events} events</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 w-8 h-8 opacity-10 dark:opacity-20">
                  <IconComponent className="w-full h-full text-gray-900 dark:text-white" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Immersive Timeline Container */}
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Dynamic Central Timeline Line */}
        <motion.div 
          className="absolute left-1/2 transform -translate-x-1/2 w-0.5 md:w-1 lg:w-1.5 h-full rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #8b5cf6, #ec4899, #3b82f6, #8b5cf6)'
          }}
        >
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent h-1/3"
          />
        </motion.div>
        
        {/* Enhanced Timeline Start Marker */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
          className="absolute left-1/2 transform -translate-x-1/2 -top-12 z-20"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(139, 92, 246, 0.5)',
                '0 0 40px rgba(236, 72, 153, 0.5)',
                '0 0 20px rgba(139, 92, 246, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-12 h-12 bg-gradient-to-br from-violet-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            >
              <Clock className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Revolutionary Events Display */}
        <div className="relative">
          {events.map((event, index) => {
            const isLeft = index % 2 === 0
            const isVisible = visibleEvents.has(event.id)
            const isHovered = hoveredEvent === event.id
            
            return (
              <motion.div
                key={event.id}
                id={event.id}
                data-event-id={event.id}
                initial={{ opacity: 0, x: isLeft ? -100 : 100, y: 50 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0.3, 
                  x: 0, 
                  y: 0,
                  scale: isHovered ? 1.02 : 1
                }}
                transition={{ 
                  delay: index * 0.2,
                  type: 'spring',
                  stiffness: 150,
                  damping: 20,
                  scale: { duration: 0.2 }
                }}
                onHoverStart={() => setHoveredEvent(event.id)}
                onHoverEnd={() => setHoveredEvent(null)}
                className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'} mb-12 md:mb-20 lg:mb-24 group`}
              >
                {/* Revolutionary Event Card */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEventClick(event)}
                  className={`relative w-full md:w-5/12 cursor-pointer ${isLeft ? 'pr-4 md:pr-12 lg:pr-16' : 'pl-4 md:pl-12 lg:pl-16'}`}
                >
                  {/* Enhanced Connecting Line */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isVisible ? '3rem' : '1rem' }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    className={`absolute top-1/2 transform -translate-y-1/2 h-0.5 rounded-full bg-gradient-to-r ${getEraGradient(event.era || 'pioneer')} ${
                      isLeft ? 'right-0' : 'left-0'
                    } shadow-sm hidden md:block`}
                  >
                    <motion.div
                      animate={{ 
                        x: isLeft ? ['0%', '100%', '0%'] : ['0%', '-100%', '0%']
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                      className="w-2 h-full bg-white rounded-full shadow-md"
                    />
                  </motion.div>
                  
                  {/* Premium Event Card Content */}
                  <motion.div 
                    className={`relative p-5 md:p-6 lg:p-8 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      selectedEvent?.id === event.id 
                        ? 'ring-2 ring-violet-500 shadow-violet-500/20 border-violet-400 dark:border-violet-600' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600'
                    }`}
                  >
                    {/* Dynamic Background Effects */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${getEraGlow(event.era || 'pioneer')} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}
                      animate={{ 
                        scale: isHovered ? [1, 1.05, 1] : 1,
                        rotate: isHovered ? [0, 1, 0] : 0
                      }}
                      transition={{ duration: 2 }}
                    />
                    
                    {/* Subtle Particle Effects */}
                    {isHovered && (
                      <div className="absolute inset-0 overflow-hidden rounded-2xl hidden md:block">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ 
                              opacity: [0, 0.6, 0],
                              scale: [0, 1, 0],
                              x: [0, Math.random() * 100 - 50],
                              y: [0, Math.random() * 100 - 50]
                            }}
                            transition={{ 
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.3
                            }}
                            className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getEraGradient(event.era || 'pioneer')}`}
                            style={{
                              left: '50%',
                              top: '50%'
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <motion.span 
                              className={`text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r ${getEraGradient(event.era || 'pioneer')} bg-clip-text text-transparent`}
                              animate={{ 
                                scale: isHovered ? [1, 1.05, 1] : 1
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              {event.year}
                            </motion.span>
                            <motion.div 
                              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold bg-gradient-to-r ${getEraGradient(event.era || 'pioneer')} text-white shadow-md`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {(event.era || 'pioneer').charAt(0).toUpperCase() + (event.era || 'pioneer').slice(1)} Era
                            </motion.div>
                          </div>
                          <motion.h3 
                            className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 leading-tight transition-all duration-300"
                            animate={{ 
                              y: isHovered ? -2 : 0
                            }}
                          >
                            {event.title}
                          </motion.h3>
                        </div>
                        
                        {/* Enhanced Type Icon */}
                        <motion.div 
                          className={`p-3 md:p-3.5 lg:p-4 rounded-xl md:rounded-2xl flex-shrink-0 shadow-md ${
                            event.type === 'milestone' ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                            event.type === 'expansion' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' :
                            event.type === 'innovation' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                            'bg-gradient-to-br from-purple-500 to-violet-600 text-white'
                          }`}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 5
                          }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {event.type === 'milestone' && <Trophy className="w-4 h-4 md:w-5 md:h-5" />}
                          {event.type === 'expansion' && <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />}
                          {event.type === 'innovation' && <Sparkles className="w-4 h-4 md:w-5 md:h-5" />}
                          {event.type === 'social-impact' && <Star className="w-4 h-4 md:w-5 md:h-5" />}
                        </motion.div>
                      
                      <motion.p 
                        className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-4 md:mb-5 line-clamp-2 md:line-clamp-3"
                        animate={{ 
                          opacity: isHovered ? 1 : 0.9
                        }}
                      >
                        {event.description}
                      </motion.p>
                      
                      {/* Enhanced Impact Metrics Preview */}
                      {event.impact && event.impact.length > 0 && (
                        <motion.div 
                          className="pt-4 md:pt-5 border-t border-gray-200 dark:border-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: isHovered ? 360 : 0 }}
                                transition={{ duration: 0.8 }}
                                className={`p-2 rounded-xl bg-gradient-to-r ${getEraGradient(event.era || 'pioneer')}`}
                              >
                                <Target className="w-4 h-4 text-white" />
                              </motion.div>
                              <div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  {event.impact.length} Impact Metrics
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Click to explore details
                                </div>
                              </div>
                            </div>
                            <motion.div
                              animate={{ 
                                x: [0, 8, 0],
                                scale: isHovered ? 1.2 : 1
                              }}
                              transition={{ 
                                x: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
                                scale: { duration: 0.2 }
                              }}
                              className={`p-2 rounded-full bg-gradient-to-r ${getEraGradient(event.era || 'pioneer')}`}
                            >
                              <ArrowRight className="w-4 h-4 text-white" />
                            </motion.div>
                          </div>
                          
                          {/* Quick Preview */}
                          {isHovered && event.impact.slice(0, 2).map((metric, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center justify-between mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                            >
                              <span className="text-xs text-gray-600 dark:text-gray-400">{metric.metric}</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {metric.value}
                              </span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                      </div>
                  </motion.div>
                </motion.div>

                {/* Revolutionary Center Dot */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: isVisible ? 1 : 0.5, 
                    rotate: 0
                  }}
                  transition={{ 
                    delay: index * 0.2 + 0.5, 
                    type: 'spring', 
                    stiffness: 200 
                  }}
                  className="absolute left-1/2 transform -translate-x-1/2 z-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative cursor-pointer group"
                    onClick={() => onEventClick(event)}
                  >
                    {/* Outer Pulse Ring */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0, 0.4]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.3
                      }}
                      className={`absolute inset-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r ${getEraGradient(event.era || 'pioneer')}`}
                    />
                    
                    {/* Main Dot */}
                    <motion.div
                      className={`relative w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${getEraGradient(event.era || 'pioneer')} shadow-lg border-2 border-white dark:border-gray-900`}
                      animate={{
                        boxShadow: [
                          '0 0 15px rgba(139, 92, 246, 0.3)',
                          '0 0 25px rgba(236, 72, 153, 0.3)',
                          '0 0 15px rgba(139, 92, 246, 0.3)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {/* Inner Glow */}
                      <div className="absolute inset-1 bg-white/30 rounded-full" />
                      
                      {/* Center Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: isHovered ? 360 : 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {getEraIcon(event.era || 'pioneer')}
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    {/* Hover Ring */}
                    <motion.div
                      className={`absolute inset-0 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-violet-500 opacity-0 group-hover:opacity-70`}
                      animate={{ 
                        scale: isHovered ? [1, 1.15, 1] : 1
                      }}
                      transition={{ duration: 0.8, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
                    />
                  </motion.div>
                </motion.div>

                {/* Invisible spacer for layout balance */}
                <div className={`w-full md:w-5/12 ${isLeft ? 'hidden md:block' : 'hidden'}`} />
              </motion.div>
            )
          })}
        </div>

        {/* Epic Timeline End Marker */}
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: events.length * 0.2,
            type: 'spring',
            stiffness: 200
          }}
          className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 z-20"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 30px rgba(236, 72, 153, 0.6)',
                '0 0 50px rgba(139, 92, 246, 0.6)',
                '0 0 30px rgba(236, 72, 153, 0.6)'
              ],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="relative w-16 h-16 bg-gradient-to-br from-rose-500 via-violet-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              className="absolute inset-2 border-2 border-white/30 rounded-full"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Rocket className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: events.length * 0.2 + 0.5 }}
            className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-violet-600 to-rose-600 text-white rounded-full text-sm font-medium whitespace-nowrap shadow-lg"
          >
            ✨ End of Timeline ✨
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced Interactive Hint */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center mt-20"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-violet-50 via-white to-rose-50 dark:from-violet-900/20 dark:via-gray-800/80 dark:to-rose-900/20 backdrop-blur-xl rounded-2xl border border-violet-200/50 dark:border-violet-800/50 shadow-2xl hover:shadow-3xl transition-all duration-500"
        >
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <MousePointer className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </motion.div>
          
          <div className="text-center">
            <div className="text-lg font-bold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent mb-1">
              Interactive Timeline
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Click any event to explore its full story and impact
            </div>
          </div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 z-30"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
          <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {visibleEvents.size} / {events.length}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

// Revolutionary Grid View Component
function GridView({ events, onEventClick, selectedEvent }: { events: TimelineEvent[], onEventClick: (event: TimelineEvent) => void, selectedEvent: TimelineEvent | null }) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-400/10 to-rose-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-violet-400/10 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent mb-4">
          Timeline Grid View
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Explore events in a structured grid layout
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              type: 'spring',
              stiffness: 200
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={() => onEventClick(event)}
            onHoverStart={() => setHoveredCard(event.id)}
            onHoverEnd={() => setHoveredCard(null)}
            className={`group relative p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border-2 cursor-pointer transition-all duration-500 overflow-hidden ${
              selectedEvent?.id === event.id 
                ? 'ring-4 ring-violet-500/50 shadow-violet-500/25 border-violet-300 dark:border-violet-600 shadow-2xl' 
                : 'border-gray-200/50 dark:border-gray-700/50 hover:border-violet-300/50 dark:hover:border-violet-600/50 shadow-lg hover:shadow-2xl'
            }`}
          >
            {/* Dynamic Background */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-br ${getEraGlow(event.era)} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}
              animate={{ 
                scale: hoveredCard === event.id ? [1, 1.02, 1] : 1
              }}
              transition={{ duration: 2 }}
            />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.span 
                      className={`text-2xl font-black bg-gradient-to-r ${getEraGradient(event.era)} bg-clip-text text-transparent`}
                      animate={{ 
                        scale: hoveredCard === event.id ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {event.year}
                    </motion.span>
                    <motion.div 
                      className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getEraGradient(event.era)} text-white shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {event.era ? event.era.charAt(0).toUpperCase() + event.era.slice(1) : ''}
                    </motion.div>
                  </div>
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300"
                    animate={{ 
                      y: hoveredCard === event.id ? -2 : 0
                    }}
                  >
                    {event.title}
                  </motion.h3>
                </div>
                
                <motion.div 
                  className={`p-3 rounded-2xl flex-shrink-0 shadow-lg ${
                    event.type === 'milestone' ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                    event.type === 'expansion' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' :
                    event.type === 'innovation' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                    'bg-gradient-to-br from-purple-500 to-violet-600 text-white'
                  }`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {event.type === 'milestone' && <Trophy className="w-5 h-5" />}
                  {event.type === 'expansion' && <TrendingUp className="w-5 h-5" />}
                  {event.type === 'innovation' && <Sparkles className="w-5 h-5" />}
                  {event.type === 'social-impact' && <Star className="w-5 h-5" />}
                </motion.div>
              </div>
              
              <motion.p 
                className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-4 mb-6"
                animate={{ 
                  opacity: hoveredCard === event.id ? 1 : 0.8
                }}
              >
                {event.description}
              </motion.p>
              
              {event.impact && event.impact.length > 0 && (
                <motion.div 
                  className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: hoveredCard === event.id ? 360 : 0 }}
                        transition={{ duration: 0.8 }}
                        className={`p-1 rounded-lg bg-gradient-to-r ${getEraGradient(event.era)}`}
                      >
                        <Target className="w-3 h-3 text-white" />
                      </motion.div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {event.impact.length} Metrics
                      </span>
                    </div>
                    <motion.div
                      animate={{ 
                        x: [0, 4, 0],
                        scale: hoveredCard === event.id ? 1.2 : 1
                      }}
                      transition={{ 
                        x: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
                        scale: { duration: 0.2 }
                      }}
                      className={`p-1 rounded-full bg-gradient-to-r ${getEraGradient(event.era)}`}
                    >
                      <ArrowRight className="w-3 h-3 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Quick Preview on Hover */}
                  <AnimatePresence>
                    {hoveredCard === event.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1"
                      >
                        {event.impact.slice(0, 2).map((metric, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                          >
                            <span className="text-xs text-gray-600 dark:text-gray-400">{metric.metric}</span>
                            <span className={`text-xs font-bold bg-gradient-to-r ${getEraGradient(event.era)} bg-clip-text text-transparent`}>
                              {metric.value}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Grid Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: events.length * 0.1 + 0.5 }}
        className="text-center mt-16 relative z-10"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-50 to-rose-50 dark:from-violet-900/20 dark:to-rose-900/20 rounded-full border border-violet-200 dark:border-violet-800 backdrop-blur-sm shadow-lg">
          <Grid3X3 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Viewing {events.length} events in grid format
          </span>
        </div>
      </motion.div>
    </div>
  )
}

// Revolutionary List View Component
function ListView({ events, onEventClick, selectedEvent }: { events: TimelineEvent[], onEventClick: (event: TimelineEvent) => void, selectedEvent: TimelineEvent | null }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-violet-400/5 to-rose-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/5 to-violet-400/5 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent mb-4">
          Timeline List View
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Browse events in a clean, organized list format
        </p>
      </motion.div>
      
      <div className="space-y-6 relative z-10">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.08,
              type: 'spring',
              stiffness: 200
            }}
            whileHover={{ 
              scale: 1.02, 
              x: 10,
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)'
            }}
            onClick={() => onEventClick(event)}
            onHoverStart={() => setHoveredItem(event.id)}
            onHoverEnd={() => setHoveredItem(null)}
            className={`group relative flex items-center gap-8 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border-2 cursor-pointer transition-all duration-500 overflow-hidden ${
              selectedEvent?.id === event.id 
                ? 'ring-4 ring-violet-500/50 shadow-violet-500/25 border-violet-300 dark:border-violet-600 shadow-xl' 
                : 'border-gray-200/50 dark:border-gray-700/50 hover:border-violet-300/50 dark:hover:border-violet-600/50 shadow-lg hover:shadow-xl'
            }`}
          >
            {/* Dynamic Background */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r ${getEraGlow(event.era)} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
              animate={{ 
                scale: hoveredItem === event.id ? [1, 1.01, 1] : 1
              }}
              transition={{ duration: 2 }}
            />
            
            {/* Enhanced Type Icon */}
            <motion.div 
              className={`relative p-4 rounded-2xl flex-shrink-0 shadow-lg ${
                event.type === 'milestone' ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                event.type === 'expansion' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' :
                event.type === 'innovation' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                'bg-gradient-to-br from-purple-500 to-violet-600 text-white'
              }`}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {event.type === 'milestone' && <Trophy className="w-6 h-6" />}
              {event.type === 'expansion' && <TrendingUp className="w-6 h-6" />}
              {event.type === 'innovation' && <Sparkles className="w-6 h-6" />}
              {event.type === 'social-impact' && <Star className="w-6 h-6" />}
              
              {/* Hover Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{ 
                  scale: hoveredItem === event.id ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 1 }}
              />
            </motion.div>
            
            {/* Enhanced Content */}
            <div className="flex-1 relative">
              <div className="flex items-center gap-4 mb-3">
                <motion.span 
                  className={`text-2xl font-black bg-gradient-to-r ${getEraGradient(event.era)} bg-clip-text text-transparent`}
                  animate={{ 
                    scale: hoveredItem === event.id ? [1, 1.05, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {event.year}
                </motion.span>
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <motion.span 
                  className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getEraGradient(event.era)} text-white shadow-md`}
                  whileHover={{ scale: 1.05 }}
                >
                  {event.era ? event.era.charAt(0).toUpperCase() + event.era.slice(1) : ''} Era
                </motion.span>
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize font-medium">
                  {event.type.replace('-', ' ')}
                </span>
              </div>
              
              <motion.h3 
                className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300"
                animate={{ 
                  x: hoveredItem === event.id ? 5 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {event.title}
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 dark:text-gray-400 text-base leading-relaxed line-clamp-2"
                animate={{ 
                  opacity: hoveredItem === event.id ? 1 : 0.8
                }}
              >
                {event.description}
              </motion.p>
              
              {/* Impact Preview */}
              {event.impact && event.impact.length > 0 && (
                <motion.div 
                  className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                  animate={{ 
                    opacity: hoveredItem === event.id ? 1 : 0.6
                  }}
                >
                  <Target className="w-4 h-4" />
                  <span>{event.impact.length} impact metrics available</span>
                </motion.div>
              )}
            </div>
            
            {/* Enhanced Arrow */}
            <motion.div
              className="flex-shrink-0"
              animate={{ 
                x: hoveredItem === event.id ? [0, 8, 0] : 0,
                scale: hoveredItem === event.id ? 1.2 : 1
              }}
              transition={{ 
                x: { repeat: hoveredItem === event.id ? Number.POSITIVE_INFINITY : 0, duration: 1.5 },
                scale: { duration: 0.2 }
              }}
            >
              <div className={`p-3 rounded-full bg-gradient-to-r ${getEraGradient(event.era)} shadow-lg`}>
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* List Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: events.length * 0.08 + 0.5 }}
        className="text-center mt-16 relative z-10"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-50 to-rose-50 dark:from-violet-900/20 dark:to-rose-900/20 rounded-full border border-violet-200 dark:border-violet-800 backdrop-blur-sm shadow-lg">
          <List className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Viewing {events.length} events in list format
          </span>
        </div>
      </motion.div>
    </div>
  )
}

// Revolutionary Event Modal Component
function EventModal({ event, onClose, onBookmark, isBookmarked }: { 
  event: TimelineEvent, 
  onClose: () => void, 
  onBookmark: () => void, 
  isBookmarked: boolean 
}) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
        animate={{ 
          opacity: 1, 
          scale: isClosing ? 0.8 : 1, 
          y: isClosing ? 50 : 0,
          rotateX: isClosing ? -15 : 0
        }}
        exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30 
        }}
        className="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <motion.div
            animate={{ 
              background: [
                `radial-gradient(ellipse at 20% 20%, ${getEraGradient(event.era).includes('amber') ? 'rgba(245, 158, 11, 0.1)' : getEraGradient(event.era).includes('green') ? 'rgba(34, 197, 94, 0.1)' : getEraGradient(event.era).includes('blue') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'} 0%, transparent 70%)`,
                `radial-gradient(ellipse at 80% 80%, ${getEraGradient(event.era).includes('amber') ? 'rgba(251, 191, 36, 0.1)' : getEraGradient(event.era).includes('green') ? 'rgba(16, 185, 129, 0.1)' : getEraGradient(event.era).includes('blue') ? 'rgba(99, 102, 241, 0.1)' : 'rgba(168, 85, 247, 0.1)'} 0%, transparent 70%)`
              ]
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' }}
            className="absolute inset-0"
          />
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2
              }}
              className={`absolute w-4 h-4 rounded-full bg-gradient-to-r ${getEraGradient(event.era)} opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
        
        <div className="relative p-10">
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <motion.span 
                className={`text-5xl font-black bg-gradient-to-r ${getEraGradient(event.era)} bg-clip-text text-transparent`}
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {event.year}
              </motion.span>
              
              <motion.div 
                className={`px-6 py-3 rounded-2xl text-lg font-bold bg-gradient-to-r ${getEraGradient(event.era)} text-white shadow-xl`}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                {event.era ? event.era.charAt(0).toUpperCase() + event.era.slice(1) : ''} Era
              </motion.div>
              
              <motion.div 
                className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-xl ${
                  event.type === 'milestone' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                  event.type === 'expansion' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
                  event.type === 'innovation' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                  'bg-gradient-to-r from-purple-500 to-violet-600 text-white'
                }`}
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                {event.type.replace('-', ' ').toUpperCase()}
              </motion.div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {event.title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto"
            >
              {event.description}
            </motion.p>
          </div>

          {/* Revolutionary Impact Metrics */}
          {event.impact && event.impact.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                    className={`p-3 rounded-2xl bg-gradient-to-r ${getEraGradient(event.era)} shadow-xl`}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className={`bg-gradient-to-r ${getEraGradient(event.era)} bg-clip-text text-transparent`}>
                    Impact Metrics
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Measuring the transformative effects of this milestone
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.impact.map((metric, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 0.5 + index * 0.15,
                      type: 'spring',
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)'
                    }}
                    className={`relative p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                  >
                    {/* Background Pattern */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getEraGradient(event.era)} opacity-5 rounded-full blur-xl`} />
                    
                    {/* Content */}
                    <div className="relative">
                      <motion.div 
                        className={`text-4xl font-black bg-gradient-to-r ${getEraGradient(event.era)} bg-clip-text text-transparent mb-3`}
                        animate={{ 
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.3
                        }}
                      >
                        {metric.value}
                      </motion.div>
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-tight">
                        {metric.metric}
                      </div>
                    </div>
                    
                    {/* Hover Glow */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${getEraGradient(event.era)} opacity-0 rounded-2xl`}
                      whileHover={{ opacity: 0.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Enhanced Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBookmark}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 font-semibold ${
                  isBookmarked
                    ? `bg-gradient-to-r ${getEraGradient(event.era)} text-white border-transparent shadow-lg hover:shadow-xl`
                    : 'bg-white/80 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-600 backdrop-blur-sm'
                }`}
              >
                <motion.div
                  animate={{ 
                    scale: isBookmarked ? [1, 1.2, 1] : 1,
                    rotate: isBookmarked ? [0, 10, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </motion.div>
                {isBookmarked ? 'Bookmarked!' : 'Bookmark Event'}
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 rounded-2xl transition-all duration-300 font-semibold backdrop-blur-sm"
              >
                <Share2 className="w-5 h-5" />
                Share Story
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-600 rounded-2xl transition-all duration-300 font-semibold backdrop-blur-sm"
              >
                <Heart className="w-5 h-5" />
                Like
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className={`px-8 py-3 bg-gradient-to-r ${getEraGradient(event.era)} hover:opacity-90 text-white rounded-2xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl`}
            >
              ✨ Close
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Revolutionary Helper Functions for Era-Based Styling
function getEraGradient(era: string | undefined): string {
  switch (era) {
    case 'pioneer': return 'from-amber-500 to-orange-600';
    case 'growth': return 'from-green-500 to-emerald-600';
    case 'innovation': return 'from-blue-500 to-indigo-600';
    case 'digital': return 'from-purple-500 to-violet-600';
    default: return 'from-gray-500 to-gray-600';
  }
}

function getEraGlow(era: string | undefined): string {
  switch (era) {
    case 'pioneer': return 'from-amber-500/20 to-orange-600/20';
    case 'growth': return 'from-green-500/20 to-emerald-600/20';
    case 'innovation': return 'from-blue-500/20 to-indigo-600/20';
    case 'digital': return 'from-purple-500/20 to-violet-600/20';
    default: return 'from-gray-500/20 to-gray-600/20';
  }
}

function getEraIcon(era: string | undefined) {
  const iconClass = "w-3 h-3 text-white";
  switch (era) {
    case 'pioneer': return <Building className={iconClass} />;
    case 'growth': return <TrendingUp className={iconClass} />;
    case 'innovation': return <Cpu className={iconClass} />;
    case 'digital': return <Smartphone className={iconClass} />;
    default: return <Clock className={iconClass} />;
  }
}