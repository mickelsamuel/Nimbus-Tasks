'use client'

import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Sphere, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { Globe, Satellite, Building, Mountain } from 'lucide-react'

// Globe component that renders a beautiful Earth
function EarthGlobe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Create realistic Earth texture
  const earthMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    // Create a realistic Earth texture with continents
    const gradient = ctx.createLinearGradient(0, 0, 2048, 1024)
    
    // Ocean colors
    gradient.addColorStop(0, '#0066cc')
    gradient.addColorStop(0.2, '#004499') 
    gradient.addColorStop(0.4, '#0066cc')
    gradient.addColorStop(0.6, '#004499')
    gradient.addColorStop(0.8, '#0066cc')
    gradient.addColorStop(1, '#004499')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2048, 1024)
    
    // Add landmasses (simplified continents)
    ctx.fillStyle = '#2d5016' // Dark green for land
    
    // North America
    ctx.fillRect(200, 200, 400, 300)
    ctx.fillRect(300, 500, 200, 150)
    
    // South America  
    ctx.fillRect(500, 600, 150, 350)
    
    // Europe
    ctx.fillRect(900, 150, 150, 200)
    
    // Africa
    ctx.fillRect(950, 350, 200, 400)
    
    // Asia
    ctx.fillRect(1100, 100, 500, 400)
    
    // Australia
    ctx.fillRect(1400, 650, 200, 100)
    
    // Add cities as bright dots
    const cities = [
      [300, 250], // New York
      [350, 280], // Montreal  
      [950, 200], // London
      [1300, 250], // Tokyo
      [1000, 400], // Cairo
      [1200, 300], // Beijing
      [500, 700], // Rio
      [1450, 700], // Sydney
    ]
    
    ctx.fillStyle = '#ffff00'
    cities.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
    })
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])
  
  useFrame((state, delta) => {
    // Slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
    
    // Clouds rotate slightly faster
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.07
    }
    
    // Atmosphere pulse
    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01)
    }
  })
  
  return (
    <group>
      {/* Main Earth sphere */}
      <Sphere
        ref={meshRef}
        args={[2, 64, 64]}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <meshPhongMaterial
          map={earthMaterial}
          shininess={100}
          transparent={false}
          color={isHovered ? '#ffffff' : '#e6f2ff'}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.02, 32, 32]}>
        <meshLambertMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere ref={atmosphereRef} args={[2.15, 32, 32]}>
        <meshLambertMaterial
          color="#87CEEB"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* City markers */}
      <CityMarkers />
    </group>
  )
}

// 3D city markers
function CityMarkers() {
  const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, color: '#E01A1A' },
    { name: 'Montreal', lat: 45.5017, lng: -73.5673, color: '#E01A1A' },
    { name: 'London', lat: 51.5074, lng: -0.1278, color: '#3b82f6' },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#10b981' },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, color: '#f59e0b' },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357, color: '#8b5cf6' },
  ]
  
  const convertLatLngTo3D = (lat: number, lng: number, radius = 2.08) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )
  }
  
  return (
    <group>
      {cities.map((city) => {
        const position = convertLatLngTo3D(city.lat, city.lng)
        return (
          <group key={city.name} position={position}>
            {/* Building representation */}
            <mesh>
              <boxGeometry args={[0.03, 0.03, 0.08]} />
              <meshBasicMaterial color={city.color} />
            </mesh>
            {/* Pulsing ring */}
            <mesh>
              <ringGeometry args={[0.02, 0.04, 16]} />
              <meshBasicMaterial 
                color={city.color} 
                transparent 
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// Control panel
function ControlPanel({ onLayerChange, currentLayer }: { onLayerChange: (layer: string) => void, currentLayer: string }) {
  const layers = [
    { id: 'realistic', name: 'Realistic', icon: Satellite, color: 'blue' },
    { id: 'night', name: 'Night Lights', icon: Mountain, color: 'purple' },
    { id: 'cities', name: 'Cities', icon: Building, color: 'orange' },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-6 right-6 z-10"
    >
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-blue-400" />
          <span className="text-white font-medium">Free 3D Globe</span>
        </div>
        
        <div className="space-y-2">
          {layers.map((layer) => {
            const IconComponent = layer.icon
            const isActive = currentLayer === layer.id
            return (
              <button
                key={layer.id}
                onClick={() => onLayerChange(layer.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm transition-all ${
                  isActive 
                    ? `bg-${layer.color}-500/40 ring-2 ring-${layer.color}-400/50` 
                    : `bg-${layer.color}-500/20 hover:bg-${layer.color}-500/30`
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {layer.name}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function InfoPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 left-6 z-10"
    >
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-white">
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>🌍 100% Free - No Signup Ever!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>🎮 Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>🔍 Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>🏢 See major cities in 3D</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main 3D scene
function Scene3DContent({ }: { currentLayer: string }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.5}
        castShadow
      />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#4A90E2" />
      
      {/* Space environment */}
      <Stars radius={300} depth={60} count={15000} factor={6} saturation={0} fade />
      <Environment preset="night" />
      
      {/* Earth */}
      <EarthGlobe />
    </>
  )
}

export default function SimpleGlobe() {
  const [currentLayer, setCurrentLayer] = useState('realistic')
  
  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas
        camera={{ 
          position: [-2, 1, 6],
          fov: 60 
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene3DContent currentLayer={currentLayer} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.2}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* UI Overlays */}
      <ControlPanel onLayerChange={setCurrentLayer} currentLayer={currentLayer} />
      <InfoPanel />
    </div>
  )
}