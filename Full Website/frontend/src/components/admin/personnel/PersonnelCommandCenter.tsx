'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users,
  Plus,
  Search,
  Filter,
  UserCheck,
  Shield,
  Target
} from 'lucide-react'
import { User } from '../types'
import { SecurityUserCard } from './SecurityUserCard'
import { adminAPI } from '@/lib/api/admin'

const recentUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@nationalbank.ca',
    role: 'manager',
    status: 'active',
    lastActive: '2 minutes ago',
    avatar: '/api/placeholder/40/40',
    department: 'Commercial Banking',
    joinDate: '2024-01-15',
    completionRate: 95,
    points: 2840
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@nationalbank.ca',
    role: 'employee',
    status: 'active',
    lastActive: '15 minutes ago',
    avatar: '/api/placeholder/40/40',
    department: 'Investment Services',
    joinDate: '2024-02-01',
    completionRate: 78,
    points: 1950
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@nationalbank.ca',
    role: 'employee',
    status: 'inactive',
    lastActive: '2 hours ago',
    avatar: '/api/placeholder/40/40',
    department: 'Risk Management',
    joinDate: '2024-01-08',
    completionRate: 82,
    points: 2180
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@nationalbank.ca',
    role: 'admin',
    status: 'active',
    lastActive: '5 minutes ago',
    avatar: '/api/placeholder/40/40',
    department: 'Information Technology',
    joinDate: '2023-11-20',
    completionRate: 100,
    points: 3240
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@nationalbank.ca',
    role: 'manager',
    status: 'active',
    lastActive: '1 hour ago',
    avatar: '/api/placeholder/40/40',
    department: 'Human Resources',
    joinDate: '2023-12-10',
    completionRate: 89,
    points: 2650
  }
]

export const PersonnelCommandCenter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [users, setUsers] = useState<User[]>(recentUsers)

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAPI.getUsers()
        if (response && Array.isArray(response)) {
          setUsers(response)
        }
      } catch (err) {
        console.error('Failed to fetch users:', err)
        // Keep mock data as fallback
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Personnel Command Header */}
      <div className="personnel-search-command">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Users className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">Personnel Command</h2>
              <p className="text-slate-300">Security clearance & user management interface</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Personnel
          </motion.button>
        </div>

        {/* Advanced Search Interface */}
        <div className="search-interface">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-white transition-colors flex items-center justify-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filters
          </motion.button>
        </div>
      </div>

      {/* Personnel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <SecurityUserCard
            key={user.id}
            user={user}
            index={index}
          />
        ))}
      </div>

      {/* Personnel Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Personnel', value: users.length, icon: Users, color: 'blue' },
          { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: UserCheck, color: 'green' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'red' },
          { label: 'Avg Completion', value: `${Math.round(users.reduce((acc, u) => acc + u.completionRate, 0) / users.length)}%`, icon: Target, color: 'purple' }
        ].map((stat, index) => {
          const IconComponent = stat.icon
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <IconComponent className={`h-6 w-6 text-${stat.color}-400`} />
                <span className="text-slate-300 font-medium">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold text-${stat.color}-400`}>
                {stat.value}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}