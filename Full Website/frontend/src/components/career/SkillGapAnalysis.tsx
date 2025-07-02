'use client'

import { useState } from 'react'
import { 
  TrendingUp, Target, AlertTriangle, CheckCircle,
  BookOpen, Award, Clock, BarChart3
} from 'lucide-react'

interface SkillGap {
  skill: string
  currentLevel: number
  requiredLevel: number
  priority: 'high' | 'medium' | 'low'
  timeToClose: string
  resources: string[]
  department: string
}

interface SkillRecommendation {
  title: string
  description: string
  timeInvestment: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  relevanceScore: number
  format: 'Module' | 'Course' | 'Workshop' | 'Certification'
}


interface SkillGapAnalysisProps {
  careerData?: unknown
  loading?: boolean
}

export function SkillGapAnalysis({ }: SkillGapAnalysisProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')

  const skillGaps: SkillGap[] = [
    {
      skill: 'Advanced Risk Modeling',
      currentLevel: 60,
      requiredLevel: 85,
      priority: 'high',
      timeToClose: '3-4 months',
      resources: ['Risk Management Certification', 'Advanced Analytics Module'],
      department: 'Risk Management'
    },
    {
      skill: 'Team Leadership',
      currentLevel: 55,
      requiredLevel: 80,
      priority: 'high',
      timeToClose: '2-3 months',
      resources: ['Leadership Fundamentals', 'Management Skills Workshop'],
      department: 'Management'
    },
    {
      skill: 'Digital Banking Platforms',
      currentLevel: 70,
      requiredLevel: 90,
      priority: 'medium',
      timeToClose: '1-2 months',
      resources: ['Fintech Innovation Course', 'Digital Banking Certification'],
      department: 'Technology'
    },
    {
      skill: 'Strategic Planning',
      currentLevel: 45,
      requiredLevel: 75,
      priority: 'medium',
      timeToClose: '4-5 months',
      resources: ['Business Strategy Course', 'Strategic Thinking Workshop'],
      department: 'Management'
    }
  ]

  const recommendations: SkillRecommendation[] = [
    {
      title: 'Advanced Risk Assessment Framework',
      description: 'Learn modern risk modeling techniques and regulatory compliance',
      timeInvestment: '6 hours',
      difficulty: 'Advanced',
      relevanceScore: 95,
      format: 'Certification'
    },
    {
      title: 'Leadership Communication Styles',
      description: 'Develop effective communication strategies for different team dynamics',
      timeInvestment: '4 hours',
      difficulty: 'Intermediate',
      relevanceScore: 88,
      format: 'Module'
    },
    {
      title: 'Fintech and Digital Innovation',
      description: 'Stay current with digital banking trends and emerging technologies',
      timeInvestment: '8 hours',
      difficulty: 'Intermediate',
      relevanceScore: 82,
      format: 'Course'
    }
  ]

  const departments = ['all', 'Risk Management', 'Management', 'Technology', 'Operations']

  const filteredGaps = selectedDepartment === 'all' 
    ? skillGaps 
    : skillGaps.filter(gap => gap.department === selectedDepartment)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'Intermediate': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'Advanced': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  return (
    <div className="dashboard-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white shadow-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Skill Gap Analysis
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Identify and close critical skill gaps
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
          <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
            {filteredGaps.filter(g => g.priority === 'high').length} High Priority
          </span>
        </div>
      </div>

      {/* Department Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedDepartment === dept
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          Current Skill Gaps
        </h3>
        <div className="space-y-4">
          {filteredGaps.map((gap, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{gap.skill}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{gap.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(gap.priority)}`}>
                    {gap.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Current: {gap.currentLevel}%</span>
                  <span className="text-gray-600 dark:text-gray-400">Required: {gap.requiredLevel}%</span>
                </div>
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${gap.currentLevel}%` }}
                  />
                  <div 
                    className="absolute top-0 h-3 border-r-2 border-orange-500"
                    style={{ left: `${gap.requiredLevel}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-600 dark:text-blue-400">Current Level</span>
                  <span className="text-orange-600 dark:text-orange-400">Target Level</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  Estimated time to close gap: {gap.timeToClose}
                </div>
                <div className="flex flex-wrap gap-1">
                  {gap.resources.map((resource, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full px-4 py-2 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                Create Development Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Learning */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Recommended Learning
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">{rec.relevanceScore}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{rec.format}</span>
                <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(rec.difficulty)}`}>
                  {rec.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {rec.timeInvestment}
                </span>
              </div>
              
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Start Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}