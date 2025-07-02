'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text'
  animation?: 'pulse' | 'wave' | 'none'
  lines?: number
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
  lines = 1
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    text: 'rounded-sm h-4'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]}`}
            style={{
              width: index === lines - 1 ? '75%' : '100%',
              height: '1rem'
            }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: animation === 'pulse' ? [0.6, 1, 0.6] : 1 }}
      transition={{
        duration: 1.5,
        repeat: animation === 'pulse' ? Infinity : 0,
        ease: 'easeInOut'
      }}
    />
  )
}

// Predefined skeleton components for common use cases
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => <Skeleton variant="text" lines={lines} className={className} />

export const CircleSkeleton: React.FC<{ size?: number; className?: string }> = ({ 
  size = 40, 
  className 
}) => <Skeleton variant="circular" width={size} height={size} className={className} />

export const RectangleSkeleton: React.FC<{ 
  width?: string | number; 
  height?: string | number; 
  className?: string 
}> = ({ width, height, className }) => (
  <Skeleton variant="rounded" width={width} height={height} className={className} />
)

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="flex items-start space-x-4">
      <CircleSkeleton size={48} />
      <div className="flex-1 space-y-3">
        <TextSkeleton lines={1} />
        <TextSkeleton lines={2} />
        <div className="flex space-x-2">
          <RectangleSkeleton width={80} height={24} />
          <RectangleSkeleton width={60} height={24} />
        </div>
      </div>
    </div>
  </div>
)

export const TableRowSkeleton: React.FC<{ columns?: number; className?: string }> = ({ 
  columns = 4, 
  className 
}) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <TextSkeleton />
      </td>
    ))}
  </tr>
)

export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center space-x-3 p-4 ${className}`}>
    <CircleSkeleton size={32} />
    <div className="flex-1">
      <TextSkeleton lines={1} />
      <div className="mt-1">
        <TextSkeleton lines={1} />
      </div>
    </div>
  </div>
)

export const ButtonSkeleton: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string 
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  }
  
  return (
    <RectangleSkeleton 
      className={`${sizeClasses[size]} ${className}`}
    />
  )
}

export const AvatarSkeleton: React.FC<{ 
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
  className?: string 
}> = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
  }
  
  return <CircleSkeleton size={sizeMap[size]} className={className} />
}

export const StatCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <TextSkeleton lines={1} />
        <RectangleSkeleton width={60} height={32} />
      </div>
      <CircleSkeleton size={40} />
    </div>
  </div>
)

export const ChartSkeleton: React.FC<{ 
  height?: number; 
  className?: string 
}> = ({ height = 200, className }) => (
  <div className={`p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="space-y-4">
      <TextSkeleton lines={1} />
      <RectangleSkeleton width="100%" height={height} />
      <div className="flex justify-center space-x-4">
        <RectangleSkeleton width={80} height={20} />
        <RectangleSkeleton width={80} height={20} />
        <RectangleSkeleton width={80} height={20} />
      </div>
    </div>
  </div>
)

export default Skeleton