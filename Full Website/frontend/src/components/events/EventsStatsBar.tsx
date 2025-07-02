'use client'

import { TrendingUp, Users, Calendar, Trophy, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

interface EventsStatsBarProps {
  stats: {
    liveEvents: number
    activeParticipants: number
    todayChampionships: number
    weeklyEvents?: number
    trends?: {
      liveEventsTrend?: string
      participantsTrend?: string
      championshipsTrend?: string
      weeklyTrend?: string
    }
  }
}

export default function EventsStatsBar({ stats }: EventsStatsBarProps) {
  const statItems = [
    {
      icon: TrendingUp,
      label: 'Live Events',
      value: stats.liveEvents,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10 dark:bg-red-500/20',
      trend: stats.trends?.liveEventsTrend || 'No change'
    },
    {
      icon: Users,
      label: 'Active Participants',
      value: stats.activeParticipants.toLocaleString(),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
      trend: stats.trends?.participantsTrend || 'No change'
    },
    {
      icon: Trophy,
      label: 'Championships Today',
      value: stats.todayChampionships,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10 dark:bg-yellow-500/20',
      trend: stats.trends?.championshipsTrend || 'No change'
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: stats.weeklyEvents || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10 dark:bg-green-500/20',
      trend: stats.trends?.weeklyTrend || 'Total events'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.1, 
            type: "spring", 
            stiffness: 300,
            damping: 20
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -5,
            rotateY: 5,
            transition: { type: "spring", stiffness: 400 }
          }}
          className="group relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/90 dark:from-slate-800/90 dark:via-slate-700/70 dark:to-slate-800/90 backdrop-blur-xl rounded-3xl" />
          <div className="absolute inset-0 border border-white/30 dark:border-slate-700/50 rounded-3xl" />
          
          {/* Hover gradient overlay */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${item.color.replace('text-', '').replace('-500', '')}-500/10, transparent 70%)`
            }}
          />
          
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-6">
              <motion.div 
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
                className={`${item.bgColor} p-4 rounded-2xl shadow-lg relative overflow-hidden`}
              >
                {/* Icon glow effect */}
                <div className={`absolute inset-0 ${item.bgColor} blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                <item.icon className={`w-7 h-7 ${item.color} relative z-10`} />
              </motion.div>
              
              <div className="text-right">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      '0 0 0px rgba(59, 130, 246, 0)',
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 0px rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                  className="text-3xl font-black text-gray-900 dark:text-white"
                >
                  {item.value}
                </motion.div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-base font-bold text-gray-700 dark:text-gray-200">
                {item.label}
              </div>
              <motion.div 
                whileHover={{ 
                  scale: 1.05,
                  x: 5
                }}
                className={`text-sm ${item.color} font-semibold flex items-center space-x-2`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>{item.trend}</span>
              </motion.div>
            </div>
            
            {/* Animated progress bar */}
            <div className="mt-4 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((parseInt(item.value.toString().replace(/,/g, '')) / 2000) * 100, 100)}%` }}
                transition={{ duration: 2, delay: index * 0.2 }}
                className={`h-full ${item.color.replace('text-', 'bg-')} rounded-full`}
                style={{
                  background: `linear-gradient(90deg, ${item.color.replace('text-', '').replace('-500', '')}-400, ${item.color.replace('text-', '').replace('-500', '')}-600)`
                }}
              />
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [20, -20, 20],
                    x: [0, 10, -10, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity
                  }}
                  className={`absolute w-2 h-2 ${item.color.replace('text-', 'bg-')} rounded-full`}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}