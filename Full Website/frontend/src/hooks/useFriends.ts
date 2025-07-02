import { useState, useEffect, useCallback } from 'react'
import { friendsApi, FriendsData, Colleague } from '@/lib/api/friends'

export const useFriends = () => {
  const [data, setData] = useState<FriendsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFriendsData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await friendsApi.getFriendsData()
      if (response.success) {
        setData(response.data)
      } else {
        setError('Failed to load networking data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load networking data')
      console.error('Error fetching friends data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const sendConnectionRequest = useCallback(async (
    colleagueId: number, 
    message: string, 
    type: 'colleague' | 'mentorship' | 'collaboration' = 'colleague'
  ) => {
    try {
      const response = await friendsApi.sendConnectionRequest(colleagueId, message, type)
      if (response.success) {
        // Refresh data to show updated requests
        await fetchFriendsData()
        return true
      }
      return false
    } catch (err) {
      console.error('Error sending connection request:', err)
      return false
    }
  }, [fetchFriendsData])

  const acceptConnection = useCallback(async (requestId: number) => {
    try {
      const response = await friendsApi.acceptConnection(requestId)
      if (response.success) {
        // Refresh data to show updated connections
        await fetchFriendsData()
        return true
      }
      return false
    } catch (err) {
      console.error('Error accepting connection:', err)
      return false
    }
  }, [fetchFriendsData])

  const declineConnection = useCallback(async (requestId: number) => {
    try {
      const response = await friendsApi.declineConnection(requestId)
      if (response.success) {
        // Refresh data to show updated requests
        await fetchFriendsData()
        return true
      }
      return false
    } catch (err) {
      console.error('Error declining connection:', err)
      return false
    }
  }, [fetchFriendsData])

  const removeConnection = useCallback(async (colleagueId: number) => {
    try {
      const response = await friendsApi.removeConnection(colleagueId)
      if (response.success) {
        // Refresh data to show updated connections
        await fetchFriendsData()
        return true
      }
      return false
    } catch (err) {
      console.error('Error removing connection:', err)
      return false
    }
  }, [fetchFriendsData])

  const searchColleagues = useCallback(async (query: string): Promise<Colleague[]> => {
    try {
      const response = await friendsApi.searchColleagues(query)
      if (response.success) {
        return response.data
      }
      return []
    } catch (err) {
      console.error('Error searching colleagues:', err)
      return []
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    fetchFriendsData()
  }, [fetchFriendsData])

  return {
    data,
    loading,
    error,
    refetch: fetchFriendsData,
    sendConnectionRequest,
    acceptConnection,
    acceptRequest: acceptConnection, // Alias for compatibility
    declineConnection,
    rejectRequest: declineConnection, // Alias for compatibility
    removeConnection,
    searchColleagues
  }
}