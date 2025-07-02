'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Book, 
  Shield, 
  Users, 
  Settings, 
  Award,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  ArrowLeft,
  Trophy,
  Target,
  Crown,
  Building2,
  Sparkles,
  Star,
  Globe
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  faqs: FAQItem[];
}

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      description: 'Learn the basics of our training platform',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button on the login page and fill in your details including first name, last name, email, and password. You\'ll receive an email verification to activate your account.'
        },
        {
          question: 'What are the system requirements?',
          answer: 'Our platform works on all modern browsers (Chrome, Firefox, Safari, Edge) and requires a stable internet connection. 3D features work best with hardware acceleration enabled.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive instructions to reset your password within minutes.'
        },
        {
          question: 'What modes are available?',
          answer: 'Choose between Standard Mode for traditional learning or Gamified Mode for an interactive 3D experience with achievements, XP, and competitions.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: Users,
      description: 'Manage your account and avatar settings',
      faqs: [
        {
          question: 'How do I update my profile information?',
          answer: 'Navigate to Settings > Profile to update your personal information, job details, and preferences. Some changes may require admin approval for security.'
        },
        {
          question: 'How do I customize my 3D avatar?',
          answer: 'Visit the Avatar section to customize your 3D character with various options for appearance, clothing, and accessories using our advanced avatar editor.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'Email changes require verification for security. Go to Settings > Account, enter your new email, and follow the verification process.'
        },
        {
          question: 'How do I switch between Standard and Gamified modes?',
          answer: 'You can switch modes in Settings > Preferences. Note that switching modes will affect your interface and available features.'
        }
      ]
    },
    {
      id: 'modules',
      title: 'Training Modules & Certifications',
      icon: Award,
      description: 'Complete courses and earn certifications',
      faqs: [
        {
          question: 'How do I enroll in a training module?',
          answer: 'Browse the Modules section, click on a module you\'re interested in, and select "Enroll Now". Some modules may require prerequisites.'
        },
        {
          question: 'How do I track my learning progress?',
          answer: 'Your Dashboard shows detailed progress tracking, completion percentages, and upcoming deadlines for all enrolled modules.'
        },
        {
          question: 'What happens if I fail an assessment?',
          answer: 'You can retake assessments after 24 hours. Review the module materials and discussion forums before attempting again.'
        },
        {
          question: 'How do I download my certificates?',
          answer: 'Go to Profile > Achievements and click the download button next to each completed certificate. Certificates are also emailed to you automatically.'
        },
        {
          question: 'Do certificates expire?',
          answer: 'Some certifications have expiration dates based on regulatory requirements. Check your certificate details for renewal information.'
        }
      ]
    },
    {
      id: 'gamification',
      title: 'Gamification & Rewards',
      icon: Trophy,
      description: 'XP, achievements, leaderboards, and competitions',
      faqs: [
        {
          question: 'How do I earn XP and level up?',
          answer: 'Complete modules, participate in discussions, and maintain learning streaks to earn XP. Reach XP thresholds to level up and unlock new rank badges.'
        },
        {
          question: 'What are achievements and how do I unlock them?',
          answer: 'Achievements are badges earned for various accomplishments like completing modules, maintaining streaks, or winning competitions. View your progress in Profile > Achievements.'
        },
        {
          question: 'How do leaderboards work?',
          answer: 'Compete with colleagues in global, department, team, and seasonal rankings. Access leaderboards from the main navigation to see your ranking and compete for top positions.'
        },
        {
          question: 'What are coins and tokens used for?',
          answer: 'Earn coins and tokens through activities to purchase power-ups, customize your avatar, or unlock special features in the Shop.'
        },
        {
          question: 'How do learning streaks work?',
          answer: 'Maintain daily learning activity to build streaks. Longer streaks earn bonus XP and unlock special achievements.'
        }
      ]
    },
    {
      id: 'collaboration',
      title: 'Teams & Collaboration',
      icon: Users,
      description: 'Work with teams and explore virtual spaces',
      faqs: [
        {
          question: 'How do I join or create a team?',
          answer: 'Visit the Teams section to browse available teams, request to join, or create your own team. Teams can collaborate on projects and compete together.'
        },
        {
          question: 'What are Spaces and how do I use them?',
          answer: 'Spaces are virtual 3D environments for team collaboration. Book meeting rooms, explore workspaces, and interact with team members in immersive environments.'
        },
        {
          question: 'How do I schedule meetings in virtual spaces?',
          answer: 'Use the Meeting Scheduler in Spaces to book virtual rooms, set agendas, and invite team members to collaborative sessions.'
        },
        {
          question: 'Can I chat with AI avatars?',
          answer: 'Yes! Access the Chat section to have conversations with AI-powered avatars that can help with learning questions and career guidance.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      description: 'Advanced security features and privacy controls',
      faqs: [
        {
          question: 'How is my data protected?',
          answer: 'We use bank-grade encryption, comply with financial regulations, and implement advanced security measures including biometric authentication and risk assessment.'
        },
        {
          question: 'How do I enable two-factor authentication?',
          answer: 'Visit Settings > Security to enable 2FA. Choose from SMS, email, or authenticator app options. Biometric authentication (fingerprint, face, voice) is also available.'
        },
        {
          question: 'What biometric authentication options are available?',
          answer: 'Our platform supports fingerprint scanning, facial recognition, and voice recognition for secure access. Enable these in Settings > Security > Biometric Authentication.'
        },
        {
          question: 'How do session timeouts work?',
          answer: 'Configure automatic logout times in Settings > Security. The system tracks device usage and can automatically log you out after periods of inactivity.'
        },
        {
          question: 'Can I track my login activity?',
          answer: 'Yes, view all login attempts, device information, and security notifications in Settings > Security > Login History.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Settings,
      description: 'Troubleshooting and technical assistance',
      faqs: [
        {
          question: '3D environments are not loading properly',
          answer: 'Ensure hardware acceleration is enabled in your browser settings. Try clearing cache or switching to a browser that supports WebGL 2.0.'
        },
        {
          question: 'Videos or animations are choppy',
          answer: 'Check your internet connection speed, close unnecessary browser tabs, and ensure your graphics drivers are up to date for optimal performance.'
        },
        {
          question: 'The platform is running slowly',
          answer: 'Clear your browser cache and cookies, disable unnecessary extensions, and ensure you have sufficient available RAM (4GB+ recommended).'
        },
        {
          question: 'Avatar customization is not saving',
          answer: 'Ensure you have a stable internet connection and sufficient browser storage. Try logging out and back in if changes aren\'t persisting.'
        },
        {
          question: 'Mobile app compatibility',
          answer: 'Our platform is optimized for desktop browsers. Mobile access provides basic features, but 3D environments work best on desktop devices.'
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    category.faqs.length > 0 || 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFAQClick = (categoryId: string, faqIndex: number) => {
    const faqId = `${categoryId}-${faqIndex}`;
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-50"
          animate={{
            scale: [1, 0.9, 1],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Enhanced pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,26,26,0.1)_1px,transparent_1px)] bg-[length:60px_60px]" />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + i * 8}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="pt-4 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div 
                className="flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
                  <span className="relative text-lg font-black text-white z-10">BNC</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">National Bank of Canada</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Help Center
                  </p>
                </div>
              </motion.div>

              {/* Back to Login */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Login</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          className="py-16 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-8">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Help & Support Center</span>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                <span className="text-gray-900 dark:text-white block">How can we</span>
                <span className="block bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mt-2">
                  help you today?
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Find answers to common questions, learn about features, or get technical support for the BNC Training Platform
              </p>
            </motion.div>
            
            {/* Enhanced Search Bar */}
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search help articles, features, or troubleshooting..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg hover:shadow-xl"
                />
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
              {[
                { icon: Shield, text: 'Bank-Grade Security', color: 'text-green-500' },
                { icon: Star, text: '24/7 Support Available', color: 'text-yellow-500' },
                { icon: Globe, text: 'Comprehensive Resources', color: 'text-blue-500' }
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Categories Grid */}
        <motion.section 
          className="py-12 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Browse Help Categories</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find detailed information about every aspect of the BNC Training Platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border transition-all cursor-pointer shadow-lg hover:shadow-xl ${
                    activeCategory === category.id 
                      ? 'border-blue-500 shadow-blue-500/20 ring-2 ring-blue-500/20' 
                      : 'border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      activeCategory === category.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-500/20 text-blue-500'
                    } transition-all`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{category.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500">{category.faqs.length} articles</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                      activeCategory === category.id ? 'rotate-90 text-blue-500' : ''
                    }`} />
                  </div>
                  
                  {/* FAQs Dropdown */}
                  <AnimatePresence>
                    {activeCategory === category.id && (
                      <motion.div 
                        className="mt-6 space-y-3"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', transformOrigin: 'top' }}
                      >
                        {category.faqs.map((faq, faqIndex) => (
                          <motion.div
                            key={faqIndex}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: faqIndex * 0.1 }}
                          >
                            <button
                              className="w-full flex items-start justify-between text-left group"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFAQClick(category.id, faqIndex);
                              }}
                            >
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{faq.question}</span>
                              <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform group-hover:text-blue-500 ${
                                expandedFAQ === `${category.id}-${faqIndex}` ? 'rotate-180' : ''
                              }`} />
                            </button>
                            <AnimatePresence>
                              {expandedFAQ === `${category.id}-${faqIndex}` && (
                                <motion.div
                                  initial={{ opacity: 0, scaleY: 0 }}
                                  animate={{ opacity: 1, scaleY: 1 }}
                                  exit={{ opacity: 0, scaleY: 0 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ overflow: 'hidden', transformOrigin: 'top' }}
                                >
                                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="py-16 px-4 border-t border-gray-200/20 dark:border-gray-800/50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Still need help?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">
                Our dedicated support team is here to assist you 24/7
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: MessageCircle,
                  title: 'Live Chat',
                  description: 'Instant support via chat',
                  action: 'Start Chat',
                  link: '#',
                  color: 'blue'
                },
                {
                  icon: Mail,
                  title: 'Email Support',
                  description: 'Detailed help via email',
                  action: 'Email Us',
                  link: 'mailto:training.support@nbc.ca',
                  color: 'green'
                },
                {
                  icon: Phone,
                  title: 'Phone Support',
                  description: 'Mon-Fri, 8AM-6PM EST',
                  action: '1-800-NBC-HELP',
                  link: 'tel:1-800-622-4357',
                  color: 'purple'
                }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${
                    contact.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                    contact.color === 'green' ? 'from-green-500 to-emerald-500' :
                    'from-purple-500 to-pink-500'
                  } flex items-center justify-center`}>
                    <contact.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{contact.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{contact.description}</p>
                  <motion.a 
                    href={contact.link}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      contact.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                      contact.color === 'green' ? 'bg-green-500 hover:bg-green-600 text-white' :
                      'bg-purple-500 hover:bg-purple-600 text-white'
                    } shadow-lg hover:shadow-xl`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{contact.action}</span>
                    <ChevronRight className="h-4 w-4" />
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="py-8 px-4 border-t border-gray-200/20 dark:border-gray-800/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/policy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <Link href="/login" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Sign In
              </Link>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Home
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              © 2025 National Bank of Canada. All rights reserved.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default HelpPage;