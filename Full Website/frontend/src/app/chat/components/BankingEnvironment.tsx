'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center, Environment, ContactShadows, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function BankingEnvironment() {
  const gridRef = useRef<THREE.GridHelper>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create minimal floating particles (much fewer)
  const particles = useMemo(() => {
    const positions = new Float32Array(30 * 3); // Reduced from 200 to 30
    const colors = new Float32Array(30 * 3);
    
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15; // Smaller area
      positions[i * 3 + 1] = Math.random() * 8 + 2; // Higher up
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      // Subtle blue only
      const color = new THREE.Color();
      color.setHSL(0.6, 0.3, 0.4); // Dimmer, more subtle
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    // Animate grid
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Animate particles more subtly
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05; // Slower rotation
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005; // Much slower movement
        if (positions[i + 1] > 12) positions[i + 1] = 2;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Enhanced Environment */}
      <Environment preset="studio" />
      
      {/* Main platform */}
      <mesh position={[0, -2.5, 0]} receiveShadow>
        <cylinderGeometry args={[8, 8, 0.2, 32]} />
        <meshStandardMaterial 
          color="#1E293B"
          metalness={0.8}
          roughness={0.2}
          emissive="#1E40AF"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Animated grid */}
      <primitive 
        ref={gridRef}
        object={new THREE.GridHelper(16, 16, '#3B82F6', '#1F2937')} 
        position={[0, -2.4, 0]} 
      />

      {/* Contact shadows for realism */}
      <ContactShadows
        position={[0, -2.4, 0]}
        scale={15}
        blur={2}
        far={4}
        opacity={0.4}
      />

      {/* Floating data particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={200}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.2}
          sizeAttenuation
        />
      </points>

      {/* Banking themed holographic panels */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[-6, 1, -4]}>
          <mesh>
            <planeGeometry args={[3, 2]} />
            <meshStandardMaterial 
              color="#0F172A" 
              transparent 
              opacity={0.8}
              emissive="#1E40AF"
              emissiveIntensity={0.2}
            />
          </mesh>
          <Html
            center
            transform
            position={[0, 0, 0.01]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-blue-300 font-bold text-center p-3 bg-blue-900/20 backdrop-blur-sm rounded-lg border border-blue-500/30">
              <div className="text-lg">NATIONAL BANK</div>
              <div className="text-sm opacity-75">Est. 1859</div>
              <div className="text-xs text-green-400">✓ Secure AI</div>
            </div>
          </Html>
        </group>
      </Float>

      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[6, 1, -4]}>
          <mesh>
            <planeGeometry args={[3, 2]} />
            <meshStandardMaterial 
              color="#0F172A" 
              transparent 
              opacity={0.8}
              emissive="#F59E0B"
              emissiveIntensity={0.2}
            />
          </mesh>
          <Html
            center
            transform
            position={[0, 0, 0.01]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-orange-300 font-bold text-center p-3 bg-orange-900/20 backdrop-blur-sm rounded-lg border border-orange-500/30">
              <div className="text-lg">AI ASSISTANT</div>
              <div className="text-sm opacity-75">Max Banking Bot</div>
              <div className="text-xs text-green-400">🤖 Active</div>
            </div>
          </Html>
        </group>
      </Float>

      {/* Ambient lighting orbs */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <Sphere args={[0.3]} position={[-4, 3, 2]}>
          <meshStandardMaterial 
            color="#06D6A0"
            emissive="#06D6A0"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>

      <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.3}>
        <Sphere args={[0.2]} position={[4, 2.5, 1]}>
          <meshStandardMaterial 
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>

      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Colored accent lights */}
      <pointLight position={[-8, 5, -5]} intensity={0.8} color="#60A5FA" />
      <pointLight position={[8, 5, 5]} intensity={0.8} color="#FBBF24" />
      <spotLight
        position={[0, 8, 3]}
        angle={0.5}
        penumbra={0.5}
        intensity={1}
        castShadow
        color="#E0E7FF"
      />

      {/* Background fog for depth */}
      <fog attach="fog" args={['#0F172A', 12, 30]} />
    </>
  );
}