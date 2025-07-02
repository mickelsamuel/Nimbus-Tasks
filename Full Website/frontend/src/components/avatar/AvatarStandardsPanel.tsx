'use client'

import { Award, Shield } from 'lucide-react'
import { ComplianceResult } from '@/lib/avatarApi'

interface AvatarStandardsPanelProps {
  compliance: ComplianceResult | null
}

interface VersionItem {
  id: string
  name: string
  date: string
  active: boolean
}

const MOCK_VERSIONS: VersionItem[] = [
  { id: 'v1', name: 'Executive Look v1.0', date: '2024-01-15', active: false },
  { id: 'v2', name: 'Professional v2.1', date: '2024-01-18', active: false },
  { id: 'v3', name: 'Current Executive v3.0', date: '2024-01-20', active: true }
]

export default function AvatarStandardsPanel({ compliance }: AvatarStandardsPanelProps) {
  const getComplianceColor = (passed: boolean) => {
    return passed ? 'text-green-400' : 'text-red-400'
  }

  const getComplianceIndicator = (passed: boolean) => {
    return passed ? '✓' : '✗'
  }

  return (
    <div className="w-80 bg-slate-900/90 backdrop-blur-sm border-l border-slate-700/50 flex flex-col">
      {/* Professional Standards Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">Professional Standards</h4>
        </div>
        
        <div className="space-y-4">
          {compliance && (
            <>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${compliance.bankingStandards.passed ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-slate-300">Banking Standards</span>
                </div>
                <span className={`text-sm font-semibold ${getComplianceColor(compliance.bankingStandards.passed)}`}>
                  {getComplianceIndicator(compliance.bankingStandards.passed)} {compliance.bankingStandards.passed ? 'Compliant' : 'Non-Compliant'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${compliance.professionalAppearance.passed ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-slate-300">Professional Appearance</span>
                </div>
                <span className={`text-sm font-semibold ${getComplianceColor(compliance.professionalAppearance.passed)}`}>
                  {getComplianceIndicator(compliance.professionalAppearance.passed)} {compliance.professionalAppearance.passed ? 'Approved' : 'Needs Review'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${compliance.accessibility.passed ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-sm text-slate-300">Accessibility</span>
                </div>
                <span className={`text-sm font-semibold ${compliance.accessibility.passed ? 'text-green-400' : 'text-yellow-400'}`}>
                  {compliance.accessibility.passed ? '✓ Compliant' : '⚠ Review Required'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Version Control Section */}
      <div className="p-6 border-b border-slate-700/50">
        <h5 className="text-lg font-semibold text-white mb-4">Avatar Versions</h5>
        <div className="space-y-2">
          {MOCK_VERSIONS.map((version) => (
            <div key={version.id} className={`p-3 rounded-lg border transition-all cursor-pointer ${
              version.active 
                ? 'bg-blue-600/20 border-blue-500/50 shadow-md' 
                : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{version.name}</div>
                  <div className="text-xs text-slate-400">{version.date}</div>
                </div>
                {version.active && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                    Current
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Integration Section */}
      <div className="p-6 flex-1">
        <h5 className="text-lg font-semibold text-white mb-4">Team Consistency</h5>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-600/10 rounded-lg border border-blue-500/20">
            <Award className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm text-blue-300 font-medium">Executive Team Standard</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-600/10 rounded-lg border border-green-500/20">
            <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-sm text-green-300 font-medium">Banking Compliance</span>
          </div>
        </div>

        {/* Overall Score */}
        {compliance && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg border border-purple-500/20">
            <div className="text-center">
              <div className="text-sm text-slate-300 mb-1">Overall Compliance Score</div>
              <div className="text-2xl font-bold text-white">
                {Math.round((compliance.bankingStandards.score + compliance.professionalAppearance.score + compliance.accessibility.score) / 3)}%
              </div>
              <div className="text-xs text-purple-300 mt-1">Industry Standard</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}