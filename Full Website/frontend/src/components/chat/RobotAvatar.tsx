'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RobotAvatarProps {
  isSpeaking: boolean;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'explaining';
  position?: [number, number, number];
  scale?: number;
  currentViseme?: { time: number; type: string; value: number };
  onReady?: () => void;
}


// Fallback Robot Component (when GLB fails)
export function FallbackRobot({ isSpeaking, emotion = 'neutral', position = [0, 0, 0], scale = 1 }: RobotAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Idle animation - subtle floating
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    
    // Head movement
    if (headRef.current) {
      if (emotion === 'thinking') {
        headRef.current.rotation.x = Math.sin(time) * 0.1;
        headRef.current.rotation.z = Math.sin(time * 0.7) * 0.05;
      } else if (emotion === 'explaining') {
        headRef.current.rotation.x = Math.sin(time * 2) * 0.05;
      }
    }
    
    // Antenna animation
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(time * 3) * 0.2;
      antennaRef.current.scale.y = 1 + Math.sin(time * 5) * 0.1;
    }
    
    // Eye blinking
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blink = Math.sin(time * 0.5) > 0.95;
      eyeLeftRef.current.scale.y = blink ? 0.1 : 1;
      eyeRightRef.current.scale.y = blink ? 0.1 : 1;
    }
    
    // Mouth animation for speaking
    if (mouthRef.current && isSpeaking) {
      const mouthScale = 0.3 + Math.abs(Math.sin(time * 10)) * 0.7;
      mouthRef.current.scale.y = mouthScale;
      mouthRef.current.scale.x = 1.2 - mouthScale * 0.2;
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = emotion === 'happy' ? 0.6 : 0.3;
      mouthRef.current.scale.x = emotion === 'happy' ? 1.2 : 1;
    }
  });
  
  const robotColor = '#E01A1A'; // National Bank red
  const accentColor = '#1e293b';
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 2, 8]} />
        <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Chest panel */}
      <mesh position={[0, -0.5, 0.81]}>
        <boxGeometry args={[1, 1.2, 0.1]} />
        <meshStandardMaterial color={robotColor} metalness={0.9} roughness={0.1} emissive={robotColor} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Face plate */}
        <mesh position={[0, 1, 0.5]}>
          <circleGeometry args={[0.6, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </mesh>
        
        {/* Eyes */}
        <mesh ref={eyeLeftRef} position={[-0.2, 1.1, 0.65]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.2, 1.1, 0.65]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
        </mesh>
        
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, 0.85, 0.65]}>
          <boxGeometry args={[0.4, 0.1, 0.05]} />
          <meshStandardMaterial color={robotColor} emissive={robotColor} emissiveIntensity={0.5} />
        </mesh>
        
        {/* Antenna */}
        <group ref={antennaRef} position={[0, 1.7, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
            <meshStandardMaterial color={accentColor} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={robotColor} emissive={robotColor} emissiveIntensity={1} />
          </mesh>
        </group>
      </group>
      
      {/* Arms */}
      <group position={[-1, -0.3, 0]} rotation={[0, 0, -0.3]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
          <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={robotColor} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      <group position={[1, -0.3, 0]} rotation={[0, 0, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
          <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={robotColor} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Legs */}
      <mesh position={[-0.3, -1.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
        <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.3, -1.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
        <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Glow effect */}
      <pointLight position={[0, 1.7, 0.5]} color={robotColor} intensity={0.5} distance={3} />
    </group>
  );
}

// Main Robot Avatar Component
export default function RobotAvatar(props: RobotAvatarProps) {
  // For now, use the fallback robot
  // In production, you can try loading a custom GLB model
  return <FallbackRobot {...props} />;
  
  // This would be for loading a custom GLB model
  // const { scene, animations } = useGLTF('/path/to/robot.glb');
  // return <primitive object={scene} {...props} />;
}

// Preload any GLB models if you have them
// useGLTF.preload('/path/to/robot.glb');