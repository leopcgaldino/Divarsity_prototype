'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { OpportunityFeed } from '@/components/dashboard/OpportunityFeed'
import { DashboardLayout } from '@/components/dashboard/DashboardLayoutV2'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0A66C2] border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <OpportunityFeed />
    </DashboardLayout>
  )
}