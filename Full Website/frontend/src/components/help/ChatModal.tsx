'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send,
  X,
  User,
  Bot,
  Sparkles,
  Zap,
  Shield,
  Clock
} from 'lucide-react'

interface ChatModalProps {
  showChatModal: boolean
  setShowChatModal: (show: boolean) => void
}

export default function ChatModal({ showChatModal, setShowChatModal }: ChatModalProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{id: string; type: 'bot' | 'user' | 'agent'; content: string; timestamp: Date}>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize chat session when modal opens
  useEffect(() => {
    if (showChatModal && !sessionId) {
      initializeChatSession()
    }
  }, [showChatModal, sessionId])

  const initializeChatSession = async () => {
    try {
      
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/support/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priority: 'medium',
          category: 'general'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSessionId(data.sessionId)
        
        // Add welcome message
        setMessages([{
          id: '1',
          type: 'agent' as const,
          content: "Hello! I'm your support specialist. How can I help you today?",
          timestamp: new Date()
        }])
      } else {
        throw new Error('Failed to start chat session')
      }
    } catch (error) {
      console.error('Error starting chat session:', error)
      // Fallback to basic message
      setMessages([{
        id: '1',
        type: 'bot' as const,
        content: "I'm currently unable to connect to our support system. Please try refreshing the page or contact support directly.",
        timestamp: new Date()
      }])
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionId) return
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentMessage = message
    setMessage('')
    setIsTyping(true)
    
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/support/chat/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentMessage,
          messageType: 'text'
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add the response message
        if (data.response) {
          const responseMessage = {
            id: (Date.now() + 1).toString(),
            type: data.response.senderType === 'agent' ? 'agent' as const : 'bot' as const,
            content: data.response.message,
            timestamp: new Date(data.response.timestamp)
          }
          setMessages(prev => [...prev, responseMessage])
        }
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error fallback message
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        type: 'bot' as const,
        content: "I'm sorry, I'm having trouble connecting right now. Please try again or contact support directly.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <AnimatePresence>
      {showChatModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: isDarkMode
              ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)'
              : 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          onClick={() => setShowChatModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-full max-w-lg mx-auto overflow-hidden rounded-3xl backdrop-blur-xl"
            style={{
              background: isDarkMode
                ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
                : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: isDarkMode
                ? '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 25px 50px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Header */}
            <div 
              className="relative p-6 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)'
              }}
            >
              {/* Background Pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='m30 0v60m-30-30h60'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px'
                }}
              />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Premium Avatar */}
                  <motion.div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Bot className="h-7 w-7 text-white" />
                    
                    {/* Online Indicator */}
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Premium Support
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm text-white/90 font-medium">
                        Elite Specialist Online
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Close Button */}
                <motion.button
                  onClick={() => setShowChatModal(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    background: 'rgba(255, 255, 255, 0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5 text-white" />
                </motion.button>
              </div>
              
              {/* Header Stats */}
              <motion.div
                className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {[
                  { icon: Clock, label: 'Avg Response', value: '< 30s' },
                  { icon: Shield, label: 'Security', value: 'Bank-Grade' },
                  { icon: Sparkles, label: 'Satisfaction', value: '99.8%' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4 text-white/80" />
                    <div className="text-center">
                      <div className="text-xs text-white/80">{stat.label}</div>
                      <div className="text-sm font-bold text-white">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Messages Container */}
            <div 
              className="h-80 overflow-y-auto p-6 space-y-4"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.3))'
                  : 'linear-gradient(to bottom, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))'
              }}
            >
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: msg.type === 'bot'
                          ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                          : 'linear-gradient(135deg, #10B981, #059669)',
                        boxShadow: msg.type === 'bot'
                          ? '0 8px 20px rgba(99, 102, 241, 0.3)'
                          : '0 8px 20px rgba(16, 185, 129, 0.3)'
                      }}
                      animate={{
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                    >
                      {msg.type === 'bot' ? (
                        <Bot className="h-5 w-5 text-white" />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </motion.div>
                    
                    {/* Message Bubble */}
                    <motion.div
                      className="max-w-xs rounded-2xl p-4 backdrop-blur-xl"
                      style={{
                        background: msg.type === 'bot'
                          ? isDarkMode
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))'
                            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))'
                          : isDarkMode
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))'
                          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                        border: msg.type === 'bot'
                          ? '1px solid rgba(99, 102, 241, 0.3)'
                          : '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p 
                        className="text-sm leading-relaxed mb-2"
                        style={{ color: isDarkMode ? '#E2E8F0' : '#374151' }}
                      >
                        {msg.content}
                      </p>
                      <span 
                        className="text-xs"
                        style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div 
                    className="flex items-center gap-1 px-4 py-3 rounded-2xl"
                    style={{
                      background: isDarkMode
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-indigo-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Premium Input */}
            <div 
              className="p-6"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(to top, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))'
                  : 'linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
                borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-transparent transition-all duration-300 focus:outline-none backdrop-blur-xl"
                  style={{
                    background: isDarkMode
                      ? 'rgba(15, 23, 42, 0.6)'
                      : 'rgba(255, 255, 255, 0.8)',
                    color: isDarkMode ? '#F1F5F9' : '#1F2937',
                    border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    // Placeholder styling handled by CSS classes
                  }}
                />
                
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: message.trim()
                      ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                      : isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                    boxShadow: message.trim() ? '0 8px 20px rgba(99, 102, 241, 0.3)' : 'none'
                  }}
                  whileHover={{ scale: message.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: message.trim() ? 0.95 : 1 }}
                >
                  <Send 
                    className="h-5 w-5" 
                    style={{ color: message.trim() ? '#FFFFFF' : isDarkMode ? '#64748B' : '#9CA3AF' }}
                  />
                </motion.button>
              </div>
              
              {/* Premium Footer */}
              <motion.div
                className="flex items-center justify-center gap-4 mt-4 pt-4 border-t"
                style={{
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" style={{ color: '#10B981' }} />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
                  >
                    Secure & Encrypted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: '#F59E0B' }} />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
                  >
                    Instant Response
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}