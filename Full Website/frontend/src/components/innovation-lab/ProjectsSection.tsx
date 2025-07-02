import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Play, 
  TrendingUp, 
  Brain, 
  ChevronRight,
  Timer,
  Target,
  Star
} from 'lucide-react';
import { useUniversityData } from '@/hooks/useUniversityData';

const ActiveChallenges = () => {
  const { data: universityData, loading } = useUniversityData();

  // Use API data or show empty state
  const activeChallenges = universityData?.projects || [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Hot': return 'bg-red-500';
      case 'Featured': return 'bg-yellow-500';
      case 'New': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-xl text-blue-200">Loading active challenges...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Active 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"> Challenges</span>
        </h2>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-4">
          Join live challenges with real prizes and showcase your skills to top employers
        </p>
        
        {/* Data source indicator */}
        {universityData?.projects?.length && (
          <div className="text-sm text-blue-300/60 mb-4">
            Showing {universityData.projects.length} live challenges
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-yellow-400">127</div>
            <div className="text-sm text-blue-300">Live Now</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">$2.5M+</div>
            <div className="text-sm text-blue-300">Total Prizes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">50K+</div>
            <div className="text-sm text-blue-300">Participants</div>
          </div>
        </div>
      </motion.div>

      {/* Challenges Grid */}
      {activeChallenges.length > 0 ? (
        <div className="grid gap-8">
          {activeChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-black/50 transition-all duration-500 overflow-hidden">
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <div className={`px-4 py-2 ${getStatusColor(challenge.status)} text-white text-sm font-bold rounded-full shadow-lg animate-pulse`}>
                  {challenge.status}
                </div>
              </div>

              {/* Challenge Header */}
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
                <div className="flex items-center gap-6">
                  {/* Icon */}
                  <div className={`relative p-6 bg-gradient-to-br ${challenge.color} rounded-2xl shadow-xl`}>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl animate-pulse" />
                    <challenge.icon className="w-12 h-12 text-white relative z-10" />
                  </div>
                  
                  {/* Title and Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className="text-blue-300 font-medium">{challenge.category}</span>
                      <span className="text-gray-400">•</span>
                      <span className={`font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">by {challenge.sponsor}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed max-w-2xl">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Prize Display */}
                <div className="text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <span className="text-3xl font-bold text-yellow-400">{challenge.prize}</span>
                  </div>
                  <div className="text-sm text-gray-400">Prize Pool</div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-bold text-white">{challenge.timeLeft}</div>
                  <div className="text-sm text-gray-400">Time Left</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-bold text-white">{challenge.participants.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Participants</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-bold text-white">{challenge.submissions}</div>
                  <div className="text-sm text-gray-400">Submissions</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-xl font-bold text-white">{challenge.rating}</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-bold text-white">{challenge.progress}%</div>
                  <div className="text-sm text-gray-400">Progress</div>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">Requirements</h4>
                <div className="flex flex-wrap gap-3">
                  {challenge.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white/10 text-blue-200 rounded-lg text-sm border border-white/20 backdrop-blur-sm"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-400">Challenge Progress</span>
                  <span className="text-sm text-white font-semibold">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${challenge.color} rounded-full`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${challenge.progress}%` }}
                    transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  Join Challenge
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  View Details
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
            </div>
          </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Brain className="w-20 h-20 text-blue-400/50 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">No Active Challenges</h3>
          <p className="text-blue-200 max-w-md mx-auto mb-8">
            Check back soon for exciting new challenges with real prizes and opportunities to showcase your skills.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg"
            onClick={() => window.location.reload()}
          >
            Refresh Challenges
          </motion.button>
        </motion.div>
      )}

      {/* View More CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-300"
        >
          Browse All Active Challenges
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ActiveChallenges;