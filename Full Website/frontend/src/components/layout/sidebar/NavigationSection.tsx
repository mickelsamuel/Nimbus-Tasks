'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import NavigationItem from './NavigationItem'
import { NavSection } from '../types'

interface NavigationSectionProps {
  section: NavSection
  sectionIndex: number
  isCollapsed: boolean
  collapsedSections: string[]
  hoveredItem: string | null
  pathname: string
  onToggleSection: (sectionId: string) => void
  onHoverItem: (itemId: string | null) => void
  className?: string
}

export default function NavigationSection({
  section,
  sectionIndex,
  isCollapsed,
  collapsedSections,
  hoveredItem,
  pathname,
  onToggleSection,
  onHoverItem,
  className = ''
}: NavigationSectionProps) {
  return (
    <motion.div
      key={section.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
      className={`mb-6 ${className}`}
    >
      {/* Section Header */}
      {!isCollapsed && (
        <motion.button
          onClick={() => onToggleSection(section.id)}
          className="relative mb-2 flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
          whileHover={{ x: 2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {section.icon}
            </motion.div>
            <span className="relative">
              {section.title}
              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-primary-500 to-primary-600"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </span>
          </div>
          <motion.div
            animate={{ rotate: collapsedSections.includes(section.id) ? -90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-3 w-3" />
          </motion.div>
        </motion.button>
      )}

      {/* Section Items */}
      <AnimatePresence>
        {(!collapsedSections.includes(section.id) || isCollapsed) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            {section.items.map((item, itemIndex) => (
              <NavigationItem
                key={item.id}
                item={item}
                itemIndex={itemIndex}
                isActive={pathname === item.href}
                isHovered={hoveredItem === item.id}
                isCollapsed={isCollapsed}
                onHover={onHoverItem}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}