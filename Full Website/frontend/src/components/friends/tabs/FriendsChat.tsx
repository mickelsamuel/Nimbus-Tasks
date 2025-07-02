'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from 'lucide-react'
import { FriendsData, User } from '../types'

interface FriendsChatProps {
  data: FriendsData
  isLoading: boolean
}

interface Message {
  id: number
  text: string
  timestamp: string
  isMe: boolean
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'file' | 'image'
}

interface ChatConversation {
  id: number
  user: User
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: Message[]
}

const mockConversations: ChatConversation[] = [
  {
    id: 1,
    user: {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'Senior Developer',
      department: 'Engineering',
      avatar: '/avatars/sarah.jpg',
      status: 'online',
      lastActive: '2 min ago',
      mutualFriends: 5,
      skills: ['React', 'TypeScript', 'Node.js'],
      isOnline: true,
      connectionDate: '2024-01-15',
      messageCount: 23,
      collaborationScore: 85
    },
    lastMessage: 'Sounds good! Let me know when you have time to review.',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
    messages: [
      {
        id: 1,
        text: 'Hey! How are things going with the new project?',
        timestamp: '10:30 AM',
        isMe: false,
        status: 'read',
        type: 'text'
      },
      {
        id: 2,
        text: 'Going well! Just finished the authentication module. Want to take a look?',
        timestamp: '10:32 AM',
        isMe: true,
        status: 'read',
        type: 'text'
      },
      {
        id: 3,
        text: 'Absolutely! I can review it this afternoon.',
        timestamp: '10:35 AM',
        isMe: false,
        status: 'read',
        type: 'text'
      },
      {
        id: 4,
        text: 'Sounds good! Let me know when you have time to review.',
        timestamp: '10:36 AM',
        isMe: false,
        status: 'delivered',
        type: 'text'
      }
    ]
  },
  {
    id: 2,
    user: {
      id: 2,
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'Product Manager',
      department: 'Product',
      avatar: '/avatars/michael.jpg',
      status: 'away',
      lastActive: '1 hour ago',
      mutualFriends: 8,
      skills: ['Strategy', 'Analytics', 'UX'],
      isOnline: false,
      connectionDate: '2024-02-20',
      messageCount: 12,
      collaborationScore: 92
    },
    lastMessage: 'Thanks for the quick turnaround on the specs!',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        text: 'Hi! Can you send me the latest product requirements?',
        timestamp: '9:15 AM',
        isMe: true,
        status: 'read',
        type: 'text'
      },
      {
        id: 2,
        text: 'Sure! I just updated them with the latest feedback.',
        timestamp: '9:20 AM',
        isMe: false,
        status: 'read',
        type: 'text'
      },
      {
        id: 3,
        text: 'Thanks for the quick turnaround on the specs!',
        timestamp: '9:45 AM',
        isMe: false,
        status: 'read',
        type: 'text'
      }
    ]
  }
]

export default function FriendsChat({ isLoading }: FriendsChatProps) {
  const [conversations] = useState<ChatConversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(
    conversations[0] || null
  )
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: Date.now(),
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent',
      type: 'text'
    }

    // Update conversation with new message
    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: newMessage.text,
      lastMessageTime: 'just now'
    } : null)

    setMessageText('')
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-[600px] flex">
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${i % 3 === 0 ? 'w-2/3' : 'w-1/2'} ${i % 2 === 0 ? 'ml-auto' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-[700px] flex overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Messages
            </h2>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                className={`w-full p-4 border-b border-gray-200 dark:border-gray-700 text-left transition-colors ${
                  selectedConversation?.id === conversation.id 
                    ? 'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-l-blue-500' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {conversation.user.firstName[0]}{conversation.user.lastName[0]}
                      </span>
                    </div>
                    {conversation.user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {conversation.user.firstName} {conversation.user.lastName}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {selectedConversation.user.firstName[0]}{selectedConversation.user.lastName[0]}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                  selectedConversation.user.status === 'online' ? 'bg-green-500' :
                  selectedConversation.user.status === 'away' ? 'bg-yellow-500' :
                  selectedConversation.user.status === 'busy' ? 'bg-red-500' :
                  'bg-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedConversation.user.isOnline ? 'Online' : selectedConversation.user.lastActive}
                </p>
              </div>
            </div>

            {/* Chat Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Phone className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Video className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MoreVertical className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedConversation.messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isMe 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <div className={`flex items-center justify-between mt-1 ${
                    message.isMe ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className="text-xs">{message.timestamp}</span>
                    {message.isMe && (
                      <div className="ml-2">
                        {getStatusIcon(message.status)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Paperclip className="h-5 w-5" />
              </motion.button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Smile className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        /* No Conversation Selected */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a friend to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  )
}