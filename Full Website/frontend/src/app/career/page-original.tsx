'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { useCareerData } from '@/hooks/career/useCareerData';
import { Achievement } from '@/types/career';
import { 
  MapPin, 
  TrendingUp, 
  Target, 
  Award, 
  Zap, 
  ChevronRight,
  Star,
  Trophy,
  GraduationCap,
  Clock
} from 'lucide-react';

export default function CareerPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>('current');
  
  const { careerData, loading, error } = useCareerData();

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  // Career paths data
  const careerPaths = [
    {
      id: 'current',
      title: 'Current Path',
      subtitle: 'Banking Specialist',
      progress: careerData?.currentPath?.progress || 0,
      milestones: [
        { title: 'Junior Associate', completed: true, date: '2022' },
        { title: 'Associate', completed: true, date: '2023' },
        { title: 'Senior Associate', completed: false, current: true, date: '2024' },
        { title: 'Team Lead', completed: false, date: '2025' },
        { title: 'Manager', completed: false, date: '2026' }
      ]
    },
    {
      id: 'alternative1',
      title: 'Alternative Path',
      subtitle: 'Digital Innovation',
      progress: (careerData?.alternativePaths?.[0] as any)?.progress || 0,
      milestones: [
        { title: 'Digital Analyst', completed: false, date: '2024' },
        { title: 'Product Specialist', completed: false, date: '2025' },
        { title: 'Innovation Lead', completed: false, date: '2026' },
        { title: 'Digital Director', completed: false, date: '2027' }
      ]
    },
    {
      id: 'alternative2',
      title: 'Leadership Track',
      subtitle: 'Management Focus',
      progress: 30,
      milestones: [
        { title: 'Project Lead', completed: false, date: '2024' },
        { title: 'Department Manager', completed: false, date: '2025' },
        { title: 'Regional Director', completed: false, date: '2027' },
        { title: 'VP Operations', completed: false, date: '2029' }
      ]
    }
  ];

  // Skills data
  const skills = [
    { name: 'Banking Operations', level: 85, category: 'Core' },
    { name: 'Customer Service', level: 90, category: 'Core' },
    { name: 'Risk Management', level: 70, category: 'Core' },
    { name: 'Digital Tools', level: 75, category: 'Technical' },
    { name: 'Data Analysis', level: 60, category: 'Technical' },
    { name: 'Leadership', level: 55, category: 'Soft Skills' },
    { name: 'Communication', level: 88, category: 'Soft Skills' },
    { name: 'Team Collaboration', level: 92, category: 'Soft Skills' }
  ];

  // Achievements data
  const achievements = [
    { 
      id: 1, 
      title: 'Customer Champion', 
      description: 'Achieved 98% customer satisfaction rating', 
      type: 'performance' as const,
      rarity: 'platinum' as const,
      date: '2024-01-15',
      impact: 'Significantly improved customer relations and satisfaction scores',
      category: 'Customer Service',
      icon: '🏆'
    },
    { 
      id: 2, 
      title: 'Quick Learner', 
      description: 'Completed 10 modules in record time', 
      type: 'performance' as const,
      rarity: 'gold' as const,
      date: '2024-02-20',
      impact: 'Demonstrated exceptional learning agility and knowledge retention',
      category: 'Professional Development',
      icon: '⚡'
    },
    { 
      id: 3, 
      title: 'Team Player', 
      description: 'Collaborated on 5 successful projects', 
      type: 'leadership' as const,
      rarity: 'silver' as const,
      date: '2024-03-10',
      impact: 'Enhanced team collaboration and project success rates',
      category: 'Team Collaboration',
      icon: '🤝'
    }
  ];

  // Learning recommendations
  const recommendations = [
    {
      title: 'Advanced Risk Assessment',
      type: 'Module',
      difficulty: 'Intermediate',
      duration: '3 hours',
      relevance: 95
    },
    {
      title: 'Leadership Fundamentals',
      type: 'Course',
      difficulty: 'Beginner',
      duration: '5 hours',
      relevance: 88
    },
    {
      title: 'Digital Banking Trends',
      type: 'Workshop',
      difficulty: 'Advanced',
      duration: '2 hours',
      relevance: 82
    }
  ];

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <motion.div 
            className="glass-morphism dark:glass-morphism-dark rounded-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <div className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading your career journey...</div>
          </motion.div>
        </div>
      </ProtectedLayout>
    );
  }

  if (error || !careerData) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <motion.div 
            className="glass-morphism dark:glass-morphism-dark rounded-2xl p-8 text-center max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Career Data Unavailable</div>
            <div className="text-gray-600 dark:text-gray-400">{error || 'Failed to load career data'}</div>
          </motion.div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23E01A1A%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-morphism dark:glass-morphism-dark rounded-3xl p-8 shadow-glass">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white">
                  <MapPin className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Career Journey</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400">Track your professional growth and explore new opportunities</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">Level 8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-600 dark:text-accent-400">75%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Path Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{achievements.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{skills.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Skills</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Career Paths */}
            <div className="xl:col-span-2 space-y-8">
              {/* Career Path Selector */}
              <motion.div 
                className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6 shadow-glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Career Paths</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {careerPaths.map((path) => (
                    <button
                      key={path.id}
                      onClick={() => setSelectedPath(path.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedPath === path.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white">{path.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{path.subtitle}</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-gray-700 dark:text-gray-300">{path.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${path.progress}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Career Path Timeline */}
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-300"></div>
                  {careerPaths.find(p => p.id === selectedPath)?.milestones.map((milestone, index) => (
                    <div key={index} className="relative flex items-center mb-6 last:mb-0">
                      <div className={`relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center ${
                        milestone.completed 
                          ? 'bg-green-500 border-green-200 dark:border-green-800' 
                          : milestone.current 
                            ? 'bg-primary-500 border-primary-200 dark:border-primary-800 animate-pulse'
                            : 'bg-gray-300 dark:bg-gray-600 border-gray-100 dark:border-gray-700'
                      }`}>
                        {milestone.completed ? (
                          <Trophy className="h-5 w-5 text-white" />
                        ) : milestone.current ? (
                          <Zap className="h-5 w-5 text-white" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className={`font-semibold ${
                              milestone.completed || milestone.current 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>{milestone.title}</h3>
                            {milestone.current && (
                              <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">Current Focus</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{milestone.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Skills Matrix */}
              <motion.div 
                className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6 shadow-glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills Development</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Core', 'Technical', 'Soft Skills'].map(category => (
                    <div key={category} className="space-y-4">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{category}</h3>
                      {skills.filter(skill => skill.category === category).map(skill => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                            <span className="text-sm text-gray-500">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div 
                              className={`h-2 rounded-full ${
                                skill.level >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                skill.level >= 60 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                'bg-gradient-to-r from-yellow-500 to-yellow-600'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Achievements */}
              <motion.div 
                className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6 shadow-glass"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Achievements</h2>
                </div>
                
                <div className="space-y-4">
                  {achievements.map(achievement => (
                    <motion.div 
                      key={achievement.id}
                      className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 cursor-pointer"
                      onClick={() => handleAchievementClick(achievement)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              achievement.rarity === 'platinum' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                              achievement.rarity === 'gold' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                              'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            }`}>
                              {achievement.rarity}
                            </span>
                            <span className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button 
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View All Achievements
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </motion.div>

              {/* Learning Recommendations */}
              <motion.div 
                className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6 shadow-glass"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended Learning</h2>
                </div>
                
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div 
                      key={index}
                      className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{rec.relevance}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{rec.type}</span>
                        <span>{rec.difficulty}</span>
                        <span>{rec.duration}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button 
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore All Modules
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Achievement Modal */}
        {selectedAchievement && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-morphism dark:glass-morphism-dark rounded-2xl p-8 max-w-md w-full shadow-glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{(selectedAchievement as Achievement & { icon?: string }).icon || '🏆'}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedAchievement.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedAchievement.description}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {selectedAchievement.impact && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Impact:</span>
                    <span className="text-gray-700 dark:text-gray-300">{selectedAchievement.impact}</span>
                  </div>
                )}
                {selectedAchievement.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-700 dark:text-gray-300">{selectedAchievement.category}</span>
                  </div>
                )}
                {selectedAchievement.date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="text-gray-700 dark:text-gray-300">{selectedAchievement.date}</span>
                  </div>
                )}
              </div>
              
              <motion.button
                onClick={() => setSelectedAchievement(null)}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </ProtectedLayout>
  );
}