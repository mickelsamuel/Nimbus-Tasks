'use client'

import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { motion } from 'framer-motion'
import { Globe, Satellite, MapPin, Zap, Mountain, Map, AlertTriangle } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

interface ControlPanelProps {
  map: mapboxgl.Map | null
  currentLayer: string
  onLayerChange: (layer: string) => void
}

function ControlPanel({ map }: ControlPanelProps) {
  [
    { id: 'satellite', name: 'Satellite', icon: Satellite, color: 'blue' },
    { id: 'streets', name: 'Streets', icon: MapPin, color: 'green' },
    { id: 'terrain', name: 'Terrain', icon: Mountain, color: 'orange' },
    { id: 'hybrid', name: 'Hybrid', icon: Map, color: 'purple' },
  ]
  
  const flyToLocation = (location: { name: string; coords: [number, number]; zoom: number }) => {
    if (!map) return
    
    map.flyTo({
      center: location.coords,
      zoom: location.zoom,
      pitch: 60,
      bearing: -20,
      duration: 3000,
      essential: true,
      easing: (t) => t * (2 - t) // Ease-out quad
    })
  }
  
  const featuredLocations = [
    { name: 'Sun Life Building', coords: [-73.5688, 45.5001] as [number, number], zoom: 20 },
    { name: 'National Bank HQ', coords: [-73.5614, 45.5001] as [number, number], zoom: 20 },
    { name: 'Montreal Overview', coords: [-73.5651, 45.5001] as [number, number], zoom: 16 },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-6 right-6 z-10 space-y-4"
    >
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
                center: [-73.5651, 45.5001], // Montreal center between buildings
                zoom: 3,
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
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>🌍 Powered by Mapbox - Real 3D buildings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>🎮 Drag to rotate, Shift+drag to tilt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>🏢 National Bank & Sun Life in 3D!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>🔍 Zoom to street level for detail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span>🎯 Interactive pins with building info</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Custom animated marker component
function AnimatedMarker({ map, lngLat, label, description, icon }: { 
  map: mapboxgl.Map | null
  lngLat: [number, number]
  label: string
  description?: string
  icon?: string
}) {
  useEffect(() => {
    if (!map) return
    
    const el = document.createElement('div')
    el.className = 'custom-marker'
    el.innerHTML = `
      <div class="marker-wrapper">
        <div class="marker-pulse"></div>
        <div class="marker-icon">
          ${icon || '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'}
        </div>
        <div class="marker-label">${label}</div>
      </div>
    `
    
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
    .setLngLat(lngLat)
    .addTo(map)
    
    if (description) {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<div class="popup-content">
          <h3>${label}</h3>
          <p>${description}</p>
        </div>`)
      
      marker.setPopup(popup)
    }
    
    return () => {
      marker.remove()
    }
  }, [map, lngLat, label, description, icon])
  
  return null
}

// No Token Panel Component
function NoTokenPanel() {
  return (
    <div className="absolute inset-0 bg-slate-900/95 flex items-center justify-center z-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 max-w-md mx-4 text-white"
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-8 w-8 text-yellow-400" />
          <h2 className="text-2xl font-bold">Mapbox Token Required</h2>
        </div>
        
        <div className="space-y-4 text-sm">
          <p className="text-gray-200">
            To use the interactive 3D globe with real satellite imagery and buildings, you need a Mapbox access token.
          </p>
          
          <div className="bg-black/20 rounded-lg p-4 space-y-2">
            <p className="font-medium text-blue-300">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-300">
              <li>Go to <span className="text-blue-400">mapbox.com</span> and create a free account</li>
              <li>Get your access token from the dashboard</li>
              <li>Add it to your <code className="bg-black/30 px-1 rounded">.env.local</code> file:</li>
            </ol>
            <div className="bg-black/40 rounded p-2 mt-2">
              <code className="text-green-400 text-xs">
                NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
              </code>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Free tier includes 50,000 map loads per month</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            Restart your development server after adding the token
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// Function to add detailed 3D buildings with street-view level detail
function addDetailedBuildings(mapInstance: mapboxgl.Map) {
  if (!mapInstance) return
  
  // Create detailed building footprints with multiple segments for realism
  const createBuildingFootprint = (center: [number, number], width: number, depth: number) => {
    const [lng, lat] = center
    const lngOffset = width / 111320 / Math.cos(lat * Math.PI / 180) // Convert meters to degrees
    const latOffset = depth / 110540 // Convert meters to degrees
    
    return [
      [lng - lngOffset/2, lat - latOffset/2],
      [lng + lngOffset/2, lat - latOffset/2],
      [lng + lngOffset/2, lat + latOffset/2],
      [lng - lngOffset/2, lat + latOffset/2],
      [lng - lngOffset/2, lat - latOffset/2]
    ]
  }
  
  // Detailed Montreal Buildings with realistic footprints and immersive 3D
  const detailedBuildings = [
    // Sun Life Building - 1155 Metcalfe Street
    {
      name: 'Sun Life Building',
      center: [-73.5688, 45.5001],
      footprint: createBuildingFootprint([-73.5688, 45.5001], 85, 125), // Large historic footprint
      height: 122, // Actual height
      floors: 24,
      color: '#FF6B35', // Vibrant orange-red
      glow: '#FF8C42',
      special: true,
      buildingType: 'historic'
    },
    // National Bank Tower - 800 Saint-Jacques Street West
    {
      name: 'National Bank Tower',
      center: [-73.5614, 45.5001],
      footprint: createBuildingFootprint([-73.5614, 45.5001], 95, 95), // Large modern tower footprint
      height: 200, // Actual height 
      floors: 40,
      color: '#00D4FF', // Electric blue
      glow: '#40E0FF',
      special: true,
      buildingType: 'modern'
    }
  ]
  
  // Create immersive 3D buildings with detailed geometry
  detailedBuildings.forEach((building, index) => {
    const buildingGeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          name: building.name,
          height: building.height,
          floors: building.floors,
          color: building.color,
          glow: building.glow,
          special: building.special,
          buildingType: building.buildingType
        },
        geometry: {
          type: 'Polygon',
          coordinates: [building.footprint]
        }
      }]
    }
    
    const sourceId = `detailed-building-${index}`
    
    try {
      // Remove existing source if it exists
      if (mapInstance.getSource(sourceId)) {
        mapInstance.removeSource(sourceId)
      }
      
      // Add building source
      mapInstance.addSource(sourceId, {
        type: 'geojson',
        data: buildingGeoJSON as any
      })
      
      // Add ultra-detailed 3D building with street-view level immersion
      mapInstance.addLayer({
        id: `detailed-building-${index}`,
        source: sourceId,
        type: 'fill-extrusion',
        minzoom: 8, // Show earlier for better visibility
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, ['get', 'glow'],   // Glow from far away
            12, ['get', 'color'], // Main color at medium zoom
            16, ['get', 'color'], // Keep color at close zoom
            20, [
              'case',
              ['==', ['get', 'name'], 'Sun Life Building'], '#FF4500', // Deeper orange up close
              ['==', ['get', 'name'], 'National Bank Tower'], '#0080FF', // Deeper blue up close
              ['get', 'color']
            ]
          ],
          'fill-extrusion-height': [
            'interpolate',
            ['exponential', 1.8],
            ['zoom'],
            8, ['*', ['get', 'height'], 0.2],  // Small at far zoom
            12, ['*', ['get', 'height'], 0.7], // Growing at medium zoom
            16, ['*', ['get', 'height'], 1.1], // Slightly taller than real
            18, ['*', ['get', 'height'], 1.3], // More impressive at close zoom
            20, ['*', ['get', 'height'], 1.5], // Street-view level detail
            22, ['*', ['get', 'height'], 2.0]  // Massive for immersion
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 0.8,
            14, 0.95,
            20, 1.0
          ],
          'fill-extrusion-ambient-occlusion-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 0.3,
            16, 0.7,
            20, 1.0  // Maximum shadow detail at street level
          ],
          'fill-extrusion-ambient-occlusion-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 4,
            16, 8,
            20, 15   // Large shadow radius for realism
          ]
        }
      })
      
      // Add massive glow effect for far visibility
      mapInstance.addLayer({
        id: `detailed-glow-${index}`,
        source: sourceId,
        type: 'fill',
        minzoom: 6,
        maxzoom: 18,
        paint: {
          'fill-color': ['get', 'glow'],
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6, 0.8,  // Strong glow from far away
            10, 0.6,
            14, 0.3,
            18, 0.1  // Subtle glow up close
          ]
        }
      })
      
      // Add enhanced labels with building details
      mapInstance.addLayer({
        id: `detailed-label-${index}`,
        source: sourceId,
        type: 'symbol',
        minzoom: 10,
        layout: {
          'text-field': [
            'format',
            ['get', 'name'], { 'font-scale': 1.2 },
            '\n', {},
            ['concat', ['get', 'floors'], ' floors'], { 'font-scale': 0.8 }
          ],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 14,
            14, 20,
            18, 30,
            22, 48   // Very large text for street view
          ],
          'text-offset': [0, -2],
          'text-anchor': 'bottom',
          'text-allow-overlap': true
        },
        paint: {
          'text-color': ['get', 'color'],
          'text-halo-color': '#000000',
          'text-halo-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 2,
            16, 4,
            22, 6    // Thick outline for readability
          ],
          'text-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0.9,
            14, 1.0
          ]
        }
      })
      
    } catch (error) {
      console.error(`Error adding detailed building ${building.name}:`, error)
    }
  })
  
  console.log('Street-view level 3D buildings added successfully!')
}

export default function RealGlobe() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [currentLayer, setCurrentLayer] = useState('satellite')
  const [isLoading, setIsLoading] = useState(true)
  const [hasToken, setHasToken] = useState(false)
  
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
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // Add custom styles
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .custom-marker {
        position: absolute;
        transform: translate(-50%, -100%);
        cursor: pointer;
      }
      
      .marker-wrapper {
        position: relative;
        animation: float 3s ease-in-out infinite;
      }
      
      .marker-pulse {
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.4);
        animation: pulse 2s ease-out infinite;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .marker-icon {
        width: 40px;
        height: 40px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 2;
        color: #3b82f6;
      }
      
      .marker-label {
        position: absolute;
        bottom: -25px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        font-weight: 500;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
      }
      
      .mapboxgl-popup-content {
        background: rgba(0, 0, 0, 0.9) !important;
        color: white !important;
        border-radius: 8px !important;
        padding: 16px !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
      }
      
      .popup-content h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .popup-content p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
      
      .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
        border-top-color: rgba(0, 0, 0, 0.9) !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    // Check for Mapbox access token
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    
    console.log('Mapbox token check:', accessToken ? 'Token found' : 'No token', accessToken?.substring(0, 20) + '...')
    
    if (!accessToken) {
      console.log('No Mapbox token found, showing setup panel')
      setHasToken(false)
      setIsLoading(false)
      return
    }
    
    setHasToken(true)
    console.log('Setting Mapbox access token...')
    
    // Set Mapbox access token
    mapboxgl.accessToken = accessToken
    
    try {
      // Initialize Mapbox map with enhanced settings
      console.log('Initializing Mapbox map...')
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9', // Mapbox satellite style
        center: [-73.5651, 45.5001], // Center between the two buildings
        zoom: 3,
        pitch: 0,
        bearing: 0,
        antialias: true,
        // Enable globe projection for spherical view
        projection: 'globe' as any,
        // Enhanced rendering options
        fadeDuration: 300
      })
      
      // Add controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
      
      map.current.on('style.load', () => {
        if (!map.current) return
        console.log('Mapbox map and style loaded successfully!')
        
        // Add fog and atmosphere effects
        map.current.setFog({
          color: 'rgb(186, 210, 235)', // Horizon color
          'high-color': 'rgb(36, 92, 223)', // Sky color  
          'horizon-blend': 0.02, // Atmosphere thickness
          'space-color': 'rgb(11, 11, 25)', // Background space color
          'star-intensity': 0.6 // Star brightness
        })
        
        // Add terrain source
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        })
        
        // Enable 3D terrain
        map.current.setTerrain({
          source: 'mapbox-dem',
          exaggeration: 1.5
        })
        
        // Set dynamic lighting
        map.current.setLight({
          anchor: 'viewport',
          position: [1.5, 90, 80],
          color: 'white',
          intensity: 0.5
        })
        
        // Start globe rotation animation
        let userInteracting = false
        const secondsPerRevolution = 120
        const maxSpinZoom = 5
        const slowSpinZoom = 3
        
        function spinGlobe() {
          const zoom = map.current?.getZoom() || 0
          if (!userInteracting && zoom < maxSpinZoom) {
            let distancePerSecond = 360 / secondsPerRevolution
            if (zoom > slowSpinZoom) {
              const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom)
              distancePerSecond *= zoomDif
            }
            const center = map.current?.getCenter()
            if (center) {
              center.lng -= distancePerSecond / 60
              map.current?.easeTo({ center, duration: 1000, easing: n => n })
            }
          }
        }
        
        map.current.on('mousedown', () => { userInteracting = true })
        map.current.on('mouseup', () => { userInteracting = false })
        map.current.on('dragstart', () => { userInteracting = true })
        map.current.on('dragend', () => { userInteracting = false })
        map.current.on('moveend', () => { spinGlobe() })
        
        setInterval(spinGlobe, 1000 / 60) // 60fps rotation
        
        // Wait a bit for all sources to be available
        setTimeout(() => {
          if (!map.current) return
          
          try {
            // Check if composite source exists
            const sources = map.current.getStyle().sources
            console.log('Available sources:', Object.keys(sources))
            
            if (sources.composite) {
              console.log('Adding 3D buildings layer...')
              // Add 3D buildings layer with enhanced styling
              map.current.addLayer({
                id: '3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 14, // Show buildings at lower zoom levels
                paint: {
                  'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'height'],
                    0, '#4A90E2',      // Light blue for short buildings
                    20, '#5B9BD5',     // Medium blue
                    50, '#357ABD',     // Darker blue
                    100, '#2E5C8A',    // Navy blue
                    200, '#1E3A5F',    // Dark navy
                    300, '#FFD700',    // Gold for skyscrapers
                    500, '#FF6B6B'     // Red for super tall buildings
                  ],
                  'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14, ['*', ['get', 'height'], 0.5], // Show reduced height at low zoom
                    16, ['*', ['get', 'height'], 0.8], // Gradually increase
                    18, ['get', 'height'], // Full height at high zoom
                    20, ['*', ['get', 'height'], 1.2] // Slightly enhanced for street view
                  ],
                  'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14, 0,
                    16, ['get', 'min_height']
                  ],
                  'fill-extrusion-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14, 0.7,
                    18, 0.9,
                    20, 1.0
                  ],
                  // Add ambient occlusion effect
                  'fill-extrusion-ambient-occlusion-intensity': 0.4,
                  'fill-extrusion-ambient-occlusion-radius': 4.0
                }
              })
              console.log('3D buildings layer added successfully!')
            } else {
              console.log('Composite source not available, skipping 3D buildings')
            }
            
            // Add detailed 3D buildings
            addDetailedBuildings(map.current!)
          } catch (error) {
            console.error('Error adding 3D buildings:', error)
          }
        }, 1000) // Wait 1 second for sources to load
        
        setIsLoading(false)
      })
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
        // Don't set hasToken to false for building layer errors
        if (e.error?.message?.includes('source "composite" not found')) {
          console.log('Building layer error, but map is working')
        } else {
          setHasToken(false)
        }
        setIsLoading(false)
      })
      
    } catch (error) {
      console.error('Failed to initialize Mapbox:', error)
      setHasToken(false)
      setIsLoading(false)
    }
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])
  
  // Handle layer changes with Mapbox styles
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded() || !hasToken) return
    
    // Define the Mapbox styles for different layers
    const layerStyles = {
      satellite: 'mapbox://styles/mapbox/satellite-v9',
      streets: 'mapbox://styles/mapbox/streets-v12',
      terrain: 'mapbox://styles/mapbox/outdoors-v12',
      hybrid: 'mapbox://styles/mapbox/satellite-streets-v12'
    }
    
    const style = layerStyles[currentLayer as keyof typeof layerStyles]
    if (style) {
      map.current.setStyle(style)
      
      // Re-add 3D buildings after style change
      map.current.once('styledata', () => {
        if (!map.current) return
        
        // Add enhanced 3D buildings layer
        map.current.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              0, '#4A90E2',      // Light blue for short buildings
              20, '#5B9BD5',     // Medium blue
              50, '#357ABD',     // Darker blue
              100, '#2E5C8A',    // Navy blue
              200, '#1E3A5F',    // Dark navy
              300, '#FFD700',    // Gold for skyscrapers
              500, '#FF6B6B'     // Red for super tall buildings
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, ['*', ['get', 'height'], 0.5],
              16, ['*', ['get', 'height'], 0.8],
              18, ['get', 'height'],
              20, ['*', ['get', 'height'], 1.2]
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 0,
              16, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 0.7,
              18, 0.9,
              20, 1.0
            ],
            'fill-extrusion-ambient-occlusion-intensity': 0.4,
            'fill-extrusion-ambient-occlusion-radius': 4.0
          }
        })
        
        // Add detailed 3D buildings with special styling
        addDetailedBuildings(map.current)
      })
    }
  }, [currentLayer, hasToken])
  
  return (
    <div className="relative w-full h-full">
      {/* Mapbox container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
      />
      
      {/* No token panel */}
      {!hasToken && !isLoading && <NoTokenPanel />}
      
      {/* Loading overlay */}
      {isLoading && hasToken && (
        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-blue-400 animate-spin" />
              <div className="text-lg">Loading Mapbox Globe...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Animated markers for Montreal locations */}
      {!isLoading && hasToken && map.current && (
        <>
          <AnimatedMarker
            map={map.current}
            lngLat={[-73.5688, 45.5001]}
            label="Sun Life Building"
            description="Historic 24-storey office building - 1155 Metcalfe Street"
          />
          <AnimatedMarker
            map={map.current}
            lngLat={[-73.5614, 45.5001]}
            label="National Bank of Canada"
            description="800 Saint-Jacques Street West - 40-storey headquarters tower"
          />
        </>
      )}
      
      {/* Control panels */}
      {!isLoading && hasToken && (
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