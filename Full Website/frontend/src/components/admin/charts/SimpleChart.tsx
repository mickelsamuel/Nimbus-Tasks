'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

interface SimpleBarChartProps {
  data: ChartDataPoint[]
  title: string
  height?: number
}

interface SimpleLineChartProps {
  data: number[]
  labels?: string[]
  title: string
  height?: number
  color?: string
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  title,
  height = 200
}) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="space-y-3" style={{ height }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-20 text-sm text-gray-600 dark:text-gray-400 text-right">
                {item.label}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    item.color || 'bg-blue-500'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {item.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  labels,
  title,
  height = 200,
  color = 'bg-blue-500'
}) => {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="relative" style={{ height }}>
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 dark:border-gray-700" />
          ))}
        </div>

        {/* Chart area */}
        <div className="relative h-full flex items-end gap-1">
          {data.map((value, index) => {
            const heightPercentage = ((value - minValue) / range) * 100
            
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${heightPercentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex-1 ${color} rounded-t-sm min-h-[2px]`}
                title={`${labels?.[index] || index}: ${value}`}
              />
            )
          })}
        </div>

        {/* Labels */}
        {labels && (
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            {labels.map((label, index) => (
              <span key={index} className="text-center">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const SimplePieChart: React.FC<{
  data: ChartDataPoint[]
  title: string
  size?: number
}> = ({ data, title, size = 120 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  let cumulativePercentage = 0
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100
    const startAngle = (cumulativePercentage / 100) * 360
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360
    
    cumulativePercentage += percentage
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle
    }
  })

  const radius = size / 2 - 10
  const centerX = size / 2
  const centerY = size / 2

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {segments.map((segment, index) => {
              const startAngleRad = (segment.startAngle * Math.PI) / 180
              const endAngleRad = (segment.endAngle * Math.PI) / 180
              
              const x1 = centerX + radius * Math.cos(startAngleRad)
              const y1 = centerY + radius * Math.sin(startAngleRad)
              const x2 = centerX + radius * Math.cos(endAngleRad)
              const y2 = centerY + radius * Math.sin(endAngleRad)
              
              const largeArcFlag = segment.percentage > 50 ? 1 : 0
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ')

              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={segment.color || `hsl(${index * 60}, 70%, 50%)`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              )
            })}
          </svg>
        </div>

        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {segment.label} ({segment.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}