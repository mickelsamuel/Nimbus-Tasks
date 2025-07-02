'use client';

import { Suspense, useRef } from 'react';
import { OrbitControls, Stars, Html, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import ProfessionalRobot from './ProfessionalRobot';
import Professional3DChatBubble from './Professional3DChatBubble';
import SimpleBankingEnvironment from './SimpleBankingEnvironment';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: string;
  suggestions?: string[];
  sources?: string[];
}

interface Professional3DChatSceneProps {
  messages: Message[];
  currentMessage?: string;
  isAISpeaking: boolean;
  currentViseme?: string;
  isLoading: boolean;
  showHistory: boolean;
  onHistoryToggle: () => void;
  onMessageClick?: (message: Message) => void;
  onSuggestionClick?: (suggestion: string) => void;
  isListening?: boolean;
  speechConfidence?: number;
  availableVoices?: Array<{ name: string; quality: number; naturalness: number }>;
}

function LoadingIndicator() {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.children.forEach((child: any, i: number) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
      });
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 2]}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[
          Math.cos((i / 6) * Math.PI * 2) * 0.8,
          0,
          Math.sin((i / 6) * Math.PI * 2) * 0.8
        ]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial 
            color="#3B82F6" 
            emissive="#3B82F6" 
            emissiveIntensity={Math.sin(Date.now() * 0.005 + i) * 0.5 + 0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Professional3DChatScene({
  messages,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentMessage: _currentMessage,
  isAISpeaking,
  currentViseme,
  isLoading,
  showHistory,
  onHistoryToggle,
  isListening = false,
  speechConfidence = 0,
  availableVoices = []
}: Professional3DChatSceneProps) {
  const controlsRef = useRef<any>(null);
  
  // Show recent messages for better performance and visual clarity
  const recentMessages = showHistory ? messages : messages.slice(-8);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={60} />
      
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={!isAISpeaking && !showHistory}
        autoRotateSpeed={0.2}
        enableDamping
        dampingFactor={0.05}
        target={[0, 0, 0]}
      />
      
      {/* Environment */}
      <Suspense fallback={null}>
        <SimpleBankingEnvironment />
        <Stars 
          radius={30} 
          depth={30} 
          count={200} 
          factor={2} 
          saturation={0.6} 
          fade 
          speed={0.3} 
        />
        
        {/* Enhanced robot assistant with new states */}
        <ProfessionalRobot 
          isAISpeaking={isAISpeaking}
          currentViseme={currentViseme}
          emotion={isAISpeaking ? 'happy' : isLoading ? 'thinking' : isListening ? 'listening' : 'neutral'}
          position={[0, 0, 0]}
          isListening={isListening}
          isProcessing={isLoading}
        />
        
        {/* 3D Chat bubbles */}
        {recentMessages.map((message, index) => (
          <Professional3DChatBubble
            key={message.id}
            message={message}
            index={index}
            isLatest={index === recentMessages.length - 1}
          />
        ))}
        
        {/* Loading indicator */}
        {isLoading && <LoadingIndicator />}
      </Suspense>
      
      {/* UI Controls overlay */}
      <Html
        position={[0, 6, 0]}
        center
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onHistoryToggle}
            className={`px-6 py-3 rounded-xl backdrop-blur-lg transition-all font-medium ${
              showHistory 
                ? 'bg-blue-500/90 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
            }`}
          >
            {showHistory ? 'Hide History' : `Show All Messages (${messages.length})`}
          </button>
          
          <div className="text-center text-white/80 text-sm bg-black/20 backdrop-blur-lg rounded-lg px-4 py-2">
            <div className="font-medium">💬 {recentMessages.length} messages</div>
            <div className="text-xs opacity-75">
              {isAISpeaking ? '🎤 AI Speaking' : 
               isListening ? `🎧 Listening${speechConfidence > 0 ? ` (${Math.round(speechConfidence * 100)}%)` : '...'}` :
               isLoading ? '💭 Thinking...' : '✨ Ready'}
            </div>
            {availableVoices.length > 0 && (
              <div className="text-xs opacity-60 mt-1">
                🗣️ {availableVoices.length} voices available
              </div>
            )}
          </div>
        </div>
      </Html>

      {/* Enhanced audio visualization */}
      {(isAISpeaking || isListening) && (
        <Html position={[0, 3, 0]} center>
          <div className="flex items-center gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`rounded-full animate-pulse ${
                  isAISpeaking ? 'bg-green-400' : 'bg-blue-400'
                }`}
                style={{
                  width: isListening ? '6px' : '8px',
                  height: `${
                    12 + 
                    Math.sin(Date.now() * 0.01 + i) * 
                    (isListening ? 6 : 8) * 
                    (speechConfidence || 1)
                  }px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: isListening ? '0.6s' : '0.8s',
                  opacity: isListening ? 0.6 + (speechConfidence * 0.4) : 1
                }}
              />
            ))}
          </div>
          {isListening && speechConfidence > 0 && (
            <div className="text-xs text-blue-300 mt-2 text-center">
              Confidence: {Math.round(speechConfidence * 100)}%
            </div>
          )}
        </Html>
      )}
    </>
  );
}