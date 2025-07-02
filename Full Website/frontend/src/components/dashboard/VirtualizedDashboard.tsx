'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface VirtualizedDashboardProps {
  children: React.ReactNode
  className?: string
}


export function VirtualizedDashboard({ children, className = '' }: VirtualizedDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Intersection Observer for visibility detection
  const observerRef = useRef<IntersectionObserver>()
  
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleSections = new Set(visibleSections)
        
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id')
          if (sectionId) {
            if (entry.isIntersecting) {
              newVisibleSections.add(sectionId)
            } else {
              newVisibleSections.delete(sectionId)
            }
          }
        })
        
        setVisibleSections(newVisibleSections)
      },
      {
        root: containerRef.current,
        rootMargin: '100px 0px', // Load sections 100px before they come into view
        threshold: 0.1
      }
    )
    
    observerRef.current = observer
    
    // Observe all section elements
    const sections = containerRef.current.querySelectorAll('[data-section-id]')
    sections.forEach((section) => observer.observe(section))
    
    return () => {
      observer.disconnect()
    }
  }, [visibleSections])
  
  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolling(true)
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    // Set scrolling to false after scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)
  }, [])
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    // Add passive scroll listener for better performance
    container.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [handleScroll])
  
  // Add scroll optimization classes
  const scrollClasses = isScrolling 
    ? 'overflow-auto will-change-scroll' 
    : 'overflow-auto'
    
  return (
    <div 
      ref={containerRef}
      className={`
        ${scrollClasses}
        ${className}
        scroll-smooth
        scrollbar-hide
        -webkit-overflow-scrolling-touch
      `}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        // Enable hardware acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: 1000
      }}
    >
      <div className="dashboard-container">
        {children}
      </div>
    </div>
  )
}

// Enhanced section wrapper for better performance
interface DashboardSectionProps {
  id: string
  children: React.ReactNode
  className?: string
  delay?: number
}

export function DashboardSection({ 
  id, 
  children, 
  className = '', 
  delay = 0 
}: DashboardSectionProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <motion.div
      ref={sectionRef}
      data-section-id={id}
      className={`dashboard-section content-visibility-auto ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: 'easeOut'
      }}
      style={{
        // Optimize rendering
        containIntrinsicSize: '300px',
        contentVisibility: 'auto'
      }}
    >
      {children}
    </motion.div>
  )
}