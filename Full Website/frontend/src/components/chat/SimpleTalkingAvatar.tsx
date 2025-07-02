'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSpeechSynthesis } from 'react-speech-kit';

interface SimpleTalkingAvatarProps {
  isPlaying: boolean;
  currentText?: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

// Simple 3D character
function SimpleCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += delta * 0.3;
      
      // Scale animation when speaking
      if (isSpeaking) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 3);
      }
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#E01A1A" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.5, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.3, 1.2, 0.6]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.3, 1.2, 0.6]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Mouth - animated when speaking */}
      <mesh position={[0, 0.8, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, isSpeaking ? 0.2 : 0.15, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// Speech bubble component
function SpeechBubble({ text, visible }: { text: string; visible: boolean }) {
  const bubbleRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (bubbleRef.current && visible) {
      bubbleRef.current.position.y = 2.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  if (!visible || !text) return null;

  return (
    <group ref={bubbleRef} position={[0, 2.5, 0]}>
      {/* Bubble background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[6, 2]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.95} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
      >
        {text}
      </Text>
    </group>
  );
}

// Floating particles effect
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  const positions = new Float32Array(50 * 3);
  for (let i = 0; i < 50; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={50}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        sizeAttenuation={true} 
        color="#E01A1A" 
        transparent 
        opacity={0.6} 
      />
    </points>
  );
}

export default function SimpleTalkingAvatar({ 
  isPlaying, 
  currentText = '',
  onSpeakingChange 
}: SimpleTalkingAvatarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const { speak, cancel } = useSpeechSynthesis();

  // Handle text-to-speech
  useEffect(() => {
    if (currentText && isPlaying) {
      setShowBubble(true);
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      
      speak({
        text: currentText,
        rate: 0.9,
        pitch: 1.1,
      });
      
      // Hide bubble after speaking
      const timeout = setTimeout(() => {
        setShowBubble(false);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      }, currentText.length * 80);
      
      return () => {
        clearTimeout(timeout);
        cancel();
      };
    } else {
      cancel();
      setShowBubble(false);
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }
  }, [currentText, isPlaying, speak, cancel, onSpeakingChange]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ 
          position: [0, 1.6, 4],
          fov: 50
        }}
        gl={{ 
          antialias: true,
          alpha: true
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          color="#ffffff"
        />
        <pointLight position={[-5, 5, 5]} intensity={0.3} color="#E01A1A" />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Floating particles */}
        <FloatingParticles />
        
        {/* Simple Character */}
        <SimpleCharacter isSpeaking={isSpeaking} />
        
        {/* Speech bubble */}
        <SpeechBubble 
          text={currentText}
          visible={showBubble}
        />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          autoRotate={false}
          target={[0, 0.5, 0]}
        />
      </Canvas>
      
      {/* Status indicator */}
      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isSpeaking ? 'bg-green-500 animate-pulse' : 
            isPlaying ? 'bg-blue-500' : 'bg-gray-400'
          }`} />
          <span className="text-xs text-white">
            {isSpeaking ? 'Speaking...' : isPlaying ? 'Ready' : 'Idle'}
          </span>
        </div>
      </div>
    </div>
  );
}