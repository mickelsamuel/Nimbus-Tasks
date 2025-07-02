import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  Users, 
  Target, 
  ChevronRight,
  DollarSign,
  Flag
} from 'lucide-react';

const LeaderboardShowcase = () => {
  const [activeBoard, setActiveBoard] = useState('overall');

  const leaderboards = {
    overall: [
      {
        rank: 1,
        name: 'Alexandra Chen',
        username: '@alexCodes',
        points: 127540,
        challenges: 89,
        wins: 34,
        winRate: 95,
        streak: 12,
        badge: 'Grandmaster',
        avatar: 'AC',
        color: 'from-yellow-400 to-orange-500',
        specialty: 'Full Stack'
      },
      {
        rank: 2,
        name: 'Marcus Rodriguez',
        username: '@marQus',
        points: 118760,
        challenges: 76,
        wins: 31,
        winRate: 92,
        streak: 8,
        badge: 'Master',
        avatar: 'MR',
        color: 'from-gray-300 to-gray-400',
        specialty: 'AI/ML'
      },
      {
        rank: 3,
        name: 'Sarah Kim',
        username: '@sarahK_dev',
        points: 109820,
        challenges: 82,
        wins: 28,
        winRate: 88,
        streak: 15,
        badge: 'Expert',
        avatar: 'SK',
        color: 'from-orange-400 to-red-500',
        specialty: 'Blockchain'
      }
    ],
    monthly: [
      {
        rank: 1,
        name: 'David Okafor',
        username: '@devDavid',
        points: 24680,
        challenges: 18,
        wins: 8,
        winRate: 94,
        streak: 6,
        badge: 'Rising Star',
        avatar: 'DO',
        color: 'from-yellow-400 to-orange-500',
        specialty: 'FinTech'
      },
      {
        rank: 2,
        name: 'Elena Popov',
        username: '@elena_codes',
        points: 23150,
        challenges: 15,
        wins: 7,
        winRate: 91,
        streak: 4,
        badge: 'Challenger',
        avatar: 'EP',
        color: 'from-gray-300 to-gray-400',
        specialty: 'Security'
      },
      {
        rank: 3,
        name: 'Jin Wei',
        username: '@jinDev',
        points: 21890,
        challenges: 16,
        wins: 6,
        winRate: 87,
        streak: 3,
        badge: 'Competitor',
        avatar: 'JW',
        color: 'from-orange-400 to-red-500',
        specialty: 'Algorithms'
      }
    ],
    rookie: [
      {
        rank: 1,
        name: 'Priya Sharma',
        username: '@priya_newbie',
        points: 8940,
        challenges: 12,
        wins: 3,
        winRate: 75,
        streak: 2,
        badge: 'Rookie Star',
        avatar: 'PS',
        color: 'from-yellow-400 to-orange-500',
        specialty: 'Frontend'
      },
      {
        rank: 2,
        name: 'Ahmed Hassan',
        username: '@ahmed_h',
        points: 7850,
        challenges: 10,
        wins: 2,
        winRate: 70,
        streak: 1,
        badge: 'Newcomer',
        avatar: 'AH',
        color: 'from-gray-300 to-gray-400',
        specialty: 'Mobile'
      },
      {
        rank: 3,
        name: 'Lisa Zhang',
        username: '@lisa_code',
        points: 6720,
        challenges: 9,
        wins: 2,
        winRate: 67,
        streak: 1,
        badge: 'Beginner',
        avatar: 'LZ',
        color: 'from-orange-400 to-red-500',
        specialty: 'Data Science'
      }
    ]
  };

  const recentWinners = [
    {
      challenge: 'AI Trading Bot Challenge',
      winner: 'Alexandra Chen',
      prize: '$25,000',
      date: '2 days ago',
      category: 'Finance',
      avatar: 'AC'
    },
    {
      challenge: 'Quantum Algorithm Sprint',
      winner: 'Marcus Rodriguez',
      prize: '$15,000',
      date: '5 days ago',
      category: 'Algorithms',
      avatar: 'MR'
    },
    {
      challenge: 'Blockchain Security Audit',
      winner: 'Sarah Kim',
      prize: '$30,000',
      date: '1 week ago',
      category: 'Security',
      avatar: 'SK'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-orange-400" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const currentLeaderboard = leaderboards[activeBoard as keyof typeof leaderboards] || [];

  return (
    <div>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Champions 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"> Leaderboard</span>
        </h2>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto">
          Celebrate our top performers and see who&apos;s dominating the challenge arena
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
              {[
                { id: 'overall', label: 'All Time' },
                { id: 'monthly', label: 'This Month' },
                { id: 'rookie', label: 'Rookies' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveBoard(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeBoard === tab.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBoard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentLeaderboard.map((player, index) => (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-black/50 transition-all duration-300">
                    {/* Rank Glow */}
                    {player.rank <= 3 && (
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${player.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                    )}
                    
                    <div className="relative flex items-center gap-6">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12 relative">
                        {getRankIcon(player.rank)}
                      </div>

                      {/* Avatar */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${player.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {player.avatar}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                            {player.name}
                          </h3>
                          <span className="text-gray-400 text-sm">{player.username}</span>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${player.color} text-black`}>
                            {player.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-300">
                          <span>{player.specialty}</span>
                          <span>•</span>
                          <span>{player.streak} win streak</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-6 text-center">
                        <div>
                          <div className="text-2xl font-bold text-yellow-400">
                            {player.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">XP</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400">
                            {player.challenges}
                          </div>
                          <div className="text-xs text-gray-400">Challenges</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400">
                            {player.wins}
                          </div>
                          <div className="text-xs text-gray-400">Wins</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-400">
                            {player.winRate}%
                          </div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>

                      {/* Action */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Recent Winners */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Recent Winners</h3>
            </div>
            
            <div className="space-y-4">
              {recentWinners.map((winner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                      {winner.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {winner.winner}
                      </h4>
                      <p className="text-xs text-gray-400">{winner.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{winner.prize}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-2">{winner.challenge}</div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">
                      {winner.category}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Platform Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Active Competitors</span>
                </div>
                <span className="text-xl font-bold text-blue-400">47.5K</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Total Rewards</span>
                </div>
                <span className="text-xl font-bold text-green-400">$2.5M</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Challenges Won</span>
                </div>
                <span className="text-xl font-bold text-purple-400">8.2K</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Flag className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">Live Challenges</span>
                </div>
                <span className="text-xl font-bold text-orange-400">127</span>
              </div>
            </div>
          </div>

          {/* Join CTA */}
          <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Join the Elite</h3>
            <p className="text-gray-300 text-sm mb-4">
              Start competing and climb your way to the top of the leaderboard
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Competing
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardShowcase;