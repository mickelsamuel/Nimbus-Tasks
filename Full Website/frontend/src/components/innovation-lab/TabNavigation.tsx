'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Trophy, Briefcase, Calendar } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { 
    id: 'hackathons', 
    label: '🚀 INNOVATION LAB', 
    icon: Rocket, 
    color: 'tab-hackathons',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    id: 'projects', 
    label: '🏆 SHOWCASE GALLERY', 
    icon: Trophy, 
    color: 'tab-projects',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'opportunities', 
    label: '💼 CAREER PATHWAYS', 
    icon: Briefcase, 
    color: 'tab-opportunities',
    gradient: 'from-orange-500 to-yellow-500'
  },
  { 
    id: 'events', 
    label: '📚 ACADEMY EVENTS', 
    icon: Calendar, 
    color: 'tab-events',
    gradient: 'from-blue-500 to-indigo-500'
  }
];

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="academy-tabs mb-12"
    >
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`academy-tab flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-400 text-sm sm:text-base ${
              activeTab === tab.id
                ? 'active'
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={activeTab === tab.id ? {
              background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.8) 0%, rgba(103, 58, 183, 0.6) 100%)',
              boxShadow: '0 8px 30px rgba(63, 81, 181, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              color: 'white'
            } : {}}
          >
            <tab.icon className={`w-5 h-5 ${tab.color}`} />
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-2xl"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}