'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, PaperAirplaneIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'
import { chatApi } from '@/lib/chat/api'
import type { ChatConversationSummary, ChatMessage } from '@/lib/chat/types'
import { formatDayLabel, formatMessageTime, mergeMessages } from '@/lib/chat/utils'
import { RoleBadge } from './RoleBadge'

const MESSAGE_POLL_MS = 3000
// Margem para não perder mensagens gravadas fora de ordem entre polls
const FETCH_OVERLAP_MS = 60_000

interface ChatWindowProps {
  conversation: ChatConversationSummary
  minimized: boolean
  fullScreen?: boolean
  refreshSignal: number
  onToggleMinimize: () => void
  onClose: () => void
  onActivity: () => void
}

export function ChatWindow({
  conversation,
  minimized,
  fullScreen = false,
  refreshSignal,
  onToggleMinimize,
  onClose,
  onActivity,
}: ChatWindowProps) {
  const conversationId = conversation.conversation_id
  const name = conversation.other_name || 'Usuário'
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const messagesRef = useRef<ChatMessage[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const stickToBottom = useRef(true)

  messagesRef.current = messages

  const fetchMessages = useCallback(async () => {
    const confirmed = messagesRef.current.filter((m) => !m.status)
    const last = confirmed[confirmed.length - 1]
    const after = last ? new Date(new Date(last.created_at).getTime() - FETCH_OVERLAP_MS).toISOString() : null
    try {
      const incoming = await chatApi.getMessages(conversationId, after)
      setLoadError(null)
      if (incoming.length > 0) {
        const hadNew = incoming.some((m) => !messagesRef.current.some((c) => c.id === m.id))
        setMessages((prev) => mergeMessages(prev, incoming))
        if (hadNew) onActivity()
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Erro ao carregar mensagens')
    } finally {
      setLoading(false)
    }
  }, [conversationId, onActivity])

  // Carga inicial + polling enquanto a janela está aberta
  useEffect(() => {
    if (minimized) return
    fetchMessages()
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') fetchMessages()
    }, MESSAGE_POLL_MS)
    return () => clearInterval(timer)
  }, [fetchMessages, minimized])

  // Atualização imediata quando chega evento em tempo real
  useEffect(() => {
    if (!minimized && refreshSignal > 0) fetchMessages()
  }, [refreshSignal]) // eslint-disable-line react-hooks/exhaustive-deps

  // Marca como lida quando a janela está visível e há mensagens não lidas
  useEffect(() => {
    if (!minimized && conversation.unread_count > 0) {
      chatApi.markRead(conversationId).then(onActivity).catch(() => undefined)
    }
  }, [minimized, conversation.unread_count, conversationId, messages.length, onActivity])

  // Auto-scroll para a última mensagem
  useEffect(() => {
    const el = scrollRef.current
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight
  }, [messages, minimized])

  useEffect(() => {
    if (!minimized) textareaRef.current?.focus()
  }, [minimized])

  const handleScroll = () => {
    const el = scrollRef.current
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  const send = async (content: string, retryId?: string) => {
    const tempId = retryId ?? `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const optimistic: ChatMessage = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: 'me',
      content,
      created_at: new Date().toISOString(),
      is_own: true,
      status: 'sending',
    }
    stickToBottom.current = true
    setMessages((prev) => [...prev.filter((m) => m.id !== tempId), optimistic])
    try {
      const saved = await chatApi.sendMessage(conversationId, content)
      setMessages((prev) => mergeMessages(prev.filter((m) => m.id !== tempId), [saved]))
      onActivity()
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m)))
    }
  }

  const handleSubmit = () => {
    const content = draft.trim()
    if (!content) return
    setDraft('')
    send(content)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section
      className={cn(
        'flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden',
        fullScreen ? 'fixed inset-0 z-[60]' : 'w-[340px] rounded-t-2xl',
        !fullScreen && (minimized ? 'h-14' : 'h-[min(480px,calc(100vh-6rem))]')
      )}
      role="dialog"
      aria-label={`Conversa com ${name}`}
    >
      {/* Cabeçalho */}
      <header className="flex items-center gap-2 h-14 px-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          type="button"
          onClick={onToggleMinimize}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
          aria-label={minimized ? `Expandir conversa com ${name}` : `Minimizar conversa com ${name}`}
        >
          <Avatar
            src={conversation.other_avatar_url ?? undefined}
            name={name}
            size="sm"
            verificationStatus={conversation.other_verified ? 'verified' : undefined}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1.5">
              {name}
              {minimized && conversation.unread_count > 0 && (
                <span className="w-2 h-2 rounded-full bg-pride-red flex-shrink-0" aria-label="Mensagens não lidas" />
              )}
            </p>
            <RoleBadge role={conversation.other_role} compact />
          </div>
        </button>
        {!fullScreen && (
          <button
            type="button"
            onClick={onToggleMinimize}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={minimized ? 'Expandir' : 'Minimizar'}
          >
            {minimized ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Fechar conversa"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </header>

      {!minimized && (
        <>
          {/* Mensagens */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5"
            role="log"
            aria-live="polite"
            aria-label="Histórico de mensagens"
          >
            {conversation.other_headline && (
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 pb-2">{conversation.other_headline}</p>
            )}
            {loading && messages.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">Carregando mensagens...</p>
            ) : loadError && messages.length === 0 ? (
              <p className="text-center text-sm text-red-600 dark:text-red-400 py-8">Não foi possível carregar as mensagens.</p>
            ) : messages.length === 0 ? (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                <p className="font-medium">Nenhuma mensagem ainda</p>
                <p className="mt-1">Envie a primeira mensagem para {name}.</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const prev = messages[i - 1]
                const showDay = !prev || new Date(prev.created_at).toDateString() !== new Date(msg.created_at).toDateString()
                return (
                  <Fragment key={msg.id}>
                    {showDay && (
                      <div className="flex items-center gap-2 py-2" aria-hidden="true">
                        <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {formatDayLabel(msg.created_at)}
                        </span>
                        <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      </div>
                    )}
                    <div className={cn('flex', msg.is_own ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-3 py-2 text-sm break-words',
                          msg.is_own
                            ? 'bg-pride-purple text-white rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md',
                          msg.status === 'sending' && 'opacity-70'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className={cn('text-[10px] mt-0.5 text-right', msg.is_own ? 'text-white/70' : 'text-gray-500 dark:text-gray-400')}>
                          {msg.status === 'sending' ? 'Enviando...' : msg.status === 'failed' ? 'Falha no envio' : formatMessageTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                    {msg.status === 'failed' && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => send(msg.content, msg.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline"
                        >
                          <ArrowPathIcon className="h-3.5 w-3.5" /> Tentar novamente
                        </button>
                      </div>
                    )}
                  </Fragment>
                )
              })
            )}
          </div>

          {/* Campo de mensagem */}
          <form
            className="border-t border-gray-200 dark:border-gray-700 p-2 flex items-end gap-2 flex-shrink-0"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escreva uma mensagem..."
              rows={2}
              maxLength={4000}
              className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pride-purple/50"
              aria-label="Escreva uma mensagem"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className={cn(
                'p-2.5 rounded-xl flex-shrink-0 transition-colors',
                draft.trim() ? 'bg-pride-purple text-white hover:bg-pride-purple/90' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              )}
              aria-label="Enviar mensagem"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </>
      )}
    </section>
  )
}
