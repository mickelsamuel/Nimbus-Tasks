'use client'

import { motion } from 'framer-motion'
import { 
  Building2, 
  MapPin, 
  Users,
  UserPlus,
  Award,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { FriendsData } from '../types'
import { FriendsData as ApiFriendsData } from '@/lib/api/friends'
import { useFriends } from '@/hooks/useFriends'

interface BusinessNetworkProps {
  data?: FriendsData | ApiFriendsData
  isLoading?: boolean
  industryPartners?: Array<{
    id: number
    name: string
    type: string
    location: string
    contact: string
    contactRole: string
    relationship: string
    projects: number
    description: string
    skills: string[]
    logo: string
  }>
  networkingEvents?: Array<{
    id: number
    title: string
    date: string
    location: string
    attendees: number
    type: string
    description: string
  }>
  professionalGroups?: Array<{
    id: number
    name: string
    members: number
    description: string
    category: string
    activity: string
  }>
}

export default function BusinessNetwork({ 
  data: propData,
  isLoading: propIsLoading, 
  industryPartners = [],
  networkingEvents = [],
  professionalGroups = []
}: BusinessNetworkProps) {
  // Use hook data if props are not provided
  const { data: hookData, loading: hookLoading } = useFriends()
  
  const data = propData || hookData
  const isLoading = propIsLoading ?? hookLoading

  // Handle null/undefined data
  if (!data && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Unable to load business network data</p>
      </div>
    )
  }
  if (isLoading) {
    return (
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
    )
  }


  return (
    <div className="space-y-8">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Building2 className="h-8 w-8" />
            <span className="text-blue-200 text-sm">Partners</span>
          </div>
          <div className="text-3xl font-bold mb-1">{industryPartners.length}</div>
          <div className="text-blue-100">Business Partners</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-green-200 text-sm">Groups</span>
          </div>
          <div className="text-3xl font-bold mb-1">{professionalGroups.length}</div>
          <div className="text-green-100">Professional Groups</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8" />
            <span className="text-purple-200 text-sm">This month</span>
          </div>
          <div className="text-3xl font-bold mb-1">{networkingEvents.length}</div>
          <div className="text-purple-100">Networking Events</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="h-8 w-8" />
            <span className="text-orange-200 text-sm">Active</span>
          </div>
          <div className="text-3xl font-bold mb-1">{industryPartners.reduce((sum, partner) => sum + partner.projects, 0)}</div>
          <div className="text-orange-100">Collaborations</div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Industry Partners */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Industry Partners
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                <UserPlus className="h-4 w-4" />
                Add Partner
              </button>
            </div>
            
            <div className="space-y-4">
              {industryPartners.map((partner) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {partner.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {partner.type}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {partner.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        partner.relationship === 'Strategic Partner' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        partner.relationship === 'Client' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        {partner.relationship}
                      </span>
                      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {partner.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Contact: <span className="font-medium text-gray-900 dark:text-white">{partner.contact}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {partner.contactRole}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {partner.projects} active projects
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {partner.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Networking Events
            </h3>
            
            <div className="space-y-4">
              {networkingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {event.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'Conference' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      event.type === 'Workshop' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.attendees}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Professional Groups */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Professional Groups
            </h3>
            
            <div className="space-y-3">
              {professionalGroups.map((group) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {group.name}
                    </h4>
                    <div className={`w-2 h-2 rounded-full ${
                      group.activity === 'High' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {group.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {group.members} members
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                      {group.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}