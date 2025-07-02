import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Gift, 
  Target, 
  Award, 
  Gem,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  TrendingUp,
  Badge,
  Coins,
  Gamepad2
} from 'lucide-react';

const RewardsShowcase = () => {
  const [activeTab, setActiveTab] = useState('catalog');

  const rewardTiers = [
    {
      name: 'Bronze',
      minPoints: 1000,
      maxPoints: 4999,
      color: 'from-orange-400 to-orange-600',
      textColor: 'text-orange-400',
      icon: Award,
      benefits: ['Basic Rewards', 'Challenge Access', 'Community Discord']
    },
    {
      name: 'Silver',
      minPoints: 5000,
      maxPoints: 14999,
      color: 'from-gray-300 to-gray-500',
      textColor: 'text-gray-300',
      icon: Badge,
      benefits: ['Premium Rewards', 'Exclusive Challenges', 'Mentorship Access']
    },
    {
      name: 'Gold',
      minPoints: 15000,
      maxPoints: 49999,
      color: 'from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-400',
      icon: Trophy,
      benefits: ['Elite Rewards', 'VIP Events', 'Direct Recruiter Contact']
    },
    {
      name: 'Platinum',
      minPoints: 50000,
      maxPoints: null,
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-400',
      icon: Crown,
      benefits: ['Legendary Rewards', 'Private Hackathons', 'Exclusive Job Board']
    }
  ];

  const rewardCatalog = [
    {
      id: 1,
      name: 'MacBook Pro M3',
      points: 45000,
      category: 'Tech',
      rarity: 'Legendary',
      image: '💻',
      description: 'Latest MacBook Pro with M3 chip, perfect for development',
      availability: 'Limited',
      claimed: 12,
      total: 50
    },
    {
      id: 2,
      name: 'Gaming Setup Bundle',
      points: 35000,
      category: 'Gaming',
      rarity: 'Epic',
      image: '🎮',
      description: 'Complete gaming setup with high-end peripherals',
      availability: 'Available',
      claimed: 28,
      total: 100
    },
    {
      id: 3,
      name: 'AWS Credits',
      points: 5000,
      category: 'Cloud',
      rarity: 'Common',
      image: '☁️',
      description: '$500 AWS credits for your projects',
      availability: 'Unlimited',
      claimed: 342,
      total: null
    },
    {
      id: 4,
      name: 'Tesla Model 3',
      points: 250000,
      category: 'Vehicle',
      rarity: 'Mythical',
      image: '🚗',
      description: 'Brand new Tesla Model 3 - The ultimate prize',
      availability: 'Ultra Rare',
      claimed: 1,
      total: 3
    },
    {
      id: 5,
      name: 'iPhone 15 Pro',
      points: 25000,
      category: 'Tech',
      rarity: 'Rare',
      image: '📱',
      description: 'Latest iPhone with Pro features',
      availability: 'Limited',
      claimed: 45,
      total: 75
    },
    {
      id: 6,
      name: 'Coding Bootcamp',
      points: 15000,
      category: 'Education',
      rarity: 'Rare',
      image: '🎓',
      description: 'Full-stack development bootcamp scholarship',
      availability: 'Available',
      claimed: 67,
      total: 200
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'Common': return 'text-gray-400 bg-gray-400/20';
      case 'Rare': return 'text-blue-400 bg-blue-400/20';
      case 'Epic': return 'text-purple-400 bg-purple-400/20';
      case 'Legendary': return 'text-yellow-400 bg-yellow-400/20';
      case 'Mythical': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const pointsStats = [
    { label: 'Your XP', value: '12,450', color: 'text-yellow-400', icon: Coins },
    { label: 'Rank', value: '#247', color: 'text-blue-400', icon: TrendingUp },
    { label: 'Rewards Claimed', value: '8', color: 'text-green-400', icon: Gift },
    { label: 'Next Tier', value: '2,550 XP', color: 'text-purple-400', icon: Target }
  ];

  return (
    <div>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Exclusive{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Rewards
          </span>
        </h2>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
          Earn XP through challenges and unlock incredible rewards from tech gadgets to dream cars
        </p>
      </motion.div>

      {/* Points Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {pointsStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-black/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mx-auto mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
          {[
            { id: 'catalog', label: 'Reward Catalog' },
            { id: 'tiers', label: 'Tier System' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'catalog' && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Reward Catalog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rewardCatalog.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-black/50 transition-all duration-300 overflow-hidden">
                    {/* Rarity Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRarityColor(reward.rarity)}`}>
                        {reward.rarity}
                      </span>
                    </div>

                    {/* Reward Image */}
                    <div className="text-6xl mb-4 text-center">{reward.image}</div>

                    {/* Reward Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                        {reward.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">{reward.description}</p>
                      
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">
                          {reward.points.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm">XP</span>
                      </div>

                      <div className="text-sm text-gray-400 mb-4">
                        Category: <span className="text-blue-300">{reward.category}</span>
                      </div>
                    </div>

                    {/* Availability */}
                    {reward.total && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Claimed</span>
                          <span>{reward.claimed}/{reward.total}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                            style={{ width: `${(reward.claimed / reward.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Claim Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Claim Reward
                    </motion.button>

                    {/* Sparkle Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                      <Sparkles className="absolute top-4 left-4 w-6 h-6 text-yellow-400 animate-pulse" />
                      <Sparkles className="absolute bottom-4 right-4 w-4 h-4 text-purple-400 animate-pulse delay-300" />
                      <Sparkles className="absolute top-1/2 right-6 w-3 h-3 text-blue-400 animate-pulse delay-700" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tiers' && (
          <motion.div
            key="tiers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tier System */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {rewardTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-black/50 transition-all duration-300 text-center">
                    {/* Tier Glow */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${tier.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                    
                    <div className="relative">
                      {/* Tier Icon */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tier.color} rounded-2xl mb-6 shadow-xl`}>
                        <tier.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Tier Name */}
                      <h3 className={`text-2xl font-bold ${tier.textColor} mb-4`}>
                        {tier.name}
                      </h3>

                      {/* Points Range */}
                      <div className="text-white text-lg font-semibold mb-6">
                        {tier.minPoints.toLocaleString()}
                        {tier.maxPoints && ` - ${tier.maxPoints.toLocaleString()}`}
                        {!tier.maxPoints && '+'}
                        <div className="text-sm text-gray-400 font-normal">XP</div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-3">
                        {tier.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-gray-300">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tier.color}`} />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Progress to Next Tier */}
                      {index < rewardTiers.length - 1 && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <div className="text-xs text-gray-400 mb-2">Next Tier Progress</div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${tier.color} h-2 rounded-full`}
                              style={{ width: '68%' }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">2,550 XP to go</div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-3xl p-12"
      >
        <Gem className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-white mb-4">Start Earning Rewards Today</h3>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Complete challenges, climb the leaderboard, and unlock incredible rewards. Every point gets you closer to your dream prize.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(234, 179, 8, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-6 h-6" />
            Start Competing
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            View All Rewards
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RewardsShowcase;