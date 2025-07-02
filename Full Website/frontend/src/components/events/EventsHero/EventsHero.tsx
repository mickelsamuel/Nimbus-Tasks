'use client'

import { Trophy, Zap, Users, Star, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

interface EventsHeroProps {
  liveEventCount?: number
  activeParticipants?: number
  todayChampionships?: number
  satisfactionRate?: number
}

export default function EventsHero({ 
  liveEventCount = 0, 
  activeParticipants = 0, 
  todayChampionships = 0,
  satisfactionRate = 0 
}: EventsHeroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 dark:from-red-800 dark:via-red-700 dark:to-orange-600"
      style={{
        borderRadius: '0 0 3rem 3rem'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-yellow-400/20 via-orange-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-pink-400/15 via-red-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/10 via-yellow-400/5 to-transparent rounded-full"
        />
      </div>
      
      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Trophy className="w-12 h-12 text-yellow-300" />
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight"
            style={{
              textShadow: '0 8px 16px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.3)'
            }}
          >
            Events & Championships
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium"
            style={{
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            Compete, learn, and excel in our comprehensive event ecosystem designed for banking professionals
          </motion.p>
        </motion.div>

        {/* Enhanced Quick Stats */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          <motion.div 
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              rotateY: 5
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center shadow-2xl hover:bg-white/15 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div 
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-yellow-400/20 rounded-2xl flex items-center justify-center mb-4 mx-auto relative z-10"
              >
                <Zap className="w-8 h-8 text-yellow-300" />
              </motion.div>
              
              <div className="relative z-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      '0 0 0px rgba(255, 215, 0, 0)',
                      '0 0 20px rgba(255, 215, 0, 0.8)',
                      '0 0 0px rgba(255, 215, 0, 0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  {liveEventCount}
                </motion.div>
                <div className="text-sm text-white/80 font-semibold uppercase tracking-wider">Live Events</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              rotateY: 5
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center shadow-2xl hover:bg-white/15 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div 
                animate={{ 
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-blue-400/20 rounded-2xl flex items-center justify-center mb-4 mx-auto relative z-10"
              >
                <Users className="w-8 h-8 text-blue-300" />
              </motion.div>
              
              <div className="relative z-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    color: ['#ffffff', '#93c5fd', '#ffffff']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  {activeParticipants.toLocaleString()}
                </motion.div>
                <div className="text-sm text-white/80 font-semibold uppercase tracking-wider">Active Participants</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              rotateY: 5
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center shadow-2xl hover:bg-white/15 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div 
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-orange-400/20 rounded-2xl flex items-center justify-center mb-4 mx-auto relative z-10"
              >
                <Crown className="w-8 h-8 text-orange-300" />
              </motion.div>
              
              <div className="relative z-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      '0 0 0px rgba(251, 146, 60, 0)',
                      '0 0 20px rgba(251, 146, 60, 0.8)',
                      '0 0 0px rgba(251, 146, 60, 0)'
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  {todayChampionships}
                </motion.div>
                <div className="text-sm text-white/80 font-semibold uppercase tracking-wider">Today&apos;s Championships</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              rotateY: 5
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center shadow-2xl hover:bg-white/15 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 bg-purple-400/20 rounded-2xl flex items-center justify-center mb-4 mx-auto relative z-10"
              >
                <Star className="w-8 h-8 text-purple-300" />
              </motion.div>
              
              <div className="relative z-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    color: ['#ffffff', '#c084fc', '#ffffff']
                  }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  {satisfactionRate}%
                </motion.div>
                <div className="text-sm text-white/80 font-semibold uppercase tracking-wider">Satisfaction Rate</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}