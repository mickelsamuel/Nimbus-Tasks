'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Edit3, 
  UserPlus, 
  Users, 
  Crown,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { useTeams } from '../../../hooks/useTeams';
import { useAuth } from '../../../contexts/AuthContext';

interface ManagementTabProps {
  isDark?: boolean;
}

interface EditTeamForm {
  name: string;
  description: string;
  category: string;
  maxMembers: number;
}

const ManagementTab: React.FC<ManagementTabProps> = ({ isDark = false }) => {
  const { teams, updateTeam, deleteTeam } = useTeams();
  const { user } = useAuth();
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditTeamForm>({
    name: '',
    description: '',
    category: '',
    maxMembers: 10
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Get teams where user is the owner/leader
  const managedTeams = teams.filter(team => 
    team.leaderId === user?.id || team.members?.some(member => 
      member.id === user?.id && (member.role === 'leader' || member.role === 'co-leader')
    )
  );

  const handleEditTeam = (team: any) => {
    setEditingTeam(team.id);
    setEditForm({
      name: team.name,
      description: team.description,
      category: team.category,
      maxMembers: team.maxMembers || 10
    });
  };

  const handleSaveEdit = async (teamId: string) => {
    try {
      setLoading(teamId);
      await updateTeam(teamId, editForm);
      setEditingTeam(null);
    } catch (error) {
      console.error('Failed to update team:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      setLoading(teamId);
      await deleteTeam(teamId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete team:', error);
    } finally {
      setLoading(null);
    }
  };

  const [showInviteModal, setShowInviteModal] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteMessage, setInviteMessage] = useState('');

  const handleInviteMembers = async (teamId: string) => {
    if (!inviteEmail) {
      alert('Please enter an email address');
      return;
    }

    try {
      setLoading(teamId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          message: inviteMessage
        })
      });

      if (response.ok) {
        alert('Invitation sent successfully!');
        setShowInviteModal(null);
        setInviteEmail('');
        setInviteRole('member');
        setInviteMessage('');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (managedTeams.length === 0) {
    return (
      <div className={`p-8 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-xl border ${isDark ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
        <div className="text-center">
          <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No Managed Teams
          </h3>
          <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            You don&apos;t have any teams to manage. Create a team to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-xl border ${isDark ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Team Management
        </h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          Manage your teams, edit details, and invite new members.
        </p>
      </div>

      {managedTeams.map((team) => (
        <motion.div
          key={team.id}
          className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-xl border ${isDark ? 'border-slate-700/50' : 'border-gray-200/50'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-gray-100'} flex items-center justify-center`}>
                <Users className={`w-6 h-6 ${isDark ? 'text-slate-300' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {team.name}
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {team.members?.length || 0} members • {team.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Owner
              </span>
            </div>
          </div>

          {editingTeam === team.id ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSaveEdit(team.id)}
                  disabled={loading === team.id}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {loading === team.id ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditingTeam(null)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                {team.description}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEditTeam(team)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Team
                </button>
                <button
                  onClick={() => setShowInviteModal(team.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Members
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(team.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Team
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm === team.id && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`p-6 rounded-2xl max-w-md w-full mx-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Delete Team
                  </h3>
                </div>
                <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Are you sure you want to delete &ldquo;{team.name}&rdquo;? This action cannot be undone.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    disabled={loading === team.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {loading === team.id ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Invite Members Modal */}
          {showInviteModal === team.id && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`p-6 rounded-2xl max-w-md w-full mx-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <UserPlus className="w-6 h-6 text-green-500" />
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Invite Team Members
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    >
                      <option value="member">Member</option>
                      <option value="co-leader">Co-Leader</option>
                      <option value="analyst">Analyst</option>
                      <option value="contributor">Contributor</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      Personal Message (Optional)
                    </label>
                    <textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Join our team to work on exciting projects..."
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => handleInviteMembers(team.id)}
                    disabled={loading === team.id || !inviteEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    {loading === team.id ? 'Sending...' : 'Send Invitation'}
                  </button>
                  <button
                    onClick={() => {
                      setShowInviteModal(null);
                      setInviteEmail('');
                      setInviteRole('member');
                      setInviteMessage('');
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ManagementTab;