'use client'

import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Html, useProgress } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useAuth } from '@/contexts/AuthContext'
import { User, RotateCcw, MousePointer, Eye } from 'lucide-react'
import { prefersReducedMotion } from '@/utils/performance'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'

interface Avatar3DProps {
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  autoRotate?: boolean
  enableControls?: boolean
  className?: string
  showInfo?: boolean
}

// Fallback avatar geometry - a professional figure
function FallbackAvatar() {
  const meshRef = useRef<THREE.Mesh>(null)
  const isReducedMotion = useMemo(() => prefersReducedMotion(), [])
  
  useFrame(({ clock }) => {
    if (meshRef.current && !isReducedMotion) {
      meshRef.current.rotation.y += 0.005 // Reduced rotation speed
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.05 // Reduced amplitude
    }
  })

  return (
    <group>
      {/* Head */}
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      
      {/* Professional badge/tie */}
      <mesh position={[0, 0.1, 0.31]}>
        <planeGeometry args={[0.15, 0.3]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      
      {/* Floating particles around avatar */}
      <ParticleSystem />
    </group>
  )
}

// Optimized particle system
function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null)
  const isReducedMotion = useMemo(() => prefersReducedMotion(), [])
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, [])
  
  const particleGeometry = useMemo(() => {
    const particleCount = isMobile ? 15 : 30 // Reduced from 50
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [isMobile])
  
  useFrame((state, delta) => {
    if (particlesRef.current && !isReducedMotion) {
      // Use delta for frame-rate independent animation
      particlesRef.current.rotation.y += delta * 0.2
      particlesRef.current.rotation.x += delta * 0.1
    }
  })
  
  // Don't render particles on reduced motion or very small screens
  if (isReducedMotion || (typeof window !== 'undefined' && window.innerWidth < 480)) {
    return null
  }

  return (
    <points ref={particlesRef}>
      <primitive object={particleGeometry} />
      <pointsMaterial size={0.02} color="#3b82f6" opacity={0.6} transparent />
    </points>
  )
}

// GLB Avatar component
function GLBAvatarModel({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url)
  const modelRef = useRef<THREE.Group>(null)
  
  useFrame((state, delta) => {
    if (modelRef.current && !prefersReducedMotion()) {
      modelRef.current.rotation.y += delta * 0.5 // Frame-rate independent
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.01 // Reduced amplitude
    }
  })

  useEffect(() => {
    if (gltf.scene) {
      // Scale and position the model appropriately
      gltf.scene.scale.setScalar(1.5)
      gltf.scene.position.y = -0.8
      
      // Optimize materials and disable shadows on mobile
      const isMobile = window.innerWidth < 768
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = !isMobile
          child.receiveShadow = !isMobile
          if (child.material) {
            child.material.needsUpdate = true
            // Optimize material properties for performance
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.precision = 'lowp'
              })
            } else {
              child.material.precision = 'lowp'
            }
          }
        }
      })
    }
  }, [gltf])

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
    </group>
  )
}

// Loading component
function LoadingFallback() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin">
            <RotateCcw className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Loading Avatar...
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>
    </Html>
  )
}

// Main Avatar3D component
export default function Avatar3D({
  avatarUrl,
  size = 'md',
  autoRotate = true,
  enableControls = true,
  className = '',
  showInfo = false
}: Avatar3DProps) {
  const { user } = useAuth()
  const [hasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get avatar URL from user or props
  const finalAvatarUrl = avatarUrl || user?.avatar || user?.avatarPortrait

  // Size configurations
  const sizeConfig = {
    sm: { width: 120, height: 120 },
    md: { width: 200, height: 200 },
    lg: { width: 300, height: 300 },
    xl: { width: 400, height: 400 }
  }

  const { width, height } = sizeConfig[size]

  // const handleError = () => {
  //   setHasError(true)
  // }

  return (
    <div 
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50 ${className}`}
      style={{ width, height }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[5, -5, -5]} intensity={0.3} color="#8b5cf6" />

        {/* Avatar Model */}
        <Suspense fallback={<LoadingFallback />}>
          {finalAvatarUrl && !hasError ? (
            <GLBAvatarModel url={finalAvatarUrl} />
          ) : (
            <FallbackAvatar />
          )}
        </Suspense>

        {/* Controls */}
        {enableControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>

      {/* Info overlay */}
      {showInfo && (
        <div className="absolute top-3 left-3 right-3">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-900 dark:text-white">
                  3D Avatar
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {finalAvatarUrl ? 'Drag to rotate and view' : 'No avatar configured'}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {enableControls && (
                  <MousePointer className="h-3 w-3 text-blue-500" />
                )}
                <Eye className="h-3 w-3 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action button */}
      {!finalAvatarUrl && (
        <div className="absolute bottom-3 left-3 right-3">
          <CreateAvatarButton />
        </div>
      )}

      {/* Holographic effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-purple-500/5 pointer-events-none" />
      
      {/* Animated border */}
      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-border opacity-30 rounded-2xl animate-pulse" />
    </div>
  )
}

// Create Avatar Button Component
function CreateAvatarButton() {
  const router = useRouter()
  
  return (
    <button
      onClick={() => router.push('/avatar')}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
    >
      <User className="h-3 w-3" />
      <span>Create Avatar</span>
    </button>
  )
}

// Error boundary wrapper
export function Avatar3DWithErrorBoundary(props: Avatar3DProps) {
  return (
    <ErrorBoundary>
      <Avatar3D {...props} />
    </ErrorBoundary>
  )
}

// Error fallback component that can use translations
function Avatar3DErrorFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="text-center p-4">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <div className="text-sm text-gray-600 dark:text-gray-300">
          3D viewer unavailable. Please use the avatar editor.
        </div>
      </div>
    </div>
  )
}

// Simple error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <Avatar3DErrorFallback />
    }

    return this.props.children
  }
}