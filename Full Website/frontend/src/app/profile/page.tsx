'use client'

import React from 'react'
import ProfilePageContainer from '@/components/profile/ProfilePageContainer'
import ProtectedLayout from '@/components/layout/ProtectedLayout'

export default function ProfilePage() {
  return (
    <ProtectedLayout>
      <ProfilePageContainer />
    </ProtectedLayout>
  )
}