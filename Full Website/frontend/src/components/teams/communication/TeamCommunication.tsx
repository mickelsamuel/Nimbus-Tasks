'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Users, Settings, Plus, Hash, Video, Phone, Mic, MicOff, VideoOff } from 'lucide-react'
import { TeamChat } from './TeamChat'

interface TeamMember {
  id: string
  name: string
  avatar: string
  status: 'online' | 'away' | 'busy' | 'offline'
  role: string
  department: string
  lastSeen: string
}

interface TeamCommunicationProps {
  teamId: string
  teamName: string
  isOpen: boolean
  onClose: () => void
}

export function TeamCommunication({ teamId, teamName, isOpen, onClose }: TeamCommunicationProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'settings'>('chat')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false)
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  useEffect(() => {
    if (isOpen && teamId) {
      fetchTeamMembers()
    }
  }, [isOpen, teamId])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teams/${teamId}/members`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const startVoiceCall = () => {
    setIsVoiceCallActive(true)
    // Implement voice call logic here
    console.log('Starting voice call for team:', teamId)
  }

  const startVideoCall = () => {
    setIsVideoCallActive(true)
    setIsVoiceCallActive(true)
    // Implement video call logic here
    console.log('Starting video call for team:', teamId)
  }

  const endCall = () => {
    setIsVoiceCallActive(false)
    setIsVideoCallActive(false)
    setIsMuted(false)
    setIsVideoEnabled(true)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {teamName}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Team Communication
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Call Controls */}
                {(isVoiceCallActive || isVideoCallActive) && (
                  <div className="flex items-center gap-2 mr-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm text-red-600 dark:text-red-400">
                        {isVideoCallActive ? 'Video Call' : 'Voice Call'} Active
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={toggleMute}
                        className={`p-1.5 rounded ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'} hover:bg-opacity-80 transition-colors`}
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                      
                      {isVideoCallActive && (
                        <button
                          onClick={toggleVideo}
                          className={`p-1.5 rounded ${!isVideoEnabled ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'} hover:bg-opacity-80 transition-colors`}
                        >
                          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </button>
                      )}
                      
                      <button
                        onClick={endCall}
                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <Phone className="h-4 w-4 transform rotate-[135deg]" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Tab Navigation */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'chat'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'members'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Users className="h-4 w-4 inline mr-1" />
                    Members
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Settings className="h-4 w-4 inline mr-1" />
                    Settings
                  </button>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full"
                >
                  <TeamChat teamId={teamId} teamName={teamName} />
                </motion.div>
              )}

              {activeTab === 'members' && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full p-6 overflow-y-auto"
                >
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Team Members
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {members.length} member{members.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={startVoiceCall}
                          disabled={isVoiceCallActive}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          Voice Call
                        </button>
                        <button
                          onClick={startVideoCall}
                          disabled={isVideoCallActive}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                        >
                          <Video className="h-4 w-4" />
                          Video Call
                        </button>
                      </div>
                    </div>

                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                              <div className="flex-1">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map((member) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="relative">
                                <img
                                  src={member.avatar || '/avatars/default.jpg'}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-full"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {member.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Department:</span>
                                <span className="text-gray-900 dark:text-white">{member.department}</span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                <span className={`capitalize font-medium ${
                                  member.status === 'online' ? 'text-green-600' :
                                  member.status === 'away' ? 'text-yellow-600' :
                                  member.status === 'busy' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}>
                                  {member.status}
                                </span>
                              </div>
                              
                              {member.status !== 'online' && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Last seen:</span>
                                  <span className="text-gray-900 dark:text-white">
                                    {formatLastSeen(member.lastSeen)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                                Send Direct Message
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full p-6 overflow-y-auto"
                >
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Communication Settings
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Notification Settings */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Notifications
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                Message Notifications
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Get notified when someone sends a message
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                Call Notifications
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Get notified for incoming voice/video calls
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                Desktop Notifications
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Show notifications on your desktop
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Privacy Settings */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Privacy
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                Show Online Status
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Let team members see when you're online
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                Read Receipts
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Show others when you've read their messages
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Channel Management */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Channel Management
                        </h4>
                        
                        <div className="space-y-4">
                          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <Plus className="h-4 w-4" />
                            Create New Channel
                          </button>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Only team leaders and admins can create new channels.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}