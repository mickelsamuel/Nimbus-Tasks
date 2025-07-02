'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Building2, 
  Search,
  Filter,
  Network
} from 'lucide-react'
import { FriendsData } from '../types'
import { FriendsData as ApiFriendsData } from '@/lib/api/friends'
import UserCard from '../components/UserCard'
import { useState } from 'react'
import { useFriends } from '@/hooks/useFriends'

interface ColleagueDirectoryProps {
  data?: FriendsData | ApiFriendsData
  isLoading?: boolean
}

export default function ColleagueDirectory({ data: propData, isLoading: propIsLoading }: ColleagueDirectoryProps) {
  // Use hook data if props are not provided
  const { data: hookData, loading: hookLoading } = useFriends()
  
  const data = propData || hookData
  const isLoading = propIsLoading ?? hookLoading
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Analytics', 'Strategy']
  
  // Use the correct property from API response
  const connections = data?.connections || data?.colleagues || []
  
  const getDepartmentStats = (dept: string) => {
    return connections.filter(user => user.department === dept).length
  }

  const filteredConnections = connections.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.role}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  // Calculate stats from the connections data
  const stats = {
    onlineFriends: connections.filter(user => user.status === 'online' || user.isOnline).length,
    totalConnections: connections.length,
    activeDepartments: departments.filter(dept => getDepartmentStats(dept) > 0).length
  }

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Engineering': 'from-blue-500 to-cyan-600',
      'Product': 'from-purple-500 to-indigo-600',
      'Design': 'from-pink-500 to-rose-600',
      'Marketing': 'from-orange-500 to-red-600',
      'Analytics': 'from-emerald-500 to-teal-600',
      'Strategy': 'from-indigo-500 to-purple-600',
    }
    return colors[department as keyof typeof colors] || 'from-gray-500 to-slate-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
          <div className="p-8">
            <div className="loading-shimmer h-8 w-64 rounded-lg mb-4 mx-auto" />
            <div className="loading-shimmer h-4 w-96 rounded-lg mx-auto" />
          </div>
        </div>

        {/* Loading Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-2xl p-6 shadow-lg">
              <div className="loading-shimmer h-12 w-12 rounded-xl mb-4 mx-auto" />
              <div className="loading-shimmer h-6 w-16 rounded-lg mb-2 mx-auto" />
              <div className="loading-shimmer h-4 w-24 rounded-lg mx-auto" />
            </div>
          ))}
        </div>

        {/* Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="loading-shimmer w-20 h-20 rounded-full" />
                <div className="flex-1">
                  <div className="loading-shimmer h-6 rounded mb-2" />
                  <div className="loading-shimmer h-4 rounded w-2/3 mb-2" />
                  <div className="loading-shimmer h-4 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="loading-shimmer h-6 w-16 rounded-full" />
                  <div className="loading-shimmer h-6 w-20 rounded-full" />
                  <div className="loading-shimmer h-6 w-14 rounded-full" />
                </div>
                <div className="loading-shimmer h-12 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-slate-900 min-h-full">
      {/* Enhanced Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 relative overflow-hidden rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-60"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8 text-center">
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          >
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
              <Network className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Professional Network Hub
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-lg text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Connect with {connections.length} colleagues across {departments.length} departments
          </motion.p>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{connections.length}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Total Colleagues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.onlineFriends}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{departments.length}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{connections.length > 0 ? Math.round(connections.reduce((acc, user) => acc + (user.collaborationHistory || 0), 0) / connections.length) : 0}%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Avg Synergy</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Search and Filter */}
      <motion.div 
        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-2xl p-6 shadow-lg relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search colleagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
            />
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setSelectedDepartment('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedDepartment === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All ({connections.length})
            </motion.button>
            
            {departments.map((dept) => (
              <motion.button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedDepartment === dept
                    ? `bg-gradient-to-r ${getDepartmentColor(dept)} text-white shadow-lg`
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {dept} ({getDepartmentStats(dept)})
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Department Overview Cards */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {departments.map((dept, index) => {
          const count = getDepartmentStats(dept)
          const avgScore = Math.round(
            connections
              .filter(user => user.department === dept)
              .reduce((acc, user) => acc + (user.collaborationHistory || 0), 0) / count
          ) || 0

          return (
            <motion.div
              key={dept}
              className="achievement-ring-card group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => setSelectedDepartment(dept)}
            >
              <div className="text-center">
                <motion.div 
                  className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${getDepartmentColor(dept)} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Building2 className="h-6 w-6 text-white" />
                </motion.div>
                
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{count}</div>
                <div className="text-xs text-gray-700 dark:text-gray-300 mb-2">{dept}</div>
                
                {/* Synergy Bar */}
                <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                  <motion.div
                    className={`h-1.5 bg-gradient-to-r ${getDepartmentColor(dept)} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${avgScore}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{avgScore}% synergy</div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Results Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedDepartment === 'all' ? 'All Colleagues' : `${selectedDepartment} Team`}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {filteredConnections.length} colleague{filteredConnections.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-white/10 dark:bg-white/10 bg-gray-200/50 text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="h-5 w-5" />
          </motion.button>
          <motion.button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-white/10 dark:bg-white/10 bg-gray-200/50 text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Colleagues Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredConnections.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                type: "spring",
                bounce: 0.4
              }}
            >
              <UserCard
                user={user}
                variant="default"
                onMessage={(userId) => console.log('Message user:', userId)}
                showActions={true}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredConnections.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-3xl p-12 max-w-md mx-auto shadow-xl">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">No colleagues found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            <motion.button
              onClick={() => {
                setSearchTerm('')
                setSelectedDepartment('all')
              }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}