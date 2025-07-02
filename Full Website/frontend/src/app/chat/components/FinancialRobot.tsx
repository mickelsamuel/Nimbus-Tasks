'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface FinancialRobotProps {
  isAISpeaking: boolean;
  currentViseme?: string;
}

export default function FinancialRobot({ isAISpeaking, currentViseme = 'sil' }: FinancialRobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const antennaRef = useRef<THREE.Mesh>(null);
  
  // Animation state
  const animationState = useRef({
    mouthOpen: 0,
    eyeBlink: 0,
    headTilt: 0,
    armWave: 0,
    hover: 0,
    antennaGlow: 0,
  });

  // Define viseme to mouth shapes mapping
  const visemeShapes = useMemo(() => ({
    'sil': 0,      // Silence - closed
    'PP': 0.2,     // P, B - pressed lips
    'FF': 0.3,     // F, V - bottom lip under top teeth
    'TH': 0.4,     // Th - tongue between teeth
    'DD': 0.3,     // T, D - tongue behind teeth
    'kk': 0.4,     // K, G - back of tongue up
    'CH': 0.5,     // Ch, J - lips forward
    'SS': 0.2,     // S, Z - lips slightly apart
    'aa': 0.7,     // A - mouth wide open
    'E': 0.5,      // E - mouth medium open
    'I': 0.3,      // I - mouth slightly open
    'O': 0.6,      // O - rounded lips
    'U': 0.4,      // U - rounded lips, smaller
  }), []);

  // Colors for the robot
  const colors = {
    primary: '#3B82F6',      // Blue
    secondary: '#60A5FA',    // Light blue
    accent: '#F59E0B',       // Orange
    eyes: '#1F2937',         // Dark gray
    glow: '#10B981',         // Green
  };

  // Update mouth shape based on viseme
  useEffect(() => {
    animationState.current.mouthOpen = visemeShapes[currentViseme] || 0;
  }, [currentViseme, visemeShapes]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();

    // Idle floating animation
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;

    // Head animations
    if (headGroupRef.current) {
      if (isAISpeaking) {
        // Head movement while speaking
        headGroupRef.current.rotation.x = Math.sin(t * 4) * 0.05;
        headGroupRef.current.rotation.z = Math.sin(t * 3) * 0.03;
      } else {
        // Gentle head movement when idle
        headGroupRef.current.rotation.x = Math.sin(t * 0.8) * 0.02;
      }
    }

    // Eye blinking
    const blinkCycle = t % 4;
    const shouldBlink = blinkCycle > 3.7 && blinkCycle < 3.9;
    animationState.current.eyeBlink = shouldBlink ? 1 : 0;

    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeScale = 1 - animationState.current.eyeBlink * 0.8;
      leftEyeRef.current.scale.y = eyeScale;
      rightEyeRef.current.scale.y = eyeScale;
    }

    // Mouth animation
    if (mouthRef.current) {
      const targetScale = 0.3 + animationState.current.mouthOpen * 0.7;
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, targetScale, 0.3);
      
      // Add slight smile when speaking
      if (isAISpeaking) {
        mouthRef.current.scale.x = 1.1 + Math.sin(t * 8) * 0.05;
      }
    }

    // Arm animations
    if (leftArmRef.current && rightArmRef.current) {
      if (isAISpeaking) {
        // Gesturing while speaking
        leftArmRef.current.rotation.z = -0.5 + Math.sin(t * 2) * 0.2;
        rightArmRef.current.rotation.z = 0.5 + Math.sin(t * 2 + Math.PI) * 0.2;
        leftArmRef.current.rotation.x = Math.sin(t * 3) * 0.1;
        rightArmRef.current.rotation.x = Math.sin(t * 3 + Math.PI/2) * 0.1;
      } else {
        // Idle arm position
        leftArmRef.current.rotation.z = -0.3;
        rightArmRef.current.rotation.z = 0.3;
      }
    }

    // Antenna animation (shows activity)
    if (antennaRef.current) {
      antennaRef.current.rotation.y = t * 2;
      const glowIntensity = isAISpeaking ? 1 : 0.3;
      animationState.current.antennaGlow = THREE.MathUtils.lerp(
        animationState.current.antennaGlow, 
        glowIntensity, 
        0.1
      );
    }

    // Body subtle movement
    if (bodyRef.current) {
      bodyRef.current.rotation.x = Math.sin(t * 0.7) * 0.01;
      bodyRef.current.rotation.z = Math.sin(t * 0.9) * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Head */}
        <group ref={headGroupRef} position={[0, 1.5, 0]}>
          {/* Main head shape */}
          <RoundedBox args={[1.2, 1.2, 1]} radius={0.3} smoothness={4}>
            <meshStandardMaterial color={colors.primary} metalness={0.3} roughness={0.7} />
          </RoundedBox>
          
          {/* Face screen */}
          <Box args={[0.9, 0.8, 0.05]} position={[0, 0, 0.51]}>
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </Box>
          
          {/* Eyes */}
          <Sphere ref={leftEyeRef} args={[0.12]} position={[-0.25, 0.15, 0.55]}>
            <meshStandardMaterial color="#ffffff" emissive="#60A5FA" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere ref={rightEyeRef} args={[0.12]} position={[0.25, 0.15, 0.55]}>
            <meshStandardMaterial color="#ffffff" emissive="#60A5FA" emissiveIntensity={0.5} />
          </Sphere>
          
          {/* Pupils */}
          <Sphere args={[0.06]} position={[-0.25, 0.15, 0.62]}>
            <meshStandardMaterial color={colors.eyes} />
          </Sphere>
          <Sphere args={[0.06]} position={[0.25, 0.15, 0.62]}>
            <meshStandardMaterial color={colors.eyes} />
          </Sphere>
          
          {/* Mouth */}
          <Box ref={mouthRef} args={[0.5, 0.15, 0.05]} position={[0, -0.2, 0.55]}>
            <meshStandardMaterial color="#ffffff" emissive={colors.accent} emissiveIntensity={0.3} />
          </Box>
          
          {/* Antenna */}
          <group position={[0, 0.7, 0]}>
            <Cylinder args={[0.05, 0.05, 0.4]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.8} />
            </Cylinder>
            <Sphere ref={antennaRef} args={[0.1]} position={[0, 0.45, 0]}>
              <meshStandardMaterial 
                color={colors.glow} 
                emissive={colors.glow} 
                emissiveIntensity={animationState.current.antennaGlow}
              />
            </Sphere>
          </group>
        </group>
        
        {/* Body */}
        <group position={[0, 0, 0]}>
          <RoundedBox ref={bodyRef} args={[1.5, 1.8, 0.8]} radius={0.2} smoothness={4}>
            <meshStandardMaterial color={colors.primary} metalness={0.3} roughness={0.7} />
          </RoundedBox>
          
          {/* Chest display */}
          <Box args={[1, 0.8, 0.05]} position={[0, 0.3, 0.41]}>
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </Box>
          
          {/* Bank logo area */}
          <Box args={[0.6, 0.4, 0.05]} position={[0, 0.3, 0.42]}>
            <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.2} />
          </Box>
          
          {/* Status lights */}
          {[-0.3, 0, 0.3].map((x, i) => (
            <Sphere key={i} args={[0.05]} position={[x, -0.3, 0.42]}>
              <meshStandardMaterial 
                color={colors.glow} 
                emissive={colors.glow} 
                emissiveIntensity={isAISpeaking ? Math.sin(Date.now() * 0.01 + i) * 0.5 + 0.5 : 0.2}
              />
            </Sphere>
          ))}
        </group>
        
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.9, 0.3, 0]}>
          <Box args={[0.3, 1, 0.3]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={colors.secondary} metalness={0.3} roughness={0.7} />
          </Box>
          {/* Hand */}
          <Sphere args={[0.2]} position={[0, -1.1, 0]}>
            <meshStandardMaterial color={colors.primary} metalness={0.3} roughness={0.7} />
          </Sphere>
        </group>
        
        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.9, 0.3, 0]}>
          <Box args={[0.3, 1, 0.3]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={colors.secondary} metalness={0.3} roughness={0.7} />
          </Box>
          {/* Hand */}
          <Sphere args={[0.2]} position={[0, -1.1, 0]}>
            <meshStandardMaterial color={colors.primary} metalness={0.3} roughness={0.7} />
          </Sphere>
        </group>
        
        {/* Legs */}
        <Box args={[0.35, 0.8, 0.35]} position={[-0.35, -1.5, 0]}>
          <meshStandardMaterial color={colors.secondary} metalness={0.3} roughness={0.7} />
        </Box>
        <Box args={[0.35, 0.8, 0.35]} position={[0.35, -1.5, 0]}>
          <meshStandardMaterial color={colors.secondary} metalness={0.3} roughness={0.7} />
        </Box>
        
        {/* Feet */}
        <Box args={[0.4, 0.15, 0.6]} position={[-0.35, -2, 0.1]}>
          <meshStandardMaterial color={colors.primary} metalness={0.3} roughness={0.7} />
        </Box>
        <Box args={[0.4, 0.15, 0.6]} position={[0.35, -2, 0.1]}>
          <meshStandardMaterial color={colors.primary} metalness={0.3} roughness={0.7} />
        </Box>
      </Float>
      
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}