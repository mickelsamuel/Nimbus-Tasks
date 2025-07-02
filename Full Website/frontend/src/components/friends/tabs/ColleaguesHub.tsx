'use client'

import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import { Colleague, SearchFilters } from '../types'
import ColleagueCard from '../cards/ColleagueCard'

interface ColleaguesHubProps {
  onConnect?: (colleagueId: number) => void
  onMessage?: (colleagueId: number) => void
}

export default function ColleaguesHub({ onConnect, onMessage }: ColleaguesHubProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    department: '',
    skills: [],
    status: '',
    departmentFilter: '',
    mentorshipFilter: '',
    statusFilter: '',
    skillsFilter: []
  })

  // Mock data - would normally come from API
  const mockColleagues: Colleague[] = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'Senior Investment Analyst',
      department: 'Investment Banking',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      skills: ['Financial Modeling', 'Risk Assessment', 'Market Analysis'],
      yearsExperience: 8,
      mentorshipPotential: 'mentor',
      collaborationHistory: 12,
      projectsInCommon: 3,
      connectionStrength: 92,
      lastActive: '2 hours ago',
      mutualFriends: 5,
      isOnline: true,
      connectionDate: '2023-06-15',
      messageCount: 23,
      collaborationScore: 88,
      joinedAt: '2019-03-15T00:00:00.000Z',
      isConnected: false,
      professionalCertifications: [
        { name: 'CFA', issuer: 'CFA Institute', date: '2020-06-15' },
        { name: 'FRM', issuer: 'GARP', date: '2021-11-30' }
      ],
      achievements: [
        { title: 'Top Performer Q3', description: 'Exceeded targets by 150%', date: '2024-09-30' },
        { title: 'Innovation Award', description: 'Led digital transformation initiative', date: '2024-06-15' }
      ],
      expertise: ['Portfolio Management', 'Derivatives'],
      location: 'Toronto, ON'
    }
  ]

  const filteredColleagues = mockColleagues.filter(colleague => {
    const matchesSearch = colleague.firstName.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
                         colleague.lastName.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
                         colleague.role.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())
    
    const matchesDepartment = !searchFilters.departmentFilter || 
                             colleague.department === searchFilters.departmentFilter
    
    const matchesMentorship = !searchFilters.mentorshipFilter || 
                             colleague.mentorshipPotential === searchFilters.mentorshipFilter
    
    const matchesStatus = !searchFilters.statusFilter || 
                         colleague.status === searchFilters.statusFilter

    return matchesSearch && matchesDepartment && matchesMentorship && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="professional-discovery-engine">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Search colleagues by name, role, or skills..."
                value={searchFilters.searchTerm}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-accent-teal focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={searchFilters.departmentFilter}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, departmentFilter: e.target.value }))}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-accent-teal focus:outline-none"
            >
              <option value="">All Departments</option>
              <option value="Investment Banking">Investment Banking</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Technology">Technology</option>
              <option value="Retail Banking">Retail Banking</option>
              <option value="Human Resources">Human Resources</option>
            </select>
            
            <select
              value={searchFilters.mentorshipFilter}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, mentorshipFilter: e.target.value }))}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-accent-teal focus:outline-none"
            >
              <option value="">All Mentorship</option>
              <option value="mentor">Mentors</option>
              <option value="mentee">Mentees</option>
            </select>
            
            <select
              value={searchFilters.statusFilter}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, statusFilter: e.target.value }))}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-accent-teal focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="busy">Busy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Users className="h-5 w-5 mr-2 text-accent-teal" />
          Professional Colleagues ({filteredColleagues.length})
        </h3>
      </div>

      {/* Colleagues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredColleagues.map((colleague) => (
          <ColleagueCard
            key={colleague.id}
            colleague={colleague}
            onConnect={onConnect}
            onMessage={onMessage}
          />
        ))}
      </div>

      {filteredColleagues.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-white/30 mb-4" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">No colleagues found</h3>
          <p className="text-white/50">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  )
}