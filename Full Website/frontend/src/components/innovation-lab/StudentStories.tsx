import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, Trophy, Linkedin, Twitter, Github, Award, TrendingUp, Target, Zap } from 'lucide-react';

const ChampionStories = () => {
  const [activeStory, setActiveStory] = useState(0);

  const champions = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'AI Trading Bot Champion',
      totalWins: 34,
      prize: '$125,000',
      rank: '#1 Global',
      speciality: 'AI/ML Finance',
      quote: 'The challenge arena pushed me beyond my limits. Building AI trading algorithms under pressure taught me more than any traditional course ever could.',
      achievements: ['Won 5 consecutive challenges', '$25K single challenge win', 'Recruited by Goldman Sachs'],
      points: 127540,
      badges: ['Grandmaster', 'AI Expert', 'Finance Wizard'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'Quantum Algorithm Master',
      totalWins: 31,
      prize: '$98,000',
      rank: '#2 Global',
      speciality: 'Quantum Computing',
      quote: 'Competing in quantum challenges opened doors I never imagined. The real-world problems and industry connections changed my career trajectory.',
      achievements: ['Solved P=NP subset', 'IBM Quantum Award', '3 patents filed'],
      points: 118760,
      badges: ['Master', 'Quantum Pioneer', 'Algorithm Guru'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 3,
      name: 'Elena Popov',
      title: 'Blockchain Security Expert',
      totalWins: 28,
      prize: '$87,500',
      rank: '#5 Global',
      speciality: 'Cybersecurity',
      quote: 'Every challenge taught me something new about blockchain vulnerabilities. The prize money funded my startup, and the connections were priceless.',
      achievements: ['Found critical ETH bug', 'CrowdStrike offer', 'Security firm founder'],
      points: 89420,
      badges: ['Expert', 'Security Shield', 'Bug Hunter'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 4,
      name: 'Priya Sharma',
      title: 'DeFi Protocol Architect',
      totalWins: 22,
      prize: '$72,000',
      rank: '#12 Global',
      speciality: 'DeFi/Web3',
      quote: 'Started as a rookie, now I\'m building protocols handling millions. The challenge arena fast-tracked my career by 5 years.',
      achievements: ['Built $10M TVL protocol', 'Uniswap grant winner', 'Web3 conference speaker'],
      points: 67890,
      badges: ['Advanced', 'DeFi Builder', 'Rising Star'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    }
  ];

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % champions.length);
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + champions.length) % champions.length);
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
          Champion <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Success Stories</span>
        </h2>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto">
          Meet the champions who turned challenges into careers and dreams into reality
        </p>
      </motion.div>

      {/* Stories Carousel */}
      <div className="relative max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStory}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Student Info */}
              <div className="p-8 lg:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-lg">
                      {champions[activeStory].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {champions[activeStory].name}
                    </h3>
                    <p className="text-yellow-400 font-semibold">
                      {champions[activeStory].title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-blue-300">{champions[activeStory].rank}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-400">{champions[activeStory].totalWins} wins</span>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mb-8">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-yellow-400/30" />
                  <p className="text-lg text-gray-300 italic pl-6">
                    {champions[activeStory].quote}
                  </p>
                </div>

                {/* Achievements */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Achievements
                    </h4>
                    <div className="space-y-2">
                      {champions[activeStory].achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-300 text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      Stats
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-green-400">{champions[activeStory].prize}</div>
                        <div className="text-xs text-gray-400">Total Earnings</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">{champions[activeStory].points.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">XP</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-3">Badges Earned</h4>
                  <div className="flex gap-2">
                    {champions[activeStory].badges.map((badge, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 rounded-full text-xs font-semibold border border-yellow-400/30">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">Connect:</span>
                  <a
                    href={champions[activeStory].social.linkedin}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={champions[activeStory].social.twitter}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={champions[activeStory].social.github}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                  >
                    <Github className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

              {/* Visual Side */}
              <div className="relative bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-8 lg:p-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-black/[0.1] bg-[size:30px_30px]" />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative text-center"
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-black/20 backdrop-blur-sm rounded-full mb-4">
                      <Trophy className="w-16 h-16 text-yellow-300" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {champions[activeStory].totalWins}
                    </h3>
                    <p className="text-white/80">Challenge Wins</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-white">
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-xl font-bold">{champions[activeStory].rank}</div>
                      <div className="text-sm opacity-80">Global Rank</div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                      <Zap className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-xl font-bold">{champions[activeStory].speciality}</div>
                      <div className="text-sm opacity-80">Speciality</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button
          onClick={prevStory}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full ml-4 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full shadow-lg flex items-center justify-center hover:bg-black/60 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextStory}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full mr-4 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full shadow-lg flex items-center justify-center hover:bg-black/60 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Story Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {champions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveStory(index)}
            className={`transition-all duration-300 ${
              activeStory === index
                ? 'w-12 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg'
                : 'w-3 h-3 bg-white/30 rounded-full hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <p className="text-blue-200 mb-4">
          Ready to become the next champion?
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(234, 179, 8, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
        >
          <Target className="w-5 h-5" />
          Start Competing Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChampionStories;