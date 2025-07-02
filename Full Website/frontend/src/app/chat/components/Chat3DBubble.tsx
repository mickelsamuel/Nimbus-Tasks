'use client';

import { useRef, useEffect, useState } from 'react';
import { Text, RoundedBox, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Chat3DBubbleProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    status?: string;
  };
  index: number;
  onComplete?: () => void;
  isLatest?: boolean;
}

export default function Chat3DBubble({ message, index, onComplete, isLatest }: Chat3DBubbleProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0);
  const { camera } = useThree();
  
  // Animation timing
  const animationProgress = useRef(0);
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  
  // Improved positioning - messages stack from bottom to top
  const verticalSpacing = 2.2;
  const horizontalOffset = message.sender === 'user' ? 4 : -4;
  const baseY = -1 + (index * verticalSpacing); // Start from platform level and go up
  
  const basePosition = message.sender === 'user' 
    ? new THREE.Vector3(horizontalOffset + 3, baseY, 2)
    : new THREE.Vector3(horizontalOffset - 3, baseY, 2);
    
  const targetPosition = message.sender === 'user'
    ? new THREE.Vector3(horizontalOffset, baseY, 0)
    : new THREE.Vector3(horizontalOffset, baseY, 0);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => {
      setOpacity(1);
      setScale(1);
    }, 100);

    // Call onComplete after animation
    if (onComplete && isLatest) {
      const completeTimer = setTimeout(onComplete, 1500);
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [onComplete, isLatest]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth animation progress
    animationProgress.current = Math.min(animationProgress.current + delta * 0.8, 1);
    
    // Interpolate position
    meshRef.current.position.lerpVectors(
      basePosition,
      targetPosition,
      THREE.MathUtils.smoothstep(animationProgress.current, 0, 1)
    );

    // Add subtle floating animation
    if (animationProgress.current >= 1) {
      meshRef.current.position.y = targetPosition.y + Math.sin(state.clock.elapsedTime * 0.5 + floatOffset.current) * 0.03;
    }

    // Billboard effect - always face camera
    meshRef.current.lookAt(camera.position);
    
    // Fade out very old messages
    if (index < -5) {
      setOpacity(Math.max(0, opacity - delta * 0.5));
    }
  });

  // Smart sizing based on content length
  const charCount = message.content.length;
  const maxCharsPerLine = 40;
  const estimatedLines = Math.ceil(charCount / maxCharsPerLine);
  
  // Dynamic sizing with max limits
  const bubbleWidth = Math.min(Math.max(3, charCount * 0.05), 7);
  const bubbleHeight = Math.min(Math.max(1, estimatedLines * 0.4), 3);
  const bubbleDepth = 0.3;

  const bubbleColor = message.sender === 'user' ? '#3B82F6' : '#FFFFFF';
  const textColor = message.sender === 'user' ? '#ffffff' : '#1F2937';

  return (
    <group ref={meshRef} scale={scale}>
      {/* Main bubble */}
      <RoundedBox
        args={[bubbleWidth, bubbleHeight, bubbleDepth]}
        radius={0.25}
        smoothness={4}
      >
        <meshStandardMaterial
          color={bubbleColor}
          transparent
          opacity={opacity * 0.9}
          roughness={0.1}
          metalness={0.1}
          emissive={message.sender === 'user' ? '#1E40AF' : '#E5E7EB'}
          emissiveIntensity={0.05}
        />
      </RoundedBox>

      {/* Bubble tail for latest AI message */}
      {isLatest && message.sender === 'ai' && (
        <mesh 
          position={[-bubbleWidth / 2 + 0.2, -bubbleHeight / 2 + 0.1, 0]} 
          rotation={[0, 0, Math.PI / 4]}
        >
          <coneGeometry args={[0.2, 0.4, 4]} />
          <meshStandardMaterial
            color={bubbleColor}
            transparent
            opacity={opacity * 0.9}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Message content */}
      <Html
        center
        transform
        occlude
        position={[0, 0, bubbleDepth / 2 + 0.01]}
        style={{
          width: `${bubbleWidth * 60}px`,
          opacity,
          transition: 'opacity 0.5s ease-out',
          pointerEvents: 'none',
        }}
      >
        <div 
          className={`flex flex-col items-center justify-center p-3 ${
            message.sender === 'user' ? 'text-white' : 'text-gray-900'
          }`}
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            lineHeight: '1.4',
            textAlign: 'center',
            maxWidth: '100%',
            wordWrap: 'break-word',
            textShadow: message.sender === 'user' 
              ? '0 1px 2px rgba(0,0,0,0.3)' 
              : 'none',
          }}
        >
          <div style={{ margin: 0, padding: 0 }}>
            {message.content}
          </div>
          <div 
            className="mt-2 opacity-60"
            style={{ 
              fontSize: '11px',
              whiteSpace: 'nowrap'
            }}
          >
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </Html>

      {/* Subtle glow for latest message */}
      {isLatest && (
        <pointLight
          position={[0, 0, 1]}
          color={message.sender === 'user' ? '#60A5FA' : '#F3F4F6'}
          intensity={0.3}
          distance={3}
        />
      )}
    </group>
  );
}