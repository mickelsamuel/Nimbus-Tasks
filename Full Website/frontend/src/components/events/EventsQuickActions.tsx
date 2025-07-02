'use client'

import { Grid, List, RefreshCw, SlidersHorizontal, Download, Share2, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

interface EventsQuickActionsProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  eventCount: number
  onRefresh: () => void
}

export default function EventsQuickActions({ 
  viewMode, 
  onViewModeChange, 
  eventCount, 
  onRefresh 
}: EventsQuickActionsProps) {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap">
      {/* Enhanced Results Count */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 bg-green-500 rounded-full"
          />
          <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
            {eventCount.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {eventCount === 1 ? 'event' : 'events'} found
          </span>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="text-blue-500"
        >
          <BarChart3 className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Enhanced Actions */}
      <div className="flex items-center gap-3">
        {/* Enhanced View Mode Toggle */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 rounded-2xl p-2 border border-white/30 dark:border-slate-600/50 shadow-lg"
        >
          <motion.button
            onClick={() => onViewModeChange('grid')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50'
            }`}
          >
            {viewMode === 'grid' && (
              <motion.div
                layoutId="viewMode"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Grid className="w-5 h-5 relative z-10" />
          </motion.button>
          
          <motion.button
            onClick={() => onViewModeChange('list')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50'
            }`}
          >
            {viewMode === 'list' && (
              <motion.div
                layoutId="viewMode"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <List className="w-5 h-5 relative z-10" />
          </motion.button>
        </motion.div>

        {/* Enhanced Action Buttons */}
        {[
          { icon: RefreshCw, onClick: onRefresh, color: 'green', label: 'Refresh' },
          { icon: SlidersHorizontal, onClick: () => {
            // Implement basic filters functionality
            const filterOptions = ['All Events', 'Upcoming', 'This Week', 'This Month']
            const selectedFilter = prompt(`Select filter:\n${filterOptions.map((option, i) => `${i + 1}. ${option}`).join('\n')}`)
            if (selectedFilter) {
              console.log('Filter applied:', filterOptions[parseInt(selectedFilter) - 1] || 'All Events')
            }
          }, color: 'purple', label: 'Filters' },
          { icon: Download, onClick: () => {
            // Implement basic export functionality
            const data = {
              timestamp: new Date().toISOString(),
              eventCount,
              exportedBy: 'User',
              events: 'Event data would be exported here'
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `events-export-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            URL.revokeObjectURL(url)
          }, color: 'blue', label: 'Export' },
          { icon: Share2, onClick: () => {
            // TODO: Implement share functionality
            console.log('Sharing events...')
            if (navigator.share) {
              navigator.share({
                title: 'Banking Events',
                text: `Check out these ${eventCount} amazing events!`,
                url: window.location.href
              }).catch(console.error)
            } else {
              // Fallback for browsers that don't support Web Share API
              navigator.clipboard.writeText(window.location.href)
              alert('Event link copied to clipboard!')
            }
          }, color: 'pink', label: 'Share' }
        ].map((action, index) => {
          const IconComponent = action.icon
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.1, 
                y: -2,
                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2)`
              }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className={`group relative p-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/50 text-gray-600 dark:text-gray-400 hover:text-white transition-all duration-300 shadow-lg overflow-hidden`}
              title={action.label}
            >
              {/* Hover background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                action.color === 'green' ? 'from-green-500 to-emerald-500' :
                action.color === 'purple' ? 'from-purple-500 to-violet-500' :
                action.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                'from-pink-500 to-rose-500'
              }`} />
              
              <motion.div
                animate={action.icon === RefreshCw ? {
                  rotate: [0, 360]
                } : {}}
                transition={action.icon === RefreshCw ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                } : {}}
                className="relative z-10"
              >
                <IconComponent className="w-5 h-5" />
              </motion.div>
              
              {/* Sparkle effect on hover */}
              <motion.div
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
              />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}