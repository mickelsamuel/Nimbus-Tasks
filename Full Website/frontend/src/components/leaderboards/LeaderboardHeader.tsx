'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LeaderboardHeaderProps {
  currentSeason?: string
  daysUntilEnd?: number
  activeCompetitors?: number
}

export default function LeaderboardHeader({ 
  currentSeason = '-',
  daysUntilEnd = 0,
  activeCompetitors = 0
}: LeaderboardHeaderProps) {
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Victory Spotlight Effect */}
      <div className="absolute inset-0">
        <div className="victory-spotlight" />
        <div className="victory-spotlight" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header Content */}
      <div 
        className="championship-arena-header relative z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 140, 0, 0.15) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '24px',
          padding: '32px',
          margin: '24px',
          overflow: 'hidden'
        }}
      >
        {/* Title Section */}
        <div className="text-center mb-6">
          <motion.h1 
            className="championship-title text-3xl sm:text-4xl lg:text-6xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
              marginBottom: '16px'
            }}
          >
            Championship Arena
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-yellow-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Compete, Achieve, and Rise to Excellence
          </motion.p>
        </div>

        {/* Live Competition Ticker */}
        <div className="competition-ticker">
          <div className="ticker-content">
            No live updates available at this time •
          </div>
        </div>

        {/* Season Championship Tracker */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-300">{currentSeason}</div>
            <div className="text-xs sm:text-sm text-yellow-200/70">Current Season</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-yellow-300/30" />
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-300">{daysUntilEnd} Days</div>
            <div className="text-xs sm:text-sm text-yellow-200/70">Until Season End</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-yellow-300/30" />
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-300">{activeCompetitors.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-yellow-200/70">Active Competitors</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .victory-spotlight {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 400px;
          background: linear-gradient(180deg,
            rgba(255, 215, 0, 0.3) 0%,
            transparent 100%);
          border-radius: 50%;
          animation: spotlight-sweep 8s ease-in-out infinite;
        }

        @keyframes spotlight-sweep {
          0%, 100% { left: 50%; opacity: 0.5; }
          25% { left: 20%; opacity: 0.8; }
          50% { left: 50%; opacity: 1; }
          75% { left: 80%; opacity: 0.8; }
        }

        .ticker-content {
          white-space: nowrap;
          animation: scroll-ticker 30s linear infinite;
          padding-left: 100%;
          color: #FFD700;
          font-weight: 600;
        }

        @keyframes scroll-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </motion.div>
  )
}