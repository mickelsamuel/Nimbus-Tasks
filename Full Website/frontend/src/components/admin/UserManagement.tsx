'use client'

import React, { useState, useEffect } from 'react'
import { 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  UserCheck,
  UserX,
  Shield,
  AlertTriangle,
  Mail,
  Building
} from 'lucide-react'
import { api } from '@/lib/api/client'

interface AdminUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'employee' | 'manager' | 'admin'
  department: string
  isActive: boolean
  isApproved: boolean
  createdAt: string
  lastLogin?: string
  manager?: {
    firstName: string
    lastName: string
    email: string
  }
  managerEmail?: string
  approvedBy?: {
    firstName: string
    lastName: string
  }
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchUsers(), fetchPendingUsers()])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data.data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/admin/pending-users')
      setPendingUsers(response.data.data.pendingUsers || [])
    } catch (error) {
      console.error('Failed to fetch pending users:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveUser = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/approve`)
      
      // Refresh data
      await fetchUsers()
      await fetchPendingUsers()
      setShowApprovalModal(false)
      setSelectedUser(null)
    } catch (error: any) {
      console.error('Failed to approve user:', error)
      alert(error.message || 'Failed to approve user')
    }
  }

  const rejectUser = async (userId: string, reason: string) => {
    try {
      await api.post(`/admin/users/${userId}/reject`, { reason })
      
      // Refresh data
      await fetchUsers()
      await fetchPendingUsers()
      setShowApprovalModal(false)
      setSelectedUser(null)
      setRejectionReason('')
    } catch (error: any) {
      console.error('Failed to reject user:', error)
      alert(error.message || 'Failed to reject user')
    }
  }

  const filteredUsers = () => {
    const allUsers = [
      ...pendingUsers.map(u => ({ ...u, status: 'pending' })),
      ...users.filter(u => u.isApproved).map(u => ({ ...u, status: 'approved' })),
      ...users.filter(u => u.rejectedAt).map(u => ({ ...u, status: 'rejected' }))
    ]

    let filtered = allUsers
    
    if (activeTab !== 'all') {
      filtered = allUsers.filter(user => user.status === activeTab)
    }

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const getStatusBadge = (user: any) => {
    if (user.rejectedAt) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      )
    }
    
    if (!user.isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user registrations, approvals, and permissions
          </p>
        </div>
        
        {pendingUsers.length > 0 && (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} pending approval
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex space-x-1">
              {[
                { id: 'pending', label: 'Pending', count: pendingUsers.length },
                { id: 'approved', label: 'Approved', count: users.filter(u => u.isApproved).length },
                { id: 'rejected', label: 'Rejected', count: users.filter(u => u.rejectedAt).length },
                { id: 'all', label: 'All Users', count: users.length + pendingUsers.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-blue-200 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredUsers().length === 0 ? (
            <div className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'No users match the current filter.'}
              </p>
            </div>
          ) : (
            filteredUsers().map((user) => (
              <div key={user._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        {getStatusBadge(user)}
                        {user.role === 'admin' && (
                          <Shield className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Building className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.department}
                          </p>
                        </div>
                        
                        {user.manager && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manager: {user.manager.firstName} {user.manager.lastName}
                          </p>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        Registered: {new Date(user.createdAt).toLocaleDateString()}
                        {user.lastLogin && ` • Last login: ${new Date(user.lastLogin).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  
                  {!user.isApproved && !user.rejectedAt && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowApprovalModal(true)
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                      >
                        <UserCheck className="w-3 h-3 mr-1" />
                        Review
                      </button>
                    </div>
                  )}
                </div>
                
                {user.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-800 dark:text-red-400">
                      <strong>Rejection reason:</strong> {user.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Review User Application
            </h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedUser.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedUser.department}</p>
              </div>
              
              {selectedUser.managerEmail && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Requested Manager</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedUser.managerEmail}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Registration Date</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional: Provide a reason for rejection..."
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => approveUser(selectedUser._id)}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Approve
              </button>
              
              <button
                onClick={() => rejectUser(selectedUser._id, rejectionReason)}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <UserX className="w-4 h-4 mr-2" />
                Reject
              </button>
              
              <button
                onClick={() => {
                  setShowApprovalModal(false)
                  setSelectedUser(null)
                  setRejectionReason('')
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}