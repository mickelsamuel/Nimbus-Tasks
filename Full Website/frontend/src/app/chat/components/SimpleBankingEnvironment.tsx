'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function SimpleBankingEnvironment() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    // Animate grid opacity
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <>
      {/* Simple platform */}
      <mesh position={[0, -2.5, 0]} receiveShadow>
        <cylinderGeometry args={[6, 6, 0.2, 32]} />
        <meshStandardMaterial 
          color="#1E293B"
          metalness={0.8}
          roughness={0.2}
          emissive="#1E40AF"
          emissiveIntensity={0.03}
        />
      </mesh>

      {/* Simple grid */}
      <primitive 
        ref={gridRef}
        object={new THREE.GridHelper(12, 12, '#3B82F6', '#374151')} 
        position={[0, -2.4, 0]} 
      />

      {/* Banking info panels - simplified */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[-5, 1, -3]}>
          <mesh>
            <planeGeometry args={[2.5, 1.5]} />
            <meshStandardMaterial 
              color="#0F172A" 
              transparent 
              opacity={0.7}
              emissive="#1E40AF"
              emissiveIntensity={0.1}
            />
          </mesh>
          <Html
            center
            transform
            position={[0, 0, 0.01]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-blue-300 font-semibold text-center p-2 text-sm">
              <div>NATIONAL BANK</div>
              <div className="text-xs opacity-75 mt-1">Secure AI Banking</div>
            </div>
          </Html>
        </group>
      </Float>

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[5, 1, -3]}>
          <mesh>
            <planeGeometry args={[2.5, 1.5]} />
            <meshStandardMaterial 
              color="#0F172A" 
              transparent 
              opacity={0.7}
              emissive="#F59E0B"
              emissiveIntensity={0.1}
            />
          </mesh>
          <Html
            center
            transform
            position={[0, 0, 0.01]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-orange-300 font-semibold text-center p-2 text-sm">
              <div>MAX AI</div>
              <div className="text-xs opacity-75 mt-1">Ready to Help</div>
            </div>
          </Html>
        </group>
      </Float>

      {/* Simple lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[8, 8, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-6, 4, -4]} intensity={0.6} color="#60A5FA" />
      <pointLight position={[6, 4, 4]} intensity={0.6} color="#FBBF24" />

      {/* Subtle fog */}
      <fog attach="fog" args={['#0F172A', 10, 25]} />
    </>
  );
}