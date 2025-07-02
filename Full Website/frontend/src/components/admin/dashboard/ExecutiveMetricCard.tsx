'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  TrendingUp
} from 'lucide-react'
import { MetricCardProps } from '../types'
import { getStatusColor } from '../styles'
import { useOptimizedAnimations } from '@/hooks/useOptimizedAnimations'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return CheckCircle
    case 'warning':
      return AlertTriangle
    case 'critical':
      return AlertCircle
    default:
      return Info
  }
}

export const ExecutiveMetricCard = ({ metric, index }: MetricCardProps) => {
  const StatusIcon = getStatusIcon(metric.status)
  const { animations } = useOptimizedAnimations()

  return (
    <motion.div
      initial={animations.scaleIn.initial}
      animate={animations.scaleIn.animate}
      transition={{ 
        ...animations.transition.default,
        delay: index * 0.05
      }}
      whileHover={animations.hover.whileHover}
      className="group executive-metric-card relative overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Background Effects - Simplified */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor(metric.status)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className={`p-2 rounded-xl bg-gradient-to-br ${getStatusColor(metric.status)} shadow-lg`}>
              <StatusIcon className="h-5 w-5 text-white" />
            </div>

            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {metric.label}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                {metric.status}
              </p>
            </div>
          </div>

          {/* Change Indicator */}
          {metric.change !== 0 && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
              metric.change > 0 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              <TrendingUp className={`h-3 w-3 ${metric.change < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(metric.change)}%
            </div>
          )}
        </div>

        {/* Value Display */}
        <div className="mb-4">
          <div className="metric-value">
            {metric.value}
          </div>
        </div>

        {/* Mini Chart */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Trend (24h)
            </span>
          </div>
          
          <div className="relative h-8 flex items-end gap-1">
            {metric.trend.map((point, i) => {
              const maxValue = Math.max(...metric.trend)
              const height = (point / maxValue) * 100
              
              return (
                <div
                  key={i}
                  className={`flex-1 bg-gradient-to-t ${getStatusColor(metric.status)} rounded-sm`}
                  style={{ height: `${height}%` }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}