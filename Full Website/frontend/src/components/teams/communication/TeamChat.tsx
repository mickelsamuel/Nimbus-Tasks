'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, Search, Users, Hash, Plus, UserPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar: string
  timestamp: string
  type: 'text' | 'file' | 'image' | 'system'
  attachments?: {
    name: string
    url: string
    type: string
    size: number
  }[]
  reactions?: {
    emoji: string
    count: number
    users: string[]
  }[]
  replyTo?: {
    id: string
    content: string
    senderName: string
  }
}

interface Channel {
  id: string
  name: string
  type: 'text' | 'voice' | 'video'
  description?: string
  memberCount: number
  isPrivate: boolean
  lastActivity: string
}

interface TeamChatProps {
  teamId: string
  teamName: string
}

export function TeamChat({ teamId, teamName }: TeamChatProps) {
  useAuth()
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMembersList, setShowMembersList] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchChannels()
  }, [teamId, fetchChannels])

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel.id)
      // Set up real-time message polling
      const interval = setInterval(() => {
        fetchMessages(activeChannel.id)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [activeChannel, fetchMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChannels = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teams/${teamId}/channels`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChannels(data.channels || [])
        if (data.channels?.length > 0) {
          setActiveChannel(data.channels[0])
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (channelId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/channels/${channelId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel || sending) return

    setSending(true)
    try {
      const messageData = {
        content: newMessage.trim(),
        type: 'text',
        replyTo: replyingTo?.id || null
      }

      const response = await fetch(`/api/teams/${teamId}/channels/${activeChannel.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(messageData)
      })

      if (response.ok) {
        setNewMessage('')
        setReplyingTo(null)
        fetchMessages(activeChannel.id)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !activeChannel) return

    // Implement file upload logic here
    console.log('File upload:', file)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const addReaction = async (messageId: string, emoji: string) => {
    // Implement reaction logic
    console.log('Add reaction:', messageId, emoji)
  }

  const filteredMessages = messages.filter(message =>
    searchQuery === '' || 
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Team Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white truncate">
              {teamName}
            </h2>
            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {channels.length} channels
          </p>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Channels
              </h3>
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <Plus className="h-3 w-3 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeChannel?.id === channel.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="truncate">{channel.name}</span>
                    {channel.isPrivate && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowMembersList(!showMembersList)}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Team Members</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChannel ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {activeChannel.name}
                    </h3>
                    {activeChannel.isPrivate && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                        Private
                      </span>
                    )}
                  </div>
                  {activeChannel.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {activeChannel.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Video className="h-4 w-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => setShowMembersList(!showMembersList)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <UserPlus className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Hash className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to #{activeChannel.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This is the beginning of your conversation in this channel.
                  </p>
                </div>
              ) : (
                filteredMessages.map((message, index) => {
                  const prevMessage = filteredMessages[index - 1]
                  const showDateDivider = !prevMessage || 
                    formatDate(message.timestamp) !== formatDate(prevMessage.timestamp)
                  const isSameUser = prevMessage?.senderId === message.senderId
                  const timeDiff = prevMessage ? 
                    new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() : 0
                  const showAvatar = !isSameUser || timeDiff > 300000 // 5 minutes
                  
                  return (
                    <div key={message.id}>
                      {showDateDivider && (
                        <div className="flex items-center justify-center my-4">
                          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${showAvatar ? 'mt-4' : 'mt-1'} group hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 py-1 rounded-lg transition-colors`}
                      >
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar ? (
                            <img
                              src={message.senderAvatar || '/avatars/default.jpg'}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {formatTime(message.timestamp)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {showAvatar && (
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                {message.senderName}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                          )}
                          
                          {message.replyTo && (
                            <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded border-l-2 border-gray-300 dark:border-gray-600">
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Replying to {message.replyTo.senderName}
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {message.replyTo.content}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-gray-900 dark:text-white text-sm leading-relaxed">
                            {message.content}
                          </div>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                  <Paperclip className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {attachment.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {message.reactions.map((reaction, i) => (
                                <button
                                  key={i}
                                  onClick={() => addReaction(message.id, reaction.emoji)}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs transition-colors"
                                >
                                  {reaction.emoji} {reaction.count}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setReplyingTo(message)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Banner */}
            <AnimatePresence>
              {replyingTo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-500 rounded-full" />
                      <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Replying to {replyingTo.senderName}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-md">
                          {replyingTo.content}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-end gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message #${activeChannel.name}`}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white resize-none"
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Hash className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Select a channel
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a channel from the sidebar to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />
    </div>
  )
}