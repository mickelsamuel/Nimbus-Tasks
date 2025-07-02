'use client';

import { useRef } from 'react';
import { Html, RoundedBox } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: string;
  suggestions?: string[];
  sources?: string[];
}

interface FloatingChatHistoryProps {
  messages: Message[];
  isVisible: boolean;
  onMessageClick?: (message: Message) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

export default function FloatingChatHistory({ 
  messages, 
  isVisible, 
  onMessageClick,
  onSuggestionClick 
}: FloatingChatHistoryProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Gentle floating animation
    groupRef.current.position.y = 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    
    // Always face camera but only rotate on Y axis
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    groupRef.current.lookAt(
      groupRef.current.position.x + direction.x,
      groupRef.current.position.y,
      groupRef.current.position.z + direction.z
    );
  });

  if (!isVisible) return null;

  // Show only last 5 messages for clarity
  const recentMessages = messages.slice(-5);

  return (
    <group ref={groupRef} position={[0, 4, -3]}>
      {/* Background panel */}
      <RoundedBox args={[8, 4, 0.2]} radius={0.3} smoothness={4}>
        <meshStandardMaterial
          color="#1F2937"
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Content */}
      <Html
        center
        transform
        occlude
        position={[0, 0, 0.11]}
        style={{
          width: '600px',
          height: '300px',
          pointerEvents: 'auto',
        }}
      >
        <div className="bg-transparent text-white p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-300">Chat History</h3>
            <span className="text-sm text-gray-400">
              {messages.length} messages
            </span>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {recentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-2 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600/30 ml-4' 
                      : 'bg-gray-600/30 mr-4'
                  }`}
                  onClick={() => onMessageClick?.(message)}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {message.sender === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white line-clamp-2">
                        {message.content}
                      </p>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      
                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.suggestions.slice(0, 3).map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSuggestionClick?.(suggestion);
                              }}
                              className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/30 transition-colors"
                            >
                              {suggestion.length > 20 ? suggestion.slice(0, 20) + '...' : suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Html>

      {/* Decorative elements */}
      <mesh position={[-3.8, 1.8, 0.15]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[3.8, 1.8, 0.15]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}