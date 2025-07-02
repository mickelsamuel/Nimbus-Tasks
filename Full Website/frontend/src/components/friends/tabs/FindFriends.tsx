'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Users, 
  MapPin, 
  Briefcase,
  X,
  SlidersHorizontal
} from 'lucide-react'
import { FriendsData, SearchFilters } from '../types'
import UserCard from '../components/UserCard'

interface FindFriendsProps {
  data: FriendsData
  isLoading: boolean
}

const departments = [
  'All Departments',
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Analytics',
  'Strategy',
  'Operations',
  'HR'
]

const allSkills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'Vue.js', 'CSS',
  'Figma', 'User Research', 'Prototyping', 'Strategy', 'Analytics', 'UX',
  'Digital Marketing', 'Content', 'Business Intelligence', 'SQL', 'Excel',
  'Machine Learning', 'Data Science'
]

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'online', label: 'Online' },
  { value: 'away', label: 'Away' },
  { value: 'offline', label: 'Offline' }
]

export default function FindFriends({ data, isLoading }: FindFriendsProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    department: 'All Departments',
    skills: [],
    status: 'all',
    searchTerm: '',
    departmentFilter: '',
    mentorshipFilter: '',
    statusFilter: '',
    skillsFilter: []
  })
  const [showFilters, setShowFilters] = useState(false)

  // Combine suggested connections with a few existing connections for demo
  const allUsers = [...data.suggestedConnections, ...data.connections.slice(0, 2)]

  // Filter users based on search criteria
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = searchFilters.searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())

    const matchesDepartment = searchFilters.department === 'All Departments' || 
      user.department === searchFilters.department

    const matchesSkills = searchFilters.skills.length === 0 ||
      searchFilters.skills.some(skill => user.skills.includes(skill))

    const matchesStatus = searchFilters.status === 'all' ||
      user.status === searchFilters.status

    return matchesSearch && matchesDepartment && matchesSkills && matchesStatus
  })

  const handleSkillToggle = (skill: string) => {
    setSearchFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const clearFilters = () => {
    setSearchFilters({
      department: 'All Departments',
      skills: [],
      status: 'all',
      searchTerm: '',
      departmentFilter: '',
      mentorshipFilter: '',
      statusFilter: '',
      skillsFilter: []
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Discover New Connections
        </h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={searchFilters.searchTerm}
            onChange={(e) => setSearchFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {(searchFilters.department !== 'All Departments' || searchFilters.skills.length > 0 || searchFilters.status !== 'all') && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </motion.button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredUsers.length} people found
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Department
                </label>
                <select
                  value={searchFilters.department}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Status
                </label>
                <select
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="w-full p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Clear Filters
                </motion.button>
              </div>
            </div>

            {/* Skills Filter */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Skills ({searchFilters.skills.length} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <motion.button
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      searchFilters.skills.includes(skill)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {skill}
                    {searchFilters.skills.includes(skill) && (
                      <X className="inline h-3 w-3 ml-1" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            variant="suggested"
            onConnect={(userId) => console.log('Connect to user:', userId)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No people found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear All Filters
          </motion.button>
        </div>
      )}
    </div>
  )
}