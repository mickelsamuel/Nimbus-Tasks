'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { UserProfile } from '../types'

interface ProfileStatsProps {
  user: UserProfile
}

interface StatCardProps {
  value: string | number
  label: string
  delay: number
}

function StatCard({ value, label, delay }: StatCardProps) {
  return (
    <motion.div 
      className="text-center rounded-xl p-4 border border-white/20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)'
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
      />
      <div className="relative z-10">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-white/70 text-sm">{label}</div>
      </div>
    </motion.div>
  )
}

interface BadgeProps {
  icon: string
  label: string
  gradient: string
  delay: number
}

function Badge({ icon, label, gradient, delay }: BadgeProps) {
  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg ${gradient}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 500 }}
      whileHover={{ scale: 1.05 }}
    >
      <span>{icon}</span>
      {label}
    </motion.div>
  )
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  // Use user's actual badges if available, otherwise show empty array
  const badges = user.badges?.map((badge, index) => ({
    icon: badge.icon || '🏆',
    label: badge.name || badge.title || 'Achievement',
    gradient: `bg-gradient-to-r ${badge.color || 'from-blue-500 to-blue-700'}`,
    delay: 0.8 + (index * 0.2)
  })) || []

  const stats = [
    { value: user.stats.modulesCompleted, label: 'Modules', delay: 0 },
    { value: `${user.stats.learningHours}h`, label: 'Learning', delay: 0.5 },
    { value: user.stats.currentStreak, label: 'Day Streak', delay: 1.0 },
    { value: (user.stats.totalXP || user.stats.xp || 0).toLocaleString(), label: 'XP', delay: 1.5 }
  ]

  return (
    <motion.div
      className="lg:ml-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {/* Executive Status Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {badges.map((badge, index) => (
          <Badge
            key={index}
            icon={badge.icon}
            label={badge.label}
            gradient={badge.gradient}
            delay={badge.delay}
          />
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            value={stat.value}
            label={stat.label}
            delay={stat.delay}
          />
        ))}
      </div>
    </motion.div>
  )
}