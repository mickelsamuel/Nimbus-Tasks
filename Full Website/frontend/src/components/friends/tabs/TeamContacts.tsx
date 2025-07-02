'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  Mail,
  MessageSquare,
  Building2,
  UserCheck,
  Info
} from 'lucide-react'
import { FriendsData } from '../types'

interface TeamContactsProps {
  data: FriendsData
  isLoading: boolean
  contactRequests?: Array<{
    id: number
    from: {
      name: string
      role: string
      department: string
      email: string
      avatar: string
    }
    reason: string
    message: string
    timestamp: string
    urgency: string
    project: string
  }>
  pendingInvitations?: Array<{
    id: number
    to: string
    role: string
    department: string
    status: string
    sentDate: string
    reason: string
  }>
  recentConnections?: Array<{
    id: number
    name: string
    role: string
    department: string
    connectedDate: string
    projects: string[]
  }>
}

export default function TeamContacts({ 
  data, 
  isLoading,
  contactRequests = [],
  pendingInvitations = [],
  recentConnections = []
}: TeamContactsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
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


  const handleAcceptRequest = (requestId: number) => {
    console.log('Accepting request:', requestId)
    // Handle accept logic
  }

  const handleDeclineRequest = (requestId: number) => {
    console.log('Declining request:', requestId)
    // Handle decline logic
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Mail className="h-8 w-8" />
            <span className="text-orange-200 text-sm">New</span>
          </div>
          <div className="text-3xl font-bold mb-1">{contactRequests.length}</div>
          <div className="text-orange-100">Contact Requests</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8" />
            <span className="text-blue-200 text-sm">Pending</span>
          </div>
          <div className="text-3xl font-bold mb-1">{pendingInvitations.length}</div>
          <div className="text-blue-100">Sent Invitations</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <UserCheck className="h-8 w-8" />
            <span className="text-green-200 text-sm">This week</span>
          </div>
          <div className="text-3xl font-bold mb-1">{recentConnections.length}</div>
          <div className="text-green-100">New Connections</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-purple-200 text-sm">Total</span>
          </div>
          <div className="text-3xl font-bold mb-1">{data.stats.totalConnections}</div>
          <div className="text-purple-100">Team Contacts</div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Contact Requests */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contact Requests
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {contactRequests.length} pending
              </span>
            </div>
            
            <div className="space-y-6">
              {contactRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-xl p-6 transition-all duration-200 ${
                    request.urgency === 'high' 
                      ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {request.from.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {request.from.name}
                        </h3>
                        {request.urgency === 'high' && (
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {request.from.role} • {request.from.department}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {request.from.email}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {request.timestamp}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Project: {request.project}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Reason: {request.reason}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        &quot;{request.message}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </button>
                  </div>
                </motion.div>
              ))}

              {contactRequests.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                  <p>You&apos;re all caught up with contact requests!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Invitations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sent Invitations
            </h3>
            
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {invitation.to}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {invitation.role} • {invitation.department}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Sent {new Date(invitation.sentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invitation.status === 'viewed' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {invitation.status === 'viewed' ? 'Viewed' : 'Pending'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Connections */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Connections
            </h3>
            
            <div className="space-y-3">
              {recentConnections.map((connection) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {connection.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {connection.role} • {connection.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Connected {new Date(connection.connectedDate).toLocaleDateString()}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {connection.projects.slice(0, 2).map((project, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                        {project}
                      </span>
                    ))}
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