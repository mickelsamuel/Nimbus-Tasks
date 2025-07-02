'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ProfessionalRobotProps {
  isAISpeaking: boolean;
  currentViseme?: string;
  emotion?: 'neutral' | 'happy' | 'thinking';
  position?: [number, number, number];
}

// Create a simple procedural robot since we don't have a model file yet
function ProceduralRobot({ isAISpeaking, emotion = 'neutral', position = [0, 0, 0] }: ProfessionalRobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const [breathPhase, setBreathPhase] = useState(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Gentle floating animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    
    // Head rotation following a subtle pattern
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }

    // Eye animations
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkTime = Math.sin(state.clock.elapsedTime * 3) > 0.95 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blinkTime;
      eyeRightRef.current.scale.y = blinkTime;
    }

    // Mouth animation when speaking
    if (mouthRef.current) {
      if (isAISpeaking) {
        const talkScale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.3;
        mouthRef.current.scale.setScalar(talkScale);
      } else {
        mouthRef.current.scale.setScalar(1);
      }
    }

    // Breathing animation for body
    setBreathPhase(state.clock.elapsedTime * 0.8);
  });

  // Color scheme based on emotion
  const getEmotionColors = () => {
    switch (emotion) {
      case 'happy':
        return { primary: '#4F46E5', secondary: '#06B6D4', accent: '#10B981' };
      case 'thinking':
        return { primary: '#7C3AED', secondary: '#EC4899', accent: '#F59E0B' };
      default:
        return { primary: '#1E40AF', secondary: '#0EA5E9', accent: '#3B82F6' };
    }
  };

  const colors = getEmotionColors();

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh position={[0, -1, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.8, 1.6]} />
        <meshStandardMaterial 
          color={colors.primary}
          metalness={0.8}
          roughness={0.2}
          emissive={colors.primary}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.6]} />
        <meshStandardMaterial 
          color={colors.secondary}
          metalness={0.7}
          roughness={0.3}
          emissive={colors.secondary}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Eyes */}
      <mesh ref={eyeLeftRef} position={[-0.2, 0.6, 0.4]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial 
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.2, 0.6, 0.4]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial 
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 0.3, 0.5]} castShadow>
        <capsuleGeometry args={[0.1, 0.2]} />
        <meshStandardMaterial 
          color={colors.accent}
          emissive={colors.accent}
          emissiveIntensity={isAISpeaking ? 0.6 : 0.2}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-1, -0.3, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.15, 1]} />
        <meshStandardMaterial 
          color={colors.primary}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[1, -0.3, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.15, 1]} />
        <meshStandardMaterial 
          color={colors.primary}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Chest panel */}
      <mesh position={[0, -0.5, 0.7]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.05]} />
        <meshStandardMaterial 
          color="#1F2937"
          metalness={0.9}
          roughness={0.1}
          emissive="#374151"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Status indicator on chest */}
      <mesh position={[0, -0.5, 0.76]}>
        <circleGeometry args={[0.05]} />
        <meshStandardMaterial 
          color={isAISpeaking ? "#10B981" : "#3B82F6"}
          emissive={isAISpeaking ? "#10B981" : "#3B82F6"}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Glowing ring around head when speaking */}
      {isAISpeaking && (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.9, 32]} />
            <meshStandardMaterial 
              color="#06D6A0"
              emissive="#06D6A0"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      )}

      {/* Ambient glow */}
      <pointLight
        position={[0, 0.5, 0]}
        color={colors.accent}
        intensity={isAISpeaking ? 1 : 0.3}
        distance={4}
      />
    </group>
  );
}

export default function ProfessionalRobot(props: ProfessionalRobotProps) {
  return <ProceduralRobot {...props} />;
}