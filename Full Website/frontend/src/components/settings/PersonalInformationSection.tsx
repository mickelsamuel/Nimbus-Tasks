'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Check, 
  Camera, 
  Smartphone, 
  Award, 
  Trash2, 
  XCircle,
  MapPin,
  Activity,
  Calendar,
  Clock
} from 'lucide-react'
import AvatarViewer3D from '@/components/avatar/AvatarViewer3D'
import { useAuth } from '@/contexts/AuthContext'
import { useSettingsContext } from '@/components/settings/SettingsProvider'

import type { EmergencyContact, Certification } from '@/lib/api/settings'


const PersonalInformationSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const { user: authUser, isLoading: authLoading } = useAuth()
  const { 
    emergencyContacts, 
    certifications, 
    updateEmergencyContacts, 
    updateCertifications, 
    uploadAvatarPhoto, 
    deleteAvatarPhoto, 
    isLoading 
  } = useSettingsContext()
  
  const [editedUser, setEditedUser] = useState<any>(authUser || {})
  const [localContacts, setLocalContacts] = useState(emergencyContacts || [])
  const [localCertifications, setLocalCertifications] = useState(certifications || [])

  // Validation functions
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!editedUser.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!editedUser.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (!editedUser.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (editedUser.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(editedUser.phoneNumber.replace(/\s|-|\(|\)/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  useEffect(() => {
    if (authUser) {
      setEditedUser(authUser)
    }
  }, [authUser])

  useEffect(() => {
    setLocalContacts(emergencyContacts || [])
  }, [emergencyContacts])

  useEffect(() => {
    setLocalCertifications(certifications || [])
  }, [certifications])
  
  // Show loading state while user data is being fetched
  if (authLoading || !authUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          Personal Information
        </h2>
        <p className="text-gray-600">Manage your profile information, contacts, and professional details</p>
      </motion.div>

      <div className="space-y-8">
        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/20 p-6 rounded-xl border border-red-200/50"
        >
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                {authUser?.avatar ? (
                  <Image 
                    src={authUser.avatar} 
                    alt="Profile" 
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Change profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-2xl font-bold text-gray-900">{authUser?.firstName || 'Loading...'} {authUser?.lastName || ''}</h3>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Level {authUser?.stats?.level || 1}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{authUser?.department || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{authUser?.streak || 0} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Joined {authUser?.joinedAt ? new Date(authUser.joinedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Last active: {authUser?.lastActive ? new Date(authUser.lastActive).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{authUser?.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${authUser?.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
            <button
              onClick={async () => {
                if (isEditing) {
                  // Clear previous validation errors
                  setValidationErrors({})
                  
                  // Validate form
                  if (!validateForm()) {
                    return // Don't submit if validation fails
                  }
                  
                  try {
                    const updateData = {
                      firstName: editedUser.firstName,
                      lastName: editedUser.lastName,
                      email: editedUser.email,
                      phoneNumber: editedUser.phoneNumber,
                    }

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/users/profile`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(updateData)
                    })

                    if (response.ok) {
                      await response.json()
                      console.log('Profile updated successfully')
                      // Could trigger a refresh of user data here
                    } else {
                      const errorData = await response.json()
                      console.error('Failed to update profile:', errorData.message)
                      alert('Failed to update profile: ' + (errorData.message || 'Unknown error'))
                      return // Don't exit editing mode on error
                    }
                  } catch (error) {
                    console.error('Error updating profile:', error)
                    alert('Failed to update profile. Please try again.')
                    return // Don't exit editing mode on error
                  }
                } else {
                  // Clear validation errors when entering edit mode
                  setValidationErrors({})
                }
                setIsEditing(!isEditing);
              }}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={isEditing ? 'Save profile changes' : 'Edit profile information'}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : isEditing ? (
                <Check className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editedUser.firstName || ''}
                    onChange={(e) => setEditedUser({...editedUser, firstName: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
                      validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={validationErrors.firstName ? 'true' : 'false'}
                    aria-describedby={validationErrors.firstName ? 'firstName-error' : undefined}
                  />
                  {validationErrors.firstName && (
                    <p id="firstName-error" className="text-red-500 text-sm mt-1" role="alert">{validationErrors.firstName}</p>
                  )}
                </div>
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{authUser?.firstName || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editedUser.lastName || ''}
                    onChange={(e) => setEditedUser({...editedUser, lastName: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                      validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                  )}
                </div>
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{authUser?.lastName || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    value={editedUser.email || ''}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{authUser?.email || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              {isEditing ? (
                <div>
                  <input
                    type="tel"
                    value={editedUser.phoneNumber || ''}
                    onChange={(e) => setEditedUser({...editedUser, phoneNumber: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                      validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
                  )}
                </div>
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{authUser?.phoneNumber || 'N/A'}</p>
              )}
            </div>

            {/* Read-only fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <p className="p-3 bg-gray-100 rounded-lg text-gray-600">{authUser?.id || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <p className="p-3 bg-gray-100 rounded-lg text-gray-600">{authUser?.department || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <p className="p-3 bg-gray-100 rounded-lg text-gray-600">{authUser?.role || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
              <p className="p-3 bg-gray-100 rounded-lg text-gray-600">N/A</p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-red-600" />
              Emergency Contacts
            </h4>
            <button
              onClick={() => {
                setLocalContacts([...localContacts, { name: '', relationship: '', phone: '', email: '', isPrimary: false }])
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <User className="h-4 w-4" />
              Add Contact
            </button>
          </div>

          <div className="space-y-4">
            {localContacts.map((contact: EmergencyContact, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={contact.name}
                    onChange={(e) => {
                      const updated = [...localContacts]
                      updated[index].name = e.target.value
                      setLocalContacts(updated)
                    }}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={contact.relationship}
                    onChange={(e) => {
                      const updated = [...localContacts]
                      updated[index].relationship = e.target.value
                      setLocalContacts(updated)
                    }}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={contact.phone}
                    onChange={(e) => {
                      const updated = [...localContacts]
                      updated[index].phone = e.target.value
                      setLocalContacts(updated)
                    }}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={contact.email}
                      onChange={(e) => {
                        const updated = [...localContacts]
                        updated[index].email = e.target.value
                        setLocalContacts(updated)
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={() => {
                        const updated = localContacts.filter((_, i: number) => i !== index)
                        setLocalContacts(updated)
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {localContacts.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => updateEmergencyContacts(localContacts)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Contacts'}
              </button>
            </div>
          )}
        </motion.div>

        {/* Professional Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Professional Certifications
            </h4>
            <button
              onClick={() => {
                setLocalCertifications([...localCertifications, { 
                  name: '', 
                  issuingOrganization: '', 
                  issueDate: undefined, 
                  expiryDate: undefined, 
                  credentialId: '',
                  isActive: true 
                }])
              }}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
            >
              <Award className="h-4 w-4" />
              Add Certification
            </button>
          </div>

          <div className="space-y-4">
            {localCertifications.map((cert: Certification, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Certification Name"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...localCertifications]
                      updated[index].name = e.target.value
                      setLocalCertifications(updated)
                    }}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Organization"
                    value={cert.issuingOrganization}
                    onChange={(e) => {
                      const updated = [...localCertifications]
                      updated[index].issuingOrganization = e.target.value
                      setLocalCertifications(updated)
                    }}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="date"
                    placeholder="Issue Date"
                    value={cert.issueDate ? (cert.issueDate instanceof Date ? cert.issueDate.toISOString().split('T')[0] : cert.issueDate) : ''}
                    onChange={(e) => {
                      const updated = [...localCertifications]
                      updated[index].issueDate = e.target.value ? new Date(e.target.value) : undefined
                      setLocalCertifications(updated)
                    }}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="date"
                    placeholder="Expiry Date"
                    value={cert.expiryDate ? (cert.expiryDate instanceof Date ? cert.expiryDate.toISOString().split('T')[0] : cert.expiryDate) : ''}
                    onChange={(e) => {
                      const updated = [...localCertifications]
                      updated[index].expiryDate = e.target.value ? new Date(e.target.value) : undefined
                      setLocalCertifications(updated)
                    }}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    placeholder="Credential ID"
                    value={cert.credentialId}
                    onChange={(e) => {
                      const updated = [...localCertifications]
                      updated[index].credentialId = e.target.value
                      setLocalCertifications(updated)
                    }}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={cert.isActive}
                        onChange={(e) => {
                          const updated = [...localCertifications]
                          updated[index].isActive = e.target.checked
                          setLocalCertifications(updated)
                        }}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <button
                      onClick={() => {
                        const updated = localCertifications.filter((_, i: number) => i !== index)
                        setLocalCertifications(updated)
                      }}
                      className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {localCertifications.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => updateCertifications(localCertifications)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Certifications'}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Avatar Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Avatar Customization</h3>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Upload Photo</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-all">
                      <div className="text-center">
                        <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload photo</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadAvatarPhoto(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    
                    <button
                      onClick={deleteAvatarPhoto}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                    >
                      Reset to Default
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">3D Avatar Customization</h4>
                  <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                    <AvatarViewer3D 
                      avatarUrl={authUser?.avatar || 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb'}
                      isAnimating={true}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PersonalInformationSection