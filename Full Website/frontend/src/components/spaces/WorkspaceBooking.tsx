'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Users, MapPin, 
  Monitor, Coffee,
  CheckCircle, XCircle,
  AlertCircle, Loader2
} from 'lucide-react'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { WorkspaceRoom } from '@/lib/api/workspaces'
import { BookingRequest } from '@/lib/api/workspaces'


export function WorkspaceBooking() {
  const {
    rooms,
    loading,
    error,
    submitting,
    bookRoom,
    getRoomAvailability
  } = useWorkspaces()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [duration, setDuration] = useState(1)
  const [successMessage, setSuccessMessage] = useState<string>('')

  // Helper functions
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Load room availability when selected room or date changes
  useEffect(() => {
    if (selectedRoom && selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0]
      getRoomAvailability(selectedRoom.id, dateString)
    }
  }, [selectedRoom, selectedDate, getRoomAvailability])

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'focus': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'collaboration': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
      case 'phone': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
      case 'training': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getAvailabilityStats = (room: WorkspaceRoom) => {
    const available = room.timeSlots.filter(slot => slot.available).length
    const total = room.timeSlots.length
    return { available, total, percentage: Math.round((available / total) * 100) }
  }

  const handleBookRoom = async () => {
    if (selectedRoom && selectedTimeSlot) {
      const bookingData: BookingRequest = {
        roomId: selectedRoom.id,
        date: selectedDate.toISOString().split('T')[0],
        startTime: selectedTimeSlot,
        duration: duration,
        purpose: 'General Meeting'
      }

      const success = await bookRoom(bookingData)
      if (success) {
        showSuccessMessage(`Successfully booked ${selectedRoom.name} for ${selectedTimeSlot}!`)
        setSelectedTimeSlot(null)
      }
    }
  }

  return (
    <div className="dashboard-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Workspace Booking
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Book meeting rooms and workspaces
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {rooms.length} Rooms Available
          </span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Room List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading rooms...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 text-red-600 dark:text-red-400">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {rooms.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg font-medium mb-2">No rooms available</div>
              <div className="text-sm">Please try again later</div>
            </div>
          ) : (
            rooms.map((room) => {
          const stats = getAvailabilityStats(room)
          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedRoom?.id === room.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{room.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.type)}`}>
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{room.capacity}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Floor {room.floor}, {room.building}</span>
                </div>
              </div>
              
              {/* Availability Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Availability Today</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stats.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
              
              {/* Equipment Preview */}
              <div className="flex flex-wrap gap-1">
                {room.equipment.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                    {item}
                  </span>
                ))}
                {room.equipment.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                    +{room.equipment.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )
        })
          )}
        </div>
      )}

      {/* Time Slot Selection */}
      {selectedRoom && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Available Time Slots - {selectedRoom.name}
          </h3>
          
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-4">
            {selectedRoom.timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available ? setSelectedTimeSlot(slot.time) : null}
                disabled={!slot.available}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTimeSlot === slot.time
                    ? 'bg-blue-600 text-white shadow-md'
                    : slot.available
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {slot.available ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  <span>{slot.time}</span>
                </div>
                {!slot.available && slot.bookedBy && (
                  <div className="text-xs mt-1 opacity-75">{slot.bookedBy}</div>
                )}
              </button>
            ))}
          </div>
          
          {/* Duration Selection */}
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration:
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4 hours</option>
            </select>
          </div>
          
          {/* Room Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Equipment</h4>
              <div className="space-y-1">
                {selectedRoom.equipment.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Monitor className="w-3 h-3" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Amenities</h4>
              <div className="space-y-1">
                {selectedRoom.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Coffee className="w-3 h-3" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Booking Button */}
          <button
            onClick={handleBookRoom}
            disabled={!selectedTimeSlot || submitting}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedTimeSlot && !submitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting
              ? 'Booking...'
              : selectedTimeSlot 
              ? `Book ${selectedRoom.name} for ${selectedTimeSlot} (${duration} hour${duration > 1 ? 's' : ''})`
              : 'Select a time slot to book'
            }
          </button>
        </div>
      )}
      
      {/* Success Message */}
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