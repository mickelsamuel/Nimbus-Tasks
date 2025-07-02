'use client'

import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Building2, 
  Eye, 
  Info,
  Sun,
  Sunset,
  Moon,
  Sunrise,
  Play,
  Palette
} from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Headquarters {
  name: string
  coords: [number, number]
  description: string
  height: number
  floors: number
  color: string
  address: string
}

const headquarters: Record<string, Headquarters> = {
  nationalBank: {
    name: 'National Bank Tower',
    coords: [-73.561712, 45.499176], // 800 Saint-Jacques Street, Montreal, QC H4Z
    description: 'Modern 40-storey headquarters tower with advanced LED facade',
    address: '800 Saint-Jacques Street West',
    height: 200,
    floors: 40,
    color: '#00B4D8'
  },
  sunLife: {
    name: 'Sun Life Building',
    coords: [-73.570345, 45.50023], // 1209 Rue Mansfield, Montreal, QC H3B 4G8
    description: 'Historic Art Deco landmark with premium office spaces',
    address: '1155 Metcalfe Street',
    height: 122,
    floors: 24,
    color: '#FF6B35' 
  }
}

export default function EnhancedGlobe() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'globe' | 'street'>('street')
  const [activeBuilding, setActiveBuilding] = useState<string>('nationalBank')
  const [lightingMode, setLightingMode] = useState<'day' | 'dusk' | 'night' | 'dawn'>('day')
  const [animationInProgress, setAnimationInProgress] = useState(false)
  
  // Dynamic lighting configuration based on time of day
  const getLightingConfig = (mode: 'day' | 'dusk' | 'night' | 'dawn') => {
    switch (mode) {
      case 'day':
        return {
          light: {
            anchor: 'viewport',
            position: [1.15, 45, 30],
            color: '#ffffff',
            intensity: 0.6
          },
          fog: {
            color: 'rgb(220, 230, 245)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.2
          }
        }
      case 'dusk':
        return {
          light: {
            anchor: 'viewport',
            position: [0.8, 30, 25],
            color: '#ff9a56',
            intensity: 0.4
          },
          fog: {
            color: 'rgb(255, 140, 105)',
            'high-color': 'rgb(223, 92, 36)',
            'horizon-blend': 0.04,
            'space-color': 'rgb(25, 15, 11)',
            'star-intensity': 0.4
          }
        }
      case 'night':
        return {
          light: {
            anchor: 'viewport',
            position: [0.5, 15, 20],
            color: '#6366f1',
            intensity: 0.2
          },
          fog: {
            color: 'rgb(55, 65, 100)',
            'high-color': 'rgb(25, 35, 70)',
            'horizon-blend': 0.06,
            'space-color': 'rgb(5, 5, 15)',
            'star-intensity': 0.8
          }
        }
      case 'dawn':
        return {
          light: {
            anchor: 'viewport',
            position: [1.3, 60, 35],
            color: '#fbbf24',
            intensity: 0.5
          },
          fog: {
            color: 'rgb(255, 200, 150)',
            'high-color': 'rgb(255, 150, 100)',
            'horizon-blend': 0.03,
            'space-color': 'rgb(20, 15, 10)',
            'star-intensity': 0.3
          }
        }
    }
  }

  // Apply dynamic lighting
  const applyLighting = (mapInstance: mapboxgl.Map, mode: 'day' | 'dusk' | 'night' | 'dawn') => {
    const config = getLightingConfig(mode)
    // Note: setLight is deprecated, using setLights instead
    mapInstance.setLights([{
      id: 'directional-light',
      type: 'directional',
      properties: {
        direction: [config.light.position[0], config.light.position[1]] as [number, number],
        color: config.light.color,
        intensity: config.light.intensity
      }
    }])
    mapInstance.setFog(config.fog)
  }

  // Performance-optimized 3D building configuration
  const configure3DBuildings = (mapInstance: mapboxgl.Map) => {
    // Optimize performance settings
    mapInstance.setRenderWorldCopies(false) // Improve performance
    
    // Debounced layer addition for better performance
    let layerTimeout: NodeJS.Timeout
    
    // Wait for sources to load before adding layers
    mapInstance.on('sourcedata', (e) => {
      if (e.sourceId === 'composite' && e.isSourceLoaded) {
        clearTimeout(layerTimeout)
        layerTimeout = setTimeout(() => {
          // Performance-optimized building layers
          if (!mapInstance.getLayer('all-buildings-optimized')) {
            try {
              mapInstance.addLayer({
                id: 'all-buildings-optimized',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 14, // Higher minzoom for better performance  
                maxzoom: 22,
                layout: {
                  'visibility': 'visible'
                },
                paint: {
                  'fill-extrusion-color': [
                    'interpolate',
                    ['exponential', 1.5], // Smooth exponential interpolation
                    ['get', 'height'],
                    0, '#f8fafc',
                    30, '#e2e8f0', 
                    60, '#cbd5e1',
                    100, '#94a3b8',
                    150, '#64748b',
                    200, '#475569',
                    300, '#334155'
                  ],
                  'fill-extrusion-height': ['get', 'height'],
                  'fill-extrusion-base': ['get', 'min_height'],
                  'fill-extrusion-opacity': 0.8,
                  'fill-extrusion-ambient-occlusion-intensity': 0.3,
                  'fill-extrusion-ambient-occlusion-radius': 8,
                  'fill-extrusion-vertical-gradient': true
                }
              })
            } catch (error) {
              console.error('Error adding optimized buildings:', error)
            }
          }

          // High-performance headquarters highlighting
          if (!mapInstance.getLayer('hq-buildings-premium')) {
            try {
              mapInstance.addLayer({
                id: 'hq-buildings-premium',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 13,
                maxzoom: 22,
                layout: {
                  'visibility': 'visible'
                },
                paint: {
                  'fill-extrusion-color': [
                    'case',
                    // National Bank Tower - Premium blue
                    ['all',
                      ['>=', ['get', 'height'], 190],
                      ['<=', ['get', 'height'], 210]
                    ],
                    '#00B4D8',
                    // Sun Life Building - Premium orange
                    ['all',
                      ['>=', ['get', 'height'], 115],
                      ['<=', ['get', 'height'], 130]
                    ],
                    '#FF6B35',
                    // Transparent for other buildings
                    'rgba(0,0,0,0)'
                  ],
                  'fill-extrusion-height': [
                    'case',
                    ['>=', ['get', 'height'], 100],
                    ['*', ['get', 'height'], 1.15], // Slightly taller for emphasis
                    ['get', 'height']
                  ],
                  'fill-extrusion-base': ['get', 'min_height'],
                  'fill-extrusion-opacity': 0.95,
                  'fill-extrusion-ambient-occlusion-intensity': 0.6,
                  'fill-extrusion-ambient-occlusion-radius': 10,
                  'fill-extrusion-vertical-gradient': true
                }
              })
            } catch (error) {
              console.error('Error adding HQ buildings:', error) 
            }
          }
        }, 500) // Reduced timeout for faster loading
      }
    })
  }

  // Ultra-smooth orbital camera animation with performance optimization
  const cinematicFlyTo = (targetBuilding: string, callback?: () => void) => {
    if (!map.current || animationInProgress) return
    
    setAnimationInProgress(true)
    const building = headquarters[targetBuilding]
    const baseBearing = targetBuilding === 'nationalBank' ? 90 : 340
    
    // Single smooth animation with custom easing and high frame rate
    const startTime = Date.now()
    const totalDuration = 4500 // Slower, more cinematic animation
    
    // Advanced easing function for smooth acceleration/deceleration
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    
    // High-performance animation loop using requestAnimationFrame
    const animateCamera = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / totalDuration, 1)
      const easedProgress = easeInOutCubic(progress)
      
      // Smooth orbital path calculation
      const orbitRadius = 360 // Full orbit degrees
      const currentBearing = baseBearing + (orbitRadius * (1 - easedProgress))
      
      // Smooth zoom progression
      const startZoom = 11
      const endZoom = 17
      const currentZoom = startZoom + (endZoom - startZoom) * easedProgress
      
      // Smooth pitch progression  
      const startPitch = 10
      const endPitch = 60
      const currentPitch = startPitch + (endPitch - startPitch) * easedProgress
      
      // Apply smooth camera position
      map.current?.jumpTo({
        center: building.coords,
        zoom: currentZoom,
        pitch: currentPitch,
        bearing: currentBearing
      })
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera)
      } else {
        // Final position adjustment for perfect placement
        map.current?.easeTo({
          center: building.coords,
          zoom: 17,
          pitch: 60,
          bearing: baseBearing,
          duration: 600,
          easing: (t) => t * (2 - t) // Smooth final ease
        })
        
        setTimeout(() => {
          setAnimationInProgress(false)
          callback?.()
        }, 500)
      }
    }
    
    // Start the smooth animation
    requestAnimationFrame(animateCamera)
  }

  // Auto-cycle through lighting modes
  const cycleLighting = () => {
    if (!map.current) return
    
    const modes: Array<'day' | 'dusk' | 'night' | 'dawn'> = ['day', 'dusk', 'night', 'dawn']
    const currentIndex = modes.indexOf(lightingMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    
    setLightingMode(nextMode)
    applyLighting(map.current, nextMode)
    
    // Note: lightPreset not available in streets-v12 style
  }
  
  // Handle container resize
  useEffect(() => {
    if (!map.current) return
    
    const handleResize = () => {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        map.current?.resize()
      }, 300)
    }
    
    // Listen for resize events
    window.addEventListener('resize', handleResize)
    
    // Create observer for container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    
    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current)
    }
    
    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    console.log('Initializing EnhancedGlobe...')
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    console.log('Mapbox token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'Not found')
    
    if (!accessToken) {
      console.error('Mapbox access token not found. Please check your environment variables.')
      setIsLoading(false)
      return
    }

    if (!accessToken.startsWith('pk.')) {
      console.error('Invalid Mapbox access token format. Token should start with "pk."')
      setIsLoading(false)
      return
    }
    
    mapboxgl.accessToken = accessToken
    
    try {
      // Initialize with performance-optimized settings
      console.log('Creating high-performance Mapbox map instance...')
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: headquarters.nationalBank.coords,
        zoom: 17,
        pitch: 60,
        bearing: 90,
        antialias: true,
        // Performance optimizations
        fadeDuration: 100, // Faster transitions
        performanceMetricsCollection: false, // Disable metrics for better performance
        preserveDrawingBuffer: false, // Better memory usage
        refreshExpiredTiles: false, // Reduce network requests
        // Rendering optimizations
        maxTileCacheSize: 200, // Limit cache size
        transformRequest: (url, resourceType) => {
          // Fix authentication for Mapbox requests
          if (url.includes('api.mapbox.com')) {
            // Ensure the URL has the correct parameters
            const urlObj = new URL(url);
            if (!urlObj.searchParams.has('sku')) {
              urlObj.searchParams.set('sku', '101vU6dUCKFu0');
            }
            if (!urlObj.searchParams.has('access_token') && accessToken) {
              urlObj.searchParams.set('access_token', accessToken);
            }
            return { url: urlObj.toString() };
          }
          return { url };
        }
      })
      console.log('High-performance map instance created')
    } catch (error) {
      console.error('Failed to create map:', error)
      setIsLoading(false)
      return
    }
    
    // Add controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-left')
    
    map.current.on('style.load', () => {
      console.log('High-performance Mapbox style loaded successfully')
      if (!map.current) return
      
      // Performance monitoring
      const startTime = performance.now()
      
      // Apply initial dynamic lighting
      applyLighting(map.current, lightingMode)
      
      // Enable optimized terrain
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })
      
      map.current.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 1.3 // Slightly reduced for better performance
      })
      
      // Configure performance-optimized 3D buildings
      configure3DBuildings(map.current)
      
      // Optimized building click detection
      map.current.on('click', (e) => {
        console.log('Clicked coordinates:', e.lngLat)
        
        // Efficient feature querying
        const features = map.current!.queryRenderedFeatures(e.point, {
          layers: ['hq-buildings-premium', 'all-buildings-optimized']
        })
        
        if (features.length > 0) {
          const building = features[0]
          console.log('Clicked building:', building.properties)
          console.log('Building height:', building.properties?.height)
        }
      })
      
      // Performance metrics
      const loadTime = performance.now() - startTime
      console.log(`Map initialization completed in ${loadTime.toFixed(2)}ms`)
      
      // Add custom markers for headquarters buildings
      Object.entries(headquarters).forEach(([key, building]) => {
        // Create custom marker element
        const el = document.createElement('div')
        el.className = 'hq-marker'
        el.innerHTML = `
          <div class="marker-content">
            <div class="marker-pulse"></div>
            <div class="marker-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18M12 3v18M3 7h18M3 14h18"/>
              </svg>
            </div>
            <div class="marker-label">${building.name}</div>
          </div>
        `
        
        new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
          offset: [0, -15] // Position marker above building
        })
        .setLngLat(building.coords)
        .addTo(map.current!)
        
        // Add popup for building information
        const popup = new mapboxgl.Popup({ 
          offset: [0, -80], // Increased distance to prevent overlap
          closeButton: false,
          className: 'hq-popup',
          maxWidth: '300px',
          anchor: 'bottom' // Ensure popup appears above marker
        })
        .setHTML(`
          <div class="popup-content">
            <h3>${building.name}</h3>
            <p class="address">${building.address}</p>
            <p class="description">${building.description}</p>
            <div class="stats">
              <span>${building.floors} floors</span>
              <span>•</span>
              <span>${building.height}m tall</span>
            </div>
          </div>
        `)
        
        // Simplified hover handling to prevent flickering
        let hoverTimeout: NodeJS.Timeout
        
        el.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout)
          popup.setLngLat(building.coords).addTo(map.current!)
        })
        
        el.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimeout)
          hoverTimeout = setTimeout(() => {
            popup.remove()
          }, 200) // Longer delay to prevent flicker
        })
        
        el.addEventListener('click', () => {
          setActiveBuilding(key)
          cinematicFlyTo(key)
        })
      })
      
      setIsLoading(false)
      
      // Force resize after load to ensure proper sizing
      setTimeout(() => {
        map.current?.resize()
      }, 100)
    })
    
    map.current.on('error', (e) => {
      console.error('Mapbox error:', e)
      if (e.error?.message?.includes('Unauthorized') || e.error?.message?.includes('401')) {
        console.error('Mapbox authentication failed. Please check your access token.')
      }
      setIsLoading(false)
    })
    
    // Add custom marker styles
    const style = document.createElement('style')
    style.innerHTML = `
      .hq-marker {
        cursor: pointer;
        transform: translate(-50%, -50%);
        pointer-events: auto;
        z-index: 1000;
      }
      
      .marker-content {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        padding: 10px;
        margin: 10px;
      }
      
      .marker-pulse {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%);
        animation: pulse 2s ease-out infinite;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
      }
      
      .marker-icon {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255,255,255,0.3);
        position: relative;
        z-index: 2;
        transition: all 0.3s ease;
        border: 2px solid rgba(255, 255, 255, 0.8);
      }
      
      .hq-marker:hover .marker-icon {
        transform: scale(1.1) translateY(-2px);
        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.6), inset 0 2px 4px rgba(255,255,255,0.4);
      }
      
      .marker-label {
        margin-top: 8px;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        border: 1px solid rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(8px);
      }
      
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
      
      .hq-popup .mapboxgl-popup-content {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
        color: white;
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        overflow: hidden;
        pointer-events: auto;
      }
      
      .hq-popup {
        pointer-events: none;
      }
      
      .hq-popup .mapboxgl-popup-content {
        pointer-events: auto;
      }
      
      .hq-popup .mapboxgl-popup-tip {
        border-top-color: rgba(15, 23, 42, 0.95);
      }
      
      .popup-content {
        padding: 20px;
        position: relative;
      }
      
      .popup-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
      }
      
      .popup-content h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
      }
      
      .popup-content .address {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #cbd5e1;
        font-weight: 500;
      }
      
      .popup-content .description {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #e2e8f0;
        line-height: 1.4;
      }
      
      .popup-content .stats {
        display: flex;
        gap: 12px;
        font-size: 13px;
        color: #94a3b8;
        padding-top: 12px;
        border-top: 1px solid rgba(255,255,255,0.1);
        font-weight: 600;
      }
      
      .popup-content .stats span:nth-child(2) {
        color: #64748b;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
      map.current?.remove()
      map.current = null
    }
  }, [])
  
  // Ultra-smooth view transitions with optimized performance
  const toggleView = () => {
    if (!map.current || animationInProgress) return
    
    setAnimationInProgress(true)
    
    if (currentView === 'street') {
      // Smooth transition to globe view
      setCurrentView('globe')
      
      // Step 1: Zoom out smoothly
      map.current.easeTo({
        zoom: 8,
        pitch: 30,
        duration: 1200,
        easing: (t) => t * t * (3 - 2 * t) // Smooth ease in-out
      })
      
      setTimeout(() => {
        // Step 2: Switch to globe projection
        map.current?.setProjection({ name: 'globe' })
        
        // Step 3: Fly to global view
        map.current?.flyTo({
          center: [-73.566029, 45.499703],
          zoom: 1.8,
          pitch: 0,
          bearing: 0,
          duration: 2500,
          curve: 1.2,
          easing: (t) => 1 - Math.pow(1 - t, 3) // Smooth deceleration
        })
        
        setTimeout(() => setAnimationInProgress(false), 2500)
      }, 1200)
      
    } else {
      // Smooth transition to street view
      setCurrentView('street')
      const building = headquarters[activeBuilding]
      const targetBearing = activeBuilding === 'nationalBank' ? 90 : 340
      
      // Step 1: Zoom into target area
      map.current.flyTo({
        center: building.coords,
        zoom: 8,
        pitch: 20,
        bearing: targetBearing,
        duration: 1500,
        curve: 1.3,
        easing: (t) => t * t * t // Smooth acceleration
      })
      
      setTimeout(() => {
        // Step 2: Switch to mercator projection
        map.current?.setProjection({ name: 'mercator' })
        
        // Step 3: Final smooth approach to street level
        map.current?.flyTo({
          center: building.coords,
          zoom: 17,
          pitch: 60,
          bearing: targetBearing,
          duration: 1800,
          curve: 1.1,
          easing: (t) => 1 - Math.pow(1 - t, 4) // Smooth final approach
        })
        
        setTimeout(() => setAnimationInProgress(false), 1800)
      }, 1500)
    }
  }
  
  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 space-y-4"
      >
        {/* View Toggle */}
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-1">
          <div className="flex bg-black/30 rounded-md">
            <button
              onClick={() => currentView === 'globe' && toggleView()}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                currentView === 'street' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Street</span>
            </button>
            <button
              onClick={() => currentView === 'street' && toggleView()}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                currentView === 'globe' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Globe</span>
            </button>
          </div>
        </div>

        {/* Dynamic Lighting Controls */}
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Lighting</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setLightingMode('day')
                map.current && applyLighting(map.current, 'day')
                // Note: lightPreset not available in streets-v12 style
              }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-all text-xs ${
                lightingMode === 'day' 
                  ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-200' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <Sun className="w-3 h-3" />
              Day
            </button>
            
            <button
              onClick={() => {
                setLightingMode('dusk')
                map.current && applyLighting(map.current, 'dusk')
                // Note: lightPreset not available in streets-v12 style
              }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-all text-xs ${
                lightingMode === 'dusk' 
                  ? 'bg-orange-500/20 border border-orange-500/50 text-orange-200' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <Sunset className="w-3 h-3" />
              Dusk
            </button>
            
            <button
              onClick={() => {
                setLightingMode('night')
                map.current && applyLighting(map.current, 'night')
                // Note: lightPreset not available in streets-v12 style
              }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-all text-xs ${
                lightingMode === 'night' 
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-200' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <Moon className="w-3 h-3" />
              Night
            </button>
            
            <button
              onClick={() => {
                setLightingMode('dawn')
                map.current && applyLighting(map.current, 'dawn')
                // Note: lightPreset not available in streets-v12 style
              }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-all text-xs ${
                lightingMode === 'dawn' 
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <Sunrise className="w-3 h-3" />
              Dawn
            </button>
          </div>
          
          <button
            onClick={cycleLighting}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-md hover:from-purple-500/30 hover:to-pink-500/30 transition-all text-xs text-white"
          >
            <Play className="w-3 h-3" />
            Auto Cycle
          </button>
        </div>

        
      </motion.div>
      
      {/* Quick Navigation - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 right-6"
      >
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Buildings
          </h3>
          
          {/* Montreal Buildings */}
          <div className="mb-4">
            <h4 className="text-white/80 text-sm font-medium mb-2 px-1">Montreal</h4>
            <div className="space-y-2">
              {Object.entries(headquarters).map(([key, building]) => (
                <button
                  key={key}
                  onClick={() => {
                    if (animationInProgress || activeBuilding === key) return
                    setActiveBuilding(key)
                    if (currentView === 'street') {
                      cinematicFlyTo(key)
                    } else {
                      // Smooth globe navigation
                      map.current?.flyTo({
                        center: building.coords,
                        zoom: 12,
                        pitch: 30,
                        bearing: key === 'nationalBank' ? 90 : 340,
                        duration: 2200,
                        curve: 1.4,
                        easing: (t) => 1 - Math.pow(1 - t, 3)
                      })
                    }
                  }}
                  disabled={animationInProgress}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    activeBuilding === key 
                      ? 'bg-blue-500/20 border border-blue-500/50' 
                      : animationInProgress 
                        ? 'bg-white/5 opacity-50 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: building.color }}
                    />
                    <div>
                      <div className="text-white text-sm font-medium">{building.name}</div>
                      <div className="text-white/60 text-xs">{building.floors} floors</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 left-6"
      >
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="mb-1 font-medium">Enhanced 3D Experience</p>
              <p className="text-xs text-white/60">
                {currentView === 'street' 
                  ? `Orbital animations • ${lightingMode} lighting • Maximum detail 3D`
                  : 'Interactive globe • Real-time lighting • Click buildings to explore'
                }
              </p>
              {animationInProgress && (
                <p className="text-xs text-blue-400 mt-1">
                  ✨ Orbital animation in progress...
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Loading 3D Globe...</p>
          </div>
        </div>
      )}
    </div>
  )
}