'use client';

import React, { useState, useRef, useEffect, useMemo, Suspense, lazy } from 'react';
import { MessageSquare, Plus, Loader2, Bot, Maximize2, Minimize2, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, BrainCircuit, TrendingUp, Shield, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiChatService, type AIResponse } from '@/services/aiChatService';
import { speechService, speechRecognition, type Viseme } from '@/services/speechService';

// Lazy load heavy 3D components
const Canvas = lazy(() => import('@react-three/fiber').then(module => ({ default: module.Canvas })));
const ImmersiveChatScene = lazy(() => import('./components/ImmersiveChatScene'));
const Professional3DChatScene = lazy(() => import('./components/Professional3DChatScene'));
const FloatingChatInput = lazy(() => import('./components/FloatingChatInput'));
const ModernChatInterface = lazy(() => import('./components/ModernChatInterface'));

// Simple error boundary for 3D scene
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'voice';
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  suggestions?: string[];
  sources?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  isActive: boolean;
}

const initialMessage: Message = {
  id: '1',
  content: 'Welcome! I\'m Max, your AI banking assistant from National Bank. With over 160 years of banking excellence, I\'m here to help you with accounts, loans, investments, and any financial questions. How can I assist you today?',
  sender: 'ai',
  timestamp: new Date(),
  type: 'text',
  status: 'read',
  suggestions: aiChatService.getConversationStarters(),
};

export default function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chatSessions');
        if (saved) {
          return JSON.parse(saved).map((session: ChatSession & { lastUpdated: string, messages: Array<Message & { timestamp: string }> }) => ({
            ...session,
            lastUpdated: new Date(session.lastUpdated),
            messages: session.messages.map((msg: Message & { timestamp: string }) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
        }
      } catch (error) {
        console.error('Failed to load chat sessions:', error);
      }
    }
    
    return [{
      id: '1',
      title: 'Welcome Chat',
      messages: [initialMessage],
      lastUpdated: new Date(),
      isActive: true,
    }];
  });
  
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const [show3D, setShow3D] = useState(false);
  const [currentViseme, setCurrentViseme] = useState<string>('sil');
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [view3D, setView3D] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = useMemo(() => activeSession?.messages || [], [activeSession?.messages]);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('chatSessions', JSON.stringify(sessions));
      } catch (error) {
        console.error('Failed to save chat sessions:', error);
      }
    }
  }, [sessions]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enable 3D after initial load and check speech capabilities
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow3D(true);
    }, 1000);
    
    // Check speech capabilities
    setIsRecognitionSupported(speechRecognition.isSupported());
    setIsSpeechSupported(speechService.isSupported());
    
    return () => clearTimeout(timer);
  }, []);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [initialMessage],
      lastUpdated: new Date(),
      isActive: false,
    };
    
    setSessions(prev => [
      ...prev.map(s => ({ ...s, isActive: false })),
      { ...newSession, isActive: true }
    ]);
    setActiveSessionId(newSession.id);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      status: 'sending',
    };

    const currentInput = inputMessage;

    // Add user message immediately
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { 
            ...session, 
            messages: [...session.messages, userMessage],
            lastUpdated: new Date(),
            title: session.messages.length <= 1 ? currentInput.slice(0, 30) + (currentInput.length > 30 ? '...' : '') : session.title
          }
        : session
    ));

    setInputMessage('');
    setIsLoading(true);

    // Update message status
    setTimeout(() => {
      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? {
              ...session,
              messages: session.messages.map(msg => 
                msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
              )
            }
          : session
      ));
    }, 500);

    // Get AI response
    try {
      const response: AIResponse = await aiChatService.generateResponse(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        status: 'read',
        suggestions: response.suggestions,
        sources: response.sources,
      };

      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { 
              ...session, 
              messages: [
                ...session.messages.map(msg => 
                  msg.id === userMessage.id ? { ...msg, status: 'read' as const } : msg
                ),
                aiMessage
              ],
              lastUpdated: new Date() 
            }
          : session
      ));
      
      // Set AI message for avatar and speech
      setCurrentAIMessage(response.message);
      setIsAISpeaking(true);
      
      // Speak the response if not muted
      if (!isMuted && isSpeechSupported) {
        try {
          await speechService.speak(
            response.message,
            { rate: 1.0, pitch: 1.1, volume: 0.9 },
            (viseme: Viseme) => setCurrentViseme(viseme.type),
            () => {
              setIsAISpeaking(false);
              setCurrentAIMessage('');
              setCurrentViseme('sil');
            }
          );
        } catch (error) {
          console.error('Speech synthesis error:', error);
          // Fallback to timer-based animation end
          setTimeout(() => {
            setIsAISpeaking(false);
            setCurrentAIMessage('');
            setCurrentViseme('sil');
          }, 3000);
        }
      } else {
        // If muted or speech not supported, just animate for a duration
        const duration = Math.min(response.message.length * 50, 5000);
        setTimeout(() => {
          setIsAISpeaking(false);
          setCurrentAIMessage('');
          setCurrentViseme('sil');
        }, duration);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleListening = async () => {
    if (!isRecognitionSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      speechRecognition.stopListening();
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        await speechRecognition.startListening(
          (transcript: string, isFinal: boolean) => {
            if (isFinal) {
              setInputMessage(prev => prev + ' ' + transcript);
              setInterimTranscript('');
            } else {
              setInterimTranscript(transcript);
            }
          },
          (error: string) => {
            console.error('Speech recognition error:', error);
            setIsListening(false);
            setInterimTranscript('');
          }
        );
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        alert('Failed to start speech recognition. Please check your microphone permissions.');
      }
    }
  };

  const toggleMute = () => {
    if (isMuted && isAISpeaking) {
      speechService.stop();
      setIsAISpeaking(false);
      setCurrentAIMessage('');
      setCurrentViseme('sil');
    }
    setIsMuted(!isMuted);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleMessageClick = (message: Message) => {
    // Could implement message replay or copying functionality
    console.log('Message clicked:', message);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowSidebar(!isFullscreen);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className={`transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 bg-black' 
        : 'h-[calc(100vh-72px)] bg-gray-50 dark:bg-gray-900'
    } flex overflow-hidden`}>
      
      {/* Collapsible Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg border-r border-white/20 dark:border-gray-700/20 flex flex-col h-full relative z-10"
          >
            <div className="p-4 border-b border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Chat Sessions
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={createNewSession}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600/80 transition-colors text-sm backdrop-blur-sm"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </button>
                  <button
                    onClick={() => setView3D(!view3D)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                    title={view3D ? 'Switch to 2D view' : 'Switch to 3D view'}
                  >
                    <Layers className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                    title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all backdrop-blur-sm ${
                    session.id === activeSessionId
                      ? 'bg-blue-500/30 border border-blue-400/50'
                      : 'hover:bg-white/10 dark:hover:bg-gray-700/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/80 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {session.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {session.messages.length} messages
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3D Chat Scene */}
      <div className="flex-1 relative">
        {/* Toggle sidebar button */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-20 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all text-gray-700 dark:text-gray-300"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        )}

        {/* Close sidebar button */}
        {showSidebar && (
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-4 left-4 z-20 p-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-lg hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        )}

        {/* Robot Status Header with View Toggle */}
        {view3D && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            <button
              onClick={() => setView3D(!view3D)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all text-gray-700 dark:text-gray-300"
              title={view3D ? 'Switch to 2D view' : 'Switch to 3D view'}
            >
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">{view3D ? '3D View' : '2D View'}</span>
            </button>
            
            <div className="flex items-center gap-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl p-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Max AI
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isAISpeaking ? 'Speaking...' : 'Ready to help'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat View - 3D or 2D */}
        {view3D ? (
          <>
            {/* 3D Scene - with bottom padding for fixed input */}
            <div className="absolute inset-0 pb-32">
            {show3D ? (
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
                    <p className="text-blue-300">Loading immersive chat experience...</p>
                  </div>
                </div>
              }>
                <ErrorBoundary fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
                    <div className="text-center">
                      <Bot className="h-20 w-20 mx-auto mb-6 text-blue-400 animate-pulse" />
                      <p className="text-blue-300 text-lg mb-4">3D scene unavailable</p>
                      <p className="text-blue-200 text-sm">Chat functionality is still available below</p>
                    </div>
                  </div>
                }>
                  <Canvas 
                    shadows 
                    className="w-full h-full"
                    camera={{ position: [0, 6, 12], fov: 60 }}
                    style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)' }}
                    onError={(error) => {
                      console.error('Canvas error:', error);
                    }}
                  >
                    <Suspense fallback={null}>
                      <Professional3DChatScene 
                        messages={messages}
                        currentMessage={currentAIMessage}
                        isAISpeaking={isAISpeaking}
                        currentViseme={currentViseme}
                        isLoading={isLoading}
                        showHistory={showHistory}
                        onHistoryToggle={toggleHistory}
                        onMessageClick={handleMessageClick}
                        onSuggestionClick={handleSuggestionClick}
                      />
                    </Suspense>
                  </Canvas>
                </ErrorBoundary>
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
                <div className="text-center">
                  <Bot className="h-20 w-20 mx-auto mb-6 text-blue-400 animate-pulse" />
                  <p className="text-blue-300 text-lg">Preparing your AI banking assistant...</p>
                </div>
              </div>
            )}
            </div>

        {/* Fixed Input Area at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-lg">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={interimTranscript || "Ask Max about banking, investments, or National Bank..."}
                    className="w-full bg-transparent border-0 resize-none focus:outline-none text-white placeholder-gray-400 text-lg min-h-[48px] max-h-32"
                    rows={1}
                    disabled={isLoading || isListening}
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}
                  />
                  
                  {/* Interim transcript display */}
                  {interimTranscript && (
                    <div className="text-blue-300 text-sm mt-2 opacity-70">
                      Listening: "{interimTranscript}"
                    </div>
                  )}
                </div>
                
                {/* Control buttons */}
                <div className="flex items-center gap-2">
                  {/* Voice controls */}
                  <button
                    onClick={toggleMute}
                    className={`p-3 rounded-xl transition-all backdrop-blur-sm ${
                      isMuted 
                        ? 'bg-red-500/80 text-white hover:bg-red-600/80 shadow-lg shadow-red-500/30' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>

                  {/* Microphone button */}
                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-xl transition-all backdrop-blur-sm ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    disabled={isLoading || !isRecognitionSupported}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                  
                  {/* Send button */}
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 backdrop-blur-sm"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Quick actions removed */}
            </div>
          </div>
        </div>
          </>
        ) : (
          /* 2D Modern Chat Interface */
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          }>
            <ModernChatInterface
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              sendMessage={sendMessage}
              isLoading={isLoading}
              isListening={isListening}
              toggleListening={toggleListening}
              isMuted={isMuted}
              toggleMute={toggleMute}
              isAISpeaking={isAISpeaking}
              onSuggestionClick={handleSuggestionClick}
              interimTranscript={interimTranscript}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}