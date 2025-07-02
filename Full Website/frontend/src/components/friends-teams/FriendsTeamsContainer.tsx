'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, MessageSquare, Search, Plus, 
  Building2,
  ChevronRight, Globe, X, Send, ArrowLeft
} from 'lucide-react'

// Combined View Components
import CombinedNetworkView from './views/CombinedNetworkView'
import CombinedDiscoverView from './views/CombinedDiscoverView'
import TeamCollaborationView from './views/TeamCollaborationView'

// Teams Components
import MyTeamsTab from '@/components/teams/tabs/MyTeamsTab'
import CreateTeamWizard from '@/components/teams/CreateTeamWizard'

// Hooks
import { useFriends } from '@/hooks/useFriends'
import { useTeams } from '@/hooks/useTeams'
import { useAuth } from '@/contexts/AuthContext'

export default function FriendsTeamsContainer() {
  const [activeView, setActiveView] = useState<'home' | 'my-network' | 'my-teams' | 'discover' | 'collaboration'>('home')
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [mainSearchQuery, setMainSearchQuery] = useState('')
  const [showMessagesPanel, setShowMessagesPanel] = useState(false)
  interface Person {
    id: string;
    userId: string;
    name: string;
    username: string;
    role: string;
    avatar: string;
    status: 'online' | 'offline';
    isOnline: boolean;
  }
  
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [messageInput, setMessageInput] = useState('')
  interface Message {
    id: string;
    text: string;
    timestamp: Date;
    sender: string;
  }
  
  const [messages, setMessages] = useState<{[userId: string]: Message[]}>({})
  const [showConversation, setShowConversation] = useState(false)
  
  const { } = useAuth()
  const { data: friendsData } = useFriends()
  const { teams, myTeams } = useTeams()
  
  // Memoize stats calculations
  const stats = useMemo(() => {
    const colleagues = friendsData?.colleagues || []
    const connectionRequests = friendsData?.connectionRequests || []
    const onlineColleagues = colleagues.filter(c => c.status === 'online' || c.isOnline)
    const myTeamsList = myTeams || []
    const allTeams = teams || []
    
    return {
      totalConnections: colleagues.length,
      onlineFriends: onlineColleagues.length,
      pendingRequests: connectionRequests.length,
      myTeamsCount: myTeamsList.length,
      availableTeams: allTeams.length,
      networkGrowth: friendsData?.analytics?.connectionGrowth || 0,
      teamPerformance: 85,
      collaborationScore: Math.round(colleagues.reduce((acc, c) => acc + (c.connectionStrength || 0), 0) / colleagues.length) || 0
    }
  }, [friendsData, myTeams, teams])


  const renderContent = () => {
    switch (activeView) {
      case 'my-network':
        return <CombinedNetworkView />
      case 'discover':
        return <CombinedDiscoverView />
      case 'my-teams':
        return <MyTeamsTab />
      case 'collaboration':
        return <TeamCollaborationView />
      case 'home':
      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome to Friends & Teams
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Click on the stat boxes above to navigate or use the search bar to find people and teams
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <motion.button
                onClick={() => setActiveView('discover')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="h-8 w-8 mx-auto mb-2" />
                Discover People & Teams
              </motion.button>
              <motion.button
                onClick={() => setActiveView('collaboration')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <Globe className="h-8 w-8 mx-auto mb-2" />
                Team Collaboration
              </motion.button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Background Elements - Optimized */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" style={{ willChange: 'transform' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float-delayed" style={{ willChange: 'transform' }} />
      
      <div className="relative z-10 container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Hero Section - Reduced animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: "tween" }}
          className="relative text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Friends & Teams
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Build meaningful connections and collaborate effectively with your professional network and teams
          </p>
          
          {/* Messages Button */}
          <motion.button
            onClick={() => setShowMessagesPanel(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="hidden sm:inline">Messages</span>
          </motion.button>
        </motion.div>

        {/* Stats Overview - Reduced animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto"
        >
          {[
            {
              icon: Users,
              label: 'Network Size',
              value: stats.totalConnections,
              change: `${stats.onlineFriends} Online • ${stats.pendingRequests} Pending`,
              color: 'blue',
              bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
              onClick: () => setActiveView('my-network')
            },
            {
              icon: Building2,
              label: 'My Teams',
              value: stats.myTeamsCount,
              change: 'Active',
              color: 'purple',
              bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
              onClick: () => setActiveView('my-teams')
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={stat.onClick}
                className={`dashboard-card rounded-3xl p-6 bg-gradient-to-br ${stat.bgColor} border-2 ${
                  stat.color === 'blue' ? 'border-blue-200 dark:border-blue-800/50' :
                  stat.color === 'green' ? 'border-green-200 dark:border-green-800/50' :
                  stat.color === 'purple' ? 'border-purple-200 dark:border-purple-800/50' :
                  'border-pink-200 dark:border-pink-800/50'
                } hover:scale-105 transition-all duration-500 hover:shadow-2xl group cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'blue' ? 'bg-blue-500/20' :
                    stat.color === 'green' ? 'bg-green-500/20' :
                    stat.color === 'purple' ? 'bg-purple-500/20' :
                    'bg-pink-500/20'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      'text-pink-600 dark:text-pink-400'
                    }`} />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      stat.color === 'blue' ? 'text-blue-900 dark:text-blue-100' :
                      stat.color === 'green' ? 'text-green-900 dark:text-green-100' :
                      stat.color === 'purple' ? 'text-purple-900 dark:text-purple-100' :
                      'text-pink-900 dark:text-pink-100'
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${
                      stat.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                      stat.color === 'green' ? 'text-green-700 dark:text-green-300' :
                      stat.color === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                      'text-pink-700 dark:text-pink-300'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  stat.color === 'blue' ? 'text-blue-800 dark:text-blue-200' :
                  stat.color === 'green' ? 'text-green-800 dark:text-green-200' :
                  stat.color === 'purple' ? 'text-purple-800 dark:text-purple-200' :
                  'text-pink-800 dark:text-pink-200'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "tween" }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for people, teams, or start collaborating..."
              value={mainSearchQuery}
              onChange={(e) => setMainSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 text-lg"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <motion.button
                onClick={() => setShowCreateTeam(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Team</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "tween" }}
          className="dashboard-card rounded-3xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[600px] p-6"
            >
              {/* Back Navigation for non-home views */}
              {activeView !== 'home' && (
                <motion.button
                  onClick={() => setActiveView('home')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-all"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Home</span>
                </motion.button>
              )}
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateTeam && (
          <CreateTeamWizard
            onClose={() => setShowCreateTeam(false)}
          />
        )}
      </AnimatePresence>

      {/* Messages Sliding Panel */}
      <AnimatePresence>
        {showMessagesPanel && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowMessagesPanel(false)
                setShowConversation(false)
                setSelectedPerson(null)
              }}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
            >
              {/* Panel Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {showConversation && (
                      <motion.button
                        onClick={() => {
                          setShowConversation(false)
                          setSelectedPerson(null)
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </motion.button>
                    )}
                    <h2 className="text-2xl font-bold">
                      {showConversation && selectedPerson ? selectedPerson.username : 'Messages'}
                    </h2>
                  </div>
                  <motion.button
                    onClick={() => {
                      setShowMessagesPanel(false)
                      setShowConversation(false)
                      setSelectedPerson(null)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
                {!showConversation && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search people..."
                      className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
                    />
                  </div>
                )}
              </div>
              
              {/* Content Area */}
              {!showConversation ? (
                /* People List */
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {friendsData?.colleagues?.map((colleague) => {
                    const person: Person = {
                      id: colleague.id.toString(),
                      userId: colleague.id.toString(),
                      name: colleague.name || colleague.firstName + ' ' + colleague.lastName,
                      username: colleague.firstName || colleague.name,
                      role: colleague.role || colleague.department || 'Colleague',
                      avatar: colleague.avatar || '/avatars/default.jpg',
                      status: colleague.isOnline ? 'online' : 'offline',
                      isOnline: colleague.isOnline || false
                    }
                    return (
                    <motion.div
                      key={person.userId}
                      onClick={() => {
                        setSelectedPerson(person)
                        setShowConversation(true)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl cursor-pointer transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                            {person.username?.charAt(0).toUpperCase()}
                          </div>
                          {(person.status === 'online' || person.isOnline) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {person.username}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {person.status === 'online' || person.isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </motion.div>
                    )
                  })}
                  
                  {(!friendsData?.colleagues || friendsData.colleagues.length === 0) && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No connections yet</p>
                      <p className="text-sm mt-2">Start building your network!</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Conversation View */
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages[selectedPerson?.userId]?.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                          message.sender === 'me' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'me' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    )) || (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Start a conversation!</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      if (messageInput.trim() && selectedPerson) {
                        const newMessage: Message = {
                          id: Math.random().toString(36).substr(2, 9),
                          sender: 'me',
                          text: messageInput,
                          timestamp: new Date()
                        }
                        setMessages(prev => ({
                          ...prev,
                          [selectedPerson.userId]: [...(prev[selectedPerson.userId] || []), newMessage]
                        }))
                        setMessageInput('')
                      }
                    }} className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!messageInput.trim()}
                        className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                      >
                        <Send className="h-5 w-5" />
                      </motion.button>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}