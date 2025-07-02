import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Mail, Phone, MapPin, 
  Twitter, Linkedin, Youtube, Github, MessageCircle,
  ArrowRight, Shield, Globe, Zap, Target, Award, Star
} from 'lucide-react';

const ChallengeFooter = () => {
  const quickLinks = [
    { name: 'Browse Challenges', href: '/university' },
    { name: 'Upcoming Hackathons', href: '/events' },
    { name: 'Leaderboards', href: '/leaderboards' },
    { name: 'Rewards Catalog', href: '/shop' },
    { name: 'Challenge Rules', href: '/help' },
    { name: 'Join Community', href: '/teams' }
  ];

  const resources = [
    { name: 'Getting Started', href: '/help/docs' },
    { name: 'Challenge Guide', href: '/help/training-videos' },
    { name: 'Submission Tips', href: '/help/best-practices' },
    { name: 'API Documentation', href: '/help/docs' },
    { name: 'FAQ & Support', href: '/help/community-forum' }
  ];

  const contact = [
    { icon: MapPin, text: 'Challenge Arena HQ, Tech City, CA 94025' },
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'support@challengearena.io' }
  ];

  const socialLinks = [
    { icon: MessageCircle, href: 'https://discord.gg/trainingplatform', name: 'Discord' },
    { icon: Twitter, href: 'https://twitter.com/trainingplatform', name: 'Twitter' },
    { icon: Github, href: 'https://github.com/trainingplatform', name: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/company/trainingplatform', name: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/@trainingplatform', name: 'YouTube' }
  ];

  const stats = [
    { icon: Trophy, value: '25K+', label: 'Challenges Won' },
    { icon: Award, value: '$2.5M+', label: 'Prizes Awarded' },
    { icon: Target, value: '127', label: 'Live Challenges' },
    { icon: Star, value: '50K+', label: 'Active Competitors' }
  ];

  return (
    <footer className="bg-black/60 backdrop-blur-xl border-t border-white/10 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Never Miss a Challenge
            </h3>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
              Get exclusive early access to challenges, special events, and higher reward tiers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                Join Elite
                <Zap className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Challenge Arena Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-7 h-7 text-black" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                  Challenge Arena
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The ultimate competitive platform for developers, innovators, and problem solvers. Compete, learn, and win incredible prizes while building your career.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-yellow-400">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-yellow-400">Resources</h4>
              <ul className="space-y-3">
                {resources.map((resource) => (
                  <li key={resource.name}>
                    <a
                      href={resource.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-yellow-400">Contact Us</h4>
              <div className="space-y-4">
                {contact.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400 text-sm leading-relaxed">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Support Hours */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-xl">
                <h5 className="font-semibold mb-2 text-yellow-400">Support Hours</h5>
                <p className="text-sm text-gray-400">
                  24/7 Live Support<br />
                  Discord Community Always Active<br />
                  Response Time: &lt;2 hours
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Partners & Sponsors */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">Major Sponsors & Partners</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
              {['Google', 'Microsoft', 'Goldman Sachs', 'IBM', 'AWS', 'Meta'].map((sponsor) => (
                <div key={sponsor} className="text-sm text-gray-400 border border-gray-700 px-6 py-3 rounded-full hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-300">
                  {sponsor}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Global Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Verified Rewards</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 Challenge Arena. All rights reserved. Built for champions.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/policy/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </a>
              <a href="/policy/terms" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Terms of Service
              </a>
              <a href="/help" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Challenge Rules
              </a>
              <a href="/policy/cookies" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ChallengeFooter;