'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { OrbitControls, Environment, Stars, Cloud, Text, Center, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import FinancialRobot from './FinancialRobot';

interface EnhancedChatSceneProps {
  currentMessage: string;
  isAISpeaking: boolean;
  currentViseme?: string;
  onReady?: () => void;
}

// Floating particles for ambiance
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    
    const color = new THREE.Color();
    color.setHSL(0.6, 0.7, 0.5 + Math.random() * 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors sizeAttenuation={false} />
    </points>
  );
}

// Dynamic text display
function MessageDisplay({ text, isVisible }: { text: string; isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (isVisible && text) {
      // Typewriter effect
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      
      return () => clearInterval(interval);
    } else {
      setDisplayText('');
    }
  }, [text, isVisible]);
  
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  if (!isVisible || !text) return null;
  
  return (
    <group ref={groupRef} position={[0, 3, -2]}>
      {/* Message background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[8, 2]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          transparent 
          opacity={0.8}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Message text */}
      <Center>
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={7}
        >
          {displayText}
        </Text>
      </Center>
      
      {/* Decorative corners */}
      <mesh position={[-3.8, 0.8, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[3.8, 0.8, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-3.8, -0.8, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[3.8, -0.8, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Bank environment elements
function BankEnvironment() {
  return (
    <>
      {/* Floor with grid pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>
      
      {/* Grid lines on floor */}
      <gridHelper args={[20, 20, '#3B82F6', '#1F2937']} position={[0, -2.49, 0]} />
      
      {/* Background panels */}
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color="#0F172A"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Decorative pillars */}
      <mesh position={[-6, 0, -5]}>
        <cylinderGeometry args={[0.5, 0.5, 5]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[6, 0, -5]}>
        <cylinderGeometry args={[0.5, 0.5, 5]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.7} roughness={0.3} />
      </mesh>
    </>
  );
}

export default function EnhancedChatScene({ 
  currentMessage, 
  isAISpeaking,
  currentViseme,
  onReady
}: EnhancedChatSceneProps) {
  useEffect(() => {
    // Notify parent when scene is ready
    if (onReady) {
      const timer = setTimeout(onReady, 1000);
      return () => clearTimeout(timer);
    }
  }, [onReady]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={!isAISpeaking}
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
        target={[0, 0, 0]}
      />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#60A5FA" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#F59E0B" />
      <spotLight
        position={[0, 8, 3]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.8}
        castShadow
        target-position={[0, 0, 0]}
      />
      
      {/* Environment */}
      <Environment preset="city" />
      <fog attach="fog" args={['#0F172A', 10, 30]} />
      
      {/* Scene elements */}
      <Suspense fallback={null}>
        <BankEnvironment />
        <FloatingParticles />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        
        {/* Main robot */}
        <FinancialRobot 
          isAISpeaking={isAISpeaking}
          currentViseme={currentViseme}
          emotion={isAISpeaking ? 'happy' : 'neutral'}
        />
        
        {/* Message display */}
        <MessageDisplay 
          text={currentMessage}
          isVisible={!!currentMessage && isAISpeaking}
        />
        
        {/* Floating bank logos/elements */}
        <Cloud
          opacity={0.1}
          speed={0.4}
          segments={20}
          position={[0, 5, -5]}
          color="#3B82F6"
        />
      </Suspense>
    </>
  );
}