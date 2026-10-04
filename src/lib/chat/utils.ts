import { differenceInCalendarDays, format, isSameDay, isSameYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ChatMessage } from './types'

export type ChatRoleKind = 'recruiter' | 'talent' | 'admin' | 'unknown'

/** Normaliza os papéis do banco (enum atual e legado) para o chat */
export function getRoleKind(role: string | null | undefined): ChatRoleKind {
  switch (role) {
    case 'recruiter_empresarial':
    case 'company':
      return 'recruiter'
    case 'candidate_prestador':
    case 'talent':
      return 'talent'
    case 'admin':
      return 'admin'
    default:
      return 'unknown'
  }
}

export const ROLE_LABELS: Record<ChatRoleKind, string> = {
  recruiter: 'Recrutador(a) · Empresa',
  talent: 'Talento',
  admin: 'Equipe Divarsity',
  unknown: 'Membro',
}

/** Horário curto para a lista de conversas: "14:30", "Ontem", "12 set", "12/09/2025" */
export function formatConversationTime(iso: string | null | undefined, now: Date = new Date()): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  if (isSameDay(date, now)) return format(date, 'HH:mm')
  if (differenceInCalendarDays(now, date) === 1) return 'Ontem'
  if (isSameYear(date, now)) return format(date, 'd MMM', { locale: ptBR })
  return format(date, 'dd/MM/yyyy')
}

export function formatMessageTime(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : format(date, 'HH:mm')
}

/** Rótulo do separador de dia dentro da conversa */
export function formatDayLabel(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  if (isSameDay(date, now)) return 'Hoje'
  if (differenceInCalendarDays(now, date) === 1) return 'Ontem'
  return format(date, isSameYear(date, now) ? "d 'de' MMMM" : "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

/** Mescla mensagens do servidor com as locais (sem duplicar e em ordem cronológica) */
export function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  if (incoming.length === 0) return current
  const byId = new Map(current.map((m) => [m.id, m]))
  for (const m of incoming) byId.set(m.id, { ...m, status: undefined })
  return Array.from(byId.values()).sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
}

export function formatUnread(count: number): string {
  return count > 99 ? '99+' : String(count)
}
