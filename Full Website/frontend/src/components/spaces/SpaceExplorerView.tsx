'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  MapPin, 
  Thermometer, 
  Lightbulb, 
  Activity, 
  Play,
  Eye,
  Zap,
  Award,
  Maximize2,
  Headphones,
  Settings,
  Star,
  Clock,
  Wifi,
  Monitor,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { VirtualSpace } from '@/types'
import { useState, useEffect } from 'react'

interface SpaceExplorerViewProps {
  spaces: VirtualSpace[]
  selectedSpace: VirtualSpace | null
  onSpaceSelect: (space: VirtualSpace) => void
  onJoinSpace: () => void
  isTransitioning: boolean
}

export default function SpaceExplorerView({ 
  spaces, 
  selectedSpace, 
  onSpaceSelect, 
  onJoinSpace, 
  isTransitioning 
}: SpaceExplorerViewProps) {
  const [hoveredSpace, setHoveredSpace] = useState<string | null>(null)
  const [orderedSpaces, setOrderedSpaces] = useState<VirtualSpace[]>(spaces)
  const [isReordering, setIsReordering] = useState(false)

  // Handle space selection with reordering animation
  const handleSpaceSelect = (space: VirtualSpace) => {
    if (space.id === selectedSpace?.id) return
    
    setIsReordering(true)
    
    // First, call the parent's onSpaceSelect to trigger the right panel animation
    onSpaceSelect(space)
    
    // Then reorder the spaces list after a brief delay
    setTimeout(() => {
      const newOrderedSpaces = [space, ...orderedSpaces.filter(s => s.id !== space.id)]
      setOrderedSpaces(newOrderedSpaces)
      setIsReordering(false)
    }, 300)
  }

  // Update ordered spaces when spaces prop changes
  useEffect(() => {
    if (selectedSpace) {
      const newOrderedSpaces = [selectedSpace, ...spaces.filter(s => s.id !== selectedSpace.id)]
      setOrderedSpaces(newOrderedSpaces)
    } else {
      setOrderedSpaces(spaces)
    }
  }, [spaces, selectedSpace])

  const getSpaceGradient = (category: string) => {
    switch (category) {
      case 'meeting':
        return 'from-blue-500/20 via-indigo-500/20 to-purple-500/20'
      case 'work':
        return 'from-purple-500/20 via-pink-500/20 to-rose-500/20'
      case 'social':
        return 'from-orange-500/20 via-red-500/20 to-pink-500/20'
      case 'training':
        return 'from-green-500/20 via-emerald-500/20 to-teal-500/20'
      case 'wellness':
        return 'from-teal-500/20 via-cyan-500/20 to-blue-500/20'
      default:
        return 'from-primary-500/20 via-primary-600/20 to-primary-700/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'from-green-500 to-emerald-600'
      case 'busy':
        return 'from-red-500 to-rose-600'
      case 'reserved':
        return 'from-yellow-500 to-amber-600'
      default:
        return 'from-gray-500 to-slate-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col xl:flex-row gap-8 h-auto xl:h-[900px] relative"
    >
      {/* Simplified Background Effects - reduced blur and removed animation for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-r from-primary-400/8 to-purple-400/8 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400/8 to-teal-400/8 rounded-full blur-xl" />
      </div>

      {/* Left Panel - Space Selection */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full xl:w-[400px] 2xl:w-[450px] relative z-10"
      >
        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-slate-800/95 dark:via-slate-800/90 dark:to-slate-900/85 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl h-full">
          {/* Panel Header */}
          <div className="p-8 border-b border-gray-200/50 dark:border-slate-600/50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Virtual Spaces
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {orderedSpaces.length} spaces available
                </p>
              </div>
            </motion.div>
          </div>

          {/* Spaces List */}
          <div className="p-6 h-[calc(100%-140px)] overflow-y-auto scrollbar-hide">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {orderedSpaces.map((space, index) => (
                <motion.div
                  key={space.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: selectedSpace?.id === space.id ? 1.02 : 1
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: isReordering ? 0 : index * 0.1,
                    layout: { duration: 0.4, ease: "easeInOut" }
                  }}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ${
                    selectedSpace?.id === space.id
                      ? 'shadow-2xl ring-2 ring-primary-500/50'
                      : 'hover:scale-102 hover:shadow-xl'
                  }`}
                  onClick={() => handleSpaceSelect(space)}
                  onMouseEnter={() => setHoveredSpace(space.id)}
                  onMouseLeave={() => setHoveredSpace(null)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Card Background with Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getSpaceGradient(space.category || 'default')} opacity-40`} />
                  <div className="absolute inset-0 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80" />
                  
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {selectedSpace?.id === space.id && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600 origin-left"
                      />
                    )}
                  </AnimatePresence>

                  {/* "Currently Active" indicator for selected space */}
                  {selectedSpace?.id === space.id && index === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full"
                    >
                      ACTIVE
                    </motion.div>
                  )}

                  {/* Card Content */}
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      {/* Space Icon */}
                      <motion.div 
                        className={`p-3 rounded-xl transition-all duration-300 ${
                          selectedSpace?.id === space.id
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-600 dark:text-gray-300'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <space.icon className="h-6 w-6" />
                      </motion.div>
                      
                      {/* Space Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                          selectedSpace?.id === space.id
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {space.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                          {space.description}
                        </p>
                        
                        {/* Status and Occupancy */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(space.status || 'available')} text-white shadow-md`}>
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              {space.status === 'available' ? 'Available' : 
                               space.status === 'busy' ? 'In Use' : 'Reserved'}
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                              <Users className="h-3.5 w-3.5" />
                              <span>{space.occupancy}/{space.capacity}</span>
                            </div>
                          </div>

                          {/* Arrow Indicator */}
                          <motion.div
                            animate={{ 
                              x: selectedSpace?.id === space.id ? 5 : 0,
                              opacity: selectedSpace?.id === space.id || hoveredSpace === space.id ? 1 : 0.5
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <ChevronRight className={`h-5 w-5 transition-colors duration-300 ${
                              selectedSpace?.id === space.id
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - 3D Space Viewport */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex-1 relative z-10 min-h-[600px] xl:min-h-0"
      >
        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-slate-800/95 dark:via-slate-800/90 dark:to-slate-900/85 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSpace?.id || 'no-space'}
              initial={{ 
                opacity: 0, 
                scale: 0.9,
                x: 100,
                rotateY: -15
              }}
              animate={{ 
                opacity: isTransitioning ? 0.7 : 1, 
                scale: 1,
                x: 0,
                rotateY: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 1.1,
                x: -100,
                rotateY: 15
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeInOut",
                scale: { duration: 0.6 },
                x: { duration: 0.7, ease: "easeOut" },
                rotateY: { duration: 0.8, ease: "easeInOut" }
              }}
              className="h-full flex flex-col"
              style={{ perspective: 1000 }}
            >
              {/* Immersive Header */}
              <div className="relative h-80 xl:h-96 overflow-hidden">
                {/* Dynamic Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  selectedSpace?.category === 'meeting' 
                    ? 'from-blue-500/40 via-indigo-500/30 to-purple-600/40'
                    : selectedSpace?.category === 'work'
                    ? 'from-purple-500/40 via-pink-500/30 to-rose-600/40'
                    : selectedSpace?.category === 'social'
                    ? 'from-orange-500/40 via-red-500/30 to-pink-600/40'
                    : selectedSpace?.category === 'training'
                    ? 'from-green-500/40 via-emerald-500/30 to-teal-600/40'
                    : selectedSpace?.category === 'wellness'
                    ? 'from-teal-500/40 via-cyan-500/30 to-blue-600/40'
                    : 'from-primary-500/40 via-primary-600/30 to-primary-700/40'
                } transition-all duration-1000`}>
                  
                  {/* Simplified Pattern Overlay - static for better performance */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), 
                                      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                      backgroundSize: '150px 150px'
                    }}
                  />
                  
                  {/* Simplified Floating Particles - reduced from 6 to 3 */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
                      animate={{
                        y: [-20, -40, -20],
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{
                        duration: 4 + (i * 1),
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "easeInOut"
                      }}
                      style={{
                        left: `${20 + (i * 20)}%`,
                        top: `${75}%`,
                        willChange: 'transform, opacity'
                      }}
                    />
                  ))}
                </div>

                {/* Top Controls */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-3 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20">
                      {selectedSpace && <selectedSpace.icon className="h-8 w-8 text-white drop-shadow-lg" />}
                    </div>
                    <div>
                      <h1 className="text-2xl xl:text-3xl font-bold text-white drop-shadow-lg">
                        {selectedSpace?.name || 'Select a Space'}
                      </h1>
                      <p className="text-white/90 text-sm xl:text-base drop-shadow-md">
                        {selectedSpace?.location || 'Choose from the list'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-xl rounded-full border border-white/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-white text-sm font-semibold drop-shadow-md">LIVE</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-xl rounded-full border border-white/20">
                      <Users className="h-4 w-4 text-white" />
                      <span className="text-white text-sm font-semibold drop-shadow-md">
                        {selectedSpace?.occupancy || 0}/{selectedSpace?.capacity || 0}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* 3D Viewport Indicator - simplified for performance */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "tween", duration: 0.3 }}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                >
                  <div className="flex items-center gap-3 px-6 py-3 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20">
                    <Monitor className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold text-sm drop-shadow-md">
                      3D Environment Ready
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  </div>
                </motion.div>
              </div>

              {/* Space Details Section */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                  {/* Environment Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary-600" />
                      Environment
                    </h3>
                    
                    {[
                      { icon: MapPin, label: 'Location', value: selectedSpace?.location || 'Unknown', color: 'text-blue-600' },
                      { icon: Thermometer, label: 'Temperature', value: selectedSpace?.temperature || 'N/A', color: 'text-orange-600' },
                      { icon: Lightbulb, label: 'Lighting', value: selectedSpace?.lighting || 'Unknown', color: 'text-yellow-600' },
                      { icon: Wifi, label: 'Connection', value: 'Ultra-Fast 5G', color: 'text-green-600' },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (index * 0.1) }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl backdrop-blur-sm"
                      >
                        <div className={`p-2 rounded-lg bg-white dark:bg-slate-600 shadow-sm`}>
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {item.value}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.label}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Live Activity Feed */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary-600" />
                      Live Activity
                    </h3>
                    
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {selectedSpace?.activities && selectedSpace.activities.length > 0 ? (
                        selectedSpace.activities.map((activity: { user: string; action: string; time: string }, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + (index * 0.1) }}
                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm"
                          >
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1 animate-pulse shadow-lg" />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                {activity.user}
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-200">
                                {activity.action}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.time}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <div className="text-lg font-medium mb-2">Peaceful & Quiet</div>
                          <div className="text-sm">No current activity in this space</div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Features & Amenities */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary-600" />
                      Features
                    </h3>
                    
                    <div className="space-y-3">
                      {selectedSpace?.features?.map((feature: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + (index * 0.05) }}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50/80 to-primary-100/80 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200/50 dark:border-primary-700/50 backdrop-blur-sm"
                        >
                          <Zap className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-primary-800 dark:text-primary-200">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Achievements */}
                    {selectedSpace?.achievements && selectedSpace.achievements.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Award className="h-5 w-5 text-amber-600" />
                          Achievements
                        </h4>
                        <div className="space-y-2">
                          {selectedSpace?.achievements?.map((achievement: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.4 + (index * 0.1) }}
                              className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200/50 dark:border-amber-700/50"
                            >
                              <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                {achievement}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200/50 dark:border-slate-600/50"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onJoinSpace}
                    className="flex-1 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-primary-500/25 hover:shadow-primary-500/40"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Play className="h-6 w-6" />
                      Enter with Avatar
                    </div>
                  </motion.button>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 border border-gray-300 dark:border-slate-500 rounded-2xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 shadow-lg"
                    >
                      <Headphones className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 border border-gray-300 dark:border-slate-500 rounded-2xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 shadow-lg"
                    >
                      <Settings className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 border border-gray-300 dark:border-slate-500 rounded-2xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 shadow-lg"
                    >
                      <Maximize2 className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}