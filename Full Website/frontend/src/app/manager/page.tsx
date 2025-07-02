'use client'

import { useState, useEffect } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { RoleProtectedRoute } from '@/components/layout/protected'
import EnhancedManagerDashboard from '@/components/manager/EnhancedManagerDashboardV2'
import { type TeamMember, type TeamMetrics } from '@/components/manager/types'
import api from '@/lib/api/client'

export default function ManagerPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics>({
    totalMembers: 0,
    activeToday: 0,
    completionRate: 0,
    averagePerformance: 0,
    pendingAssignments: 0,
    upcomingDeadlines: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real team data from API
  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch team members and metrics from API
        const [membersRes, metricsRes] = await Promise.all([
          api.get('/manager/team-members'),
          api.get('/manager/metrics')
        ])
        
        if (membersRes.data) {
          setTeamMembers(membersRes.data.members || [])
        }
        
        if (metricsRes.data) {
          setTeamMetrics({
            totalMembers: metricsRes.data.totalMembers || 0,
            activeToday: metricsRes.data.activeToday || 0,
            completionRate: metricsRes.data.completionRate || 0,
            averagePerformance: metricsRes.data.averagePerformance || 0,
            pendingAssignments: metricsRes.data.pendingAssignments || 0,
            upcomingDeadlines: metricsRes.data.upcomingDeadlines || 0
          })
        }
      } catch (error) {
        setError('Failed to fetch team data')
        // Keep empty state for graceful degradation
      } finally {
        setLoading(false)
      }
    }
    
    fetchManagerData()
  }, [])

  return (
    <RoleProtectedRoute allowedRoles={['manager', 'admin']}>
      <ProtectedLayout>
        <EnhancedManagerDashboard 
          teamMembers={teamMembers}
          teamMetrics={teamMetrics}
          loading={loading}
          error={error}
        />
      </ProtectedLayout>
    </RoleProtectedRoute>
  )
}