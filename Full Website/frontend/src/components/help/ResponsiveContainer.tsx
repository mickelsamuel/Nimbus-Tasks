'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
}

export default function ResponsiveContainer({ 
  children, 
  className = '', 
  maxWidth = 'full',
  padding = 'md',
  animate = true 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md', 
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-full'
  }

  const paddingClasses = {
    'none': '',
    'sm': 'px-2 py-1',
    'md': 'px-4 py-2',
    'lg': 'px-6 py-4', 
    'xl': 'px-8 py-6'
  }

  const baseClasses = `
    w-full 
    ${maxWidthClasses[maxWidth]} 
    ${paddingClasses[padding]} 
    mx-auto 
    ${className}
  `.trim()

  if (animate) {
    return (
      <motion.div
        className={baseClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  )
}