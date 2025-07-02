'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { NavItem } from '../types'

interface NavigationItemProps {
  item: NavItem
  itemIndex: number
  isActive: boolean
  isHovered: boolean
  isCollapsed: boolean
  onHover: (itemId: string | null) => void
  className?: string
}

export default function NavigationItem({
  item,
  itemIndex,
  isActive,
  isHovered,
  isCollapsed,
  onHover,
  className = ''
}: NavigationItemProps) {
  const isLocked = item.locked

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
      className={className}
    >
      <Link
        href={isLocked ? '#' : item.href}
        className={`
          relative flex items-center gap-3 rounded-lg px-3 py-2.5 
          text-gray-700 dark:text-gray-300
          hover:text-gray-900 dark:hover:text-white
          transition-all duration-300 ease-out
          ${isActive ? 'bg-gradient-to-r from-primary-500/10 to-primary-600/5 text-primary-600 dark:text-primary-400 font-semibold' : ''}
          ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}
          ${isCollapsed ? 'justify-center px-2' : ''}
          ${isHovered && !isActive ? 'transform translate-x-1 bg-gradient-to-r from-primary-500/5 to-transparent' : ''}
        `}
        onMouseEnter={() => onHover(item.id)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => isLocked && e.preventDefault()}
      >
        {/* Active indicator bar */}
        <div
          className={`absolute left-0 top-1/2 w-1 h-3/4 -translate-y-1/2 bg-gradient-to-b from-primary-500 to-primary-600 rounded-r transition-transform duration-300 ease-out ${
            isActive ? 'scale-y-100' : 'scale-y-0'
          }`}
        />

        {/* Icon with effects */}
        <motion.div
          className="relative"
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {item.icon}
          
          {/* New badge indicator */}
          {item.new && (
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
          )}
          
          {/* Live indicator */}
          {item.live && (
            <div className="absolute -top-1 -right-1">
              <div className="relative flex h-2 w-2">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <div className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Title and badges */}
        {!isCollapsed && (
          <>
            <span className={`flex-1 font-medium transition-all duration-300 ${
              isActive ? 'font-semibold' : ''
            } ${
              isHovered && !isActive ? 'text-primary-600 dark:text-primary-400' : ''
            }`}>
              {item.title}
            </span>

            {/* Progress indicator */}
            {item.progress !== undefined && (
              <div className="w-12">
                <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Badge */}
            {item.badge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                  rounded-full px-2 py-0.5 text-xs font-semibold
                  ${item.badgeType === 'info' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}
                  ${item.badgeType === 'success' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}
                  ${item.badgeType === 'warning' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}
                  ${item.badgeType === 'danger' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}
                  ${!item.badgeType && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}
                `}
              >
                {item.badge}
              </motion.span>
            )}

            {/* Lock icon */}
            {isLocked && (
              <Shield className="h-4 w-4 text-gray-400" />
            )}
          </>
        )}

        {/* Hover tooltip for collapsed state */}
        {isCollapsed && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full ml-2 z-50 whitespace-nowrap rounded-lg bg-gray-900 dark:bg-gray-800 px-3 py-2 text-sm text-white shadow-lg"
              >
                {item.title}
                {item.badge && (
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Link>
    </motion.div>
  )
}