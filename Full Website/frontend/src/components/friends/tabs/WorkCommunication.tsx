'use client'

import { motion } from 'framer-motion'
import { 
  MessageSquare,
  Phone,
  Video,
  Calendar,
  Users,
  Clock,
  Pin,
  FileText,
  Paperclip,
  Search,
  Bell,
  Settings,
  MoreVertical,
  Send,
  Smile
} from 'lucide-react'
import { FriendsData } from '../types'
import { FriendsData as ApiFriendsData } from '@/lib/api/friends'
import { useFriends } from '@/hooks/useFriends'

interface WorkCommunicationProps {
  data?: FriendsData | ApiFriendsData
  isLoading?: boolean
}

export default function WorkCommunication({ data: propData, isLoading: propIsLoading }: WorkCommunicationProps) {
  // Use hook data if props are not provided
  const { data: hookData, loading: hookLoading } = useFriends()
  
  const data = propData || hookData
  const isLoading = propIsLoading ?? hookLoading

  // Handle null/undefined data
  if (!data && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Unable to load work communication data</p>
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  const workChannels = [
    {
      id: 1,
      name: 'general',
      description: 'Company-wide announcements and general discussion',
      type: 'public',
      memberCount: 124,
      unreadCount: 3,
      lastMessage: 'Welcome to our new team members!',
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      isPinned: true
    },
    {
      id: 2,
      name: 'project-alpha',
      description: 'Alpha project coordination and updates',
      type: 'project',
      memberCount: 8,
      unreadCount: 0,
      lastMessage: 'Sprint review scheduled for Friday',
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isPinned: false
    },
    {
      id: 3,
      name: 'engineering',
      description: 'Engineering team discussions and tech talks',
      type: 'department',
      memberCount: 45,
      unreadCount: 7,
      lastMessage: 'New deployment process documentation',
      lastActivity: new Date(Date.now() - 45 * 60 * 1000),
      isPinned: true
    },
    {
      id: 4,
      name: 'announcements',
      description: 'Important company announcements',
      type: 'announcement',
      memberCount: 124,
      unreadCount: 1,
      lastMessage: 'Q2 all-hands meeting next Tuesday',
      lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isPinned: true
    }
  ]

  const recentMessages = [
    {
      id: 1,
      channel: 'project-alpha',
      author: 'Sarah Johnson',
      authorRole: 'Team Lead',
      content: 'Great work on the API integration everyone! The performance metrics look excellent.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      reactions: [
        { emoji: '👍', count: 5 },
        { emoji: '🚀', count: 3 }
      ]
    },
    {
      id: 2,
      channel: 'engineering',
      author: 'Michael Chen',
      authorRole: 'Senior Developer',
      content: 'Sharing the updated coding standards document. Please review before the team meeting.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'file',
      attachments: [
        { name: 'coding-standards-v2.pdf', size: '1.2 MB' }
      ],
      reactions: [
        { emoji: '📄', count: 8 },
        { emoji: '👀', count: 4 }
      ]
    },
    {
      id: 3,
      channel: 'general',
      author: 'HR Team',
      authorRole: 'Human Resources',
      content: 'Reminder: Employee wellness workshop tomorrow at 2 PM in Conference Room A. Coffee and snacks provided!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'announcement',
      reactions: [
        { emoji: '☕', count: 12 },
        { emoji: '🎉', count: 6 }
      ]
    }
  ]

  const directMessages = [
    {
      id: 1,
      participant: 'Emily Rodriguez',
      participantRole: 'UX Designer',
      lastMessage: 'Can we sync on the user flow wireframes?',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 2,
      participant: 'Alex Thompson',
      participantRole: 'Data Scientist',
      lastMessage: 'The analytics dashboard is ready for review',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: true
    },
    {
      id: 3,
      participant: 'Lisa Wang',
      participantRole: 'Project Manager',
      lastMessage: 'Meeting notes from yesterday\'s standup',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: false
    }
  ]

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Sprint Planning',
      time: '2:00 PM - 3:00 PM',
      participants: ['Sarah Johnson', 'Michael Chen', '+6 others'],
      type: 'video'
    },
    {
      id: 2,
      title: '1:1 with Manager',
      time: '4:00 PM - 4:30 PM',
      participants: ['Sarah Johnson'],
      type: 'video'
    },
    {
      id: 3,
      title: 'Design Review',
      time: 'Tomorrow 10:00 AM',
      participants: ['Emily Rodriguez', 'Lisa Wang', '+3 others'],
      type: 'video'
    }
  ]

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'public': return MessageSquare
      case 'project': return FileText
      case 'department': return Users
      case 'announcement': return Bell
      default: return MessageSquare
    }
  }

  const getChannelColor = (type: string) => {
    switch (type) {
      case 'public': return 'text-blue-600 dark:text-blue-400'
      case 'project': return 'text-purple-600 dark:text-purple-400'
      case 'department': return 'text-green-600 dark:text-green-400'
      case 'announcement': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Communication Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="h-8 w-8" />
            <span className="text-blue-200 text-sm">Active</span>
          </div>
          <div className="text-3xl font-bold mb-1">{workChannels.length}</div>
          <div className="text-blue-100">Work Channels</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-green-200 text-sm">Direct</span>
          </div>
          <div className="text-3xl font-bold mb-1">{directMessages.length}</div>
          <div className="text-green-100">DM Conversations</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Video className="h-8 w-8" />
            <span className="text-purple-200 text-sm">Today</span>
          </div>
          <div className="text-3xl font-bold mb-1">{upcomingMeetings.length}</div>
          <div className="text-purple-100">Video Meetings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Bell className="h-8 w-8" />
            <span className="text-orange-200 text-sm">Unread</span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {workChannels.reduce((sum, channel) => sum + channel.unreadCount, 0) + 
             directMessages.reduce((sum, dm) => sum + dm.unreadCount, 0)}
          </div>
          <div className="text-orange-100">New Messages</div>
        </motion.div>
      </div>

      {/* Main Communication Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Channels Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Channels
              </h3>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {workChannels.map((channel) => {
                const IconComponent = getChannelIcon(channel.type)
                return (
                  <motion.div
                    key={channel.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      channel.isPinned ? 'bg-blue-50 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {channel.isPinned && (
                          <Pin className="h-3 w-3 text-blue-500" />
                        )}
                        <IconComponent className={`h-4 w-4 ${getChannelColor(channel.type)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          #{channel.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {channel.memberCount} members
                        </div>
                      </div>
                    </div>
                    {channel.unreadCount > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                        {channel.unreadCount}
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Direct Messages
              </h4>
              <div className="space-y-2">
                {directMessages.map((dm) => (
                  <motion.div
                    key={dm.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {dm.participant.charAt(0)}
                        </span>
                      </div>
                      {dm.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {dm.participant}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {dm.lastMessage}
                      </div>
                    </div>
                    {dm.unreadCount > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        {dm.unreadCount}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    #general
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    124 members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Video className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {recentMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                      {message.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {message.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {message.authorRole}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      message.type === 'announcement' 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}>
                      <p className="text-gray-900 dark:text-white">{message.content}</p>
                      
                      {message.attachments && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border">
                              <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {attachment.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({attachment.size})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {reaction.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full p-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors">
                      <Smile className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Upcoming Meetings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today&apos;s Meetings
            </h3>
            
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {meeting.title}
                    </h4>
                    <Video className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <Clock className="h-3 w-3" />
                    {meeting.time}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {meeting.participants.join(', ')}
                  </div>
                  <button className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Join Meeting
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/70 transition-colors">
                <Calendar className="h-4 w-4" />
                <span className="font-medium text-sm">Schedule Meeting</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/70 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium text-sm">Create Channel</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/70 transition-colors">
                <FileText className="h-4 w-4" />
                <span className="font-medium text-sm">Share Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}