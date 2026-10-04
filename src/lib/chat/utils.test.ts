import { describe, expect, it } from 'vitest'
import { formatConversationTime, formatDayLabel, formatUnread, getRoleKind, mergeMessages } from './utils'
import type { ChatMessage } from './types'

const msg = (id: string, created_at: string, extra: Partial<ChatMessage> = {}): ChatMessage =>
  ({ id, conversation_id: 'c1', sender_id: 's1', content: id, created_at, is_own: false, ...extra }) as ChatMessage

describe('chat utils', () => {
  it('normaliza papéis', () => {
    expect(getRoleKind('recruiter_empresarial')).toBe('recruiter')
    expect(getRoleKind('company')).toBe('recruiter')
    expect(getRoleKind('candidate_prestador')).toBe('talent')
    expect(getRoleKind('talent')).toBe('talent')
    expect(getRoleKind('admin')).toBe('admin')
    expect(getRoleKind(null)).toBe('unknown')
  })

  it('formata horários da lista', () => {
    const now = new Date(2026, 9, 4, 15, 0)
    expect(formatConversationTime(new Date(2026, 9, 4, 9, 5).toISOString(), now)).toBe('09:05')
    expect(formatConversationTime(new Date(2026, 9, 3, 9, 5).toISOString(), now)).toBe('Ontem')
    expect(formatConversationTime(new Date(2025, 8, 12).toISOString(), now)).toBe('12/09/2025')
    expect(formatConversationTime(null, now)).toBe('')
    expect(formatConversationTime('invalido', now)).toBe('')
  })

  it('formata separador de dia', () => {
    const now = new Date(2026, 9, 4, 15, 0)
    expect(formatDayLabel(new Date(2026, 9, 4, 1).toISOString(), now)).toBe('Hoje')
    expect(formatDayLabel(new Date(2026, 9, 3, 1).toISOString(), now)).toBe('Ontem')
    expect(formatDayLabel(new Date(2026, 8, 12).toISOString(), now)).toBe('12 de setembro')
  })

  it('mescla mensagens sem duplicar e em ordem', () => {
    const a = msg('a', '2026-10-04T10:00:00Z')
    const b = msg('b', '2026-10-04T11:00:00Z', { status: 'sending' })
    const merged = mergeMessages([b], [a, { ...b, status: undefined }])
    expect(merged.map((m) => m.id)).toEqual(['a', 'b'])
    expect(merged[1].status).toBeUndefined()
    expect(mergeMessages([a], [])).toEqual([a])
  })

  it('limita contador de não lidas', () => {
    expect(formatUnread(5)).toBe('5')
    expect(formatUnread(150)).toBe('99+')
  })
})
