'use client';
import { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBubbleProps {
  text: string;
  isVisible: boolean;
  position: [number, number, number];
  isTyping?: boolean;
  onComplete?: () => void;
}

export function SpeechBubble({ 
  text, 
  isVisible, 
  position, 
  isTyping = false, 
  onComplete 
}: SpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const typewriterSpeed = 30; // ms per character

  useEffect(() => {
    if (isTyping && text && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typewriterSpeed);
      
      return () => clearTimeout(timer);
    } else if (!isTyping) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
    }
    
    if (currentIndex >= text.length && onComplete) {
      onComplete();
    }
  }, [text, isTyping, currentIndex, onComplete]);

  useEffect(() => {
    if (text !== displayedText) {
      setCurrentIndex(0);
      setDisplayedText('');
    }
  }, [text, displayedText]);

  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      transform
      sprite
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.3 
            }}
            className="relative max-w-sm p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {/* Speech bubble tail pointing to avatar's mouth */}
            <div 
              className="absolute bottom-0 left-6 transform translate-y-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgba(255,255,255,0.95)',
              }}
            />
            
            <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
              {displayedText}
            </div>
            
            {/* Typing indicator */}
            {isTyping && currentIndex < text.length && (
              <motion.div
                className="inline-block w-1 h-4 ml-1 bg-blue-500 rounded"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
}

// 3D Speech Bubble using Three.js geometry (alternative approach)
export function SpeechBubble3D({ 
  text, 
  isVisible, 
  position,
  isTyping = false 
}: SpeechBubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isTyping && text && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30);
      
      return () => clearTimeout(timer);
    } else if (!isTyping) {
      setDisplayedText(text);
    }
  }, [text, isTyping, currentIndex]);

  return (
    <group position={position} visible={isVisible}>
      {/* Bubble background */}
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 1, 0.1]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9} 
        />
      </mesh>
      
      {/* Text content */}
      <Html
        position={[0, 0, 0.1]}
        center
        distanceFactor={8}
      >
        <div className="max-w-xs p-3 text-sm text-gray-800 bg-transparent text-center">
          {displayedText}
          {isTyping && currentIndex < text.length && (
            <span className="animate-pulse">|</span>
          )}
        </div>
      </Html>
    </group>
  );
}