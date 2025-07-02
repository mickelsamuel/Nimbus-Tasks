'use client';

import { Suspense, useRef } from 'react';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple 3D robot avatar - much lighter than the original
function SimpleRobot({ isAISpeaking }: { isAISpeaking: boolean }) {
  const robotRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (robotRef.current) {
      // Gentle floating animation
      robotRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Speaking animation
      if (isAISpeaking) {
        robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 10) * 0.05;
      }
    }
  });

  return (
    <group ref={robotRef}>
      {/* Head */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.2, 1.1, 0.4]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.2, 1.1, 0.4]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.2, 0.6]} />
        <meshStandardMaterial color="#5BA0F2" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.7, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0.7, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
    </group>
  );
}

// Speech bubble component
function SpeechBubble({ text, isVisible }: { text: string; isVisible: boolean }) {
  if (!isVisible || !text) return null;
  
  return (
    <group position={[2, 2, 0]}>
      {/* Bubble background */}
      <mesh>
        <planeGeometry args={[3, 1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      {/* Simple text representation with particles */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.8, 0.8]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function ChatScene({ 
  currentMessage, 
  isAISpeaking 
}: { 
  currentMessage: string;
  isAISpeaking: boolean;
}) {
  return (
    <>
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={!isAISpeaking}
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />
      
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-3, 2, -3]} intensity={0.3} color="#60a5fa" />
      
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <Suspense fallback={null}>
          <SimpleRobot isAISpeaking={isAISpeaking} />
        </Suspense>
      </Float>
      
      <SpeechBubble 
        text={currentMessage}
        isVisible={!!currentMessage}
      />
      
      {/* Simple ground */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.3} />
      </mesh>
    </>
  );
}