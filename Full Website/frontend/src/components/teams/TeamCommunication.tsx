'use client'

import { useState } from 'react'
import { 
  MessageSquare, Phone, Video,
  Send, Paperclip, Smile, Search,
  Bell, Users, Hash,
  MoreVertical, Maximize2
} from 'lucide-react'
import { TeamCommunication as EnhancedTeamCommunication } from './communication/TeamCommunication'

interface Message {
  id: string
  author: string
  authorRole: string
  content: string
  timestamp: Date
  type: 'text' | 'file' | 'announcement'
  isRead: boolean
  reactions: { emoji: string; count: number; users: string[] }[]
  attachments?: { name: string; type: string; size: string }[]
}

interface Channel {
  id: string
  name: string
  description: string
  type: 'general' | 'project' | 'announcement' | 'random'
  memberCount: number
  unreadCount: number
  lastActivity: Date
  isPrivate: boolean
}

interface DirectMessage {
  id: string
  participant: string
  participantRole: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
}

interface TeamCommunicationProps {
  teamId?: string
  teamName?: string
  channels?: Channel[]
  directMessages?: DirectMessage[]
  messages?: Message[]
}

export function TeamCommunication({ 
  teamId,
  teamName,
  channels = [], 
  directMessages = [], 
  messages = [] 
}: TeamCommunicationProps) {
  const [activeTab, setActiveTab] = useState<'channels' | 'direct' | 'announcements'>('channels')
  const [selectedChannel, setSelectedChannel] = useState<string>('general')
  const [messageInput, setMessageInput] = useState('')
  const [showEnhancedChat, setShowEnhancedChat] = useState(false)


  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'general': return Hash
      case 'project': return Users
      case 'announcement': return Bell
      case 'random': return MessageSquare
      default: return Hash
    }
  }

  const getChannelColor = (type: string) => {
    switch (type) {
      case 'general': return 'text-blue-600 dark:text-blue-400'
      case 'project': return 'text-purple-600 dark:text-purple-400'
      case 'announcement': return 'text-orange-600 dark:text-orange-400'
      case 'random': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const sendMessage = async () => {
    if (messageInput.trim()) {
      try {
        // Send message to backend API
        const response = await fetch('/api/teams/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            teamId: selectedChannel,
            message: messageInput.trim(),
            type: 'text'
          })
        });

        if (response.ok) {
          setMessageInput('');
          // In real implementation, socket.io would handle real-time updates
          // For now, you could refresh the chat or add the message optimistically
        } else {
          // Failed to send message
        }
      } catch (error) {
        // Error sending message
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Sidebar */}
      <div className="lg:col-span-1 dashboard-card rounded-xl p-4 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Chat
            </h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col gap-2 mb-4">
          {[
            { id: 'channels', label: 'Channels', count: channels.reduce((sum, c) => sum + c.unreadCount, 0) },
            { id: 'direct', label: 'Direct Messages', count: directMessages.reduce((sum, dm) => sum + dm.unreadCount, 0) },
            { id: 'announcements', label: 'Announcements', count: 1 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'channels' | 'direct' | 'announcements')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="space-y-2">
          {activeTab === 'channels' && channels.map((channel) => {
            const IconComponent = getChannelIcon(channel.type)
            return (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  selectedChannel === channel.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${getChannelColor(channel.type)}`} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">#{channel.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{channel.memberCount} members</div>
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            )
          })}

          {activeTab === 'direct' && directMessages.map((dm) => (
            <button
              key={dm.id}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {dm.participant.charAt(0)}
                  </div>
                  {dm.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">{dm.participant}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {dm.lastMessage}
                  </div>
                </div>
              </div>
              {dm.unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {dm.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 dashboard-card rounded-xl flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                #{selectedChannel}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {channels.find(c => c.id === selectedChannel)?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {teamId && teamName && (
              <button
                onClick={() => setShowEnhancedChat(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="Open Enhanced Chat"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm font-medium">Enhanced Chat</span>
              </button>
            )}
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {message.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{message.author}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{message.authorRole}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {!message.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    message.type === 'announcement' 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}>
                    <p className="text-gray-900 dark:text-white">{message.content}</p>
                    
                    {message.attachments && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border">
                            <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{attachment.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({attachment.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.reactions.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {message.reactions.map((reaction, index) => (
                        <button key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <span>{reaction.emoji}</span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message #${selectedChannel}`}
                className="w-full p-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage()
                  }
                }}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Modal */}
      {teamId && teamName && (
        <EnhancedTeamCommunication
          teamId={teamId}
          teamName={teamName}
          isOpen={showEnhancedChat}
          onClose={() => setShowEnhancedChat(false)}
        />
      )}
    </div>
  )
}