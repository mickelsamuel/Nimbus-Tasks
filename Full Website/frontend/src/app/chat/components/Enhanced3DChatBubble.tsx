'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text, RoundedBox } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: string;
  suggestions?: string[];
  sources?: string[];
}

interface Enhanced3DChatBubbleProps {
  message: Message;
  index: number;
  isLatest: boolean;
  isAnimating?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export default function Enhanced3DChatBubble({ 
  message, 
  index, 
  isLatest, 
  isAnimating = false,
  onSuggestionClick 
}: Enhanced3DChatBubbleProps) {
  const bubbleRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate position based on sender and index
  const isUser = message.sender === 'user';
  const baseX = isUser ? 3 : -3;
  const baseY = -index * 0.8 + 2;
  const baseZ = isLatest ? 0.5 : 0;
  
  // Enhanced spring animation with stagger effect
  const springs = useSpring({
    position: isVisible ? [baseX, baseY, baseZ] : [baseX, baseY - 2, baseZ - 2],
    scale: isLatest ? (isHovered ? 1.05 : 1) : 0.9,
    opacity: isLatest ? 1 : Math.max(0.6 - index * 0.1, 0.2),
    rotationY: isAnimating ? Math.sin(Date.now() * 0.001) * 0.1 : 0,
    config: { 
      tension: 200, 
      friction: 25,
      precision: 0.01 
    },
    delay: index * 100, // Stagger animation
  });
  
  // Floating animation for latest message
  useFrame((state) => {
    if (bubbleRef.current && isLatest) {
      bubbleRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });
  
  // Show bubble with delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);
  
  // Color scheme based on sender
  const bubbleColor = isUser ? '#3B82F6' : '#10B981';
  const textColor = '#FFFFFF';
  const accentColor = isUser ? '#60A5FA' : '#34D399';
  
  // Truncate long messages
  const truncatedContent = message.content.length > 100 
    ? message.content.substring(0, 100) + '...' 
    : message.content;
  
  return (
    <animated.group 
      ref={bubbleRef}
      position={springs.position as any}
      scale={springs.scale}
      rotation-y={springs.rotationY}
    >
      {/* Main bubble body */}
      <animated.mesh
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        castShadow
        receiveShadow
      >
        <RoundedBox args={[2.5, 0.8, 0.3]} radius={0.1} smoothness={4}>
          <animated.meshStandardMaterial
            color={bubbleColor}
            transparent
            opacity={springs.opacity}
            metalness={0.1}
            roughness={0.3}
            emissive={accentColor}
            emissiveIntensity={isLatest ? 0.1 : 0.05}
          />
        </RoundedBox>
      </animated.mesh>
      
      {/* Bubble tail */}
      <mesh 
        position={isUser ? [-1.2, -0.2, 0] : [1.2, -0.2, 0]}
        rotation={isUser ? [0, 0, Math.PI / 4] : [0, 0, -Math.PI / 4]}
      >
        <coneGeometry args={[0.15, 0.3, 8]} />
        <animated.meshStandardMaterial
          color={bubbleColor}
          transparent
          opacity={springs.opacity}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      
      {/* Glow effect for latest message */}
      {isLatest && (
        <mesh>
          <RoundedBox args={[2.7, 1.0, 0.35]} radius={0.12} smoothness={4}>
            <animated.meshStandardMaterial
              color={accentColor}
              transparent
              opacity={0.2}
              emissive={accentColor}
              emissiveIntensity={0.3}
            />
          </RoundedBox>
        </mesh>
      )}
      
      {/* Text content */}
      <Text
        ref={textRef}
        position={[0, 0, 0.16]}
        fontSize={0.12}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
        textAlign="center"
        font="/fonts/Inter-Medium.woff"
      >
        {truncatedContent}
      </Text>
      
      {/* Sender indicator */}
      <Text
        position={[isUser ? 1 : -1, -0.3, 0.16]}
        fontSize={0.08}
        color={textColor}
        anchorX={isUser ? "right" : "left"}
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        {isUser ? 'You' : 'Max AI'}
      </Text>
      
      {/* Status indicator for user messages */}
      {isUser && message.status && (
        <mesh position={[1.1, 0.3, 0.16]}>
          <circleGeometry args={[0.03]} />
          <meshStandardMaterial
            color={
              message.status === 'read' ? '#10B981' :
              message.status === 'sent' ? '#3B82F6' :
              '#F59E0B'
            }
            emissive={
              message.status === 'read' ? '#10B981' :
              message.status === 'sent' ? '#3B82F6' :
              '#F59E0B'
            }
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
      
      {/* Interactive HTML overlay for suggestions */}
      {message.suggestions && message.suggestions.length > 0 && isLatest && (
        <Html
          position={[0, -0.6, 0]}
          center
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex flex-wrap gap-2 max-w-md">
            {message.suggestions.slice(0, 3).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-3 py-1 bg-white/20 backdrop-blur-lg rounded-full text-white text-xs hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
              >
                {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
              </button>
            ))}
          </div>
        </Html>
      )}
      
      {/* Ambient lighting for the bubble */}
      <pointLight
        position={[0, 0, 0.5]}
        color={accentColor}
        intensity={isLatest ? 0.3 : 0.1}
        distance={2}
        decay={2}
      />
      
      {/* Particle effects for AI messages */}
      {!isUser && isLatest && isAnimating && (
        <group>
          {Array.from({ length: 6 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 6) * Math.PI * 2) * 1.5,
                Math.sin((i / 6) * Math.PI * 2) * 0.5,
                0.3
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </animated.group>
  );
}