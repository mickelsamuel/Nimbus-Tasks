'use client'

import React from 'react'

interface TimeframeFilterProps {
  activeTimeframe: string
  onTimeframeChange: (timeframe: string) => void
  options?: string[]
}

const defaultOptions = ['day', 'week', 'month', 'all']

export default function TimeframeFilter({ 
  activeTimeframe, 
  onTimeframeChange, 
  options = defaultOptions 
}: TimeframeFilterProps) {
  return (
    <div className="flex flex-wrap justify-center mb-6 gap-2">
      {options.map((period) => (
        <button
          key={period}
          onClick={() => onTimeframeChange(period)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTimeframe === period
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
          }`}
        >
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </button>
      ))}
    </div>
  )
}