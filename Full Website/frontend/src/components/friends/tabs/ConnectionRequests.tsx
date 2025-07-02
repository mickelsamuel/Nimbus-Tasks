'use client'

import { motion } from 'framer-motion'
import { UserPlus, MessageCircle, Clock, Check, X, Users } from 'lucide-react'
import { FriendsData } from '../types'
import { FriendsData as ApiFriendsData, ConnectionRequest } from '@/lib/api/friends'
import { friendsApi } from '@/lib/api/friends'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFriends } from '@/hooks/useFriends'

interface ConnectionRequestsProps {
  data?: FriendsData | ApiFriendsData
  isLoading?: boolean
  onRefresh?: () => void
}

export default function ConnectionRequests({ data: propData, isLoading: propIsLoading, onRefresh }: ConnectionRequestsProps) {
  // Always call hooks at the top level
  const { data: hookData, loading: hookLoading, refetch } = useFriends()
  const router = useRouter()
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set())
  
  const data = propData || hookData
  const isLoading = propIsLoading ?? hookLoading
  const refreshData = onRefresh || refetch

  // Handle null/undefined data
  if (!data && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Unable to load connection requests</p>
      </div>
    )
  }

  const handleAcceptRequest = async (requestId: number) => {
    try {
      setProcessingRequests(prev => new Set(prev).add(requestId))
      const response = await friendsApi.acceptConnection(requestId)
      
      if (response.success) {
        // Show success message (you could use a toast here)
        console.log('Connection request accepted successfully')
        // Refresh the data to update UI
        if (refreshData) {
          refreshData()
        }
      } else {
        console.error('Failed to accept connection request')
      }
    } catch (error) {
      console.error('Failed to accept connection request:', error)
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const handleDeclineRequest = async (requestId: number) => {
    try {
      setProcessingRequests(prev => new Set(prev).add(requestId))
      const response = await friendsApi.declineConnection(requestId)
      
      if (response.success) {
        // Show success message
        console.log('Connection request declined successfully')
        // Refresh the data to update UI
        if (refreshData) {
          refreshData()
        }
      } else {
        console.error('Failed to decline connection request')
      }
    } catch (error) {
      console.error('Failed to decline connection request:', error)
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <UserPlus className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Connection Requests
          </h2>
          {data?.pendingRequests && data?.pendingRequests.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-sm font-medium">
              {data?.pendingRequests.length} pending
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          People who want to connect with you
        </p>
      </div>

      {/* Pending Requests */}
      {data?.pendingRequests && data?.pendingRequests.length > 0 ? (
        <div className="space-y-4">
          {data?.pendingRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {request.from.firstName[0]}{request.from.lastName[0]}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
                    request.from.status === 'online' ? 'bg-green-500' :
                    request.from.status === 'away' ? 'bg-yellow-500' :
                    request.from.status === 'busy' ? 'bg-red-500' :
                    'bg-gray-400'
                  }`} />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {request.from.firstName} {request.from.lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {request.from.role} • {request.from.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{request.timestamp}</span>
                    </div>
                  </div>

                  {/* Request Message */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      &ldquo;{request.message}&rdquo;
                    </p>
                  </div>

                  {/* Mutual Connections & Skills */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4" />
                      <span>{request.mutualConnections} mutual connections</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {request.from.skills.slice(0, 4).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={processingRequests.has(request.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors group relative"
                      title={`Accept connection request from ${request.from.firstName} ${request.from.lastName}`}
                    >
                      {processingRequests.has(request.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {processingRequests.has(request.id) ? 'Processing...' : 'Accept'}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                        Add to your network
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeclineRequest(request.id)}
                      disabled={processingRequests.has(request.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors group relative"
                      title={`Decline connection request from ${request.from.firstName} ${request.from.lastName}`}
                    >
                      {processingRequests.has(request.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      {processingRequests.has(request.id) ? 'Processing...' : 'Decline'}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                        Remove this request
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Navigate to chat page with the user's ID as a parameter
                        router.push(`/chat?user=${request.from.id}&name=${encodeURIComponent(request.from.firstName + ' ' + request.from.lastName)}`);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group relative"
                      title={`Send a message to ${request.from.firstName} ${request.from.lastName}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                        Start conversation
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No pending requests
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            When people send you connection requests, they&apos;ll appear here
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Find People to Connect
          </motion.button>
        </motion.div>
      )}

      {/* Quick Stats */}
      {data?.pendingRequests && data?.pendingRequests.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Request Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {data?.pendingRequests.length}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Pending Requests
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {data?.pendingRequests.reduce((sum: number, req: ConnectionRequest) => sum + (req.from.collaborationHistory || 0), 0)}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Total Collaboration History
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {new Set(data?.pendingRequests.map((req: { from: { department: string } }) => req.from.department)).size}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Different Departments
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}