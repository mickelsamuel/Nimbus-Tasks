'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Calendar, Download, UserCheck, Lightbulb, 
  MessageCircle, Lock 
} from 'lucide-react';

const features = [
  { icon: FileText, label: 'Application Management', desc: 'Track your progress' },
  { icon: Calendar, label: 'Interview Scheduling', desc: 'Book your slots' },
  { icon: Download, label: 'Document Upload', desc: 'Submit requirements' },
  { icon: UserCheck, label: 'Mentor Matching', desc: 'Connect with experts' },
  { icon: Lightbulb, label: 'Resource Library', desc: 'Learning materials' },
  { icon: MessageCircle, label: 'Community Forums', desc: 'Network with peers' }
];

export default function StudentPortalTeaser() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 relative overflow-hidden student-portal-teaser"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(139, 195, 74, 0.15) 0%, rgba(76, 175, 80, 0.08) 50%, transparent 100%)',
        border: '3px solid transparent',
        borderImage: 'linear-gradient(135deg, rgba(139, 195, 74, 0.6) 0%, rgba(76, 175, 80, 0.4) 50%, rgba(139, 195, 74, 0.6) 100%) 1',
        borderRadius: '40px',
        padding: '60px'
      }}
    >
      <div className="coming-soon-animation absolute"
        style={{
          top: '20px',
          right: '30px',
          background: 'linear-gradient(45deg, #8BC34A 0%, #4CAF50 100%)',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '25px',
          fontWeight: '800',
          fontSize: '0.9rem',
          animation: 'comingSoonFloat 3s ease-in-out infinite'
        }}
      >
        COMING SOON
      </div>

      <div className="text-center mb-12">
        <h2 className="university-section-header bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
          Student Portal
        </h2>
        <p className="university-body-text text-xl text-gray-400 max-w-2xl mx-auto">
          Your gateway to managing applications, connecting with mentors, and accessing exclusive resources
        </p>
      </div>

      <div className="portal-preview-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="preview-feature"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '15px',
              padding: '24px',
              textAlign: 'center',
              border: '1px solid rgba(139, 195, 74, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <feature.icon className="w-10 h-10 text-green-400 mx-auto mb-4" />
            <h3 className="university-label-text font-semibold mb-2">{feature.label}</h3>
            <p className="university-label-text text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg flex items-center gap-3"
        >
          <Lock className="w-5 h-5" />
          Get Early Access
        </motion.button>
      </div>
    </motion.div>
  );
}