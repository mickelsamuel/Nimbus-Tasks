'use client';

import { useRef } from 'react';
import { Html, RoundedBox } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Send, Mic, MicOff, Loader2, Volume2, VolumeX, Sparkles, BrainCircuit, TrendingUp, Shield } from 'lucide-react';

interface FloatingChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  isListening: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isRecognitionSupported: boolean;
  interimTranscript: string;
  onSendMessage: () => void;
  onToggleListening: () => void;
  onToggleMute: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function FloatingChatInput({
  inputMessage,
  setInputMessage,
  isListening,
  isLoading,
  isMuted,
  isRecognitionSupported,
  interimTranscript,
  onSendMessage,
  onToggleListening,
  onToggleMute,
  onKeyPress
}: FloatingChatInputProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Position at bottom of screen in world space
    groupRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    
    // Always face camera
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    groupRef.current.lookAt(
      groupRef.current.position.x + direction.x,
      groupRef.current.position.y,
      groupRef.current.position.z + direction.z
    );
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 3]}>
      {/* Input panel background */}
      <RoundedBox args={[10, 2, 0.3]} radius={0.3} smoothness={4}>
        <meshStandardMaterial
          color="#1F2937"
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Glow effect */}
      <RoundedBox args={[10.2, 2.2, 0.1]} radius={0.35} smoothness={4} position={[0, 0, -0.1]}>
        <meshStandardMaterial
          color="#3B82F6"
          transparent
          opacity={0.2}
          emissive="#3B82F6"
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      {/* Main input interface */}
      <Html
        center
        transform
        occlude
        position={[0, 0, 0.16]}
        style={{
          width: '800px',
          height: '160px',
          pointerEvents: 'auto',
        }}
      >
        <div className="bg-transparent p-4">
          {/* Main input area */}
          <div className="flex items-end gap-3 bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm border border-gray-600/30">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder={interimTranscript || "Ask Max about banking, investments, or National Bank..."}
                className="w-full bg-transparent border-0 resize-none focus:outline-none text-white placeholder-gray-400 text-lg"
                rows={1}
                disabled={isLoading || isListening}
                style={{ 
                  minHeight: '24px',
                  maxHeight: '120px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
              
              {/* Interim transcript display */}
              {interimTranscript && (
                <div className="text-blue-300 text-sm mt-1 opacity-70">
                  Listening: "{interimTranscript}"
                </div>
              )}
            </div>
            
            {/* Control buttons */}
            <div className="flex items-center gap-2">
              {/* Voice controls */}
              <button
                onClick={onToggleMute}
                className={`p-3 rounded-xl transition-all ${
                  isMuted 
                    ? 'bg-red-500/80 text-white hover:bg-red-600/80' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              {/* Microphone button */}
              <button
                onClick={onToggleListening}
                className={`p-3 rounded-xl transition-all ${
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
                onClick={onSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="mt-3 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-gray-800/30 rounded-xl p-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300 mr-2">Quick Actions:</span>
              
              <button 
                onClick={() => setInputMessage("What's my account balance?")}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
              >
                <TrendingUp className="h-3 w-3" />
                Balance
              </button>
              
              <button 
                onClick={() => setInputMessage("Tell me about investment options")}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
              >
                <BrainCircuit className="h-3 w-3" />
                Investing
              </button>
              
              <button 
                onClick={() => setInputMessage("How do you protect my account from fraud?")}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
              >
                <Shield className="h-3 w-3" />
                Security
              </button>
            </div>
          </div>
        </div>
      </Html>

      {/* Decorative light elements */}
      <pointLight
        position={[0, 0, 0.5]}
        color="#3B82F6"
        intensity={0.5}
        distance={3}
      />
    </group>
  );
}