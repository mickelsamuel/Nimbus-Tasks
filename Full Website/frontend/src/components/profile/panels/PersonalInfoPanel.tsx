'use client';

import React from 'react';
import { Edit3, Save, X, Mail, Phone, MapPin, Briefcase, Calendar, User, Building } from 'lucide-react';
import { UserProfile, safeRenderLocation } from '../types';

interface PersonalInfoPanelProps {
  user: UserProfile;
  editedUser: UserProfile;
  setEditedUser: (user: UserProfile) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function PersonalInfoPanel({
  user,
  editedUser,
  setEditedUser,
  isEditing,
  setIsEditing,
  onSave,
  onCancel
}: PersonalInfoPanelProps) {
  const handleInputChange = (field: string, value: string) => {
    setEditedUser({
      ...editedUser,
      [field]: value
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Personal Information
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage your personal details and contact information
          </p>
        </div>
        
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-400 rounded-xl transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40 text-green-700 dark:text-green-400 rounded-xl transition-colors"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            First Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedUser.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your first name"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-900 dark:text-white">
              {user.firstName || 'Not specified'}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            Last Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedUser.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your last name"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-900 dark:text-white">
              {user.lastName || 'Not specified'}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Mail className="h-4 w-4" />
            Email Address
          </label>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-900 dark:text-white">
            {user.email || 'Not specified'}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Email cannot be changed here. Contact support if needed.
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Phone className="h-4 w-4" />
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={editedUser.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your phone number"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-900 dark:text-white">
              {user.phone || 'Not specified'}
            </div>
          )}
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Building className="h-4 w-4" />
            Department
          </label>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-900 dark:text-white">
            {user.department || 'Not specified'}
          </div>
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Briefcase className="h-4 w-4" />
            Job Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedUser.jobTitle || ''}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your job title"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-900 dark:text-white">
              {user.jobTitle || 'Not specified'}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            Location
          </label>
          {isEditing ? (
            <input
              type="text"
              value={typeof editedUser.location === 'string' ? editedUser.location : ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your location"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-900 dark:text-white">
              {safeRenderLocation(user.location)}
            </div>
          )}
        </div>

        {/* Join Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            Join Date
          </label>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-900 dark:text-white">
            {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Not specified'}
          </div>
        </div>
      </div>
    </div>
  );
}