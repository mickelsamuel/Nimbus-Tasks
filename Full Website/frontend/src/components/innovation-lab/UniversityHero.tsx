import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Trophy, Globe, Sparkles } from 'lucide-react';

const UniversityHero = () => {
  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/10 to-transparent"
          animate={{
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
            }}
            animate={{
              y: -200,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              delay: i * 3,
              ease: "linear"
            }}
          >
            {i % 3 === 0 ? (
              <GraduationCap className="w-8 h-8 text-white/20" />
            ) : i % 3 === 1 ? (
              <BookOpen className="w-8 h-8 text-white/20" />
            ) : (
              <Trophy className="w-8 h-8 text-white/20" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* University Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8 inline-flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-2xl">
                <GraduationCap className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
              Excellence Academy
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-12 max-w-3xl mx-auto"
          >
            Empowering tomorrow&apos;s leaders through innovative education and cutting-edge research
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="group relative px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <span className="relative z-10">Explore Programs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore Programs
              </span>
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-600 transform hover:scale-105 transition-all duration-300">
              Virtual Tour
            </button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Users, label: "Students", value: "15,000+" },
              { icon: Globe, label: "Countries", value: "120+" },
              { icon: Trophy, label: "Rankings", value: "Top 10" },
              { icon: Sparkles, label: "Programs", value: "200+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UniversityHero;