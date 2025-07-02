import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Clock, 
  Star, 
  Zap, 
  Target,
  Award,
  Gift,
  Code,
  Calculator,
  Brain
} from 'lucide-react';

const ChallengeStats = () => {
  const [animatedValues, setAnimatedValues] = useState({
    participants: 0,
    challenges: 0,
    totalPrizes: 0,
    winRate: 0,
    activeEvents: 0,
    avgRating: 0
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      participants: 47582,
      challenges: 847,
      totalPrizes: 2500000,
      winRate: 94,
      activeEvents: 127,
      avgRating: 4.8
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        participants: Math.floor(targets.participants * easeOut),
        challenges: Math.floor(targets.challenges * easeOut),
        totalPrizes: Math.floor(targets.totalPrizes * easeOut),
        winRate: Math.floor(targets.winRate * easeOut),
        activeEvents: Math.floor(targets.activeEvents * easeOut),
        avgRating: Number((targets.avgRating * easeOut).toFixed(1))
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Users,
      value: `${(animatedValues.participants / 1000).toFixed(0)}K+`,
      label: "Active Competitors",
      color: "from-blue-400 to-cyan-500",
      description: "worldwide participants",
      bgPattern: "bg-blue-500/10"
    },
    {
      icon: Trophy,
      value: `${animatedValues.challenges}+`,
      label: "Live Challenges",
      color: "from-yellow-400 to-orange-500",
      description: "across all categories",
      bgPattern: "bg-yellow-500/10"
    },
    {
      icon: TrendingUp,
      value: `$${(animatedValues.totalPrizes / 1000000).toFixed(1)}M+`,
      label: "Total Prize Pool",
      color: "from-green-400 to-emerald-500",
      description: "in rewards distributed",
      bgPattern: "bg-green-500/10"
    },
    {
      icon: Target,
      value: `${animatedValues.winRate}%`,
      label: "Success Rate",
      color: "from-purple-400 to-pink-500",
      description: "challenge completion",
      bgPattern: "bg-purple-500/10"
    },
    {
      icon: Clock,
      value: `${animatedValues.activeEvents}`,
      label: "Live Events",
      color: "from-red-400 to-rose-500",
      description: "happening right now",
      bgPattern: "bg-red-500/10"
    },
    {
      icon: Star,
      value: `${animatedValues.avgRating}`,
      label: "Platform Rating",
      color: "from-indigo-400 to-purple-500",
      description: "average user rating",
      bgPattern: "bg-indigo-500/10"
    }
  ];

  const categoryIcons = [Code, Calculator, Brain, Zap, Gift, Award];

  return (
    <div className="relative -mt-32 z-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Floating Challenge Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {categoryIcons.map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * 200 + 50,
                y: Math.random() * 200 + 50,
                opacity: 0 
              }}
              animate={{ 
                x: Math.random() * 200 + 50,
                y: Math.random() * 200 + 50,
                opacity: 0.1,
                rotate: [0, 360]
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2
              }}
            >
              <Icon className="w-16 h-16 text-white/20" />
            </motion.div>
          ))}
        </div>

        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl" />
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Challenge Arena
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"> Statistics</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Join thousands of competitors in the ultimate skill testing platform
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: index * 0.1 + 0.3, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className="group relative perspective-1000"
              >
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-1">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Icon Container */}
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />
                      <div className={`relative bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <motion.div
                        className="text-3xl lg:text-4xl font-bold text-white mb-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut"
                        }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-lg font-semibold text-blue-200 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-sm text-blue-300/70">
                        {stat.description}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Animation */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      delay: index * 0.1 + 0.8,
                      duration: 1.5,
                      ease: "easeOut"
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 pt-8 border-t border-white/10 relative z-10"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Join the Arena?
                </h3>
                <p className="text-blue-200 max-w-md">
                  Start competing today and climb the leaderboards to win amazing prizes
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">View Live Challenges</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Browse Categories
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeStats;