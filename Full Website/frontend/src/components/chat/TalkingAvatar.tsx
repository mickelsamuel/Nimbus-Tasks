'use client';

import { useRef, useState, useEffect, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSpeechSynthesis } from 'react-speech-kit';

// Simple Error Boundary for 3D components
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Avatar Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

interface TalkingAvatarProps {
  avatarUrl: string;
  isPlaying: boolean;
  currentText?: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

// Speech bubble component in 3D space
function SpeechBubble({ text, visible, position = [0, 2.5, 0] }: { 
  text: string; 
  visible: boolean; 
  position?: [number, number, number] 
}) {
  const bubbleRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (bubbleRef.current && visible) {
      // Gentle floating animation
      bubbleRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  if (!visible || !text) return null;

  return (
    <group ref={bubbleRef} position={position}>
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
        font="Arial"
      >
        {text}
      </Text>
      
      {/* Bubble tail */}
      <mesh position={[0, -1, -0.05]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.2, 0.4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Enhanced avatar model with lip sync simulation
function TalkingAvatarModel({ 
  url, 
  isAnimating, 
  isSpeaking 
}: { 
  url: string; 
  isAnimating: boolean; 
  isSpeaking: boolean; 
}) {
  const meshRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const [morphTargets, setMorphTargets] = useState<THREE.Mesh[]>([]);
  
  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, url);
  
  // Set up animations and morph targets
  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      
      // Find idle animation
      const idleAnimation = gltf.animations.find(
        (clip: THREE.AnimationClip) => 
          clip.name.toLowerCase().includes('idle') || 
          clip.name.toLowerCase().includes('breathing')
      ) || gltf.animations[0];
      
      if (idleAnimation && mixerRef.current) {
        const action = mixerRef.current.clipAction(idleAnimation);
        action.play();
      }
    }
    
    // Find morph targets for lip sync
    const meshes: THREE.Mesh[] = [];
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
        meshes.push(child);
      }
    });
    setMorphTargets(meshes);
    
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [gltf]);

  // Animation and lip sync frame updates
  useFrame((state, delta) => {
    if (mixerRef.current && isAnimating) {
      mixerRef.current.update(delta);
    }
    
    // Simple lip sync simulation based on speaking state
    if (morphTargets.length > 0 && isSpeaking) {
      morphTargets.forEach((mesh) => {
        if (mesh.morphTargetInfluences) {
          // Simulate mouth movement with random values
          const mouthIndex = mesh.morphTargetDictionary?.['viseme_aa'] || 0;
          if (mesh.morphTargetInfluences[mouthIndex] !== undefined) {
            mesh.morphTargetInfluences[mouthIndex] = 
              0.3 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
          }
        }
      });
    } else if (morphTargets.length > 0) {
      // Reset mouth to closed position
      morphTargets.forEach((mesh) => {
        if (mesh.morphTargetInfluences) {
          const mouthIndex = mesh.morphTargetDictionary?.['viseme_aa'] || 0;
          if (mesh.morphTargetInfluences[mouthIndex] !== undefined) {
            mesh.morphTargetInfluences[mouthIndex] = 
              THREE.MathUtils.lerp(mesh.morphTargetInfluences[mouthIndex], 0, delta * 3);
          }
        }
      });
    }
    
    // Add subtle head movement when speaking
    if (meshRef.current && isSpeaking) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    } else if (meshRef.current) {
      // Return to neutral position
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, delta * 2);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, delta * 2);
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 0]} scale={[1, 1, 1]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Fallback avatar when model fails to load
function FallbackAvatar({ isSpeaking }: { isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += delta * 0.5;
      
      // Scale animation when speaking
      if (isSpeaking) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.05;
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
      
      {/* National Bank AI Label */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="#E01A1A"
        anchorX="center"
        anchorY="middle"
        font="Arial"
      >
        National Bank AI
      </Text>
    </group>
  );
}

// Loading fallback
function LoadingAvatar() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#E01A1A" wireframe />
      </mesh>
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="#E01A1A"
        anchorX="center"
        anchorY="middle"
        font="Arial"
      >
        Loading Avatar...
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
  
  const positions = new Float32Array(100 * 3);
  for (let i = 0; i < 100; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={100}
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

export default function TalkingAvatar({ 
  avatarUrl, 
  isPlaying, 
  currentText = '',
  onSpeakingChange 
}: TalkingAvatarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const { speak, cancel } = useSpeechSynthesis();
  
  const [currentAvatarUrl] = useState(avatarUrl);

  // Handle text-to-speech
  useEffect(() => {
    if (currentText && isPlaying) {
      setShowBubble(true);
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      
      speak({
        text: currentText,
        voice: null, // Use default voice, you can customize this
        rate: 0.9,
        pitch: 1.1,
      });
      
      // Hide bubble after speaking
      const timeout = setTimeout(() => {
        setShowBubble(false);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      }, currentText.length * 80); // Estimate speaking time
      
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
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Floating particles */}
        <FloatingParticles />
        
        {/* Avatar */}
        <Suspense fallback={<LoadingAvatar />}>
          <ErrorBoundary fallback={<FallbackAvatar isSpeaking={isSpeaking} />}>
            <TalkingAvatarModel 
              url={currentAvatarUrl} 
              isAnimating={true} 
              isSpeaking={isSpeaking}
            />
          </ErrorBoundary>
        </Suspense>
        
        {/* Speech bubble */}
        <SpeechBubble 
          text={currentText}
          visible={showBubble}
          position={[0, 2.5, 0]}
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