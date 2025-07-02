'use client'

import React from 'react'
import { Network, Users, Building2, Award } from 'lucide-react'

interface NetworkNode {
  id: number
  name: string
  role: string
  department: string
  connectionStrength: number
  mutualConnections: number
}

export default function ProfessionalNetwork() {

  const networkNodes: NetworkNode[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Analyst',
      department: 'Investment Banking',
      connectionStrength: 95,
      mutualConnections: 8
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Risk Manager',
      department: 'Risk Management',
      connectionStrength: 87,
      mutualConnections: 12
    }
  ]

  return (
    <div className="space-y-6">
      <div className="social-hub-header p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Professional Network</h2>
        <p className="text-white/70">Visualize and explore your professional connections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-2">
          <div className="professional-network-visualization">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Network className="h-5 w-5 mr-2 text-accent-teal" />
              Network Map
            </h3>
            <div className="h-96 flex items-center justify-center bg-white/5 rounded-lg">
              <div className="text-center">
                <Network className="h-16 w-16 mx-auto text-white/30 mb-4" />
                <p className="text-white/50">Interactive network visualization would go here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div className="space-y-4">
          <div className="achievement-ring-card">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2 text-accent-teal" />
              Network Overview
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70 text-sm">Direct Connections</span>
                <span className="text-white font-semibold">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70 text-sm">2nd Degree</span>
                <span className="text-white font-semibold">1,832</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70 text-sm">Departments</span>
                <span className="text-white font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70 text-sm">Avg. Connection Strength</span>
                <span className="text-white font-semibold">89%</span>
              </div>
            </div>
          </div>

          <div className="achievement-ring-card">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-secondary-teal" />
              Top Departments
            </h4>
            <div className="space-y-2">
              {['Investment Banking', 'Risk Management', 'Technology', 'Retail Banking'].map((dept, index) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">{dept}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-teal rounded-full"
                        style={{ width: `${85 - index * 15}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-xs">{Math.round(85 - index * 15)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Connections */}
      <div className="professional-network-visualization">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-400" />
          Key Connections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {networkNodes.map((node) => (
            <div 
              key={node.id}
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-accent-teal/50 transition-colors cursor-pointer"
              onClick={() => console.log('Selected node:', node)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-teal to-secondary-teal rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {node.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{node.name}</h4>
                  <p className="text-white/70 text-sm">{node.role}</p>
                  <p className="text-white/50 text-xs">{node.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-accent-teal text-sm font-semibold">{node.connectionStrength}%</p>
                  <p className="text-white/50 text-xs">{node.mutualConnections} mutual</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}