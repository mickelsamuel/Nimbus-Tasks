'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Loader2, 
  Settings, 
  Sparkles,
  Headphones,
  Zap,
  Brain,
  MessageCircle
} from 'lucide-react';

interface VoiceProfile {
  name: string;
  quality: number;
  naturalness: number;
  gender?: 'male' | 'female' | 'neutral';
}

interface EnhancedChatControlsProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  onToggleListening: () => void;
  onToggleMute: () => void;
  isLoading: boolean;
  isListening: boolean;
  isMuted: boolean;
  isAISpeaking: boolean;
  speechConfidence: number;
  interimTranscript: string;
  availableVoices: VoiceProfile[];
  isRecognitionSupported: boolean;
  isSpeechSupported: boolean;
}

export default function EnhancedChatControls({
  inputMessage,
  setInputMessage,
  onSendMessage,
  onToggleListening,
  onToggleMute,
  isLoading,
  isListening,
  isMuted,
  isAISpeaking,
  speechConfidence,
  interimTranscript,
  availableVoices,
  isRecognitionSupported,
  isSpeechSupported
}: EnhancedChatControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  // Pulse animation when AI is speaking
  useEffect(() => {
    if (isAISpeaking) {
      setPulseAnimation(true);
      const timer = setTimeout(() => setPulseAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAISpeaking]);

  const getBestVoice = () => {
    if (availableVoices.length === 0) return null;
    return availableVoices.reduce((best, voice) => 
      voice.quality + voice.naturalness > best.quality + best.naturalness ? voice : best
    );
  };

  const getStatusText = () => {
    if (isLoading) return 'Max is thinking...';
    if (isListening) return `Listening${speechConfidence > 0 ? ` (${Math.round(speechConfidence * 100)}% confidence)` : '...'}`;
    if (isAISpeaking) return 'Max is speaking...';
    return 'Ready to help with your banking questions';
  };

  const getStatusColor = () => {
    if (isLoading) return 'text-yellow-400';
    if (isListening) return 'text-green-400';
    if (isAISpeaking) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Status bar */}
      <motion.div 
        className="mb-4 flex items-center justify-between bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl p-3 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={`h-3 w-3 rounded-full ${
              isLoading ? 'bg-yellow-400' :
              isListening ? 'bg-green-400' :
              isAISpeaking ? 'bg-blue-400' :
              'bg-gray-400'
            }`}
            animate={{
              scale: (isListening || isAISpeaking) ? [1, 1.2, 1] : 1,
              opacity: (isListening || isAISpeaking) ? [1, 0.7, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: (isListening || isAISpeaking) ? Infinity : 0
            }}
          />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isSpeechSupported && (
            <motion.button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Headphones className="h-4 w-4 text-gray-300" />
            </motion.button>
          )}
          <motion.button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="h-4 w-4 text-gray-300" />
          </motion.button>
        </div>
      </motion.div>

      {/* Voice settings panel */}
      <AnimatePresence>
        {showVoiceSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Voice Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-300 mb-2 block">Selected Voice</label>
                <div className="bg-white/5 rounded-lg p-3">
                  {getBestVoice() ? (
                    <div>
                      <div className="text-sm text-white font-medium">{getBestVoice()?.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Quality: {getBestVoice()?.quality}/5 • Naturalness: {getBestVoice()?.naturalness}/5
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">No voice selected</div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-300 mb-2 block">Available Voices</label>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white">{availableVoices.length} voices</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Recognition: {isRecognitionSupported ? 'Supported' : 'Not supported'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced controls panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced Controls
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.button
                className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Brain className="h-5 w-5 text-purple-400" />
                <span className="text-xs text-gray-300">AI Mode</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-xs text-gray-300">Quick Reply</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="h-5 w-5 text-green-400" />
                <span className="text-xs text-gray-300">Context</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="h-5 w-5 text-pink-400" />
                <span className="text-xs text-gray-300">Enhanced</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input area */}
      <motion.div
        className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-gray-700/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={interimTranscript || "Ask Max about banking, investments, or National Bank services..."}
              className="w-full bg-transparent border-0 resize-none focus:outline-none text-white placeholder-gray-400 text-lg min-h-[48px] max-h-32 leading-6"
              rows={1}
              disabled={isLoading || isListening}
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
            
            {/* Interim transcript display */}
            <AnimatePresence>
              {interimTranscript && (
                <motion.div 
                  className="absolute bottom-full left-0 mb-2 text-blue-300 text-sm opacity-70 bg-blue-500/10 backdrop-blur-sm rounded-lg px-3 py-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Listening: &quot;{interimTranscript}&quot;
                  {speechConfidence > 0 && (
                    <span className="ml-2 text-xs">
                      ({Math.round(speechConfidence * 100)}%)
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center gap-2">
            {/* Mute/Unmute button */}
            {isSpeechSupported && (
              <motion.button
                onClick={onToggleMute}
                className={`p-3 rounded-xl transition-all backdrop-blur-sm ${
                  isMuted 
                    ? 'bg-red-500/80 text-white hover:bg-red-600/80 shadow-lg shadow-red-500/30' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                title={isMuted ? 'Unmute Max&apos;s voice' : 'Mute Max&apos;s voice'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={pulseAnimation && !isMuted ? {
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.7)',
                    '0 0 0 10px rgba(59, 130, 246, 0)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: pulseAnimation ? Infinity : 0 }}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </motion.button>
            )}

            {/* Microphone button */}
            {isRecognitionSupported && (
              <motion.button
                onClick={onToggleListening}
                className={`p-3 rounded-xl transition-all backdrop-blur-sm relative ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                disabled={isLoading}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isListening ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                
                {/* Confidence indicator */}
                {isListening && speechConfidence > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  ></motion.div>
                )}
              </motion.button>
            )}
            
            {/* Send button */}
            <motion.button
              onClick={onSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Input hints */}
        <motion.div
          className="mt-3 flex items-center justify-between text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <span>Press Enter to send • Shift+Enter for new line</span>
            {isRecognitionSupported && (
              <span className="flex items-center gap-1">
                <Mic className="h-3 w-3" />
                Voice input enabled
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <motion.div
              className="text-blue-400 font-medium"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Max AI
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}