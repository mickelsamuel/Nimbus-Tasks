'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Coins, Star, Clock, Play, Target } from 'lucide-react'

interface Quest {
  id: number
  title: string
  description: string
  progress: number
  total: number
  xpReward: number
  coinReward: number
  tokenReward?: number
  difficulty: string
  timeLeft: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface QuestCardProps {
  quest: Quest
  index: number
  selectedQuest: string | null
  onQuestSelect: (questId: number) => void
  onStartQuest: (questId: number) => void
  onQuestProgress: (questId: number) => void
}

export default function QuestCard({
  quest,
  index,
  selectedQuest,
  onQuestSelect,
  onStartQuest,
  onQuestProgress
}: QuestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div 
        className="rounded-2xl p-6 cursor-pointer transition-all duration-300"
        style={{
          background: selectedQuest === quest.id.toString()
            ? 'linear-gradient(145deg, rgba(147,51,234,0.2) 0%, rgba(217,70,239,0.1) 100%)'
            : 'linear-gradient(145deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.6) 100%)',
          backdropFilter: 'blur(10px)',
          border: selectedQuest === quest.id.toString()
            ? '2px solid rgba(147,51,234,0.5)'
            : '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
        onClick={() => onQuestSelect(quest.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Quest Icon */}
            <motion.div
              className={`p-3 rounded-xl bg-gradient-to-br ${quest.color}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <quest.icon className="h-6 w-6 text-white" />
            </motion.div>

            {/* Quest Details */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{quest.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">
                    {quest.progress}/{quest.total}
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${quest.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Rewards */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-purple-400 font-medium">+{quest.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-400 font-medium">+{quest.coinReward}</span>
                </div>
                {quest.tokenReward && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-purple-500" />
                    <span className="text-purple-400 font-medium">+{quest.tokenReward}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-400 text-sm">{quest.timeLeft}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            quest.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
            quest.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {quest.difficulty}
          </div>
        </div>

        {/* Action Button */}
        <AnimatePresence>
          {selectedQuest === quest.id.toString() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-700"
            >
              <div className="flex gap-2">
                <button 
                  onClick={() => onStartQuest(quest.id)}
                  className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${quest.color} text-white font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform`}
                >
                  <Play className="h-5 w-5" />
                  Start Quest
                </button>
                <button 
                  onClick={() => onQuestProgress(quest.id)}
                  disabled={quest.progress >= quest.total}
                  className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <Target className="h-4 w-4" />
                  {quest.progress >= quest.total ? 'Complete' : '+1'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}