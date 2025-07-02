'use client'

import { useState } from 'react'
import { 
  Calendar, Clock, Users, 
  MapPin, Send, Plus, X, 
  CheckCircle, UserPlus,
  AlertCircle, Loader2
} from 'lucide-react'
import { useMeetings } from '@/hooks/useMeetings'
import { CreateMeetingRequest, MeetingInvite } from '@/lib/api/meetings'


export function MeetingScheduler() {
  const {
    meetings,
    availableRooms,
    loading,
    error,
    submitting,
    createMeeting,
    joinMeeting,
    cancelMeeting
  } = useMeetings()

  const [activeStep, setActiveStep] = useState<'details' | 'attendees' | 'review'>('details')
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    type: 'in-person' as 'in-person' | 'hybrid' | 'virtual',
    room: '',
    agenda: [''],
    description: ''
  })
  const [invites, setInvites] = useState<MeetingInvite[]>([])
  const [newInvite, setNewInvite] = useState({ email: '', name: '', role: '', required: true })
  const [successMessage, setSuccessMessage] = useState<string>('')

  // Helper functions
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleFormChange = (field: string, value: string | string[]) => {
    setMeetingForm(prev => ({ ...prev, [field]: value }))
  }

  const addAgendaItem = () => {
    setMeetingForm(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }))
  }

  const updateAgendaItem = (index: number, value: string) => {
    setMeetingForm(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }))
  }

  const removeAgendaItem = (index: number) => {
    setMeetingForm(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }))
  }

  const addInvite = () => {
    if (newInvite.email && newInvite.name) {
      setInvites(prev => [...prev, newInvite])
      setNewInvite({ email: '', name: '', role: '', required: true })
    }
  }

  const removeInvite = (index: number) => {
    setInvites(prev => prev.filter((_, i) => i !== index))
  }

  const handleScheduleMeeting = async () => {
    const meetingData: CreateMeetingRequest = {
      title: meetingForm.title,
      date: meetingForm.date,
      startTime: meetingForm.startTime,
      endTime: meetingForm.endTime,
      type: meetingForm.type,
      room: meetingForm.room,
      agenda: meetingForm.agenda.filter(item => item.trim()),
      description: meetingForm.description,
      attendees: invites
    }

    const success = await createMeeting(meetingData)
    if (success) {
      showSuccessMessage('Meeting scheduled successfully!')
      
      // Reset form
      setMeetingForm({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        type: 'in-person',
        room: '',
        agenda: [''],
        description: ''
      })
      setInvites([])
      setActiveStep('details')
    }
  }

  const handleJoinMeeting = async (meetingId: string) => {
    const joinUrl = await joinMeeting(meetingId)
    if (joinUrl) {
      window.open(joinUrl, '_blank')
    }
  }

  const handleCancelMeeting = async (meetingId: string) => {
    const success = await cancelMeeting(meetingId)
    if (success) {
      showSuccessMessage('Meeting cancelled successfully!')
    }
  }

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'in-person': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'hybrid': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
      case 'virtual': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'scheduled': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'cancelled': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Meeting Scheduler */}
      <div className="dashboard-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Schedule Meeting
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create and manage meetings
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[
            { id: 'details', label: 'Details' },
            { id: 'attendees', label: 'Attendees' },
            { id: 'review', label: 'Review' }
          ].map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                activeStep === step.id
                  ? 'bg-purple-600 text-white'
                  : index < ['details', 'attendees', 'review'].indexOf(activeStep)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {index < ['details', 'attendees', 'review'].indexOf(activeStep) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                activeStep === step.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {step.label}
              </span>
              {index < 2 && <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mx-4" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {activeStep === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Title
              </label>
              <input
                type="text"
                value={meetingForm.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Enter meeting title"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={meetingForm.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Type
                </label>
                <select
                  value={meetingForm.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="in-person">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={meetingForm.startTime}
                  onChange={(e) => handleFormChange('startTime', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={meetingForm.endTime}
                  onChange={(e) => handleFormChange('endTime', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {meetingForm.type !== 'virtual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room
                </label>
                <select
                  value={meetingForm.room}
                  onChange={(e) => handleFormChange('room', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a room</option>
                  {availableRooms.map((room) => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agenda Items
              </label>
              <div className="space-y-2">
                {meetingForm.agenda.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAgendaItem(index, e.target.value)}
                      placeholder={`Agenda item ${index + 1}`}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {meetingForm.agenda.length > 1 && (
                      <button
                        onClick={() => removeAgendaItem(index)}
                        className="p-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addAgendaItem}
                  className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add agenda item
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveStep('attendees')}
              disabled={!meetingForm.title || !meetingForm.startTime || !meetingForm.endTime || submitting}
              className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Next: Add Attendees
            </button>
          </div>
        )}

        {activeStep === 'attendees' && (
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Add Attendees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newInvite.name}
                  onChange={(e) => setNewInvite(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={newInvite.role}
                  onChange={(e) => setNewInvite(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Role (optional)"
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newInvite.required}
                    onChange={(e) => setNewInvite(prev => ({ ...prev, required: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
                </label>
              </div>
              <button
                onClick={addInvite}
                disabled={!newInvite.email || !newInvite.name}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Attendee
              </button>
            </div>

            {invites.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Attendees ({invites.length})</h3>
                <div className="space-y-2">
                  {invites.map((invite, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{invite.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{invite.email}</div>
                        {invite.role && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{invite.role}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invite.required 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        }`}>
                          {invite.required ? 'Required' : 'Optional'}
                        </span>
                        <button
                          onClick={() => removeInvite(index)}
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setActiveStep('details')}
                className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setActiveStep('review')}
                className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Review Meeting
              </button>
            </div>
          </div>
        )}

        {activeStep === 'review' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Meeting Summary</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Title:</span>
                  <div className="font-medium text-gray-900 dark:text-white">{meetingForm.title}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date & Time:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(meetingForm.date).toLocaleDateString()} at {meetingForm.startTime} - {meetingForm.endTime}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(meetingForm.type)}`}>
                    {meetingForm.type.charAt(0).toUpperCase() + meetingForm.type.slice(1)}
                  </span>
                </div>
                {meetingForm.room && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Room:</span>
                    <div className="font-medium text-gray-900 dark:text-white">{meetingForm.room}</div>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Attendees:</span>
                  <div className="font-medium text-gray-900 dark:text-white">{invites.length} people invited</div>
                </div>
                {meetingForm.agenda.filter(item => item.trim()).length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Agenda:</span>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {meetingForm.agenda.filter(item => item.trim()).map((item, index) => (
                        <li key={index} className="text-sm text-gray-900 dark:text-white">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setActiveStep('attendees')}
                className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleScheduleMeeting}
                disabled={submitting}
                className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {submitting ? 'Scheduling...' : 'Schedule Meeting'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Meetings */}
      <div className="dashboard-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white shadow-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Meetings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your scheduled meetings
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading meetings...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <div className="text-lg font-medium mb-2">No upcoming meetings</div>
                <div className="text-sm">Schedule your first meeting above</div>
              </div>
            ) : (
              meetings.map((meeting) => (
            <div key={meeting.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{meeting.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Organized by {meeting.organizer}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(meeting.type)}`}>
                    {meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{meeting.date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{meeting.startTime} - {meeting.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{meeting.room}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{meeting.attendees.length} attendees</span>
                </div>
              </div>
              
              {meeting.agenda && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Agenda:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {meeting.agenda.map((item, index) => (
                      <li key={index} className="text-sm text-gray-900 dark:text-white">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleJoinMeeting(meeting.id)}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Join Meeting
                </button>
                <button 
                  onClick={() => handleCancelMeeting(meeting.id)}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
          )}
          </div>
        )}
      </div>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}