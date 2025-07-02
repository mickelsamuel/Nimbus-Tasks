'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Loader2,
  MessageSquare,
  Phone,
  Video,
  Search,
  User,
  Bot,
  Volume2,
  VolumeX,
  Plus,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import RobotAvatar, { FallbackRobot } from '@/components/chat/RobotAvatar';
import { SpeechBubble } from '@/components/chat/SpeechBubble';
import { speechService, speechRecognition, Viseme } from '@/services/speechService';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'voice';
  isLoading?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  isActive: boolean;
}


const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Welcome to the National Bank of Canada! I\'m your AI banking assistant specialized in finance and our bank\'s rich history since 1859. I can help you with banking services, investment advice, account information, and share fascinating stories about our institution. How may I assist you today?',
    sender: 'ai',
    timestamp: new Date(),
    type: 'text',
  },
];

// 3D Scene Component
function ChatScene({ 
  currentMessage, 
  isAISpeaking, 
  currentViseme,
  onRobotReady 
}: { 
  currentMessage: string;
  isAISpeaking: boolean;
  currentViseme?: Viseme;
  onRobotReady: () => void;
}) {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
      />
      
      {/* Environment */}
      <Environment preset="studio" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#60a5fa" />
      
      {/* Robot Avatar */}
      <Suspense fallback={
        <FallbackRobot 
          isSpeaking={isAISpeaking} 
          emotion={isAISpeaking ? 'explaining' : 'neutral'}
          currentViseme={currentViseme}
          onReady={onRobotReady}
        />
      }>
        <RobotAvatar 
          isSpeaking={isAISpeaking} 
          emotion={isAISpeaking ? 'explaining' : 'neutral'}
          currentViseme={currentViseme}
          onReady={onRobotReady}
        />
      </Suspense>
      
      {/* Speech Bubble - positioned to come from avatar's mouth */}
      <SpeechBubble 
        text={currentMessage}
        isVisible={!!currentMessage}
        position={[1.5, 1.8, 0.5]}
        isTyping={isAISpeaking}
      />
      
      {/* Ground */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.3} />
      </mesh>
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 10,
          Math.random() * 5 + 2,
          (Math.random() - 0.5) * 10
        ]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  );
}

export default function ChatPage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState('1');
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentViseme, setCurrentViseme] = useState<Viseme>();
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const [robotReady, setRobotReady] = useState(false);
  
  const activeChat = chatSessions.find(chat => chat.id === activeChatId);
  const messages = useMemo(() => activeChat?.messages || [], [activeChat?.messages]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Initialize and load chat sessions from localStorage on mount
  useEffect(() => {
    const initializeChatSessions = () => {
      const saved = localStorage.getItem('chatSessions');
      if (saved) {
        try {
          const parsedSessions = JSON.parse(saved).map((session: ChatSession & { lastUpdated: string, messages: Array<Message & { timestamp: string }> }) => ({
            ...session,
            lastUpdated: new Date(session.lastUpdated),
            messages: session.messages.map((msg: Message & { timestamp: string }) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setChatSessions(parsedSessions);
          const activeSession = parsedSessions.find((s: ChatSession) => s.isActive);
          if (activeSession) {
            setActiveChatId(activeSession.id);
          }
        } catch (error) {
          console.error('Failed to load chat sessions:', error);
          // Initialize with default session if loading fails
          const defaultSession: ChatSession = {
            id: '1',
            title: 'Welcome Chat',
            messages: initialMessages,
            lastUpdated: new Date(),
            isActive: true
          };
          setChatSessions([defaultSession]);
          setActiveChatId('1');
        }
      } else {
        // Initialize with default session if no saved data
        const defaultSession: ChatSession = {
          id: '1',
          title: 'Welcome Chat',
          messages: initialMessages,
          lastUpdated: new Date(),
          isActive: true
        };
        setChatSessions([defaultSession]);
        setActiveChatId('1');
      }
      setIsInitialized(true);
    };
    
    initializeChatSessions();
  }, []);
  
  // Save chat sessions to localStorage (only after initialization)
  useEffect(() => {
    if (isInitialized && chatSessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions, isInitialized]);

  // Generate AI Response with proper banking/finance focus
  const generateAIResponse = useCallback((userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Banking and finance responses
    if (input.includes('account') || input.includes('balance')) {
      return "I can help you with account management! National Bank offers various account types including checking, savings, and premium accounts. Each comes with different features and benefits. Would you like to know about specific account types or how to check your balance through our digital services?";
    }
    
    if (input.includes('investment') || input.includes('portfolio')) {
      return "National Bank has been helping Canadians grow their wealth since 1859! We offer comprehensive investment solutions including mutual funds, GICs, RRSPs, and TFSAs. Our investment advisors can help create a personalized portfolio based on your risk tolerance and financial goals. What type of investment interests you most?";
    }
    
    if (input.includes('history') || input.includes('founded')) {
      return "The National Bank of Canada has a fascinating history! Founded in 1859 in Quebec City, we're Canada's sixth-largest bank. We started as Banque Nationale and have grown to serve millions of customers across Canada. We've been at the forefront of banking innovation, from early telephone banking to today's digital solutions. What aspect of our history would you like to explore?";
    }
    
    if (input.includes('loan') || input.includes('mortgage')) {
      return "National Bank offers competitive lending solutions! We provide personal loans, auto loans, and mortgages with flexible terms. Our mortgage specialists can help you find the perfect home financing solution, whether you're a first-time buyer or looking to refinance. Current rates are very competitive. Would you like information about a specific type of loan?";
    }
    
    if (input.includes('credit card') || input.includes('card')) {
      return "National Bank has an excellent selection of credit cards! From no-fee cards to premium rewards cards, we have options for every lifestyle. Our World Elite cards offer travel benefits, while our cashback cards help you save on everyday purchases. Each card comes with fraud protection and digital wallet compatibility. What type of rewards interest you most?";
    }
    
    if (input.includes('digital') || input.includes('app') || input.includes('online')) {
      return "Our digital banking platform is award-winning! The National Bank app lets you manage accounts, transfer money, pay bills, and even deposit cheques by photo. We also offer budgeting tools, spending insights, and secure messaging with advisors. Security is our priority with biometric login and real-time fraud monitoring. Have you downloaded our app yet?";
    }
    
    // Default responses
    const responses = [
      "As your National Bank assistant, I'm here to help with all your banking needs! Whether it's about our services, our 160+ year history, or financial planning, I can provide detailed information tailored to your interests.",
      "National Bank of Canada has been serving customers with excellence since 1859. We offer comprehensive financial services from personal banking to wealth management. What specific area would you like to explore today?",
      "Great question! National Bank is committed to helping Canadians achieve their financial goals through innovative banking solutions, personalized service, and competitive rates. How can I assist you with your banking journey today?",
      "I'm delighted to help you learn more about National Bank! With over 160 years of banking expertise, we combine traditional values with modern technology to serve our customers better. What interests you most about our services?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }, []);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Chat',
      messages: initialMessages,
      lastUpdated: new Date(),
      isActive: true
    };
    
    setChatSessions(prev => [
      ...prev.map(chat => ({ ...chat, isActive: false })),
      newChat
    ]);
    setActiveChatId(newChatId);
  };
  
  const switchToChat = (chatId: string) => {
    setChatSessions(prev => prev.map(chat => ({
      ...chat,
      isActive: chat.id === chatId
    })));
    setActiveChatId(chatId);
  };
  
  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
    setChatSessions(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title } : chat
    ));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setChatSessions(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, userMessage], lastUpdated: new Date() }
        : chat
    ));
    
    // Update chat title if this is the first user message
    if (activeChat.messages.length <= 1) {
      updateChatTitle(activeChatId, inputMessage);
    }
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Generate AI response
    setTimeout(async () => {
      const aiResponseText = generateAIResponse(currentInput);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      
      setChatSessions(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: [...chat.messages, aiResponse], lastUpdated: new Date() }
          : chat
      ));
      setIsLoading(false);
      setIsTyping(false);
      
      // Set current AI message for speech bubble
      setCurrentAIMessage(aiResponseText);
      
      // Speak the response if not muted
      if (!isMuted && speechService.isSupported()) {
        console.log('🔊 Starting speech synthesis:', aiResponseText.substring(0, 50) + '...');
        setIsAISpeaking(true);
        try {
          await speechService.speak(
            aiResponseText,
            { rate: 0.9, pitch: 1.0, volume: 1.0 },
            (viseme) => setCurrentViseme(viseme),
            () => {
              console.log('🔊 Speech synthesis completed');
              setIsAISpeaking(false);
              setTimeout(() => setCurrentAIMessage(''), 2000);
            }
          );
        } catch (error) {
          console.error('🔊 Speech synthesis error:', error);
          setIsAISpeaking(false);
          setTimeout(() => setCurrentAIMessage(''), 2000);
        }
      } else {
        if (isMuted) {
          console.log('🔇 Speech muted by user');
        } else {
          console.log('🔊 Speech synthesis not supported');
        }
        setTimeout(() => setCurrentAIMessage(''), 3000);
      }
    }, 1500);
  };

  const startVoiceRecognition = async () => {
    if (!speechRecognition.isSupported()) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    try {
      setIsListening(true);
      await speechRecognition.startListening(
        (transcript, isFinal) => {
          if (isFinal) {
            setInputMessage(transcript);
            setIsListening(false);
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      );
      stopListeningRef.current = () => speechRecognition.stopListening();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopVoiceRecognition = () => {
    if (stopListeningRef.current) {
      stopListeningRef.current();
      stopListeningRef.current = null;
    }
    setIsListening(false);
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      console.log('🔇 Muting AI speech');
      speechService.cancel();
      setIsAISpeaking(false);
      setCurrentAIMessage('');
    } else {
      console.log('🔊 Unmuting AI speech');
    }
  };

  const handleRobotReady = useCallback(() => {
    setRobotReady(true);
  }, []);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto p-6 h-[calc(100vh-72px)] flex gap-6">
        {/* Chat History Sidebar */}
        <div className="hidden lg:flex bg-white dark:bg-gray-800 border border-gray-200/40 dark:border-gray-700/40 rounded-xl flex-col w-80 flex-shrink-0">
          {/* Chat History Header */}
          <div className="p-4 border-b border-gray-200/40 dark:border-gray-700/40 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chat History</h2>
              <button
                onClick={createNewChat}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </button>
            </div>
            
            {/* Search Chats */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {chatSessions
              .filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                className={cn(
                  "p-3 border-b border-gray-200/20 dark:border-gray-700/20 cursor-pointer transition-all duration-200",
                  chat.isActive && "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                )}
                onClick={() => switchToChat(chat.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    {chat.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-green-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {chat.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                        {chat.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                      {chat.messages[chat.messages.length - 1]?.content.slice(0, 50) || 'No messages yet'}...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{chat.messages.length} messages</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* AI Status */}
          <div className="p-3 border-t border-gray-200/40 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full transition-colors",
                robotReady ? "bg-green-500" : "bg-yellow-500"
              )} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {robotReady ? "AI Avatar Ready" : "Loading AI Avatar..."}
              </span>
            </div>
          </div>
        </div>

        {/* Main Chat Area - 3D Avatar Section */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-200/40 dark:border-gray-700/40 rounded-xl overflow-hidden min-w-0">
          {/* 3D Avatar Container */}
          <div className="flex-1 flex flex-col">
            {/* Avatar Header */}
          <div className="p-4 border-b border-gray-200/40 dark:border-gray-700/40 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Alexandra - AI Banking Assistant</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {isAISpeaking ? "Speaking..." : isTyping ? "Thinking..." : "Ready to help"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      isMuted 
                        ? 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute AI Speech' : 'Mute AI Speech'}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    {isMuted ? 'Muted' : 'Audio'}
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Avatar Environment */}
            <div className="flex-1 relative bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 min-h-0">
              <Canvas 
                shadows 
                className="w-full h-full" 
                resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
              >
                <ChatScene 
                  currentMessage={currentAIMessage}
                  isAISpeaking={isAISpeaking}
                  currentViseme={currentViseme}
                  onRobotReady={handleRobotReady}
                />
              </Canvas>
              
              {/* Mobile Message Input - only visible on small screens */}
              <div className="absolute bottom-0 left-0 right-0 p-3 lg:hidden bg-gradient-to-t from-gray-50/95 via-gray-50/80 to-transparent dark:from-gray-900/95 dark:via-gray-900/80">
                <div className="max-w-full mx-auto">
                  <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-200/40 dark:border-gray-700/40 p-2 shadow-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Ask about banking services..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full border-0 bg-transparent focus:outline-none text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                        disabled={isLoading || isListening}
                      />
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        className={`flex items-center justify-center h-8 w-8 p-0 rounded-full transition-colors ${
                          isListening 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                        disabled={isLoading}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="flex items-center justify-center h-8 w-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - User Chat Messages */}
          <div className="hidden lg:flex bg-white dark:bg-gray-800 border-l border-gray-200/40 dark:border-gray-700/40 flex-col flex-shrink-0" style={{width: 'min(384px, 30vw)'}}>
            {/* Messages Header */}
            <div className="p-4 border-b border-gray-200/40 dark:border-gray-700/40 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {activeChat?.title || 'Conversation'}
                </h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center h-7 w-7 p-0 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex items-center justify-center h-7 w-7 p-0 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                    <Video className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    message.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      message.sender === 'user'
                        ? "bg-blue-500"
                        : "bg-gradient-to-br from-purple-500 to-blue-600"
                    )}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                  
                  <div className={cn(
                    "flex flex-col gap-1",
                    message.sender === 'user' ? 'items-end' : 'items-start'
                  )}>
                    <div className={cn(
                      "px-4 py-2 rounded-2xl text-sm break-words",
                      message.sender === 'user'
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md"
                    )}>
                      {message.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200/40 dark:border-gray-700/40 flex-shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 p-2">
                <div className="flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask about banking, investments, or financial advice..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border-0 bg-transparent focus:outline-none text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                    disabled={isLoading || isListening}
                  />
                </div>
                
                <div className="flex gap-1">
                  <button
                    className={`flex items-center justify-center h-8 w-8 p-0 rounded-full transition-colors ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    disabled={isLoading}
                    title={isListening ? 'Stop Recording' : 'Start Voice Input'}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="flex items-center justify-center h-8 w-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                    title="Send Message"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Status indicators */}
              <div className="flex items-center justify-center mt-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>Alexandra is thinking...</span>
                  </div>
                )}
                
                {isListening && (
                  <div className="flex items-center gap-2 text-blue-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Listening...</span>
                  </div>
                )}
                
                {isAISpeaking && (
                  <div className="flex items-center gap-2 text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Alexandra is speaking...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}