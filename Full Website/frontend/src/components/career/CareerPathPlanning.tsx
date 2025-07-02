'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, Target, Clock, ChevronRight, Users, Sparkles,
  BookOpen, Award, TrendingUp, CheckCircle,
  Briefcase, Star, Zap, Trophy, ArrowRight, Calendar,
  DollarSign, BarChart3, Rocket, Shield, Code, Brain
} from 'lucide-react'
import styles from './career.module.css'

interface CareerRole {
  title: string
  level: number
  timeframe: string
  requirements: string[]
  responsibilities: string[]
  salary_range: string
  available_positions: number
  growth_outlook: 'high' | 'medium' | 'low'
  skills_gain: string[]
  certifications: string[]
}

interface CareerPath {
  id: string
  name: string
  description: string
  current_role: string
  target_role: string
  estimated_time: string
  completion_rate: number
  roles: CareerRole[]
  required_skills: string[]
  recommended_by: string[]
  icon: React.ReactNode
  color: string
}

interface Milestone {
  id: string
  title: string
  date: string
  type: 'achievement' | 'promotion' | 'certification' | 'skill'
  status: 'completed' | 'current' | 'upcoming'
  description: string
}


interface CareerPathPlanningProps {
  careerData?: unknown
  loading?: boolean
}

export function CareerPathPlanning({ }: CareerPathPlanningProps) {
  const [selectedPath, setSelectedPath] = useState<string>('traditional')
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(null)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [animateStats, setAnimateStats] = useState(false)

  useEffect(() => {
    setAnimateStats(true)
  }, [])

  const careerPaths: CareerPath[] = [
    {
      id: 'traditional',
      name: 'Traditional Banking Leadership',
      description: 'Classic progression through banking hierarchy',
      current_role: 'Senior Associate',
      target_role: 'Regional Manager',
      estimated_time: '3-5 years',
      completion_rate: 78,
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600',
      roles: [
        {
          title: 'Team Lead',
          level: 4,
          timeframe: '6-12 months',
          requirements: [
            '2+ years banking experience',
            'Leadership training completion',
            'Performance rating 4+'
          ],
          responsibilities: [
            'Lead team of 5-8 associates',
            'Client relationship management',
            'Process improvement initiatives'
          ],
          salary_range: '$65,000 - $75,000',
          available_positions: 12,
          growth_outlook: 'high',
          skills_gain: ['Team Management', 'Conflict Resolution', 'Strategic Planning'],
          certifications: ['Banking Leadership Certificate', 'Project Management']
        },
        {
          title: 'Assistant Manager',
          level: 5,
          timeframe: '12-18 months',
          requirements: [
            '1+ year team leadership',
            'Advanced banking certification',
            'MBA preferred'
          ],
          responsibilities: [
            'Oversee daily branch operations',
            'Budget management',
            'Staff development'
          ],
          salary_range: '$75,000 - $90,000',
          available_positions: 8,
          growth_outlook: 'medium',
          skills_gain: ['P&L Management', 'Operations Strategy', 'Change Management'],
          certifications: ['Advanced Banking Management', 'Six Sigma Green Belt']
        },
        {
          title: 'Branch Manager',
          level: 6,
          timeframe: '18-24 months',
          requirements: [
            '3+ years management experience',
            'P&L responsibility',
            'Regional training'
          ],
          responsibilities: [
            'Full branch operations',
            'Sales targets achievement',
            'Regulatory compliance'
          ],
          salary_range: '$90,000 - $110,000',
          available_positions: 5,
          growth_outlook: 'medium',
          skills_gain: ['Executive Leadership', 'Business Development', 'Risk Management'],
          certifications: ['Executive Banking Certificate', 'Risk Management Professional']
        }
      ],
      required_skills: ['Leadership', 'Operations Management', 'Customer Relations', 'Risk Management'],
      recommended_by: ['Current Manager', 'HR Director', 'Regional VP']
    },
    {
      id: 'digital',
      name: 'Digital Banking Innovation',
      description: 'Focus on fintech and digital transformation',
      current_role: 'Senior Associate',
      target_role: 'Digital Product Manager',
      estimated_time: '2-4 years',
      completion_rate: 65,
      icon: <Code className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-600',
      roles: [
        {
          title: 'Digital Banking Specialist',
          level: 4,
          timeframe: '6-9 months',
          requirements: [
            'Digital banking certification',
            'Data analysis skills',
            'Agile methodology'
          ],
          responsibilities: [
            'Digital platform optimization',
            'User experience improvement',
            'Tech vendor management'
          ],
          salary_range: '$70,000 - $85,000',
          available_positions: 6,
          growth_outlook: 'high',
          skills_gain: ['UX Design Principles', 'API Integration', 'Data Analytics'],
          certifications: ['Digital Banking Professional', 'Google Analytics', 'AWS Cloud Practitioner']
        },
        {
          title: 'Product Analyst',
          level: 5,
          timeframe: '12-15 months',
          requirements: [
            'Product management course',
            'SQL knowledge',
            'Customer journey mapping'
          ],
          responsibilities: [
            'Product roadmap development',
            'Market research',
            'Feature prioritization'
          ],
          salary_range: '$85,000 - $100,000',
          available_positions: 4,
          growth_outlook: 'high',
          skills_gain: ['Product Strategy', 'Market Analysis', 'Stakeholder Management'],
          certifications: ['Product Management Certificate', 'Scrum Master', 'SQL Developer']
        },
        {
          title: 'Digital Product Manager',
          level: 6,
          timeframe: '15-24 months',
          requirements: [
            'Product management certification',
            'Technical leadership',
            'Strategy development'
          ],
          responsibilities: [
            'Digital product strategy',
            'Cross-functional team leadership',
            'Innovation initiatives'
          ],
          salary_range: '$100,000 - $125,000',
          available_positions: 3,
          growth_outlook: 'high',
          skills_gain: ['Product Vision', 'Technical Architecture', 'Innovation Management'],
          certifications: ['Senior Product Manager', 'Digital Innovation Leader', 'AI/ML Fundamentals']
        }
      ],
      required_skills: ['Product Management', 'Data Analysis', 'Digital Strategy', 'Agile Methodology'],
      recommended_by: ['Innovation Director', 'Digital Banking Head']
    },
    {
      id: 'risk',
      name: 'Risk Management Expertise',
      description: 'Specialize in risk assessment and compliance',
      current_role: 'Senior Associate',
      target_role: 'Senior Risk Manager',
      estimated_time: '4-6 years',
      completion_rate: 82,
      icon: <Shield className="w-5 h-5" />,
      color: 'from-green-500 to-teal-600',
      roles: [
        {
          title: 'Risk Analyst',
          level: 4,
          timeframe: '9-12 months',
          requirements: [
            'Risk management certification',
            'Statistical analysis',
            'Regulatory knowledge'
          ],
          responsibilities: [
            'Risk assessment',
            'Compliance monitoring',
            'Report generation'
          ],
          salary_range: '$68,000 - $82,000',
          available_positions: 7,
          growth_outlook: 'medium',
          skills_gain: ['Risk Modeling', 'Regulatory Compliance', 'Statistical Analysis'],
          certifications: ['FRM Level 1', 'Compliance Certificate', 'Data Analysis Professional']
        },
        {
          title: 'Risk Manager',
          level: 5,
          timeframe: '18-24 months',
          requirements: [
            'Advanced risk certification',
            'Team leadership',
            '5+ years experience'
          ],
          responsibilities: [
            'Risk framework development',
            'Team management',
            'Stakeholder reporting'
          ],
          salary_range: '$85,000 - $105,000',
          available_positions: 4,
          growth_outlook: 'medium',
          skills_gain: ['Enterprise Risk', 'Team Leadership', 'Strategic Planning'],
          certifications: ['FRM Level 2', 'Risk Management Professional', 'Leadership Excellence']
        },
        {
          title: 'Senior Risk Manager',
          level: 6,
          timeframe: '24-36 months',
          requirements: [
            'Senior risk certification',
            'Strategic planning',
            'Executive communication'
          ],
          responsibilities: [
            'Enterprise risk strategy',
            'Regulatory relationships',
            'Board reporting'
          ],
          salary_range: '$105,000 - $130,000',
          available_positions: 2,
          growth_outlook: 'medium',
          skills_gain: ['Executive Leadership', 'Board Governance', 'Strategic Risk Management'],
          certifications: ['Chief Risk Officer Program', 'Executive Leadership', 'Advanced Compliance']
        }
      ],
      required_skills: ['Risk Assessment', 'Regulatory Compliance', 'Statistical Analysis', 'Strategic Planning'],
      recommended_by: ['Chief Risk Officer', 'Compliance Director']
    }
  ]

  const currentPath = careerPaths.find(path => path.id === selectedPath)

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Joined Wells Fargo',
      date: 'January 2022',
      type: 'achievement',
      status: 'completed',
      description: 'Started as Banking Associate'
    },
    {
      id: '2',
      title: 'Customer Excellence Award',
      date: 'June 2022',
      type: 'achievement',
      status: 'completed',
      description: 'Top 10% customer satisfaction'
    },
    {
      id: '3',
      title: 'Promoted to Senior Associate',
      date: 'January 2023',
      type: 'promotion',
      status: 'completed',
      description: 'Recognition for outstanding performance'
    },
    {
      id: '4',
      title: 'Banking Certification',
      date: 'March 2024',
      type: 'certification',
      status: 'current',
      description: 'Advanced Banking Professional'
    },
    {
      id: '5',
      title: 'Team Lead Position',
      date: 'Q3 2024',
      type: 'promotion',
      status: 'upcoming',
      description: 'Next career milestone'
    }
  ]

  const careerStats = [
    { label: 'Years Experience', value: 2.5, suffix: '', icon: <Clock className="w-5 h-5" /> },
    { label: 'Skills Mastered', value: 12, suffix: '', icon: <Brain className="w-5 h-5" /> },
    { label: 'Certifications', value: 4, suffix: '', icon: <Award className="w-5 h-5" /> },
    { label: 'Career Progress', value: 45, suffix: '%', icon: <TrendingUp className="w-5 h-5" /> }
  ]

  const getGrowthColor = (outlook: string) => {
    switch (outlook) {
      case 'high': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-white" />
      case 'promotion': return <TrendingUp className="w-5 h-5 text-white" />
      case 'certification': return <Award className="w-5 h-5 text-white" />
      case 'skill': return <Zap className="w-5 h-5 text-white" />
      default: return <Star className="w-5 h-5 text-white" />
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Hero Header with Glassmorphism */}
      <div className={`${styles['glass-card']} p-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/20 to-teal-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white shadow-2xl animate-pulse">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Career Path Planning
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Design your professional growth journey
                </p>
              </div>
            </div>
            <button className={`${styles['glass-button']} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300`}>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Career Talk
              </span>
            </button>
          </div>

          {/* Career Stats */}
          <div className={`${styles['career-stats-grid']} mt-8`}>
            {careerStats.map((stat, index) => (
              <div 
                key={index} 
                className={`${styles['career-stat-card']} ${styles['slide-in-up']}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-3 text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </div>
                <div className={`${styles['career-stat-value']} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  {animateStats ? stat.value : 0}{stat.suffix}
                </div>
                <div className={`${styles['career-stat-label']} text-gray-600 dark:text-gray-400`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Timeline */}
      <div className={`${styles['glass-card']} p-6`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Your Career Journey
        </h2>
        <div className={styles['career-timeline']}>
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.id} 
              className={`${styles['career-milestone']} ${styles['fade-in']}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${styles['career-milestone-icon']} ${styles[milestone.status]}`}>
                {getMilestoneIcon(milestone.type)}
              </div>
              <div className={styles['career-milestone-content']}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{milestone.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                    {milestone.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Path Selection with Enhanced UI */}
      <div className={`${styles['glass-card']} p-6`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
          Choose Your Career Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careerPaths.map((path, index) => (
            <div
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              onMouseEnter={() => setHoveredPath(path.id)}
              onMouseLeave={() => setHoveredPath(null)}
              className={`relative cursor-pointer transform transition-all duration-500 ${
                selectedPath === path.id ? 'scale-105' : 'hover:scale-102'
              } ${styles['slide-in-up']}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedPath === path.id
                  ? 'border-transparent shadow-2xl'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${selectedPath === path.id ? styles['glass-card'] : 'bg-white/50 dark:bg-gray-900/50'}`}>
                {selectedPath === path.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-10 rounded-2xl`} />
                )}
                
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${path.color} text-white mb-4 shadow-lg ${
                    hoveredPath === path.id ? styles['career-float'] : ''
                  }`}>
                    {path.icon}
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {path.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {path.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Timeline</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {path.estimated_time}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Success Rate</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {path.completion_rate}%
                      </span>
                    </div>
                    
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${path.color} transition-all duration-1000 ease-out`}
                        style={{ 
                          width: selectedPath === path.id || hoveredPath === path.id ? `${path.completion_rate}%` : '0%' 
                        }}
                      >
                        <div className={styles['skill-progress-fill']} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Path Details */}
      {currentPath && (
        <div className={`${styles['glass-card']} p-6 ${styles['fade-in']}`}>
          {/* Path Overview */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Path Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`${styles['glass-card']} p-4 border border-blue-200 dark:border-blue-800`}>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Current Role</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{currentPath.current_role}</div>
              </div>
              <div className={`${styles['glass-card']} p-4 border border-purple-200 dark:border-purple-800`}>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Target Role</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{currentPath.target_role}</div>
              </div>
              <div className={`${styles['glass-card']} p-4 border border-green-200 dark:border-green-800`}>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Timeline</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{currentPath.estimated_time}</div>
              </div>
              <div className={`${styles['glass-card']} p-4 border border-yellow-200 dark:border-yellow-800`}>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">Success Rate</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{currentPath.completion_rate}%</div>
              </div>
            </div>
          </div>

          {/* Role Progression */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Role Progression Roadmap
            </h3>
            <div className="space-y-6">
              {currentPath.roles.map((role, index) => (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < currentPath.roles.length - 1 && (
                    <div className="absolute left-8 top-20 w-1 h-24 bg-gradient-to-b from-blue-400 to-purple-400 opacity-30" />
                  )}
                  
                  <div 
                    className={`${styles['glass-card']} p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                      selectedRole?.title === role.title ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                    }`}
                    onClick={() => setSelectedRole(selectedRole?.title === role.title ? null : role)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Level Indicator */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentPath.color} flex items-center justify-center text-white font-bold text-xl shadow-lg ${styles['career-float']}`}>
                        L{role.level}
                      </div>
                      
                      {/* Role Information */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                            {role.title}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGrowthColor(role.growth_outlook)}`}>
                              {role.growth_outlook} growth
                            </span>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                              selectedRole?.title === role.title ? 'rotate-90' : ''
                            }`} />
                          </div>
                        </div>
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className={`${styles['glass-card']} p-3 text-center`}>
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Timeline</div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">
                              {role.timeframe}
                            </div>
                          </div>
                          <div className={`${styles['glass-card']} p-3 text-center`}>
                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Salary Range</div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">
                              {role.salary_range}
                            </div>
                          </div>
                          <div className={`${styles['glass-card']} p-3 text-center`}>
                            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Positions</div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">
                              {role.available_positions} Open
                            </div>
                          </div>
                          <div className={`${styles['glass-card']} p-3 text-center`}>
                            <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Career Level</div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">
                              Level {role.level}
                            </div>
                          </div>
                        </div>

                        {/* Skills Preview */}
                        <div className="flex flex-wrap gap-2">
                          {role.skills_gain.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {role.skills_gain.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                              +{role.skills_gain.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {selectedRole?.title === role.title && (
                      <div className={`mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6 ${styles['slide-in-up']}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Requirements */}
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              Requirements
                            </h5>
                            <ul className="space-y-2">
                              {role.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Responsibilities */}
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              Key Responsibilities
                            </h5>
                            <ul className="space-y-2">
                              {role.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {/* Skills & Certifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              Skills You&apos;ll Gain
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {role.skills_gain.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                              Recommended Certifications
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {role.certifications.map((cert, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm font-medium">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-4">
                          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2">
                            <Rocket className="w-4 h-4" />
                            Apply for Position
                          </button>
                          <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-all duration-300 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            View Training Plan
                          </button>
                          <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-all duration-300 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Connect with Mentors
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Required Skills */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                Master These Skills
              </h3>
              <div className="space-y-3">
                {currentPath.required_skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className={`${styles['glass-card']} p-4 border border-green-200 dark:border-green-800 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                          <Zap className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{skill}</span>
                      </div>
                      <button className="px-4 py-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                        Learn
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommendations */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Endorsed By Leaders
              </h3>
              <div className="space-y-3">
                {currentPath.recommended_by.map((person, index) => (
                  <div 
                    key={index} 
                    className={`${styles['glass-card']} p-4 border border-purple-200 dark:border-purple-800 transform hover:scale-[1.02] transition-all duration-300`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {person.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{person}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Recommends this path
                        </div>
                      </div>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className={`${styles['glass-card']} p-8 mt-8 text-center border-2 border-blue-500 dark:border-blue-400`}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Take the first step towards your career goals. Connect with mentors, access exclusive resources, and track your progress.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-300 shadow-xl text-lg flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Start This Path
              </button>
              <button className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium transition-all duration-300 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}