import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Code, 
  Calculator, 
  Brain, 
  Shield, 
  Globe, 
  ArrowRight, 
  Clock, 
  Users, 
  Trophy,
  Star
} from 'lucide-react';

interface ChallengesSectionProps {
  selectedProgram: string;
  setSelectedProgram: (program: string) => void;
}

const ChallengeCategories: React.FC<ChallengesSectionProps> = ({ selectedProgram, setSelectedProgram }) => {
  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'finance', name: 'Finance', icon: TrendingUp },
    { id: 'coding', name: 'Coding', icon: Code },
    { id: 'algorithms', name: 'Algorithms', icon: Brain },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'math', name: 'Mathematics', icon: Calculator },
  ];

  const challenges = [
    {
      id: 1,
      category: 'finance',
      title: 'AI Trading Bot Challenge',
      difficulty: 'Expert',
      timeLeft: '3 days',
      participants: 2847,
      prize: '$25,000',
      rating: 4.9,
      highlights: ['Machine Learning', 'Market Analysis', 'Risk Management'],
      color: 'from-emerald-500 to-cyan-600',
      status: 'Live'
    },
    {
      id: 2,
      category: 'coding',
      title: 'Quantum Algorithm Sprint',
      difficulty: 'Advanced',
      timeLeft: '7 days',
      participants: 1923,
      prize: '$15,000',
      rating: 4.8,
      highlights: ['Quantum Computing', 'Algorithm Design', 'Optimization'],
      color: 'from-purple-500 to-pink-600',
      status: 'Live'
    },
    {
      id: 3,
      category: 'security',
      title: 'Blockchain Security Audit',
      difficulty: 'Expert',
      timeLeft: '12 days',
      participants: 1456,
      prize: '$30,000',
      rating: 4.9,
      highlights: ['Smart Contracts', 'Vulnerability Testing', 'DeFi'],
      color: 'from-orange-500 to-red-600',
      status: 'Live'
    },
    {
      id: 4,
      category: 'algorithms',
      title: 'Graph Theory Optimization',
      difficulty: 'Intermediate',
      timeLeft: '5 days',
      participants: 2156,
      prize: '$12,000',
      rating: 4.7,
      highlights: ['Graph Algorithms', 'Optimization', 'Data Structures'],
      color: 'from-green-500 to-emerald-600',
      status: 'Live'
    },
    {
      id: 5,
      category: 'math',
      title: 'Cryptographic Puzzle',
      difficulty: 'Advanced',
      timeLeft: '14 days',
      participants: 987,
      prize: '$18,000',
      rating: 4.8,
      highlights: ['Number Theory', 'Cryptography', 'Prime Numbers'],
      color: 'from-indigo-500 to-blue-600',
      status: 'Starting Soon'
    },
    {
      id: 6,
      category: 'coding',
      title: 'Real-time System Design',
      difficulty: 'Expert',
      timeLeft: '9 days',
      participants: 1678,
      prize: '$22,000',
      rating: 4.6,
      highlights: ['System Architecture', 'Scalability', 'Performance'],
      color: 'from-teal-500 to-cyan-600',
      status: 'Live'
    }
  ];

  const filteredChallenges = selectedProgram === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedProgram);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Live': return 'bg-green-500';
      case 'Starting Soon': return 'bg-yellow-500';
      case 'Ended': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Challenge 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"> Categories</span>
        </h2>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto">
          Compete in diverse skill-based challenges and win substantial rewards
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedProgram(category.id)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 border-2 ${
              selectedProgram === category.id
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent shadow-lg shadow-orange-500/30'
                : 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:border-white/40'
            }`}
          >
            <category.icon className="w-5 h-5" />
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Challenges Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedProgram}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`px-3 py-1 ${getStatusColor(challenge.status)} text-white text-xs font-bold rounded-full shadow-lg`}>
                  {challenge.status}
                </div>
              </div>

              {/* Challenge Header */}
              <div className="relative h-32 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-80`} />
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Floating Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                    {(() => {
                      const categoryIcon = categories.find(c => c.id === challenge.category)?.icon;
                      if (categoryIcon) {
                        const IconComponent = categoryIcon;
                        return <IconComponent className="w-16 h-16 text-white relative z-10" />;
                      }
                      return null;
                    })()}
                  </motion.div>
                </div>

                {/* Prize Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-bold text-sm">{challenge.prize}</span>
                  </div>
                </div>
              </div>

              {/* Challenge Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {challenge.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-blue-300">{challenge.category}</span>
                  </div>
                </div>

                {/* Challenge Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-gray-300">{challenge.timeLeft} left</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-gray-300">{challenge.participants.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div className="text-xs text-gray-300">{challenge.rating}</div>
                  </div>
                </div>

                {/* Skills Highlights */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {challenge.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/10 text-blue-200 rounded-lg text-xs border border-white/20"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-300"
                >
                  <span>Join Challenge</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* View All Challenges CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(234, 179, 8, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-lg transition-all duration-300"
          >
            Explore All Challenges
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
          >
            Create Challenge
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChallengeCategories;