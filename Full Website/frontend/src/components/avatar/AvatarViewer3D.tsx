'use client'

import { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { Play, Pause, Camera, RotateCcw } from 'lucide-react'

interface AvatarModelProps {
  url: string
  isAnimating: boolean
}

// Simple 3D Avatar Model Component
function AvatarModel({ url, isAnimating }: AvatarModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  
  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, url)
  
  // Set up animations when model loads
  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene)
      
      // Play the first animation or look for idle animation
      const idleAnimation = gltf.animations.find(
        (clip: THREE.AnimationClip) => clip.name.toLowerCase().includes('idle') || 
                  clip.name.toLowerCase().includes('breathing')
      ) || gltf.animations[0]
      
      if (idleAnimation && mixerRef.current) {
        const action = mixerRef.current.clipAction(idleAnimation)
        action.play()
      }
    }
    
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
      }
    }
  }, [gltf])

  // Update animations on each frame
  useFrame((_, delta) => {
    if (mixerRef.current && isAnimating) {
      mixerRef.current.update(delta)
    }
    
    // Add subtle floating animation
    if (meshRef.current && isAnimating) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group ref={meshRef} position={[0, -1, 0]} scale={[1, 1, 1]}>
      <primitive object={gltf.scene} />
    </group>
  )
}

// Fallback loading component
function LoadingAvatar() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial color="#8B5CF6" wireframe />
    </mesh>
  )
}

interface AvatarViewer3DProps {
  avatarUrl: string
  isAnimating?: boolean
  className?: string
  currentView?: string
  onViewChange?: (view: string) => void
  onAnimationToggle?: () => void
  configuration?: unknown
}

export default function AvatarViewer3D({ 
  avatarUrl, 
  isAnimating = false,
  className = ''
}: AvatarViewer3DProps) {
  const [animating, setAnimating] = useState(isAnimating)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = 'avatar-screenshot.png'
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  const resetCamera = () => {
    // This will be handled by OrbitControls ref if needed
    window.location.reload() // Simple reset for now
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        camera={{ 
          position: [0, 1.6, 4],
          fov: 50
        }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Avatar Model */}
        <Suspense fallback={<LoadingAvatar />}>
          <AvatarModel url={avatarUrl} isAnimating={animating} />
        </Suspense>
        
        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          autoRotate={animating}
          autoRotateSpeed={2}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Animation Toggle */}
        <button
          onClick={() => setAnimating(!animating)}
          className="flex items-center gap-2 px-3 py-2 bg-black/20 hover:bg-black/30 text-white rounded-lg backdrop-blur-sm transition-all"
          title={animating ? 'Pause Animation' : 'Play Animation'}
        >
          {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Screenshot */}
        <button
          onClick={handleScreenshot}
          className="flex items-center gap-2 px-3 py-2 bg-black/20 hover:bg-black/30 text-white rounded-lg backdrop-blur-sm transition-all"
          title="Take Screenshot"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Reset Camera */}
        <button
          onClick={resetCamera}
          className="flex items-center gap-2 px-3 py-2 bg-black/20 hover:bg-black/30 text-white rounded-lg backdrop-blur-sm transition-all"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-xs">
          <div>🎮 Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>✨ Ready Player Me Avatar</div>
        </div>
      </div>
    </div>
  )
}