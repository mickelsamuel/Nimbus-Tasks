'use client'

import { useEffect, useRef } from 'react'

export function JavaScriptAnimations() {
  const spinnerRef = useRef<HTMLDivElement>(null)
  const pulseRef = useRef<HTMLDivElement>(null)
  const bounceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationFrameId: number
    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp

      const elapsed = timestamp - startTime

      // Spinner animation (360 degrees per 2 seconds)
      if (spinnerRef.current) {
        const rotation = (elapsed / 2000) * 360
        spinnerRef.current.style.transform = `rotate(${rotation}deg)`
      }

      // Pulse animation (2 second cycle)
      if (pulseRef.current) {
        const pulse = Math.sin((elapsed / 1000) * Math.PI) * 0.5 + 0.5
        pulseRef.current.style.opacity = (0.5 + pulse * 0.5).toString()
      }

      // Bounce animation (1 second cycle)
      if (bounceRef.current) {
        const bounce = Math.abs(Math.sin((elapsed / 500) * Math.PI))
        bounceRef.current.style.transform = `translateY(${-bounce * 10}px)`
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-bold mb-2">JS Animations</h3>
      
      <div className="flex items-center gap-2 mb-2">
        <div 
          ref={spinnerRef}
          className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="text-xs">JS Spin</span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <div 
          ref={pulseRef}
          className="w-6 h-6 bg-green-500 rounded-full"
        />
        <span className="text-xs">JS Pulse</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div 
          ref={bounceRef}
          className="w-6 h-6 bg-purple-500 rounded-full"
        />
        <span className="text-xs">JS Bounce</span>
      </div>
      
      <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
        These use requestAnimationFrame
      </p>
    </div>
  )
}