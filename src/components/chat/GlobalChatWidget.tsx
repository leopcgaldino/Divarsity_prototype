'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ChatWidget } from './ChatWidget'

// Páginas onde o widget não aparece (fluxos de autenticação/cadastro)
const HIDDEN_PREFIXES = ['/login', '/register', '/onboarding', '/auth', '/forgot-password']

/** Renderiza o chat em todas as páginas, apenas para usuários logados */
export function GlobalChatWidget() {
  const { user, loading } = useAuth()
  const pathname = usePathname() ?? ''

  if (loading || !user) return null
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) return null

  // key: recria o widget (e limpa o estado) ao trocar de conta
  return <ChatWidget key={user.id} />
}
