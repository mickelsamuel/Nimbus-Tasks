'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';

interface ProfessionalRobotProps {
  isAISpeaking: boolean;
  currentViseme?: string;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'listening' | 'processing';
  position?: [number, number, number];
  isListening?: boolean;
  isProcessing?: boolean;
}

// Enhanced 3D robot with advanced animations and lip-sync
function ProceduralRobot({ 
  isAISpeaking, 
  emotion = 'neutral', 
  position = [0, 0, 0], 
  isListening = false,
  isProcessing = false,
  currentViseme = 'sil'
}: ProfessionalRobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const chestPanelRef = useRef<THREE.Mesh>(null);
  const [gesturePhase, setGesturePhase] = useState(0);
  
  // Viseme mappings for realistic mouth shapes
  const visemeMouthShapes = useMemo(() => ({
    'sil': { scaleX: 1, scaleY: 0.3, scaleZ: 1 }, // closed
    'aa': { scaleX: 1.5, scaleY: 1.2, scaleZ: 1 }, // 'ah' sound
    'E': { scaleX: 1.2, scaleY: 0.8, scaleZ: 1 }, // 'eh' sound
    'I': { scaleX: 0.8, scaleY: 0.6, scaleZ: 1 }, // 'ih' sound
    'O': { scaleX: 1, scaleY: 1.5, scaleZ: 1.2 }, // 'oh' sound
    'U': { scaleX: 0.6, scaleY: 1.3, scaleZ: 1.1 }, // 'oo' sound
    'PP': { scaleX: 1, scaleY: 0.1, scaleZ: 1 }, // 'p' and 'b' sounds
    'FF': { scaleX: 1.1, scaleY: 0.5, scaleZ: 1 }, // 'f' and 'v' sounds
    'TH': { scaleX: 1.2, scaleY: 0.7, scaleZ: 1 }, // 'th' sound
    'DD': { scaleX: 1.1, scaleY: 0.6, scaleZ: 1 }, // 't' and 'd' sounds
    'kk': { scaleX: 1.3, scaleY: 0.9, scaleZ: 1 }, // 'k' and 'g' sounds
    'CH': { scaleX: 1, scaleY: 0.9, scaleZ: 1.1 }, // 'ch' sound
    'SS': { scaleX: 0.9, scaleY: 0.4, scaleZ: 1 }, // 's' and 'z' sounds
  }), []);
  
  // Spring animation for smooth state transitions
  const { chestGlow } = useSpring({
    chestGlow: isProcessing ? 1.0 : isAISpeaking ? 0.8 : 0.3,
    config: { tension: 200, friction: 20 }
  });

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Enhanced floating animation with personality
    const floatIntensity = isListening ? 0.15 : isProcessing ? 0.05 : 0.1;
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * floatIntensity;
    
    // Dynamic head movements
    if (headRef.current) {
      if (isListening) {
        // Attentive head tilt when listening
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.15;
        headRef.current.rotation.x = 0.1;
      } else if (isProcessing) {
        // Thinking head movement
        headRef.current.rotation.y = Math.sin(time * 0.4) * 0.2;
        headRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      } else {
        // Natural idle head movement
        headRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
        headRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
      }
    }
    
    // Enhanced eye animations
    if (eyeLeftRef.current && eyeRightRef.current) {
      // Natural blinking pattern
      const blinkPattern = Math.sin(time * 2.5) > 0.97 ? 0.1 : 1;
      const emotionBlink = emotion === 'happy' ? Math.sin(time * 4) * 0.1 + 0.9 : 1;
      const finalBlink = Math.min(blinkPattern, emotionBlink);
      
      eyeLeftRef.current.scale.y = finalBlink;
      eyeRightRef.current.scale.y = finalBlink;
      
      // Eye tracking simulation
      if (!isAISpeaking && !isListening) {
        const lookX = Math.sin(time * 0.2) * 0.02;
        const lookY = Math.cos(time * 0.15) * 0.01;
        eyeLeftRef.current.position.x = -0.2 + lookX;
        eyeRightRef.current.position.x = 0.2 + lookX;
        eyeLeftRef.current.position.y = 0.6 + lookY;
        eyeRightRef.current.position.y = 0.6 + lookY;
      }
    }
    
    // Advanced mouth animation with viseme support
    if (mouthRef.current) {
      const targetShape = visemeMouthShapes[currentViseme] || visemeMouthShapes['sil'];
      
      if (isAISpeaking) {
        // Smooth transition to viseme shape
        mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, targetShape.scaleX, 0.3);
        mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, targetShape.scaleY, 0.3);
        mouthRef.current.scale.z = THREE.MathUtils.lerp(mouthRef.current.scale.z, targetShape.scaleZ, 0.3);
      } else {
        // Return to neutral closed position
        mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, 1, 0.1);
        mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 0.3, 0.1);
        mouthRef.current.scale.z = THREE.MathUtils.lerp(mouthRef.current.scale.z, 1, 0.1);
      }
    }
    
    // Enhanced arm gestures
    if (leftArmRef.current && rightArmRef.current) {
      if (isAISpeaking) {
        // Gentle speaking gestures
        leftArmRef.current.rotation.z = Math.PI / 6 + Math.sin(time * 1.5) * 0.1;
        rightArmRef.current.rotation.z = -Math.PI / 6 - Math.sin(time * 1.5 + Math.PI) * 0.1;
      } else if (isListening) {
        // Open, welcoming posture
        leftArmRef.current.rotation.z = Math.PI / 8;
        rightArmRef.current.rotation.z = -Math.PI / 8;
      } else if (isProcessing) {
        // Thinking gesture
        leftArmRef.current.rotation.z = Math.PI / 4;
        rightArmRef.current.rotation.z = -Math.PI / 6 + Math.sin(time * 2) * 0.05;
      } else {
        // Relaxed idle position
        leftArmRef.current.rotation.z = Math.PI / 6 + Math.sin(time * 0.5) * 0.02;
        rightArmRef.current.rotation.z = -Math.PI / 6 - Math.sin(time * 0.5) * 0.02;
      }
    }
    
    // Chest panel animation
    if (chestPanelRef.current) {
      const pulseIntensity = isProcessing ? 0.1 : isAISpeaking ? 0.05 : 0.02;
      chestPanelRef.current.scale.setScalar(1 + Math.sin(time * 3) * pulseIntensity);
    }
    
    // Update animation phases
    setGesturePhase(time * 1.2);
  });

  // Enhanced color scheme based on emotion and state
  const getEmotionColors = () => {
    if (isListening) {
      return { primary: '#059669', secondary: '#06D6A0', accent: '#10B981', glow: '#34D399' };
    }
    if (isProcessing) {
      return { primary: '#7C3AED', secondary: '#A855F7', accent: '#C084FC', glow: '#DDA0DD' };
    }
    
    switch (emotion) {
      case 'happy':
        return { primary: '#4F46E5', secondary: '#06B6D4', accent: '#10B981', glow: '#60A5FA' };
      case 'thinking':
      case 'processing':
        return { primary: '#7C3AED', secondary: '#EC4899', accent: '#F59E0B', glow: '#F472B6' };
      case 'listening':
        return { primary: '#059669', secondary: '#06D6A0', accent: '#10B981', glow: '#34D399' };
      default:
        return { primary: '#1E40AF', secondary: '#0EA5E9', accent: '#3B82F6', glow: '#60A5FA' };
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

      {/* Arms with gesture animation */}
      <mesh ref={leftArmRef} position={[-1, -0.3, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.15, 1]} />
        <meshStandardMaterial 
          color={colors.primary}
          metalness={0.6}
          roughness={0.4}
          emissive={colors.primary}
          emissiveIntensity={isAISpeaking ? 0.1 : 0.05}
        />
      </mesh>
      <mesh ref={rightArmRef} position={[1, -0.3, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.15, 1]} />
        <meshStandardMaterial 
          color={colors.primary}
          metalness={0.6}
          roughness={0.4}
          emissive={colors.primary}
          emissiveIntensity={isAISpeaking ? 0.1 : 0.05}
        />
      </mesh>

      {/* Enhanced chest panel with state indicators */}
      <animated.mesh ref={chestPanelRef} position={[0, -0.5, 0.7]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.05]} />
        <animated.meshStandardMaterial 
          color="#1F2937"
          metalness={0.9}
          roughness={0.1}
          emissive={colors.primary}
          emissiveIntensity={chestGlow}
        />
      </animated.mesh>
      
      {/* Additional status lights on chest */}
      <mesh position={[-0.1, -0.4, 0.76]}>
        <circleGeometry args={[0.02]} />
        <meshStandardMaterial 
          color={isListening ? "#10B981" : "#6B7280"}
          emissive={isListening ? "#10B981" : "#6B7280"}
          emissiveIntensity={isListening ? 1 : 0.2}
        />
      </mesh>
      <mesh position={[0.1, -0.4, 0.76]}>
        <circleGeometry args={[0.02]} />
        <meshStandardMaterial 
          color={isProcessing ? "#F59E0B" : "#6B7280"}
          emissive={isProcessing ? "#F59E0B" : "#6B7280"}
          emissiveIntensity={isProcessing ? 1 : 0.2}
        />
      </mesh>

      {/* Main status indicator on chest */}
      <animated.mesh position={[0, -0.5, 0.76]}>
        <circleGeometry args={[0.05]} />
        <animated.meshStandardMaterial 
          color={isAISpeaking ? "#10B981" : isListening ? "#06D6A0" : isProcessing ? "#F59E0B" : "#3B82F6"}
          emissive={isAISpeaking ? "#10B981" : isListening ? "#06D6A0" : isProcessing ? "#F59E0B" : "#3B82F6"}
          emissiveIntensity={chestGlow}
        />
      </animated.mesh>

      {/* Dynamic state rings */}
      {(isAISpeaking || isListening || isProcessing) && (
        <Float speed={isAISpeaking ? 3 : 2} rotationIntensity={0.2} floatIntensity={0.15}>
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.9, 32]} />
            <meshStandardMaterial 
              color={colors.glow}
              emissive={colors.glow}
              emissiveIntensity={isAISpeaking ? 1.0 : isListening ? 0.8 : 0.6}
              transparent
              opacity={isAISpeaking ? 0.8 : 0.6}
            />
          </mesh>
        </Float>
      )}
      
      {/* Secondary ring for enhanced visual feedback */}
      {isAISpeaking && (
        <Float speed={4} rotationIntensity={-0.1} floatIntensity={0.1}>
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.1, 32]} />
            <meshStandardMaterial 
              color={colors.accent}
              emissive={colors.accent}
              emissiveIntensity={0.4}
              transparent
              opacity={0.3}
            />
          </mesh>
        </Float>
      )}
      
      {/* Particle effects when processing */}
      {isProcessing && (
        <group>
          {Array.from({ length: 8 }, (_, i) => (
            <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.1} floatIntensity={0.2}>
              <mesh position={[
                Math.cos((i / 8) * Math.PI * 2) * 1.2,
                0.5 + Math.sin(gesturePhase + i) * 0.2,
                Math.sin((i / 8) * Math.PI * 2) * 1.2
              ]}>
                <sphereGeometry args={[0.02]} />
                <meshStandardMaterial 
                  color={colors.accent}
                  emissive={colors.accent}
                  emissiveIntensity={0.8}
                />
              </mesh>
            </Float>
          ))}
        </group>
      )}

      {/* Enhanced ambient lighting */}
      <pointLight
        position={[0, 0.5, 0]}
        color={colors.glow}
        intensity={isAISpeaking ? 1.2 : isListening ? 0.8 : isProcessing ? 0.6 : 0.3}
        distance={5}
        decay={2}
      />
      
      {/* Additional mood lighting */}
      {isAISpeaking && (
        <spotLight
          position={[0, 3, 2]}
          angle={0.3}
          penumbra={0.5}
          color={colors.glow}
          intensity={0.5}
          castShadow
          target={headRef.current}
        />
      )}
    </group>
  );
}

export default function ProfessionalRobot(props: ProfessionalRobotProps) {
  // Determine emotion based on state
  const currentEmotion = props.isListening 
    ? 'listening' 
    : props.isProcessing 
      ? 'processing' 
      : props.emotion || 'neutral';
  
  return (
    <animated.group>
      <ProceduralRobot 
        {...props} 
        emotion={currentEmotion}
      />
    </animated.group>
  );
}