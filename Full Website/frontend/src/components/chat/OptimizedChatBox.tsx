'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
// import { useAuth } from '@/contexts/AuthContext'; // Unused import
import { prefersReducedMotion } from '@/utils/performance';

interface OptimizedChatBoxProps {
  messages: Array<{
    id: number;
    sender: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>;
  isTyping: boolean;
  currentSpeech?: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

// Lightweight 3D Chat Environment
function SimpleChatEnvironment({ children }: { children: React.ReactNode }) {
  const boxRef = useRef<THREE.Group>(null);
  const isReducedMotion = useMemo(() => prefersReducedMotion(), []);
  
  useFrame((state) => {
    if (boxRef.current && !isReducedMotion) {
      // Very subtle floating animation
      boxRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={boxRef}>
      {/* Simplified container */}
      <RoundedBox args={[12, 8, 8]} radius={0.3} smoothness={2} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.05}
        />
      </RoundedBox>
      
      {children}
    </group>
  );
}

// Simple Avatar Representation
function SimpleAvatar({ 
  isSpeaking, 
  position = [0, -1, 0] 
}: { 
  isSpeaking: boolean; 
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isReducedMotion = useMemo(() => prefersReducedMotion(), []);
  
  useFrame((state) => {
    if (meshRef.current && !isReducedMotion) {
      // Subtle breathing animation
      const breathScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.setScalar(breathScale);
      
      // Speaking animation
      if (isSpeaking) {
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.1;
      }
    }
  });

  return (
    <group position={position}>
      {/* Simple avatar representation */}
      <mesh ref={meshRef}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial 
          color={isSpeaking ? "#3b82f6" : "#6b7280"} 
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#10b981"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  );
}

// Lightweight message display
function MessageDisplay({ 
  messages, 
  isTyping 
}: { 
  messages: OptimizedChatBoxProps['messages'];
  isTyping: boolean;
}) {
  const latestMessage = messages[messages.length - 1];
  
  if (!latestMessage) return null;
  
  return (
    <group position={[0, 2, 0]}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        maxWidth={6}
        textAlign="center"
        color={latestMessage.sender === 'user' ? "#3b82f6" : "#10b981"}
        anchorX="center"
        anchorY="middle"
      >
        {latestMessage.content.substring(0, 100)}
        {latestMessage.content.length > 100 ? '...' : ''}
      </Text>
      
      {isTyping && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.2}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          AI is typing...
        </Text>
      )}
    </group>
  );
}

// Main optimized component
export default function OptimizedChatBox({
  messages,
  isTyping,
  currentSpeech,
  onSpeakingChange
}: OptimizedChatBoxProps) {
  // const { user } = useAuth(); // Commented out as it's not used
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isReducedMotion = useMemo(() => prefersReducedMotion(), []);
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, []);

  // Simplified speech handling
  useEffect(() => {
    if (currentSpeech) {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      
      const timer = setTimeout(() => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      }, currentSpeech.length * 50); // Rough estimate
      
      return () => clearTimeout(timer);
    } else {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }
  }, [currentSpeech, onSpeakingChange]);

  // Fallback to 2D on mobile or reduced motion
  if (isMobile || isReducedMotion) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isSpeaking ? 'bg-blue-500' : 'bg-gray-600'
          }`}>
            <div className="w-8 h-8 bg-white rounded-full opacity-80" />
          </div>
          {messages.length > 0 && (
            <p className="text-sm opacity-90 max-w-xs">
              {messages[messages.length - 1].content.substring(0, 100)}
            </p>
          )}
          {isTyping && (
            <p className="text-xs text-gray-400 mt-2">AI is typing...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45 }}
        gl={{ 
          antialias: false,
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {/* Simplified lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        {/* 3D Environment */}
        <SimpleChatEnvironment>
          <SimpleAvatar isSpeaking={isSpeaking} />
          <MessageDisplay messages={messages} isTyping={isTyping} />
        </SimpleChatEnvironment>
        
        {/* Simplified controls */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}