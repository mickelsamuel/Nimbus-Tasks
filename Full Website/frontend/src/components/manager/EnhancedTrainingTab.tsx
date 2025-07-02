'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Target, BookOpen, Clock, 
  Plus, Search, Send,
  CheckCircle, Star,
  BarChart3
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { TeamMember } from './types'

interface EnhancedTrainingTabProps {
  teamMembers: TeamMember[]
}

interface TrainingModule {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  duration: number
  completionRate: number
  prerequisites: string[]
  skills: string[]
  recommended?: boolean
}

export default function EnhancedTrainingTab({ teamMembers }: EnhancedTrainingTabProps) {
  const { isDark: darkMode } = useTheme()
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([])
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [assignmentDeadline, setAssignmentDeadline] = useState('')

  // Mock training modules data
  const trainingModules: TrainingModule[] = [
    {
      id: '1',
      title: 'Advanced Risk Assessment',
      description: 'Comprehensive training on modern risk assessment methodologies and tools',
      category: 'Risk Management',
      difficulty: 'Advanced',
      duration: 480, // minutes
      completionRate: 87,
      prerequisites: ['Basic Risk Fundamentals'],
      skills: ['Risk Analysis', 'Financial Modeling', 'Regulatory Compliance'],
      recommended: true
    },
    {
      id: '2',
      title: 'Client Relationship Excellence',
      description: 'Master the art of building and maintaining exceptional client relationships',
      category: 'Client Relations',
      difficulty: 'Intermediate',
      duration: 360,
      completionRate: 92,
      prerequisites: ['Communication Basics'],
      skills: ['Client Management', 'Communication', 'Negotiation']
    },
    {
      id: '3',
      title: 'Investment Portfolio Strategies',
      description: 'Advanced strategies for optimizing investment portfolios',
      category: 'Investment Banking',
      difficulty: 'Expert',
      duration: 600,
      completionRate: 78,
      prerequisites: ['Financial Markets', 'Portfolio Theory'],
      skills: ['Portfolio Management', 'Market Analysis', 'Asset Allocation'],
      recommended: true
    },
    {
      id: '4',
      title: 'Digital Banking Innovation',
      description: 'Stay ahead with the latest digital banking technologies and trends',
      category: 'Technology',
      difficulty: 'Beginner',
      duration: 240,
      completionRate: 95,
      prerequisites: [],
      skills: ['Digital Literacy', 'Innovation', 'Technology Adoption']
    }
  ]

  const handleMemberSelection = (member: TeamMember) => {
    if (selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id))
    } else {
      setSelectedMembers([...selectedMembers, member])
    }
  }

  const handleAssignTraining = () => {
    if (selectedModule && selectedMembers.length > 0) {
      // API call to assign training to selected members would go here
      // Implementation: POST /api/training/assignments with module and member data
      
      // Reset selections
      setSelectedModule(null)
      setSelectedMembers([])
      setAssignmentDeadline('')
    }
  }

  const filteredModules = trainingModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || module.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'emerald'
      case 'Intermediate': return 'yellow'
      case 'Advanced': return 'orange'
      case 'Expert': return 'red'
      default: return 'gray'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Training Command Header */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Training Command Center
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Assign training modules and track team development progress
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg">
              <BarChart3 className="w-4 h-4" />
              Training Analytics
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg">
              <Plus className="w-4 h-4" />
              Create Module
            </button>
          </div>
        </div>
      </div>

      {/* Training Assignment Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Available Training Modules */}
        <div className={`xl:col-span-2 p-6 rounded-2xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Available Training Modules
            </h3>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className={`absolute left-3 top-3 w-4 h-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-xl border transition-all ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`px-3 py-2 rounded-xl border transition-all ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="all">All Categories</option>
                <option value="Risk Management">Risk Management</option>
                <option value="Client Relations">Client Relations</option>
                <option value="Investment Banking">Investment Banking</option>
                <option value="Technology">Technology</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedModule(module)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-105 relative ${
                  selectedModule?.id === module.id
                    ? darkMode 
                      ? 'bg-purple-900/30 border-purple-400 shadow-lg'
                      : 'bg-purple-50 border-purple-300 shadow-lg'
                    : darkMode 
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {module.recommended && (
                  <div className="absolute top-2 right-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode 
                        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-400/30' 
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      <Star className="w-3 h-3 inline mr-1" />
                      Recommended
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600`}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {module.title}
                    </h4>
                    <p className={`text-sm mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {Math.floor(module.duration / 60)}h {module.duration % 60}m
                      </span>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      `bg-${getDifficultyColor(module.difficulty)}-100 text-${getDifficultyColor(module.difficulty)}-700`
                    } ${darkMode && `bg-${getDifficultyColor(module.difficulty)}-900/30 text-${getDifficultyColor(module.difficulty)}-400`}`}>
                      {module.difficulty}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {module.completionRate}%
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      completion
                    </div>
                  </div>
                </div>

                <div className={`h-2 rounded-full mb-3 ${
                  darkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${module.completionRate}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {module.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className={`px-2 py-1 text-xs rounded-lg ${
                        darkMode 
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-400/30' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedModule?.id === module.id
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : darkMode 
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>
                  {selectedModule?.id === module.id ? 'Selected' : 'Select Module'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Assignment Panel */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Assignment Panel
          </h3>

          {/* Selected Module Summary */}
          {selectedModule ? (
            <div className={`p-4 rounded-xl border mb-6 ${
              darkMode 
                ? 'bg-purple-900/20 border-purple-400/30' 
                : 'bg-purple-50 border-purple-200'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Selected Module
              </h4>
              <p className={`text-sm mb-2 ${
                darkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>
                {selectedModule.title}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {Math.floor(selectedModule.duration / 60)}h {selectedModule.duration % 60}m
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  `bg-${getDifficultyColor(selectedModule.difficulty)}-100 text-${getDifficultyColor(selectedModule.difficulty)}-700`
                } ${darkMode && `bg-${getDifficultyColor(selectedModule.difficulty)}-900/30 text-${getDifficultyColor(selectedModule.difficulty)}-400`}`}>
                  {selectedModule.difficulty}
                </span>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-xl border mb-6 text-center ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <Target className={`w-8 h-8 mx-auto mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Select a training module to assign
              </p>
            </div>
          )}

          {/* Team Member Selection */}
          <div className="mb-6">
            <h4 className={`font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Select Team Members
            </h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleMemberSelection(member)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedMembers.find(m => m.id === member.id)
                      ? darkMode 
                        ? 'bg-emerald-900/30 border-emerald-400 shadow-lg'
                        : 'bg-emerald-50 border-emerald-300 shadow-lg'
                      : darkMode 
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {member.name}
                      </div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {member.role}
                      </div>
                    </div>
                    {selectedMembers.find(m => m.id === member.id) && (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Settings */}
          <div className="mb-6">
            <h4 className={`font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Assignment Settings
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Deadline
                </label>
                <input
                  type="date"
                  value={assignmentDeadline}
                  onChange={(e) => setAssignmentDeadline(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border transition-all ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
            </div>
          </div>

          {/* Assignment Summary */}
          <div className={`p-4 rounded-xl mb-6 ${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Assignment Summary
            </h4>
            <div className="space-y-1 text-sm">
              <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Module: {selectedModule ? selectedModule.title : 'None selected'}
              </div>
              <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Members: {selectedMembers.length} selected
              </div>
              <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Deadline: {assignmentDeadline || 'Not set'}
              </div>
            </div>
          </div>

          {/* Assign Button */}
          <button
            onClick={handleAssignTraining}
            disabled={!selectedModule || selectedMembers.length === 0}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              selectedModule && selectedMembers.length > 0
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:scale-105 shadow-lg'
                : darkMode 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5 inline mr-2" />
            Assign Training
          </button>
        </div>
      </div>
    </motion.div>
  )
}