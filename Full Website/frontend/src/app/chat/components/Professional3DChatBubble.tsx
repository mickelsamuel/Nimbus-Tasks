'use client';

import { useRef, useEffect, useState } from 'react';
import { Html, Text3D, Center, Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Professional3DChatBubbleProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  };
  index: number;
  isLatest?: boolean;
}

export default function Professional3DChatBubble({ 
  message, 
  index, 
  isLatest 
}: Professional3DChatBubbleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0);
  const { camera } = useThree();
  
  const animationProgress = useRef(0);
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  // Smart positioning - stack bubbles in a spiral around the robot
  const baseAngle = (index * 0.8) % (Math.PI * 2);
  const radius = 4 + (index % 3) * 0.5;
  const height = -1 + (index * 0.8);
  
  const basePosition = new THREE.Vector3(
    Math.cos(baseAngle) * (radius + 2),
    height + 2,
    Math.sin(baseAngle) * (radius + 2)
  );
  
  const targetPosition = new THREE.Vector3(
    Math.cos(baseAngle) * radius,
    height,
    Math.sin(baseAngle) * radius
  );

  // Dynamic sizing based on content
  const contentLength = message.content.length;
  const bubbleWidth = Math.min(Math.max(2, contentLength * 0.03), 4);
  const bubbleHeight = Math.min(Math.max(0.8, Math.ceil(contentLength / 40) * 0.4), 2);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
      setScale(1);
    }, index * 200);

    return () => clearTimeout(timer);
  }, [index]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth entrance animation
    animationProgress.current = Math.min(animationProgress.current + delta * 1.5, 1);
    
    groupRef.current.position.lerpVectors(
      basePosition,
      targetPosition,
      THREE.MathUtils.smootherstep(animationProgress.current, 0, 1)
    );

    // Gentle floating when in position
    if (animationProgress.current >= 1) {
      groupRef.current.position.y = targetPosition.y + 
        Math.sin(state.clock.elapsedTime * 0.5 + floatOffset.current) * 0.1;
    }

    // Face camera with smooth rotation
    const targetRotation = new THREE.Euler();
    targetRotation.setFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        camera.position.clone().sub(groupRef.current.position).normalize()
      )
    );
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.y,
      delta * 2
    );

    // Fade out old bubbles
    if (index < -6) {
      setOpacity(Math.max(0, opacity - delta * 0.5));
    }
  });

  const bubbleColor = message.sender === 'user' ? '#3B82F6' : '#FFFFFF';
  const textColor = message.sender === 'user' ? '#ffffff' : '#1F2937';
  const emissiveColor = message.sender === 'user' ? '#1E40AF' : '#E5E7EB';

  return (
    <group ref={groupRef} scale={scale}>
      <Float 
        speed={0.5} 
        rotationIntensity={0.1} 
        floatIntensity={0.1}
      >
        {/* Main bubble geometry */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[bubbleWidth, 16, 16]} />
          <meshStandardMaterial
            color={bubbleColor}
            transparent
            opacity={opacity * 0.9}
            roughness={0.1}
            metalness={0.2}
            emissive={emissiveColor}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Bubble connector for AI messages */}
        {message.sender === 'ai' && isLatest && (
          <mesh 
            position={[-bubbleWidth * 0.8, -bubbleWidth * 0.3, 0]}
            rotation={[0, 0, Math.PI / 4]}
            castShadow
          >
            <coneGeometry args={[bubbleWidth * 0.2, bubbleWidth * 0.4, 6]} />
            <meshStandardMaterial
              color={bubbleColor}
              transparent
              opacity={opacity * 0.9}
              roughness={0.1}
              metalness={0.2}
              emissive={emissiveColor}
              emissiveIntensity={0.1}
            />
          </mesh>
        )}

        {/* Text content */}
        <Html
          center
          transform
          occlude
          position={[0, 0, bubbleWidth + 0.1]}
          style={{
            width: `${bubbleWidth * 120}px`,
            opacity,
            transition: 'opacity 0.5s ease-out',
            pointerEvents: 'none',
          }}
        >
          <div 
            className={`flex flex-col items-center justify-center p-4 rounded-2xl backdrop-blur-sm ${
              message.sender === 'user' 
                ? 'text-white bg-blue-500/20' 
                : 'text-gray-900 bg-white/80'
            }`}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: Math.max(12, Math.min(16, bubbleWidth * 4)) + 'px',
              lineHeight: '1.4',
              textAlign: 'center',
              maxWidth: '100%',
              wordWrap: 'break-word',
              textShadow: message.sender === 'user' 
                ? '0 1px 2px rgba(0,0,0,0.3)' 
                : 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ margin: 0, padding: 0 }}>
              {message.content}
            </div>
            <div 
              className="mt-2 opacity-60"
              style={{ 
                fontSize: Math.max(10, Math.min(12, bubbleWidth * 3)) + 'px',
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

        {/* Glow effect for latest message */}
        {isLatest && (
          <>
            <pointLight
              position={[0, 0, bubbleWidth + 0.5]}
              color={message.sender === 'user' ? '#60A5FA' : '#F3F4F6'}
              intensity={0.5}
              distance={bubbleWidth * 2}
            />
            
            {/* Particle effect for new messages */}
            <mesh>
              <ringGeometry args={[bubbleWidth + 0.2, bubbleWidth + 0.4, 16]} />
              <meshBasicMaterial
                color={message.sender === 'user' ? '#3B82F6' : '#10B981'}
                transparent
                opacity={opacity * 0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </>
        )}
      </Float>
    </group>
  );
}