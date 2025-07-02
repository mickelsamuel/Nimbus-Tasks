'use client'

import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { NotificationCenter } from '@/components/common/notifications/NotificationCenter'
import { useAuth } from '@/contexts/AuthContext'

export default function NotificationsPage() {
  const { user } = useAuth()

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto p-6">
        <NotificationCenter userId={user?.id?.toString()} />
      </div>
    </ProtectedLayout>
  )
}