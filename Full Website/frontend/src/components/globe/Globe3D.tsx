'use client'

import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { motion } from 'framer-motion'
import { Globe, Satellite, MapPin, Zap, Building, Mountain } from 'lucide-react'
import './mapbox.css'

// Mapbox access token - you'll need to set this in your environment
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// Check if token is available
const hasValidToken = MAPBOX_TOKEN && MAPBOX_TOKEN !== 'your_mapbox_access_token_here'

interface ControlPanelProps {
  map: mapboxgl.Map | null
  currentLayer: string
  onLayerChange: (layer: string) => void
}

function ControlPanel({ map, currentLayer, onLayerChange }: ControlPanelProps) {
  const [, ] = useState(false)
  
  const layers = [
    { id: 'satellite', name: 'Satellite', icon: Satellite, color: 'blue' },
    { id: 'streets', name: 'Streets', icon: MapPin, color: 'green' },
    { id: 'terrain', name: 'Terrain', icon: Mountain, color: 'orange' },
    { id: 'buildings', name: '3D Buildings', icon: Building, color: 'purple' },
  ]
  
  const flyToLocation = (location: { name: string; coords: [number, number]; zoom: number }) => {
    if (!map) return
    
    map.flyTo({
      center: location.coords,
      zoom: location.zoom,
      pitch: 60,
      bearing: 0,
      duration: 2000
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
            if (map) {
              map.flyTo({
                center: [-95, 45], // North America center
                zoom: 2,
                pitch: 0,
                bearing: 0,
                duration: 2000
              })
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
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>🌍 Drag to rotate globe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>🔍 Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>🏢 See 3D buildings up close</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>🗺️ Switch map layers</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function NoTokenPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-slate-900/95 flex items-center justify-center z-50"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-red-500/50 p-8 max-w-lg mx-4">
        <div className="text-center text-white">
          <div className="mb-4">
            <Globe className="h-16 w-16 text-red-400 mx-auto animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-400">Mapbox Token Required</h2>
          <div className="text-left space-y-4 text-sm">
            <p>To see the 3D globe with satellite imagery and buildings, you need a Mapbox access token:</p>
            
            <div className="bg-black/20 p-4 rounded-lg">
              <p className="font-semibold text-blue-400 mb-2">Setup Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://account.mapbox.com/access-tokens/" target="_blank" className="text-blue-300 underline">Mapbox Account</a></li>
                <li>Create a free account if you don&apos;t have one</li>
                <li>Copy your default public token</li>
                <li>Add it to your <code className="bg-black/30 px-1 rounded">.env.local</code> file:</li>
              </ol>
            </div>
            
            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs">
              <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here</code>
            </div>
            
            <p className="text-gray-300">Then restart your development server to see the full 3D globe!</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Globe3D() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [currentLayer, setCurrentLayer] = useState('satellite')
  const [isLoading, setIsLoading] = useState(true)
  
  // Handle window/container resize for sidebar collapse/expand  
  useEffect(() => {
    if (!map.current) return
    
    const handleResize = () => {
      if (map.current) {
        setTimeout(() => {
          map.current?.resize()
        }, 100)
      }
    }
    
    // Simple window resize listener
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    // Don't initialize map if no token
    if (!hasValidToken) {
      setIsLoading(false)
      return
    }
    
    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN!
    
    // Initialize map with the latest Mapbox Standard Satellite style
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard-satellite', // Latest 2024 style with 3D landmarks
      center: [-95, 45], // Center on North America
      zoom: 2,
      pitch: 0,
      bearing: 0,
      antialias: true,
      // Enable globe projection
      projection: 'globe' as any,
    })
    
    // Add atmosphere styling for the globe
    map.current.on('style.load', () => {
      if (!map.current) return
      
      map.current.setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        'space-color': 'rgb(11, 11, 25)', // Background color
      })
      
      // Add 3D terrain
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })
      
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
      
      setIsLoading(false)
    })
    
    // Add 3D buildings layer
    map.current.on('load', () => {
      if (!map.current) return
      
      // Add 3D buildings
      map.current.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      })
      
      // Add click handlers for interactivity
      map.current.on('click', (e) => {
        console.log('Clicked at:', e.lngLat)
      })
      
      // Add smooth zoom transitions
      map.current.on('zoom', () => {
        const zoom = map.current?.getZoom() || 0
        if (zoom > 10) {
          // Show more detail at higher zoom levels
          map.current?.setPaintProperty('3d-buildings', 'fill-extrusion-opacity', 0.8)
        } else {
          map.current?.setPaintProperty('3d-buildings', 'fill-extrusion-opacity', 0.6)
        }
      })
    })
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])
  
  // Handle layer changes
  useEffect(() => {
    if (!map.current) return
    
    const layerStyles = {
      satellite: 'mapbox://styles/mapbox/standard-satellite', // 2024 Standard Satellite with 3D landmarks
      streets: 'mapbox://styles/mapbox/standard', // 2024 Standard style with dynamic lighting
      terrain: 'mapbox://styles/mapbox/outdoors-v12',
      buildings: 'mapbox://styles/mapbox/standard' // Standard style shows 3D buildings better
    }
    
    const style = layerStyles[currentLayer as keyof typeof layerStyles]
    if (style) {
      map.current.setStyle(style)
      
      // Re-add custom layers after style change
      map.current.once('style.load', () => {
        if (!map.current) return
        
        // Re-add terrain
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        })
        
        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
        
        // Re-add fog
        map.current.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
        })
        
        // Re-add 3D buildings if not in satellite mode
        if (currentLayer !== 'satellite') {
          map.current.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          })
        }
      })
    }
  }, [currentLayer])
  
  return (
    <div className="relative w-full h-full">
      {/* Mapbox container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
      />
      
      {/* No Token Panel */}
      {!hasValidToken && <NoTokenPanel />}
      
      {/* Loading overlay */}
      {isLoading && hasValidToken && (
        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-blue-400 animate-spin" />
              <div className="text-lg">Loading Global Map...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Control panels - only show when token is valid */}
      {hasValidToken && (
        <>
          <ControlPanel 
            map={map.current} 
            currentLayer={currentLayer}
            onLayerChange={setCurrentLayer}
          />
          <InfoPanel />
        </>
      )}
    </div>
  )
}