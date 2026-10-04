'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TestLayout } from '@/components/layout/TestLayout'
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

export default function TestPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  if (!user) {
    return (
      <TestLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
        </div>
      </TestLayout>
    )
  }

  return (
    <TestLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Page</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">This is a test page.</p>
        <Button className="mt-4" onClick={() => console.log('clicked')}>Test Button</Button>
      </div>
    </TestLayout>
  )
}