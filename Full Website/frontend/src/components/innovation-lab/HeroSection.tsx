import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Code, 
  Calculator, 
  Brain, 
  Zap, 
  Target, 
  Gamepad2, 
  Award,
  Users,
  Clock,
  Star,
  ChevronRight,
  Play,
  TrendingUp
} from 'lucide-react';

const ChallengeHubHero = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  
  const featuredChallenges = [
    {
      title: "AI Trading Bot Challenge",
      category: "Finance",
      prize: "$25,000",
      participants: 2847,
      timeLeft: "3d 14h",
      difficulty: "Expert",
      icon: TrendingUp,
      color: "from-emerald-400 to-cyan-500"
    },
    {
      title: "Quantum Algorithm Sprint",
      category: "Coding",
      prize: "$15,000",
      participants: 1923,
      timeLeft: "7d 02h",
      difficulty: "Advanced",
      icon: Zap,
      color: "from-purple-400 to-pink-500"
    },
    {
      title: "Blockchain Security Audit",
      category: "Security",
      prize: "$30,000",
      participants: 1456,
      timeLeft: "12d 08h",
      difficulty: "Expert",
      icon: Zap,
      color: "from-orange-400 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChallenge((prev) => (prev + 1) % featuredChallenges.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredChallenges.length]);

  const floatingIcons = [
    { icon: Code, delay: 0 },
    { icon: Calculator, delay: 1 },
    { icon: Brain, delay: 2 },
    { icon: Trophy, delay: 3 },
    { icon: Target, delay: 4 },
    { icon: Gamepad2, delay: 5 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:100px_100px]" />
        
        {/* Moving Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Challenge Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
              rotate: 0,
            }}
            animate={{
              y: -200,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: item.delay * 2,
              ease: "linear"
            }}
          >
            <item.icon className="w-12 h-12 text-white/10" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Platform Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="mb-8 inline-flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-2xl opacity-60 animate-pulse" />
              <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-full shadow-2xl border border-white/20">
                <Trophy className="w-20 h-20 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200">
              Challenge
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              Arena
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-3xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Compete in cutting-edge challenges, solve complex problems, and win incredible rewards. 
            <span className="text-yellow-400 font-semibold"> Your skills, our stage.</span>
          </motion.p>

          {/* Featured Challenge Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-sm text-blue-300 mb-4 flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                Featured Challenge
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChallenge}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {(() => {
                    const challenge = featuredChallenges[currentChallenge];
                    const IconComponent = challenge.icon;
                    return (
                      <>
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className={`p-3 bg-gradient-to-r ${challenge.color} rounded-xl`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-2xl font-bold text-white">{challenge.title}</h3>
                            <p className="text-blue-300">{challenge.category}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-400">{challenge.prize}</div>
                            <div className="text-sm text-gray-400">Prize Pool</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-400">{challenge.participants}</div>
                            <div className="text-sm text-gray-400">Participants</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-400">{challenge.timeLeft}</div>
                            <div className="text-sm text-gray-400">Time Left</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-400">{challenge.difficulty}</div>
                            <div className="text-sm text-gray-400">Difficulty</div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {featuredChallenges.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChallenge(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentChallenge 
                        ? 'bg-white shadow-lg scale-125' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-full overflow-hidden shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-6 h-6" />
                Start Competing
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-bold text-lg rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
            >
              Browse Challenges
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Users, label: "Active Competitors", value: "50K+", color: "text-blue-400" },
              { icon: Trophy, label: "Challenges Won", value: "25K+", color: "text-yellow-400" },
              { icon: Award, label: "Total Prizes", value: "$2.5M+", color: "text-green-400" },
              { icon: Clock, label: "Live Events", value: "127", color: "text-purple-400" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                className="text-center group cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-12 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-2 h-4 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChallengeHubHero;