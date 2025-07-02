'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Users, Coins, Star } from 'lucide-react'
import UserAvatar from '@/components/ui/UserAvatar'
import { useAuth } from '@/contexts/AuthContext'

interface PowerUp {
  id: number
  name: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
  duration?: string
}

interface GameProfile {
  username: string
  level: number
  xp: number
  xpToNext: number
  rank: string
  rankColor: string
  coins: number
  tokens: number
  streak: number
  achievements: number
  totalAchievements: number
  guild: string
  powerUps: PowerUp[]
}

interface PlayerProfileProps {
  gameProfile: GameProfile
  xpAnimation: boolean
  activatePowerUp: (powerUpId: number) => void
}

export default function PlayerProfile({ 
  gameProfile, 
  xpAnimation, 
  activatePowerUp 
}: PlayerProfileProps) {
  const { user } = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div 
        className="rounded-3xl p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23E01A1A%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M0 0h20v20H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Player Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1">
            {/* Avatar with level */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  {user ? (
                    <UserAvatar
                      user={{
                        avatar: user.avatar,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        level: gameProfile.level,
                        isOnline: true,
                        hasCompletedAvatarSetup: user.hasCompletedAvatarSetup
                      }}
                      size="2xl"
                      showSetupPrompt={false}
                      animationType="glow"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-3xl sm:text-5xl text-white">{gameProfile.username[0]}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Level badge */}
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-white shadow-lg text-sm sm:text-base"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {gameProfile.level}
              </motion.div>

              {/* Rank emblem */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <motion.div
                  className={`px-3 py-1 rounded-full bg-gradient-to-r ${gameProfile.rankColor} text-xs font-bold text-white shadow-lg`}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {gameProfile.rank}
                </motion.div>
              </div>
            </motion.div>

            {/* Player Stats */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome back, {gameProfile.username}!
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-gray-300 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>{gameProfile.achievements}/{gameProfile.totalAchievements} Achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span>{gameProfile.streak} Day Streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>{gameProfile.guild}</span>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Level {gameProfile.level}</span>
                  <span className="text-gray-400">Level {gameProfile.level + 1}</span>
                </div>
                <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(gameProfile.xp / gameProfile.xpToNext) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  {xpAnimation && (
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-purple-400">{gameProfile.xp} XP</span>
                  <span className="text-gray-500">{gameProfile.xpToNext - gameProfile.xp} to next level</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resources & Power-ups */}
          <div className="space-y-4">
            {/* Resources */}
            <div className="flex gap-4">
              <motion.div 
                className="bg-gray-800/50 rounded-xl px-4 py-2 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-500 font-bold">{gameProfile.coins.toLocaleString()}</span>
              </motion.div>
              <motion.div 
                className="bg-gray-800/50 rounded-xl px-4 py-2 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="h-5 w-5 text-purple-500" />
                <span className="text-purple-500 font-bold">{gameProfile.tokens}</span>
              </motion.div>
            </div>


            {/* Active Power-ups */}
            <div className="flex gap-2">
              {gameProfile.powerUps.map((powerUp) => (
                <motion.div
                  key={powerUp.id}
                  className={`relative p-2 rounded-lg cursor-pointer transition-all ${
                    powerUp.active
                      ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/50'
                      : 'bg-gray-800/50 opacity-50 hover:opacity-70'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => activatePowerUp(powerUp.id)}
                  title={`${powerUp.name} - Click to ${powerUp.active ? 'deactivate' : 'activate'}`}
                >
                  <powerUp.icon className="h-6 w-6 text-white" />
                  {powerUp.active && powerUp.duration && (
                    <span className="absolute -bottom-1 -right-1 text-xs bg-purple-600 rounded px-1">
                      {powerUp.duration}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}