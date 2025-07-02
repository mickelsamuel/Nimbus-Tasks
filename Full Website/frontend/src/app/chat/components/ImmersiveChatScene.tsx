'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { OrbitControls, Stars, Html, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimatePresence } from 'framer-motion';
import FinancialRobot from './FinancialRobot';
import Chat3DBubble from './Chat3DBubble';
import FloatingChatHistory from './FloatingChatHistory';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: string;
  suggestions?: string[];
  sources?: string[];
}

interface ImmersiveChatSceneProps {
  messages: Message[];
  currentMessage: string;
  isAISpeaking: boolean;
  currentViseme?: string;
  isLoading: boolean;
  showHistory: boolean;
  onHistoryToggle: () => void;
  onMessageClick?: (message: Message) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

// Enhanced environment with interactive elements
function BankingEnvironment() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      // Subtle grid animation
      gridRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <>
      {/* Animated floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshStandardMaterial 
          color="#0F172A" 
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Dynamic grid */}
      <primitive 
        ref={gridRef}
        object={new THREE.GridHelper(30, 30, '#3B82F6', '#1F2937')} 
        position={[0, -2.49, 0]} 
      />
      
      {/* Floating data streams */}
      {Array.from({ length: 8 }, (_, i) => (
        <DataStream key={i} index={i} />
      ))}
      
      {/* Background holographic panels */}
      {/* <HolographicPanels /> */}
    </>
  );
}

// Animated data streams
function DataStream({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / 8) * Math.PI * 2;
  const radius = 10;
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + index;
      meshRef.current.position.x = Math.cos(angle + t * 0.1) * radius;
      meshRef.current.position.z = Math.sin(angle + t * 0.1) * radius;
      meshRef.current.position.y = Math.sin(t * 0.5) * 3;
      meshRef.current.rotation.y = t;
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.02, 0.02, 6]} />
      <meshStandardMaterial 
        color="#60A5FA" 
        emissive="#3B82F6" 
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Holographic information panels
function HolographicPanels() {
  return (
    <>
      {/* Banking stats panel */}
      <group position={[-8, 2, -5]}>
        <mesh>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            transparent 
            opacity={0.7}
            emissive="#3B82F6"
            emissiveIntensity={0.1}
          />
        </mesh>
        <Html
          center
          transform
          position={[0, 0, 0.01]}
          style={{ width: '200px', pointerEvents: 'none' }}
        >
          <div className="text-blue-300 text-xs text-center p-2">
            <div className="font-bold mb-1">NATIONAL BANK</div>
            <div>Est. 1859</div>
            <div>160+ Years</div>
            <div className="text-green-400">99.9% Uptime</div>
          </div>
        </Html>
      </group>

      {/* Services panel */}
      <group position={[8, 2, -5]}>
        <mesh>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            transparent 
            opacity={0.7}
            emissive="#F59E0B"
            emissiveIntensity={0.1}
          />
        </mesh>
        <Html
          center
          transform
          position={[0, 0, 0.01]}
          style={{ width: '200px', pointerEvents: 'none' }}
        >
          <div className="text-orange-300 text-xs text-center p-2">
            <div className="font-bold mb-1">SERVICES</div>
            <div>• Banking</div>
            <div>• Loans</div>
            <div>• Investments</div>
            <div>• Security</div>
          </div>
        </Html>
      </group>
    </>
  );
}

// Loading indicator
function LoadingIndicator() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 3]}>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[Math.cos((i / 8) * Math.PI * 2), 0, Math.sin((i / 8) * Math.PI * 2)]}>
          <sphereGeometry args={[0.1]} />
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

export default function ImmersiveChatScene({
  messages,
  currentMessage,
  isAISpeaking,
  currentViseme,
  isLoading,
  showHistory,
  onHistoryToggle,
  onMessageClick,
  onSuggestionClick
}: ImmersiveChatSceneProps) {
  const controlsRef = useRef<any>(null);
  
  // Show only recent messages as 3D bubbles (limit for better visual experience)
  const recentMessages = messages.slice(-4);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={50} />
      
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate={!isAISpeaking && !showHistory}
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.08}
        target={[0, 1, 0]}
      />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-8, 8, -8]} intensity={0.5} color="#60A5FA" />
      <pointLight position={[8, 8, 8]} intensity={0.5} color="#F59E0B" />
      <spotLight
        position={[0, 10, 5]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        castShadow
        target-position={[0, 0, 0]}
      />
      
      {/* Environment - removed Environment component to avoid HDRI loading errors */}
      {/* Simple gradient background is set in the Canvas style prop */}
      <fog attach="fog" args={['#0F172A', 15, 40]} />
      
      {/* Scene elements */}
      <Suspense fallback={null}>
        <BankingEnvironment />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        {/* Main robot */}
        <FinancialRobot 
          isAISpeaking={isAISpeaking}
          currentViseme={currentViseme}
          emotion={isAISpeaking ? 'happy' : 'neutral'}
        />
        
        {/* 3D Chat bubbles */}
        {recentMessages.map((message, index) => (
          <Chat3DBubble
            key={message.id}
            message={message}
            index={index} // Simple indexing from 0
            isLatest={index === recentMessages.length - 1}
          />
        ))}
        
        {/* Floating chat history */}
        <FloatingChatHistory
          messages={messages}
          isVisible={showHistory}
          onMessageClick={onMessageClick}
          onSuggestionClick={onSuggestionClick}
        />
        
        {/* Loading indicator */}
        {isLoading && <LoadingIndicator />}
      </Suspense>
      
      {/* UI Controls overlay */}
      <Html
        position={[0, 5, 0]}
        center
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex gap-2">
          <button
            onClick={onHistoryToggle}
            className={`px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${
              showHistory 
                ? 'bg-blue-500/80 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </Html>
    </>
  );
}