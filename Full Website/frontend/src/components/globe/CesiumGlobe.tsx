'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Satellite, MapPin, Building, Mountain, Zap } from 'lucide-react'

// Dynamic import for Cesium to handle SSR
let Cesium: Record<string, unknown> | null = null

interface ControlPanelProps {
  viewer: Record<string, unknown> | null
  currentLayer: string
  onLayerChange: (layer: string) => void
}

function ControlPanel({ viewer, currentLayer, onLayerChange }: ControlPanelProps) {
  const layers = [
    { id: 'satellite', name: 'Satellite', icon: Satellite, color: 'blue' },
    { id: 'osm', name: 'OpenStreetMap', icon: MapPin, color: 'green' },
    { id: 'terrain', name: 'Terrain', icon: Mountain, color: 'orange' },
    { id: 'buildings', name: '3D Buildings', icon: Building, color: 'purple' },
  ]
  
  const flyToLocation = (location: { name: string; coords: [number, number]; zoom: number }) => {
    if (!viewer || !Cesium) return
    
    ;(viewer as any).camera.flyTo({
      destination: (Cesium as any).Cartesian3.fromDegrees(location.coords[0], location.coords[1], location.zoom * 1000),
      duration: 2.0
    })
  }
  
  const featuredLocations = [
    { name: 'New York', coords: [-74.0060, 40.7128] as [number, number], zoom: 15 },
    { name: 'Montreal', coords: [-73.5673, 45.5017] as [number, number], zoom: 15 },
    { name: 'London', coords: [-0.1278, 51.5074] as [number, number], zoom: 15 },
    { name: 'Tokyo', coords: [139.6503, 35.6762] as [number, number], zoom: 15 },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-6 right-6 z-10 space-y-4"
    >
      {/* Layer Controls */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-blue-400" />
          <span className="text-white font-medium">Map Layers</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {layers.map((layer) => {
            const IconComponent = layer.icon
            const isActive = currentLayer === layer.id
            return (
              <button
                key={layer.id}
                onClick={() => onLayerChange(layer.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm transition-all ${
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
      
      {/* Quick Navigation */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-5 w-5 text-purple-400" />
          <span className="text-white font-medium">Quick Travel</span>
        </div>
        
        <div className="space-y-2">
          {featuredLocations.map((location) => (
            <button
              key={location.name}
              onClick={() => flyToLocation(location)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-white text-sm transition-colors"
            >
              <MapPin className="h-4 w-4" />
              {location.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Globe Reset */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <button
          onClick={() => {
            if (viewer && Cesium) {
              ;(viewer as any).camera.flyHome(2.0)
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-white text-sm transition-colors"
        >
          <Globe className="h-4 w-4" />
          Reset Globe View
        </button>
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
            <span>🌍 Completely Free - No Signup Required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>🎮 Drag to rotate globe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>🔍 Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>🏢 See 3D buildings & terrain</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CesiumGlobe() {
  const cesiumContainer = useRef<HTMLDivElement>(null)
  const viewer = useRef<Record<string, unknown> | null>(null)
  const [currentLayer, setCurrentLayer] = useState('satellite')
  const [isLoading, setIsLoading] = useState(true)
  const [cesiumLoaded, setCesiumLoaded] = useState(false)
  
  // Load Cesium dynamically
  useEffect(() => {
    const loadCesium = async () => {
      try {
        // Check if running in browser
        if (typeof window === 'undefined') return
        
        // Import Cesium dynamically to handle SSR
        const cesiumModule = await import('cesium')
        Cesium = cesiumModule.default || cesiumModule
        
        // Cesium will use its default configuration
        
        // Disable Cesium Ion (we'll use free data sources)
        if ((Cesium as any).Ion) {
          (Cesium as any).Ion.defaultAccessToken = undefined
        }
        
        setCesiumLoaded(true)
      } catch (error) {
        console.error('Failed to load Cesium:', error)
        setIsLoading(false)
      }
    }
    
    loadCesium()
  }, [])
  
  // Initialize Cesium viewer
  useEffect(() => {
    if (!cesiumContainer.current || viewer.current || !cesiumLoaded || !Cesium) return
    
    try {
      // Create basic Cesium viewer
      viewer.current = new (Cesium as any).Viewer(cesiumContainer.current, {
        // Disable UI elements for clean look
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        selectionIndicator: false,
        
        // Configure for globe view
        scene3DOnly: true
      })
      
      // Configure the scene
      const scene = (viewer.current as any).scene
      
      // Enable lighting based on sun/moon positions
      scene.globe.enableLighting = true
      
      // Set initial camera position to show North America
      ;(viewer.current as any).camera.setView({
        destination: (Cesium as any).Cartesian3.fromDegrees(-95.0, 40.0, 15000000.0)
      })
      
      // Add 3D buildings (simplified version using OSM data)
      addBuildings()
      
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to initialize Cesium viewer:', error)
      setIsLoading(false)
    }
    
    // Cleanup
    return () => {
      if (viewer.current) {
        ;(viewer.current as any).destroy()
        viewer.current = null
      }
    }
  }, [cesiumLoaded])
  
  // Add 3D buildings function
  const addBuildings = () => {
    if (!viewer.current || !Cesium) return
    
    // Add some sample 3D buildings for major cities
    const cities = [
      { name: 'Empire State Building', lon: -73.9857, lat: 40.7484, height: 443 },
      { name: 'CN Tower', lon: -79.3871, lat: 43.6426, height: 553 },
      { name: 'Eiffel Tower', lon: 2.2945, lat: 48.8584, height: 330 },
      { name: 'Tokyo Skytree', lon: 139.8107, lat: 35.7101, height: 634 },
    ]
    
    cities.forEach(city => {
      ;(viewer.current as any).entities.add({
        name: city.name,
        position: (Cesium as any).Cartesian3.fromDegrees(city.lon, city.lat),
        box: {
          dimensions: new (Cesium as any).Cartesian3(100.0, 100.0, city.height),
          material: (Cesium as any).Color.CYAN.withAlpha(0.8),
          outline: true,
          outlineColor: (Cesium as any).Color.WHITE
        }
      })
    })
  }
  
  // Handle layer changes
  useEffect(() => {
    if (!viewer.current || !Cesium) return
    
    const scene = (viewer.current as any).scene
    
    switch (currentLayer) {
      case 'satellite':
        scene.imageryLayers.removeAll()
        scene.imageryLayers.addImageryProvider(
          new (Cesium as any).OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
          })
        )
        break
        
      case 'osm':
        scene.imageryLayers.removeAll()
        scene.imageryLayers.addImageryProvider(
          new (Cesium as any).OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
          })
        )
        break
        
      case 'terrain':
        scene.imageryLayers.removeAll()
        // Use a free terrain style from OpenStreetMap
        scene.imageryLayers.addImageryProvider(
          new (Cesium as any).UrlTemplateImageryProvider({
            url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        )
        break
        
      case 'buildings':
        scene.imageryLayers.removeAll()
        scene.imageryLayers.addImageryProvider(
          new (Cesium as any).OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
          })
        )
        // Buildings are always visible via entities
        break
    }
  }, [currentLayer])
  
  return (
    <div className="relative w-full h-full">
      {/* Cesium container */}
      <div 
        ref={cesiumContainer} 
        className="w-full h-full"
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-blue-400 animate-spin" />
              <div className="text-lg">Loading Free 3D Globe...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Control panels */}
      {!isLoading && (
        <>
          <ControlPanel 
            viewer={viewer.current} 
            currentLayer={currentLayer}
            onLayerChange={setCurrentLayer}
          />
          <InfoPanel />
        </>
      )}
    </div>
  )
}