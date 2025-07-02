'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  MessageSquare, Users, Building2, Search, Send, Paperclip,
  Smile, Phone, Video, Info, Pin
} from 'lucide-react'
import { useFriends } from '@/hooks/useFriends'
import { useTeams } from '@/hooks/useTeams'
import { useAuth } from '@/contexts/AuthContext'


interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  type: 'direct' | 'team'
  isOnline?: boolean
  isPinned?: boolean
}

export default function CombinedCommunicationView() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'teams'>('all')
  
  const { } = useAuth()
  const { data: friendsData } = useFriends()
  const { myTeams } = useTeams()
  
  // Mock conversations data - would come from API
  const conversations: Conversation[] = [
    // Direct messages from friends
    ...(friendsData?.colleagues || []).slice(0, 5).map((colleague, index) => ({
      id: `direct-${colleague.id}`,
      name: colleague.name,
      avatar: colleague.avatar || '/avatars/default.jpg',
      lastMessage: index === 0 ? "Hey, are you available for a quick call?" : "Thanks for your help yesterday!",
      timestamp: index === 0 ? "2 min ago" : `${index + 1}h ago`,
      unreadCount: index === 0 ? 2 : 0,
      type: 'direct' as const,
      isOnline: colleague.isOnline,
      isPinned: index === 0
    })),
    // Team messages
    ...(myTeams || []).slice(0, 3).map((team, index) => ({
      id: `team-${team._id || team.id}`,
      name: team.name,
      avatar: team.avatar || '/avatars/team-default.jpg',
      lastMessage: index === 0 ? "New project update posted" : "Meeting scheduled for tomorrow",
      timestamp: `${index + 3}h ago`,
      unreadCount: index === 0 ? 5 : 0,
      type: 'team' as const,
      isPinned: index === 1
    }))
  ]

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = (conv.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || 
                       (filterType === 'direct' && conv.type === 'direct') ||
                       (filterType === 'teams' && conv.type === 'team')
    return matchesSearch && matchesType
  }).sort((a, b) => {
    // Sort by pinned first, then by unread, then by time
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1
    return 0
  })

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Send message logic here
      setMessageInput('')
    }
  }

  return (
    <div className="h-[600px] flex gap-6">
      {/* Conversations List */}
      <div className="w-1/3 dashboard-card rounded-2xl p-4 flex flex-col">
        {/* Search and Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            {(['all', 'direct', 'teams'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {type === 'direct' && <Users className="h-3 w-3 inline mr-1" />}
                {type === 'teams' && <Building2 className="h-3 w-3 inline mr-1" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredConversations.map((conv) => (
            <motion.button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              whileHover={{ x: 2 }}
              className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                selectedConversation === conv.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Image
                    src={conv.avatar}
                    alt={conv.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  {conv.type === 'direct' && conv.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {conv.name || 'Unknown'}
                    </h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {conv.isPinned && <Pin className="h-3 w-3" />}
                      {conv.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate pr-2">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full min-w-[20px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 dashboard-card rounded-2xl flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedConv.avatar}
                    alt={selectedConv.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedConv.name || 'Unknown'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedConv.type === 'direct' && selectedConv.isOnline ? 'Active now' : 
                       selectedConv.type === 'team' ? `${Math.floor(Math.random() * 50) + 10} members` : 
                       'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Video className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Info className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Start a conversation with {selectedConv.name || 'this contact'}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                    <Smile className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}