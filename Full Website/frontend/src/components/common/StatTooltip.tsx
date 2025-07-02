'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'

interface StatTooltipProps {
  title: string
  description: string
  calculation?: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function StatTooltip({ 
  title, 
  description, 
  calculation, 
  children, 
  position = 'top' 
}: StatTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-1">
        {children}
        <Info className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
      </div>
      
      {showTooltip && (
        <div className={`absolute z-50 ${positionClasses[position]} w-72`}>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {description}
            </p>
            {calculation && (
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-2">
                <strong>Calculation:</strong> {calculation}
              </div>
            )}
            {/* Arrow */}
            <div className={`absolute w-2 h-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-0 border-r-0' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-0 border-b-0' :
              'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-0 border-t-0'
            }`} />
          </div>
        </div>
      )}
    </div>
  )
}