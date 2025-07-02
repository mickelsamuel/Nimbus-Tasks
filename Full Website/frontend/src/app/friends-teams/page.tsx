'use client'

import React from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import FriendsTeamsContainer from '@/components/friends-teams/FriendsTeamsContainer'

export default function FriendsTeamsPage() {
  return (
    <ProtectedLayout>
      <FriendsTeamsContainer />
    </ProtectedLayout>
  )
}