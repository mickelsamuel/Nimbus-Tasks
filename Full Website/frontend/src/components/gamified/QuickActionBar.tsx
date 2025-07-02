'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, Map, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  path: string
}

export default function QuickActionBar() {
  const router = useRouter()

  const actions: QuickAction[] = [
    { icon: BookOpen, label: 'Training Modules', color: 'from-blue-500 to-cyan-500', path: '/modules' },
    { icon: Users, label: 'Join Team Battle', color: 'from-green-500 to-emerald-500', path: '/teams' },
    { icon: Map, label: 'Career Journey', color: 'from-purple-500 to-pink-500', path: '/career' },
    { icon: Sparkles, label: 'Power-Up Shop', color: 'from-yellow-500 to-orange-500', path: '/shop' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 + index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(action.path)}
          className="relative group overflow-hidden rounded-2xl p-4 sm:p-6"
          style={{
            background: 'linear-gradient(145deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.6) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          {/* Hover Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
          
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-medium text-sm sm:text-base text-center">{action.label}</span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}