'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Crown, Medal, Award, Sparkles } from 'lucide-react'

interface PodiumUser {
  id: number
  name: string
  avatar: string
  score: number
  department?: string
  streak?: number
  achievements?: number
}

interface ChampionsPodiumProps {
  first?: PodiumUser
  second?: PodiumUser
  third?: PodiumUser
  loading?: boolean
}

export default function ChampionsPodium({ 
  first, 
  second, 
  third, 
  loading = false 
}: ChampionsPodiumProps) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 dark:border-slate-700 animate-pulse">
          <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <motion.div
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <motion.div
          className="text-center mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-amber-500" />
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400">
              Top Performers
            </h2>
            <Crown className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Celebrating our leading achievers
          </p>
        </motion.div>

        {/* Podium Display */}
        <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-8 h-80">
          {/* Second Place */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="relative mb-4 group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-slate-300 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-700 shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src={second?.avatar || '/avatars/default.jpg'} 
                  alt={second?.name || 'TBD'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center shadow-lg">
                <Medal className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 w-32 sm:w-36 h-32 flex flex-col items-center justify-end text-center shadow-lg border border-slate-200 dark:border-slate-600">
              <div className="text-2xl font-black text-slate-700 dark:text-slate-200 mb-1">2</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 truncate w-full">{second?.name || 'TBD'}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{second?.score?.toLocaleString() || 0} XP</div>
            </div>
          </motion.div>

          {/* First Place */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="relative mb-4 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 overflow-hidden bg-white dark:bg-slate-700 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src={first?.avatar || '/avatars/default.jpg'} 
                  alt={first?.name || 'TBD'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-pulse" />
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl p-6 w-36 sm:w-40 h-40 flex flex-col items-center justify-end text-center shadow-2xl border border-amber-200 dark:border-amber-700 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="text-3xl font-black text-amber-700 dark:text-amber-300 mb-1">1</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate w-full">{first?.name || 'TBD'}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{first?.score?.toLocaleString() || 0} XP</div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-amber-600 dark:text-amber-400">Champion</span>
              </div>
            </div>
          </motion.div>

          {/* Third Place */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <div className="relative mb-4 group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-600 overflow-hidden bg-white dark:bg-slate-700 shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src={third?.avatar || '/avatars/default.jpg'} 
                  alt={third?.name || 'TBD'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
                <Award className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl p-6 w-32 sm:w-36 h-28 flex flex-col items-center justify-end text-center shadow-lg border border-amber-200 dark:border-amber-700">
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mb-1">3</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 truncate w-full">{third?.name || 'TBD'}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{third?.score?.toLocaleString() || 0} XP</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}