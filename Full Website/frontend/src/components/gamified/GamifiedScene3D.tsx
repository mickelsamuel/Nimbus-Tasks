'use client'

import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Html, useAnimations, useGLTF } from '@react-three/drei'
import { useAuth } from '@/contexts/AuthContext'
import { rafThrottle } from '@/utils/performance'
import * as THREE from 'three'

interface PlayerAvatarProps {
  position: [number, number, number]
  isMoving: boolean
  direction: [number, number, number]
  velocity: number
}

function RPMAvatar({ url, isMoving, velocity }: { url: string, position: [number, number, number], isMoving: boolean, velocity: number }) {
  const group = useRef<THREE.Group>(null)
  const gltf = useGLTF(url) as any
  const { scene, animations } = gltf
  const { actions, names } = useAnimations((animations as THREE.AnimationClip[]) || [], group)
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null)
  const [walkCycle, setWalkCycle] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const hasAnimations = animations && (animations as THREE.AnimationClip[]).length > 0
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const scrollTimer = useRef<NodeJS.Timeout | null>(null)
  
  // Initialize avatar
  useEffect(() => {
    if (scene) {
      // Scale the avatar properly
      (scene as THREE.Object3D).scale.setScalar(1)
      
      // Setup mixer for potential future animations
      mixer.current = new THREE.AnimationMixer(scene as THREE.Object3D)
    }
  }, [scene, names])

  // Scroll detection for performance optimization
  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      setIsScrolling(true)
      
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }
      
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }
    }
  }, [])

  // Handle animation transitions
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return

    // Find appropriate animations
    const walkAnimation = names.find(name => 
      name.toLowerCase().includes('walk') || 
      name.toLowerCase().includes('walking') ||
      name.toLowerCase().includes('run')
    )
    const idleAnimation = names.find(name => 
      name.toLowerCase().includes('idle') || 
      name.toLowerCase().includes('standing')
    ) || names[0] // Fallback to first animation

    const targetAnimation = isMoving ? walkAnimation : idleAnimation
    
    if (targetAnimation && targetAnimation !== currentAnimation) {
      // Fade out current animation
      if (currentAnimation && actions[currentAnimation]) {
        actions[currentAnimation].fadeOut(0.3)
      }
      
      // Fade in new animation
      if (actions[targetAnimation]) {
        actions[targetAnimation]
          .reset()
          .setEffectiveTimeScale(isMoving ? Math.max(0.8, Math.min(velocity * 0.5, 2)) : 1)
          .setEffectiveWeight(1.0)
          .fadeIn(0.3)
          .play()
        
        setCurrentAnimation(targetAnimation)
      }
    }
  }, [isMoving, actions, names, currentAnimation, velocity])

  useFrame((state, delta) => {
    if (!group.current || !scene) return
    
    // Pause animations during scrolling for better performance
    if (isScrolling) {
      return
    }
    
    // Update animation mixer if available
    if (mixer.current && hasAnimations) {
      mixer.current.update(delta)
    }
    
    // Manual animation for avatars without built-in animations
    if (!hasAnimations && gltf.scene) {
      if (isMoving) {
        // Manual walking animation with more visible movement
        setWalkCycle(prev => prev + delta * 15 * velocity)
        const bobIntensity = Math.sin(walkCycle) * 0.15 // Increased bobbing
        const sway = Math.sin(walkCycle * 0.8) * 0.08 // Increased swaying
        const lean = Math.sin(walkCycle * 1.2) * 0.05 // Added forward lean
        
        const sceneObj = gltf.scene as THREE.Object3D
        sceneObj.position.y = Math.abs(bobIntensity)
        sceneObj.rotation.z = sway
        sceneObj.rotation.x = lean
        
        // Try to animate limbs if they exist - with REDUCED rotations
        sceneObj.traverse((child) => {
          if (child.name.toLowerCase().includes('arm') || child.name.toLowerCase().includes('shoulder')) {
            child.rotation.x = Math.sin(walkCycle + Math.PI) * 0.1 // Reduced from 0.5 to 0.1
          }
          if (child.name.toLowerCase().includes('leg') || child.name.toLowerCase().includes('thigh')) {
            child.rotation.x = Math.sin(walkCycle) * 0.15 // Reduced from 0.6 to 0.15
          }
        })
      } else {
        // Idle breathing animation
        const breathing = Math.sin(state.clock.elapsedTime * 2) * 0.02
        const sceneObj = gltf.scene as THREE.Object3D
        sceneObj.position.y = breathing
        sceneObj.rotation.z = 0
        sceneObj.rotation.x = 0
        
        // Reset limb positions
        sceneObj.traverse((child) => {
          if (child.name.toLowerCase().includes('arm') || 
              child.name.toLowerCase().includes('shoulder') ||
              child.name.toLowerCase().includes('leg') || 
              child.name.toLowerCase().includes('thigh')) {
            child.rotation.x = 0
          }
        })
      }
    }
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene as THREE.Object3D} />
    </group>
  )
}

function FallbackAvatar({ isMoving }: { position: [number, number, number], isMoving: boolean, velocity: number }) {
  const meshRef = useRef<THREE.Group>(null)
  const [walkCycle, setWalkCycle] = useState(0)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isMoving) {
        // Walking animation cycle based on actual velocity
        setWalkCycle(prev => prev + delta * 15) // Consistent walking speed
        const bobIntensity = Math.sin(walkCycle) * 0.08
        const sway = Math.sin(walkCycle * 0.5) * 0.03
        
        meshRef.current.position.y = Math.abs(bobIntensity)
        meshRef.current.rotation.z = sway
        
        // Walking animation active
      } else {
        // Idle breathing animation
        const breathing = Math.sin(state.clock.elapsedTime * 3) * 0.02
        meshRef.current.position.y = breathing
        meshRef.current.rotation.z = 0
      }
    }
  })

  return (
    <group ref={meshRef}>
      {/* Avatar Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 1.8, 0.3]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      
      {/* Avatar Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Arms that swing when walking */}
      <mesh 
        position={[-0.5, 0.8, 0]} 
        rotation={[0, 0, isMoving ? Math.sin(walkCycle + Math.PI) * 0.3 : -0.3]}
        castShadow
      >
        <cylinderGeometry args={[0.1, 0.08, 0.6]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      <mesh 
        position={[0.5, 0.8, 0]} 
        rotation={[0, 0, isMoving ? Math.sin(walkCycle) * 0.3 : 0.3]}
        castShadow
      >
        <cylinderGeometry args={[0.1, 0.08, 0.6]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      
      {/* Name Tag */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Player
      </Text>
    </group>
  )
}

function PlayerAvatar({ position, isMoving, direction, velocity }: PlayerAvatarProps) {
  const { user } = useAuth()
  const avatarUrl = user?.avatar || user?.avatar3D
  
  // Rotate avatar to face movement direction with smooth interpolation
  const groupRef = useRef<THREE.Group>(null)
  const targetRotation = useRef(0)
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Always update position first
      groupRef.current.position.set(position[0], position[1], position[2])
      
      if (isMoving && (direction[0] !== 0 || direction[2] !== 0)) {
        targetRotation.current = Math.atan2(direction[0], direction[2])
      }
      
      // Smooth rotation interpolation
      const currentRotation = groupRef.current.rotation.y
      const rotationDiff = targetRotation.current - currentRotation
      const normalizedDiff = Math.atan2(Math.sin(rotationDiff), Math.cos(rotationDiff))
      
      groupRef.current.rotation.y += normalizedDiff * delta * 8
    }
  })

  return (
    <group ref={groupRef}>
      <Suspense fallback={
        <Html center>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-sm">
            Loading Avatar...
          </div>
        </Html>
      }>
        {avatarUrl ? (
          <RPMAvatar url={avatarUrl} position={[0, 0, 0]} isMoving={isMoving} velocity={velocity} />
        ) : (
          <FallbackAvatar position={[0, 0, 0]} isMoving={isMoving} velocity={velocity} />
        )}
      </Suspense>
    </group>
  )
}

interface CameraControllerProps {
  avatarPosition: [number, number, number]
  isMoving: boolean
}

function CameraController({ avatarPosition }: CameraControllerProps) {
  const { camera } = useThree()
  
  useFrame((state, delta) => {
    // Simple camera follow
    const offset = new THREE.Vector3(0, 3, 5)
    const targetPosition = new THREE.Vector3(...avatarPosition).add(offset)
    camera.position.lerp(targetPosition, delta * 2)
    
    // Simple look-at
    camera.lookAt(avatarPosition[0], avatarPosition[1] + 1, avatarPosition[2])
  })
  
  return null
}

interface GamifiedScene3DProps {
  onMovement?: (position: [number, number, number]) => void
}

export default function GamifiedScene3D({ onMovement }: GamifiedScene3DProps) {
  const [avatarPosition, setAvatarPosition] = useState<[number, number, number]>([0, 0, 0])
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false
  })
  const [isMoving, setIsMoving] = useState(false)
  const [movementDirection, setMovementDirection] = useState<[number, number, number]>([0, 0, 0])
  const [velocity, setVelocity] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0))
  useRef(new THREE.Vector3(0, 0, 0))
  const scrollTimer = useRef<NodeJS.Timeout | null>(null)

  // Scroll detection for performance optimization
  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      setIsScrolling(true)
      
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }
      
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'shift') {
        setKeys(prev => ({ ...prev, shift: true }))
      } else if (key in keys) {
        setKeys(prev => ({ ...prev, [key]: true }))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'shift') {
        setKeys(prev => ({ ...prev, shift: false }))
      } else if (key in keys) {
        setKeys(prev => ({ ...prev, [key]: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [keys])

  useEffect(() => {
    const baseSpeed = 0.02  // Reduced from 0.08 (4x slower)
    const runSpeed = 0.04   // Reduced from 0.15 (3.75x slower)
    let animationId: number

    const updatePosition = () => {
      setAvatarPosition(prev => {
        const currentSpeed = keys.shift ? runSpeed : baseSpeed
        const acceleration = 0.8
        const deceleration = 0.9
        
        let dirX = 0
        let dirZ = 0

        if (keys.w) dirZ = -1
        if (keys.s) dirZ = 1
        if (keys.a) dirX = -1
        if (keys.d) dirX = 1

        // Normalize diagonal movement
        if (dirX !== 0 && dirZ !== 0) {
          dirX *= 0.707
          dirZ *= 0.707
        }

        const hasKeyInput = keys.w || keys.s || keys.a || keys.d
        
        // Smooth acceleration/deceleration
        if (hasKeyInput) {
          velocityRef.current.x = THREE.MathUtils.lerp(velocityRef.current.x, dirX * currentSpeed, acceleration)
          velocityRef.current.z = THREE.MathUtils.lerp(velocityRef.current.z, dirZ * currentSpeed, acceleration)
        } else {
          velocityRef.current.x = THREE.MathUtils.lerp(velocityRef.current.x, 0, deceleration)
          velocityRef.current.z = THREE.MathUtils.lerp(velocityRef.current.z, 0, deceleration)
        }

        const newX = prev[0] + velocityRef.current.x
        const newZ = prev[2] + velocityRef.current.z
        
        const newPosition: [number, number, number] = [newX, prev[1], newZ]
        
        // Calculate actual velocity for animation
        const velocityMagnitude = Math.sqrt(velocityRef.current.x * velocityRef.current.x + velocityRef.current.z * velocityRef.current.z)
        const isCurrentlyMoving = velocityMagnitude > 0.01
        
        setIsMoving(isCurrentlyMoving)
        setMovementDirection([dirX, 0, dirZ])
        setVelocity(velocityMagnitude * 50) // Scale for display
        onMovement?.(newPosition)
        
        // Remove console spam
        
        return newPosition
      })

      animationId = requestAnimationFrame(updatePosition)
    }

    updatePosition()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [keys, onMovement])

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 3, 5], fov: 60 }}
        gl={{ 
          antialias: !isScrolling, // Disable antialiasing during scroll
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={isScrolling ? [0.5, 1] : [1, 2]} // Reduce pixel ratio during scroll
        frameloop={isScrolling ? "demand" : "always"} // Pause rendering during scroll
        performance={{ min: isScrolling ? 0.2 : 0.5 }}
        style={{
          willChange: isScrolling ? 'auto' : 'contents',
          contain: 'layout style paint'
        }}
      >
        {/* Simple Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        {/* Simple Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        {/* Player Avatar */}
        <PlayerAvatar 
          position={avatarPosition} 
          isMoving={isMoving}
          direction={movementDirection}
          velocity={velocity}
        />

        {/* Simple Camera Controller */}
        <CameraController avatarPosition={avatarPosition} isMoving={isMoving} />
      </Canvas>

      {/* Enhanced UI */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white border border-white/20">
        <h3 className="font-bold mb-3 text-lg">Controls</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">W</kbd>
            <span>Move Forward</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">S</kbd>
            <span>Move Backward</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">A</kbd>
            <span>Move Left</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">D</kbd>
            <span>Move Right</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">Shift</kbd>
            <span>Run</span>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-3 text-white text-sm border border-white/20">
        <div className="space-y-1">
          <div>Position: ({avatarPosition[0].toFixed(1)}, {avatarPosition[2].toFixed(1)})</div>
          <div>Status: {isMoving ? (keys.shift ? 'Running' : 'Walking') : 'Idle'}</div>
          <div>Speed: {velocity.toFixed(2)}</div>
        </div>
      </div>

      {/* Loading Indicator */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-xl">Loading 3D World...</div>
        </div>
      }>
        <></>
      </Suspense>
    </div>
  )
}

// Preload Ready Player Me avatars
useGLTF.preload('https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb')