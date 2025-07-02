'use client';

import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html, PerspectiveCamera, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { motion } from 'framer-motion';
// Custom hook for media query since react-use doesn't export useMediaQuery
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);
  
  return matches;
};
import ProfessionalRobot from './ProfessionalRobot';
import Enhanced3DChatBubble from './Enhanced3DChatBubble';
import SimpleBankingEnvironment from './SimpleBankingEnvironment';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: string;
  suggestions?: string[];
  sources?: string[];
}

interface OptimizedChatSceneProps {
  messages: Message[];
  isAISpeaking: boolean;
  currentViseme?: string;
  isLoading: boolean;
  showHistory: boolean;
  onHistoryToggle: () => void;
  onSuggestionClick?: (suggestion: string) => void;
  isListening?: boolean;
  speechConfidence?: number;
  availableVoices?: Array<{ name: string; quality: number; naturalness: number }>;
}

// Performance-optimized loading indicator
function OptimizedLoadingIndicator() {
  const meshRef = useRef<any>(null);
  
  // Reduce particle count on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const particleCount = isMobile ? 3 : 6;
  
  return (
    <group ref={meshRef} position={[0, -1, 2]}>
      {Array.from({ length: particleCount }, (_, i) => (
        <mesh key={i} position={[
          Math.cos((i / particleCount) * Math.PI * 2) * 0.8,
          0,
          Math.sin((i / particleCount) * Math.PI * 2) * 0.8
        ]}>
          <sphereGeometry args={[0.06]} />
          <meshBasicMaterial 
            color="#3B82F6" 
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Mobile-optimized controls
function MobileOptimizedControls({ target }: { target: [number, number, number] }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return (
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={6}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
        enableDamping
        dampingFactor={0.1}
        target={target}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
      />
    );
  }
  
  return (
    <OrbitControls 
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={8}
      maxDistance={20}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 2.2}
      autoRotate={true}
      autoRotateSpeed={0.2}
      enableDamping
      dampingFactor={0.05}
      target={target}
    />
  );
}

// Performance monitoring component
function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [showStats, setShowStats] = useState(false);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrames = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
        
        // Auto-adjust quality based on performance
        if (fps < 30) {
          console.warn('Low FPS detected, consider reducing quality');
        }
      }
      
      requestAnimationFrame(countFrames);
    };
    
    const rafId = requestAnimationFrame(countFrames);
    return () => cancelAnimationFrame(rafId);
  }, [fps]);
  
  if (!showStats) {
    return (
      <motion.button
        onClick={() => setShowStats(true)}
        className="fixed bottom-4 left-4 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-30 hover:opacity-100"
        whileHover={{ scale: 1.05 }}
      >
        📊
      </motion.button>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 left-4 z-20 bg-black/70 backdrop-blur text-white text-xs p-3 rounded-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <span>Performance</span>
        <button 
          onClick={() => setShowStats(false)}
          className="text-gray-400 hover:text-white ml-2"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={fps >= 50 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
            {fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Quality:</span>
          <span className="text-blue-400">
            {fps >= 50 ? 'High' : fps >= 30 ? 'Medium' : 'Low'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function OptimizedChatScene({
  messages,
  isAISpeaking,
  currentViseme,
  isLoading,
  showHistory,
  onHistoryToggle,
  onSuggestionClick,
  isListening = false,
  speechConfidence = 0,
  availableVoices = []
}: OptimizedChatSceneProps) {
  
  // Device detection
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isLowEnd = useMediaQuery('(max-width: 480px)');
  
  // Performance-based quality adjustment
  const deviceQuality = useMemo(() => {
    if (isLowEnd) return 'low';
    if (isMobile || isTablet) return 'medium';
    return 'high';
  }, [isLowEnd, isMobile, isTablet]);
  
  // Optimize message rendering based on device
  const optimizedMessages = useMemo(() => {
    if (isLowEnd) {
      // Show only last 3 messages on low-end devices
      return showHistory ? messages.slice(-3) : messages.slice(-2);
    }
    if (isMobile) {
      // Show last 5 messages on mobile
      return showHistory ? messages.slice(-5) : messages.slice(-3);
    }
    // Full history on desktop
    return showHistory ? messages : messages.slice(-8);
  }, [messages, showHistory, isLowEnd, isMobile]);
  
  // Adaptive camera settings
  const cameraSettings = useMemo(() => {
    if (isMobile) {
      return {
        position: [0, 4, 10] as [number, number, number],
        fov: 70
      };
    }
    return {
      position: [0, 6, 12] as [number, number, number],
      fov: 60
    };
  }, [isMobile]);
  
  // Performance settings
  const performanceSettings = useMemo(() => {
    return {
      antialias: deviceQuality === 'high',
      powerPreference: deviceQuality === 'high' ? 'high-performance' : 'low-power',
      stencil: deviceQuality !== 'low',
      depth: true,
      alpha: true
    };
  }, [deviceQuality]);
  
  // Star field optimization
  const starSettings = useMemo(() => {
    return {
      radius: isMobile ? 20 : 30,
      depth: isMobile ? 20 : 30,
      count: isLowEnd ? 50 : isMobile ? 100 : 200,
      factor: 2,
      saturation: 0.6,
      fade: true,
      speed: 0.3
    };
  }, [isMobile, isLowEnd]);
  
  return (
    <div className="relative w-full h-full">
      <Canvas 
        shadows={deviceQuality === 'high'} 
        className="w-full h-full"
        camera={cameraSettings}
        gl={performanceSettings}
        style={{ 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)',
          touchAction: 'none' // Prevent scrolling on mobile
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
        }}
      >
        {/* Adaptive performance optimization */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        <PerspectiveCamera makeDefault {...cameraSettings} />
        
        <MobileOptimizedControls target={[0, 0, 0]} />
        
        {/* Environment with quality scaling */}
        <Suspense fallback={null}>
          {deviceQuality !== 'low' && <SimpleBankingEnvironment />}
          <Stars {...starSettings} />
          
          {/* Main robot assistant */}
          <ProfessionalRobot 
            isAISpeaking={isAISpeaking}
            currentViseme={currentViseme}
            emotion={isAISpeaking ? 'happy' : isLoading ? 'thinking' : isListening ? 'listening' : 'neutral'}
            position={[0, 0, 0]}
            isListening={isListening}
            isProcessing={isLoading}
          />
          
          {/* Optimized 3D Chat bubbles */}
          {optimizedMessages.map((message, index) => (
            <Enhanced3DChatBubble
              key={message.id}
              message={message}
              index={index}
              isLatest={index === optimizedMessages.length - 1}
              isAnimating={isAISpeaking && message.sender === 'ai'}
              onSuggestionClick={onSuggestionClick}
            />
          ))}
          
          {/* Optimized loading indicator */}
          {isLoading && <OptimizedLoadingIndicator />}
        </Suspense>
        
        {/* Optimized lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          castShadow={deviceQuality === 'high'}
          shadow-mapSize-width={deviceQuality === 'high' ? 2048 : 1024}
          shadow-mapSize-height={deviceQuality === 'high' ? 2048 : 1024}
        />
        
        {/* UI Controls overlay - optimized for mobile */}
        <Html
          position={[0, isMobile ? 4 : 6, 0]}
          center
          style={{ pointerEvents: 'auto' }}
        >
          <motion.div 
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={onHistoryToggle}
              className={`px-4 py-2 ${isMobile ? 'px-3 py-2 text-sm' : 'px-6 py-3'} rounded-xl backdrop-blur-lg transition-all font-medium ${
                showHistory 
                  ? 'bg-blue-500/90 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showHistory ? 'Hide History' : `Show All (${messages.length})`}
            </motion.button>
            
            <motion.div 
              className={`text-center text-white/80 ${isMobile ? 'text-xs' : 'text-sm'} bg-black/20 backdrop-blur-lg rounded-lg px-3 py-2 max-w-xs`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="font-medium">💬 {optimizedMessages.length} messages</div>
              <div className="text-xs opacity-75">
                {isAISpeaking ? '🎤 Max Speaking' : 
                 isListening ? `🎧 Listening${speechConfidence > 0 ? ` (${Math.round(speechConfidence * 100)}%)` : '...'}` :
                 isLoading ? '💭 Thinking...' : '✨ Ready'}
              </div>
              {availableVoices.length > 0 && !isMobile && (
                <div className="text-xs opacity-60 mt-1">
                  🗣️ {availableVoices.length} voices
                </div>
              )}
            </motion.div>
          </motion.div>
        </Html>

        {/* Enhanced audio visualization - mobile optimized */}
        {(isAISpeaking || isListening) && (
          <Html position={[0, isMobile ? 2.5 : 3, 0]} center>
            <motion.div 
              className="flex items-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {Array.from({ length: isMobile ? 5 : 7 }, (_, i) => (
                <motion.div
                  key={i}
                  className={`rounded-full ${
                    isAISpeaking ? 'bg-green-400' : 'bg-blue-400'
                  }`}
                  style={{
                    width: isMobile ? '4px' : '6px',
                    height: isMobile ? '8px' : '12px'
                  }}
                  animate={{
                    scaleY: [1, 1.5 + Math.sin(Date.now() * 0.01 + i) * 0.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: isListening ? 0.6 : 0.8,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
            {isListening && speechConfidence > 0 && !isMobile && (
              <motion.div 
                className="text-xs text-blue-300 mt-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Confidence: {Math.round(speechConfidence * 100)}%
              </motion.div>
            )}
          </Html>
        )}
      </Canvas>
      
      {/* Performance monitor */}
      <PerformanceMonitor />
      
      {/* Mobile optimization indicator */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded"
        >
          📱 Mobile Optimized
        </motion.div>
      )}
    </div>
  );
}