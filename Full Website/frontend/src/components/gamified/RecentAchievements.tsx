'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic'
  unlockedAt: string
}

interface RecentAchievementsProps {
  achievements: Achievement[]
}

export default function RecentAchievements({ achievements }: RecentAchievementsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.8) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
    >
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Award className="h-5 w-5 text-purple-500" />
        Recent Achievements
      </h2>

      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50"
          >
            {/* Achievement Icon */}
            <motion.div
              className={`text-3xl p-2 rounded-xl ${
                achievement.rarity === 'common' ? 'bg-gray-700' :
                achievement.rarity === 'rare' ? 'bg-blue-600/20' :
                'bg-purple-600/20'
              }`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            >
              {achievement.icon}
            </motion.div>

            {/* Achievement Details */}
            <div className="flex-1">
              <p className="text-white font-medium">{achievement.name}</p>
              <p className="text-gray-400 text-xs">{achievement.description}</p>
              <p className="text-gray-500 text-xs mt-1">{achievement.unlockedAt}</p>
            </div>

            {/* Rarity Indicator */}
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              achievement.rarity === 'common' ? 'bg-gray-700 text-gray-300' :
              achievement.rarity === 'rare' ? 'bg-blue-600/20 text-blue-400' :
              'bg-purple-600/20 text-purple-400'
            }`}>
              {achievement.rarity.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 font-medium hover:bg-purple-600/30 transition-colors">
        View All Achievements
      </button>
    </motion.div>
  )
}