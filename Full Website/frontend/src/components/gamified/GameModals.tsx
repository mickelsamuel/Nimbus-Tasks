'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

interface Quest {
  title: string
  xpReward: number
  coinReward: number
}

interface GameModalsProps {
  showQuestComplete: boolean
  completedQuest: Quest | null
  showXPGain: boolean
  xpGained: number
  showLevelUp: boolean
  currentLevel: number
  onCloseLevelUp: () => void
}

export default function GameModals({
  showQuestComplete,
  completedQuest,
  showXPGain,
  xpGained,
  showLevelUp,
  currentLevel,
  onCloseLevelUp
}: GameModalsProps) {
  return (
    <>
      {/* Quest Completion Modal */}
      <AnimatePresence>
        {showQuestComplete && completedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-2xl max-w-md mx-4 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Quest Complete!</h3>
              <p className="text-lg text-green-100 mb-4">{completedQuest.title}</p>
              <div className="flex justify-center gap-4 mb-4">
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-yellow-300 font-bold">+{completedQuest.xpReward} XP</span>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-yellow-300 font-bold">+{completedQuest.coinReward} Coins</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Gain Notification */}
      <AnimatePresence>
        {showXPGain && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 right-4 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl shadow-lg z-50"
          >
            <div className="flex items-center gap-2 text-white font-bold">
              <Zap className="h-5 w-5 text-yellow-300" />
              +{xpGained} XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-5xl font-bold text-white mb-2">LEVEL UP!</h2>
              <p className="text-2xl text-gray-300">You&apos;ve reached Level {currentLevel}</p>
              <button
                onClick={onCloseLevelUp}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}