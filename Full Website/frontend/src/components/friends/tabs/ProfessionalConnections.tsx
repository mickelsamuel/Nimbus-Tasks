'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Building2, 
  MapPin, 
  Phone,
  Mail,
  MessageSquare,
  Briefcase,
  Award,
  Calendar,
  Filter,
  Search,
  ExternalLink,
  UserPlus,
  Star
} from 'lucide-react'
import { FriendsData } from '../types'
import { FriendsData as ApiFriendsData } from '@/lib/api/friends'
import { useFriends } from '@/hooks/useFriends'

interface ProfessionalConnectionsProps {
  data?: FriendsData | ApiFriendsData
  isLoading?: boolean
}

export default function ProfessionalConnections({ data: propData, isLoading: propIsLoading }: ProfessionalConnectionsProps) {
  // Use hook data if props are not provided
  const { data: hookData, loading: hookLoading } = useFriends()
  
  const data = propData || hookData
  const isLoading = propIsLoading ?? hookLoading

  // Handle null/undefined data
  if (!data && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Unable to load professional connections</p>
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

  interface Connection {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
    location?: string;
    connectionDate: string;
    skills: string[];
    collaborationScore?: number;
    lastActive: string;
    status: string;
  }
  
  interface DataWithConnections {
    connections?: Connection[];
    colleagues?: Connection[];
  }
  
  // Use real connections data from API - handle both data structures
  const dataWithConnections = data as unknown as DataWithConnections
  const rawConnections = dataWithConnections?.connections || []
  const professionalConnections = rawConnections.map((connection: Connection) => ({
    id: connection.id,
    name: `${connection.firstName} ${connection.lastName}`,
    role: connection.role,
    company: 'Current Company', // This would come from API in a real implementation
    department: connection.department,
    location: connection.location || 'Location not specified',
    connectionType: 'Colleague',
    connectionDate: connection.connectionDate,
    projects: [], // This would come from API
    skills: connection.skills,
    endorsements: connection.collaborationScore || 0,
    collaborationRating: (connection.collaborationScore || 0) / 20, // Convert to 5-point scale
    lastInteraction: connection.lastActive,
    isStarred: false, // This would come from user preferences
    status: connection.status === 'online' ? 'available' : connection.status
  }))

  const connectionStats = {
    colleagues: professionalConnections.length,
    industryContacts: 0, // This would come from API in a real implementation
    consultants: 0, // This would come from API in a real implementation
    totalProjects: professionalConnections.reduce((sum: number, c: { projects: unknown[] }) => sum + c.projects.length, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'away': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'Colleague': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'Industry Contact': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'Consultant': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-8">
      {/* Connection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-blue-200 text-sm">Internal</span>
          </div>
          <div className="text-3xl font-bold mb-1">{connectionStats.colleagues}</div>
          <div className="text-blue-100">Colleagues</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Building2 className="h-8 w-8" />
            <span className="text-purple-200 text-sm">External</span>
          </div>
          <div className="text-3xl font-bold mb-1">{connectionStats.industryContacts}</div>
          <div className="text-purple-100">Industry Contacts</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="h-8 w-8" />
            <span className="text-green-200 text-sm">Service</span>
          </div>
          <div className="text-3xl font-bold mb-1">{connectionStats.consultants}</div>
          <div className="text-green-100">Consultants</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="h-8 w-8" />
            <span className="text-orange-200 text-sm">Shared</span>
          </div>
          <div className="text-3xl font-bold mb-1">{connectionStats.totalProjects}</div>
          <div className="text-orange-100">Active Projects</div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, company, skills, or projects..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              <option>All Types</option>
              <option>Colleagues</option>
              <option>Industry Contacts</option>
              <option>Consultants</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              <option>All Locations</option>
              <option>San Francisco, CA</option>
              <option>Austin, TX</option>
              <option>Remote</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {professionalConnections.map((connection, index: number) => (
          <motion.div
            key={connection.id as string}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {(connection.name as string).split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(connection.status as string)} rounded-full border-2 border-white dark:border-gray-800`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {connection.name as string}
                    </h3>
                    {(connection.isStarred as boolean) && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {connection.role as string}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {connection.company as string}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConnectionTypeColor(connection.connectionType as string)}`}>
                  {connection.connectionType as string}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {connection.collaborationRating as number}
                  </span>
                </div>
              </div>
            </div>

            {/* Location and Last Interaction */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {connection.location as string}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last contact: {connection.lastInteraction as string}
              </div>
            </div>

            {/* Current Projects */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Current Projects ({(connection.projects as unknown[]).length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {(connection.projects as string[]).slice(0, 3).map((project: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md">
                    {project}
                  </span>
                ))}
                {(connection.projects as unknown[]).length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                    +{(connection.projects as unknown[]).length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {(connection.skills as string[]).slice(0, 4).map((skill: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions and Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Award className="h-3 w-3" />
                <span>{connection.endorsements as number} endorsements</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-lg transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg transition-colors">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Add Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Expand Your Professional Network
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            <UserPlus className="h-4 w-4" />
            Add Connection
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Import Contacts
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sync from email or LinkedIn
            </p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Building2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Company Directory
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse all company employees
            </p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Industry Events
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Meet professionals at events
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}