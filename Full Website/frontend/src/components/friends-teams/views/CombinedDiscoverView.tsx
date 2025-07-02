'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Search, Filter, Users, Building2, UserPlus, Plus, Hash
} from 'lucide-react'
import { useFriends } from '@/hooks/useFriends'
import { useTeams } from '@/hooks/useTeams'
import { useAuth } from '@/contexts/AuthContext'

export default function CombinedDiscoverView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'people' | 'teams'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  
  const { user } = useAuth()
  const { data: friendsData, sendConnectionRequest } = useFriends()
  const { teams, joinTeam } = useTeams()
  
  const suggestedPeople = friendsData?.suggestedConnections || []
  const availableTeams = teams.filter(team => !team.members?.some(m => m.userId === user?.id))

  // Filter based on search and filters
  const filteredPeople = suggestedPeople.filter(person => {
    const matchesSearch = (person.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (person.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (person.department || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || person.department === selectedDepartment
    return matchesSearch && matchesDepartment && (activeFilter === 'all' || activeFilter === 'people')
  })

  const filteredTeams = availableTeams.filter(team => {
    const matchesSearch = (team.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (team.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (team.department || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || team.department === selectedDepartment
    return matchesSearch && matchesDepartment && (activeFilter === 'all' || activeFilter === 'teams')
  })

  const handleConnect = async (personId: string) => {
    await sendConnectionRequest(Number(personId), "I'd like to connect with you!")
  }

  const handleJoinTeam = async (teamId: string) => {
    await joinTeam(teamId)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="dashboard-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search people and teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {(['all', 'people', 'teams'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-3 rounded-xl font-medium capitalize transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter === 'people' && <Users className="h-4 w-4 inline mr-2" />}
                {filter === 'teams' && <Building2 className="h-4 w-4 inline mr-2" />}
                {filter}
              </button>
            ))}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* People Section */}
        {(activeFilter === 'all' || activeFilter === 'people') && filteredPeople.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Suggested Connections
              <span className="text-sm font-normal text-gray-500">
                ({filteredPeople.length} people)
              </span>
            </h3>
            
            <div className="space-y-3">
              {filteredPeople.slice(0, 5).map((person) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  className="dashboard-card rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={person.avatar || '/avatars/default.jpg'}
                        alt={person.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {person.name || 'Unknown'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {person.role || 'Professional'} • {person.department || 'General'}
                        </p>
                        {person.mutualConnections && person.mutualConnections > 0 && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {person.mutualConnections} mutual connections
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConnect(String(person.id))}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <UserPlus className="h-3 w-3 inline mr-1" />
                      Connect
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Teams Section */}
        {(activeFilter === 'all' || activeFilter === 'teams') && filteredTeams.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              Recommended Teams
              <span className="text-sm font-normal text-gray-500">
                ({filteredTeams.length} teams)
              </span>
            </h3>
            
            <div className="space-y-3">
              {filteredTeams.slice(0, 5).map((team) => (
                <motion.div
                  key={team._id || team.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: -4 }}
                  className="dashboard-card rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {(team.name || 'T').charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {team.name || 'Unknown Team'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {team.description || 'No description available'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {team.members?.length || 0} members
                            </span>
                            {team.department && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {team.department}
                              </span>
                            )}
                            {team.focusAreas && team.focusAreas.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                {team.focusAreas[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinTeam(team._id || team.id || '')}
                      className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors ml-4"
                    >
                      <Plus className="h-3 w-3 inline mr-1" />
                      Join
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredPeople.length === 0 && filteredTeams.length === 0 && (
        <div className="text-center py-12 dashboard-card rounded-2xl">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
            No results found
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}