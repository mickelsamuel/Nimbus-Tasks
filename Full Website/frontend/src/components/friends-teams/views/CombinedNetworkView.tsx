'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Users, UserPlus, Search, CheckCircle, XCircle, 
  Clock, Activity, UserCheck, Mail,
  Building2, Calendar, MoreVertical
} from 'lucide-react'
import { useFriends } from '@/hooks/useFriends'
import { useAuth } from '@/contexts/AuthContext'

export default function CombinedNetworkView() {
  const [activeSection, setActiveSection] = useState<'connections' | 'requests'>('connections')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all')
  
  const { } = useAuth()
  const { data: friendsData, loading, acceptRequest, rejectRequest } = useFriends()
  
  const colleagues = friendsData?.colleagues || []
  const connectionRequests = friendsData?.connectionRequests || []
  
  // Filter connections based on search and status
  const filteredConnections = colleagues.filter(colleague => {
    const matchesSearch = (colleague.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (colleague.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (colleague.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'online' && colleague.isOnline) ||
                         (filterStatus === 'offline' && !colleague.isOnline)
    return matchesSearch && matchesStatus
  })

  const handleAcceptRequest = async (requestId: string) => {
    await acceptRequest(Number(requestId))
  }

  const handleRejectRequest = async (requestId: string) => {
    await rejectRequest(Number(requestId))
  }

  return (
    <div className="space-y-6">
      {/* Section Toggle */}
      <div className="flex items-center gap-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
        <button
          onClick={() => setActiveSection('connections')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeSection === 'connections'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          My Connections
          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            {colleagues.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSection('requests')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeSection === 'requests'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Pending Requests
          {connectionRequests.length > 0 && (
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              {connectionRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Search and Filters */}
      {activeSection === 'connections' && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search connections by name, role, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {(['all', 'online', 'offline'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-3 rounded-xl font-medium capitalize transition-all duration-300 ${
                  filterStatus === status
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status === 'online' && <div className="w-2 h-2 bg-green-400 rounded-full mr-2 inline-block" />}
                {status === 'offline' && <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 inline-block" />}
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'connections' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="dashboard-card rounded-2xl p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div>
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredConnections.length > 0 ? (
                filteredConnections.map((colleague) => (
                  <motion.div
                    key={colleague.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="dashboard-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Image
                            src={colleague.avatar || '/avatars/default.jpg'}
                            alt={colleague.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {colleague.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-800" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {colleague.name || 'Unknown'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {colleague.role || 'Professional'}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {colleague.department && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Building2 className="h-3 w-3" />
                          {colleague.department}
                        </div>
                      )}
                      {colleague.lastActive && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          Last active {colleague.lastActive}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-3 w-3 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">Connection strength:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {colleague.connectionStrength || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                        <Mail className="h-3 w-3 inline mr-1" />
                        Message
                      </button>
                      <button className="px-3 py-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                        View Profile
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No connections found matching your criteria
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Requests Section
            <div className="space-y-4">
              {connectionRequests.length > 0 ? (
                connectionRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="dashboard-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={request.avatar || '/avatars/default.jpg'}
                          alt={request.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {request.name || 'Unknown'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {request.role || 'Professional'}
                          </p>
                          {request.message && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                              &ldquo;{request.message}&rdquo;
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {request.mutualConnections && request.mutualConnections > 0 && (
                              <span>
                                <UserCheck className="h-3 w-3 inline mr-1" />
                                {request.mutualConnections} mutual connections
                              </span>
                            )}
                            <span>
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(request.sentDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptRequest(String(request.id))}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectRequest(String(request.id))}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                        >
                          <XCircle className="h-4 w-4 inline mr-1" />
                          Decline
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 dashboard-card rounded-2xl">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No pending connection requests
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}