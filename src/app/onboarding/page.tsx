'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { OnboardingForm } from '@/components/onboarding/OnboardingForm'
import { AuthLayout } from '@/components/layout/MainLayout'

export default function OnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/onboarding')
    }
    if (!loading && user) {
      // Check if profile already exists - if so, redirect to dashboard
      // This will be handled by the middleware
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <AuthLayout>
        <div className="w-full max-w-3xl mx-auto py-12 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
          </div>
        </div>
      </AuthLayout>
    )
  }

  if (!user) return null

  return (
    <AuthLayout>
      <OnboardingForm />
    </AuthLayout>
  )
}