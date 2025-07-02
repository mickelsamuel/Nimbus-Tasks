'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls, Environment, Text, RoundedBox, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useAuth } from '@/contexts/AuthContext';
import { getBest3DAvatarUrl, AvatarUser } from '@/utils/avatarUtils';

interface Enhanced3DChatBoxProps {
  messages: Array<{
    id: number;
    sender: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>;
  isTyping: boolean;
  currentSpeech?: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

// 3D Chat Environment Container
function ChatEnvironment({ children }: { children: React.ReactNode }) {
  const boxRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (boxRef.current) {
      // Subtle floating animation
      boxRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={boxRef}>
      {/* Main container box */}
      <RoundedBox args={[16, 10, 12]} radius={0.5} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </RoundedBox>
      
      {/* Floor */}
      <Plane args={[15, 11]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.8, 0]}>
        <meshStandardMaterial 
          color="#0f172a" 
          transparent 
          opacity={0.3}
        />
      </Plane>
      
      {/* Back wall with gradient */}
      <Plane args={[15, 9]} position={[0, 0, -5.8]}>
        <meshStandardMaterial 
          color="#1e40af" 
          transparent 
          opacity={0.2}
        />
      </Plane>
      
      {children}
    </group>
  );
}

// Enhanced User Avatar Model
function UserAvatarModel({ 
  avatarUrl, 
  isSpeaking, 
  position = [0, -2, 0] 
}: { 
  avatarUrl: string; 
  isSpeaking: boolean; 
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const [morphTargets, setMorphTargets] = useState<THREE.Mesh[]>([]);

  // Load avatar - useLoader must be called unconditionally
  const gltf = useLoader(GLTFLoader, avatarUrl);

  // Set up animations and morph targets
  useEffect(() => {
    if (gltf?.animations && gltf.animations.length > 0) {
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
    gltf?.scene.traverse((child: THREE.Object3D) => {
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

  // Animation frame updates
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    // Enhanced lip sync with multiple visemes
    if (morphTargets.length > 0 && isSpeaking) {
      morphTargets.forEach((mesh) => {
        if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
          // More realistic lip sync with multiple mouth shapes
          const time = state.clock.elapsedTime;
          const speechIntensity = 0.3 + Math.sin(time * 12) * 0.2;
          
          // Try different viseme names
          const visemeNames = ['viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U'];
          visemeNames.forEach((viseme, index) => {
            if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
              const morphIndex = mesh.morphTargetDictionary[viseme];
              if (morphIndex !== undefined) {
                mesh.morphTargetInfluences[morphIndex] = 
                  speechIntensity * (Math.sin(time * 8 + index) * 0.5 + 0.5);
              }
            }
          });
        }
      });
    } else if (morphTargets.length > 0) {
      // Reset mouth to closed position
      morphTargets.forEach((mesh) => {
        if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
          Object.values(mesh.morphTargetDictionary).forEach((morphIndex) => {
            if (typeof morphIndex === 'number' && mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[morphIndex] = 
                THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphIndex], 0, delta * 3);
            }
          });
        }
      });
    }
    
    // Head movement when speaking
    if (meshRef.current && isSpeaking) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    } else if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, delta * 2);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, delta * 2);
    }
  });

  if (!gltf) return <FallbackUserAvatar isSpeaking={isSpeaking} position={position} />;

  return (
    <group ref={meshRef} position={position} scale={[1.2, 1.2, 1.2]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Fallback avatar when user avatar fails to load
function FallbackUserAvatar({ 
  isSpeaking, 
  position = [0, -2, 0] 
}: { 
  isSpeaking: boolean; 
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      
      if (isSpeaking) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.05;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 3);
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Professional avatar representation */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#E01A1A" />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.5, 16]} />
        <meshStandardMaterial color="#1e293b" />
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
      
      {/* Dynamic mouth */}
      <mesh position={[0, 0.8, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, isSpeaking ? 0.25 : 0.15, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// Enhanced 3D Speech Bubble
function Enhanced3DSpeechBubble({ 
  text, 
  visible, 
  position = [0, 2, 0] 
}: { 
  text: string; 
  visible: boolean; 
  position?: [number, number, number];
}) {
  const bubbleRef = useRef<THREE.Group>(null);
  const [displayText, setDisplayText] = useState('');
  
  // Typewriter effect
  useEffect(() => {
    if (visible && text) {
      setDisplayText('');
      let index = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(interval);
        }
      }, 30);
      
      return () => clearInterval(interval);
    } else {
      setDisplayText('');
    }
  }, [text, visible]);
  
  useFrame((state) => {
    if (bubbleRef.current && visible) {
      // Gentle floating
      bubbleRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Subtle rotation for depth
      bubbleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  if (!visible || !text) return null;

  return (
    <group ref={bubbleRef} position={position}>
      {/* Main bubble with rounded corners */}
      <RoundedBox args={[7, 2.5, 0.3]} radius={0.2} smoothness={4}>
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.95}
        />
      </RoundedBox>
      
      {/* Bubble tail */}
      <mesh position={[0, -1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.3, 0.6, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Text with typewriter effect */}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.25}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        textAlign="center"
        lineHeight={1.2}
      >
        {displayText}
      </Text>
      
      {/* Subtle glow effect */}
      <pointLight 
        position={[0, 0, 0.5]} 
        intensity={0.3} 
        distance={3} 
        color="#ffffff"
      />
    </group>
  );
}

// Enhanced 3D Message Display Panel with floating messages
function MessageDisplayPanel({ 
  messages, 
  isTyping 
}: { 
  messages: Array<{
    id: number;
    sender: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>; 
  isTyping: boolean;
}) {
  const panelRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (panelRef.current) {
      // Gentle floating motion
      panelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  // Show last few messages in 3D space
  const recentMessages = messages.slice(-4);
  
  return (
    <group ref={panelRef} position={[6, 1, -3]}>
      {/* Holographic message panel */}
      <RoundedBox args={[7, 10, 0.3]} radius={0.4} smoothness={4}>
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.4}
          wireframe={false}
        />
      </RoundedBox>
      
      {/* Panel glow effect */}
      <pointLight 
        position={[0, 0, 0.5]} 
        intensity={0.5} 
        distance={8} 
        color="#3b82f6"
      />
      
      {/* Title */}
      <Text
        position={[0, 4.5, 0.2]}
        fontSize={0.3}
        color="#E01A1A"
        anchorX="center"
        anchorY="middle"
      >
        Conversation History
      </Text>
      
      {/* Messages with improved layout */}
      {recentMessages.map((message, index) => (
        <group key={message.id} position={[0, 3 - index * 1.8, 0.2]}>
          {/* User/AI indicator */}
          <mesh 
            position={message.sender === 'user' ? [2.8, 0, 0] : [-2.8, 0, 0]}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color={message.sender === 'user' ? '#3b82f6' : '#E01A1A'} 
            />
          </mesh>
          
          {/* Message bubble with better styling */}
          <RoundedBox 
            args={[5.5, 1.2, 0.15]} 
            radius={0.15} 
            smoothness={4}
            position={message.sender === 'user' ? [0.2, 0, 0] : [-0.2, 0, 0]}
          >
            <meshStandardMaterial 
              color={message.sender === 'user' ? '#1e40af' : '#dc2626'} 
              transparent 
              opacity={0.8}
            />
          </RoundedBox>
          
          {/* Message text with better formatting */}
          <Text
            position={message.sender === 'user' ? [0.2, 0, 0.1] : [-0.2, 0, 0.1]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={5}
            textAlign="center"
            lineHeight={1.1}
          >
            {message.content.slice(0, 120)}{message.content.length > 120 ? '...' : ''}
          </Text>
          
          {/* Timestamp */}
          <Text
            position={message.sender === 'user' ? [2.5, -0.4, 0.1] : [-2.5, -0.4, 0.1]}
            fontSize={0.08}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </group>
      ))}
      
      {/* Enhanced typing indicator with animation */}
      {isTyping && (
        <group position={[-0.2, -3.5, 0.2]}>
          <RoundedBox args={[3, 1, 0.12]} radius={0.2} smoothness={4}>
            <meshStandardMaterial color="#dc2626" transparent opacity={0.8} />
          </RoundedBox>
          
          {/* Animated dots */}
          <AnimatedTypingDots position={[0, 0, 0.1]} />
          
          <Text
            position={[0, -0.3, 0.1]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Alexandra is thinking...
          </Text>
        </group>
      )}
    </group>
  );
}

// Animated typing dots
function AnimatedTypingDots({ position }: { position: [number, number, number] }) {
  const dot1Ref = useRef<THREE.Mesh>(null);
  const dot2Ref = useRef<THREE.Mesh>(null);
  const dot3Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (dot1Ref.current) {
      dot1Ref.current.position.y = position[1] + Math.sin(time * 3) * 0.1;
    }
    if (dot2Ref.current) {
      dot2Ref.current.position.y = position[1] + Math.sin(time * 3 + 0.5) * 0.1;
    }
    if (dot3Ref.current) {
      dot3Ref.current.position.y = position[1] + Math.sin(time * 3 + 1) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={dot1Ref} position={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh ref={dot2Ref} position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh ref={dot3Ref} position={[0.3, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Atmospheric particles
function AtmosphericParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  const positions = new Float32Array(100 * 3);
  for (let i = 0; i < 100; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
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
        size={0.02} 
        sizeAttenuation={true} 
        color="#E01A1A" 
        transparent 
        opacity={0.4} 
      />
    </points>
  );
}

export default function Enhanced3DChatBox({ 
  messages, 
  isTyping, 
  currentSpeech = '',
  onSpeakingChange 
}: Enhanced3DChatBoxProps) {
  const { user } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const { speak, cancel } = useSpeechSynthesis();

  // Get user's 3D avatar URL
  const userAvatarUrl = getBest3DAvatarUrl(user, user as AvatarUser) || 
                       user?.avatar || 
                       "https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb";

  // Handle text-to-speech
  useEffect(() => {
    if (currentSpeech && currentSpeech.length > 0) {
      setShowBubble(true);
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      
      speak({
        text: currentSpeech,
        rate: 0.9,
        pitch: 1.0,
      });
      
      const timeout = setTimeout(() => {
        setShowBubble(false);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      }, currentSpeech.length * 60);
      
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
  }, [currentSpeech, speak, cancel, onSpeakingChange]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ 
          position: [0, 2, 8],
          fov: 60
        }}
        gl={{ 
          antialias: true,
          alpha: true
        }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          color="#ffffff"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 5, 5]} intensity={0.5} color="#3b82f6" />
        <spotLight
          position={[0, 8, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          castShadow
          color="#E01A1A"
        />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Main chat environment */}
        <ChatEnvironment>
          {/* Atmospheric particles */}
          <AtmosphericParticles />
          
          {/* User's avatar */}
          <Suspense fallback={<FallbackUserAvatar isSpeaking={isSpeaking} />}>
            <UserAvatarModel 
              avatarUrl={userAvatarUrl}
              isSpeaking={isSpeaking}
              position={[0, -2, 0]}
            />
          </Suspense>
          
          {/* Speech bubble */}
          <Enhanced3DSpeechBubble 
            text={currentSpeech}
            visible={showBubble}
            position={[0, 2, 0]}
          />
          
          {/* Message display panel */}
          <MessageDisplayPanel 
            messages={messages}
            isTyping={isTyping}
          />
          
          {/* Bank branding elements */}
          <Text
            position={[0, 4.5, -5.5]}
            fontSize={0.4}
            color="#E01A1A"
            anchorX="center"
            anchorY="middle"
          >
            National Bank AI Assistant
          </Text>
        </ChatEnvironment>
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={6}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          autoRotate={false}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* Status overlay */}
      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isSpeaking ? 'bg-green-500 animate-pulse' : 
            showBubble ? 'bg-blue-500' : 'bg-gray-400'
          }`} />
          <span className="text-xs text-white">
            {isSpeaking ? 'Speaking...' : showBubble ? 'Ready' : 'Idle'}
          </span>
        </div>
        <div className="text-xs text-white/70 mt-1">
          {user?.firstName || 'User'}&apos;s Avatar
        </div>
      </div>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg p-2">
        <div className="text-xs text-white space-y-1">
          <div>🎮 Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>✨ 3D Banking AI</div>
        </div>
      </div>
    </div>
  );
}