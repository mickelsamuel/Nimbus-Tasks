import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUniversityData } from '@/hooks/useUniversityData';
import { 
  Users, 
  Building, 
  Trophy, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Play,
  Award,
  Target,
  Code,
  Brain,
  TrendingUp,
  Shield,
  Timer,
  LucideIcon
} from 'lucide-react';

interface HackathonWithWinners {
  id: number;
  title: string;
  description: string;
  prize: string;
  timeLeft: string;
  participants: number;
  maxParticipants: number;
  sponsors: string[];
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  difficulty: string;
  technologies: string[];
  icon: LucideIcon;
  color: string;
  registrationDeadline: string;
  teamSize: string;
  submissions: number;
  winners?: string[];
}

const HackathonsSection = () => {
  const [activeTab, setActiveTab] = useState('live');
  const { data: universityData, loading, error } = useUniversityData();

  // Transform API data to match component interface, with fallback mock data
  const hackathons = React.useMemo(() => {
    if (loading || error || !universityData?.hackathons?.length) {
      // Fallback mock data for development/when API is unavailable
      return {
        live: [
          {
            id: 1,
            title: 'Global FinTech Innovation Challenge',
            description: 'Build the future of financial technology with cutting-edge solutions for digital banking, payments, and investment platforms.',
            prize: '$100,000',
            timeLeft: '2d 14h 23m',
            participants: 4562,
            maxParticipants: 5000,
            sponsors: ['Goldman Sachs', 'JP Morgan', 'Stripe', 'Square'],
            location: 'Virtual + NYC',
            startDate: 'Dec 15, 2024',
            endDate: 'Dec 17, 2024',
            status: 'live',
            difficulty: 'Expert',
            technologies: ['React', 'Node.js', 'Blockchain', 'AI/ML', 'Cloud'],
            icon: TrendingUp,
            color: 'from-emerald-400 to-cyan-500',
            registrationDeadline: 'Dec 14, 2024',
            teamSize: '2-4 members',
            submissions: 847
          }
        ],
        upcoming: [
          {
            id: 3,
            title: 'AI Security Fortress Challenge',
            description: 'Create next-generation cybersecurity solutions powered by artificial intelligence to defend against advanced threats.',
            prize: '$85,000',
            timeLeft: '12d 06h 15m',
            participants: 1847,
            maxParticipants: 4000,
            sponsors: ['CrowdStrike', 'Palo Alto', 'Cisco', 'FireEye'],
            location: 'San Francisco + Virtual',
            startDate: 'Jan 10, 2025',
            endDate: 'Jan 12, 2025',
            status: 'upcoming',
            difficulty: 'Advanced',
            technologies: ['Python', 'TensorFlow', 'Cybersecurity', 'ML', 'Docker'],
            icon: Shield,
            color: 'from-orange-400 to-red-500',
            registrationDeadline: 'Jan 5, 2025',
            teamSize: '2-5 members',
            submissions: 0
          }
        ],
        completed: [
          {
            id: 4,
            title: 'Blockchain DeFi Revolution',
            description: 'Revolutionary DeFi solutions that completed last month with groundbreaking innovations.',
            prize: '$120,000',
            timeLeft: 'Completed',
            participants: 3952,
            maxParticipants: 4000,
            sponsors: ['Ethereum', 'Polygon', 'Chainlink', 'Uniswap'],
            location: 'London + Virtual',
            startDate: 'Nov 15, 2024',
            endDate: 'Nov 17, 2024',
            status: 'completed',
            difficulty: 'Expert',
            technologies: ['Solidity', 'Web3', 'Smart Contracts', 'DeFi', 'React'],
            icon: Code,
            color: 'from-blue-400 to-indigo-500',
            registrationDeadline: 'Nov 10, 2024',
            teamSize: '3-6 members',
            submissions: 1247,
            winners: ['Team Alpha', 'DeFi Warriors', 'Blockchain Innovators']
          }
        ]
      };
    }

    // Transform API data to component format
    const apiHackathons = universityData.hackathons;
    const grouped = {
      live: [] as HackathonWithWinners[],
      upcoming: [] as HackathonWithWinners[],
      completed: [] as HackathonWithWinners[]
    };

    apiHackathons.forEach(hackathon => {
      const transformedHackathon: HackathonWithWinners = {
        id: hackathon.id,
        title: hackathon.title,
        description: hackathon.description,
        prize: hackathon.prize || '$TBD',
        timeLeft: hackathon.status === 'live' ? 'Live Now' : hackathon.status === 'completed' ? 'Completed' : 'Coming Soon',
        participants: hackathon.participants || 0,
        maxParticipants: hackathon.maxParticipants || 1000,
        sponsors: hackathon.sponsors || [],
        location: hackathon.location || 'Virtual',
        startDate: hackathon.startDate || 'TBD',
        endDate: hackathon.endDate || 'TBD',
        status: hackathon.status || 'upcoming',
        difficulty: hackathon.difficulty || 'Intermediate',
        technologies: hackathon.technologies || [],
        icon: hackathon.type === 'fintech' ? TrendingUp : 
              hackathon.type === 'ai' ? Brain :
              hackathon.type === 'security' ? Shield : Code,
        color: hackathon.type === 'fintech' ? 'from-emerald-400 to-cyan-500' :
               hackathon.type === 'ai' ? 'from-purple-400 to-pink-500' :
               hackathon.type === 'security' ? 'from-orange-400 to-red-500' : 'from-blue-400 to-indigo-500',
        registrationDeadline: hackathon.registrationDeadline || 'TBD',
        teamSize: hackathon.teamSize || '1-4 members',
        submissions: hackathon.submissions || 0,
        winners: hackathon.winners
      };

      if (hackathon.status === 'live') {
        grouped.live.push(transformedHackathon);
      } else if (hackathon.status === 'completed') {
        grouped.completed.push(transformedHackathon);
      } else {
        grouped.upcoming.push(transformedHackathon);
      }
    });

    return grouped;
  }, [universityData, loading, error]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'live': return 'bg-red-500 animate-pulse';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  const currentHackathons = hackathons[activeTab as keyof typeof hackathons] || [];

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-xl text-blue-200">Loading epic hackathons...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Hackathons</h3>
        <p className="text-blue-200 mb-4">There was an error loading the hackathon data.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
        >
          Try Again
        </button>
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
          Epic 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"> Hackathons</span>
        </h2>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
          Join world-class hackathons with top sponsors, incredible prizes, and life-changing opportunities
        </p>
        
        {/* Show data source indicator */}
        <div className="text-sm text-blue-300/60">
          {universityData?.hackathons?.length ? 
            `Showing ${universityData.hackathons.length} hackathons from live data` : 
            'Showing demo hackathons (API data unavailable)'
          }
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
          {[
            { id: 'live', label: 'Live Now', count: hackathons.live.length },
            { id: 'upcoming', label: 'Upcoming', count: hackathons.upcoming.length },
            { id: 'completed', label: 'Completed', count: hackathons.completed.length }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {tab.label} ({tab.count})
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hackathons Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid gap-8"
        >
          {currentHackathons.map((hackathon, index) => (
            <motion.div
              key={hackathon.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-black/50 transition-all duration-500 overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <div className={`px-4 py-2 ${getStatusColor(hackathon.status)} text-white text-sm font-bold rounded-full shadow-lg`}>
                    {hackathon.status === 'live' && '🔴 LIVE NOW'}
                    {hackathon.status === 'upcoming' && '📅 UPCOMING'}
                    {hackathon.status === 'completed' && '✅ COMPLETED'}
                  </div>
                </div>

                {/* Hackathon Header */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-8 mb-8">
                  <div className="flex items-center gap-6 flex-1">
                    {/* Icon */}
                    <div className={`relative p-6 bg-gradient-to-br ${hackathon.color} rounded-2xl shadow-xl`}>
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl animate-pulse" />
                      <hackathon.icon className="w-12 h-12 text-white relative z-10" />
                    </div>
                    
                    {/* Title and Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                        {hackathon.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                        <span className={`font-semibold ${getDifficultyColor(hackathon.difficulty)}`}>
                          {hackathon.difficulty}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-blue-300">{hackathon.teamSize}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">{hackathon.location}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed max-w-2xl">
                        {hackathon.description}
                      </p>
                    </div>
                  </div>

                  {/* Prize Display */}
                  <div className="text-center lg:text-right">
                    <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      <span className="text-4xl font-bold text-yellow-400">{hackathon.prize}</span>
                    </div>
                    <div className="text-sm text-gray-400">Total Prize Pool</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                      {hackathon.status === 'live' ? <Timer className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {hackathon.status === 'live' ? hackathon.timeLeft : hackathon.startDate}
                    </div>
                    <div className="text-sm text-gray-400">
                      {hackathon.status === 'live' ? 'Time Left' : 'Start Date'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-lg font-bold text-white">
                      {hackathon.participants.toLocaleString()}/{hackathon.maxParticipants.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Participants</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                      <Building className="w-5 h-5" />
                    </div>
                    <div className="text-lg font-bold text-white">{hackathon.sponsors.length}</div>
                    <div className="text-sm text-gray-400">Sponsors</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="text-lg font-bold text-white">{hackathon.submissions}</div>
                    <div className="text-sm text-gray-400">Submissions</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-lg font-bold text-white truncate">{hackathon.location.split(' + ')[0]}</div>
                    <div className="text-sm text-gray-400">Location</div>
                  </div>
                </div>

                {/* Sponsors */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Major Sponsors</h4>
                  <div className="flex flex-wrap gap-3">
                    {hackathon.sponsors.map((sponsor, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-200 rounded-lg text-sm border border-blue-500/30 backdrop-blur-sm"
                      >
                        {sponsor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Tech Stack</h4>
                  <div className="flex flex-wrap gap-3">
                    {hackathon.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-white/10 text-gray-200 rounded-lg text-sm border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Winners Section for Completed Hackathons */}
                {hackathon.status === 'completed' && (hackathon as HackathonWithWinners).winners && (
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        <h4 className="text-lg font-semibold text-yellow-400">🏆 Winners</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(hackathon as HackathonWithWinners).winners!.map((winner: string, idx: number) => (
                          <div key={idx} className="text-center p-4 bg-white/10 rounded-lg">
                            <div className="text-2xl mb-2">
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                            </div>
                            <div className="font-semibold text-white">{winner}</div>
                            <div className="text-sm text-gray-400">
                              {idx === 0 ? '1st Place' : idx === 1 ? '2nd Place' : '3rd Place'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {hackathon.status === 'live' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 animate-pulse"
                      >
                        <Play className="w-5 h-5" />
                        Join Live Hackathon
                      </motion.button>
                    </>
                  )}
                  
                  {hackathon.status === 'upcoming' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <Calendar className="w-5 h-5" />
                        Register Now
                      </motion.button>
                    </>
                  )}
                  
                  {hackathon.status === 'completed' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <Award className="w-5 h-5" />
                        View Results
                      </motion.button>
                    </>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${hackathon.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* View All CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(234, 179, 8, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-full shadow-lg transition-all duration-300"
        >
          Explore All Hackathons
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HackathonsSection;