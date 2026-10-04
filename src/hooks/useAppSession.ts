'use client'

import { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'

export interface AppSession {
  user: { name: string | null; email: string | null }
}

/**
 * Sessão simplificada derivada do Supabase Auth (useAuth).
 * Retorna null enquanto não houver usuário autenticado.
 */
export function useAppSession() {
  const { user, profile, loading, signOut } = useAuth()

  const session = useMemo<AppSession | null>(() => {
    if (!user) return null
    return {
      user: {
        name: profile?.social_name ?? user.email?.split('@')[0] ?? null,
        email: user.email ?? null,
      },
    }
  }, [user, profile])

  return { data: session, loading, signOut }
}
