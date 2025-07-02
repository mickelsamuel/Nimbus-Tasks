'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Users, Trophy } from 'lucide-react';

interface InnovationLabHeroProps {
  onCreateChallenge: () => void;
  showButton?: boolean;
}

export default function InnovationLabHero({ onCreateChallenge, showButton = true }: InnovationLabHeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-50"
              />
              <Rocket className="relative w-24 h-24 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Innovation Lab
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Where groundbreaking ideas come to life. Submit challenges, collaborate with teams, and transform the future of our workplace.
          </p>

          <div className="flex flex-wrap gap-6 justify-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3"
            >
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">50+ Active Challenges</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3"
            >
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">200+ Innovators</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3"
            >
              <Trophy className="w-6 h-6 text-green-400" />
              <span className="text-white font-semibold">$100k+ in Rewards</span>
            </motion.div>
          </div>

          {showButton && (
            <motion.button
              onClick={onCreateChallenge}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Your Innovation Challenge
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"
        />
      </div>
    </section>
  );
}