'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'
import { chatApi, getChatClient } from '@/lib/chat/api'
import { OPEN_CHAT_EVENT, type OpenChatDetail } from '@/lib/chat/events'
import type { ChatConversationSummary, ChatProfileResult } from '@/lib/chat/types'
import { formatConversationTime, formatUnread } from '@/lib/chat/utils'
import { ChatWindow } from './ChatWindow'
import { RoleBadge } from './RoleBadge'

const LIST_POLL_MS = 5000
const MAX_WINDOWS_DESKTOP = 2

interface OpenWindow {
  conversationId: string
  minimized: boolean
}

type PanelView = 'list' | 'new'

export function ChatWidget() {
  const [expanded, setExpanded] = useState(false)
  const [view, setView] = useState<PanelView>('list')
  const [conversations, setConversations] = useState<ChatConversationSummary[]>([])
  const [loaded, setLoaded] = useState(false)
  const [listError, setListError] = useState(false)
  const [filter, setFilter] = useState('')
  const [windows, setWindows] = useState<OpenWindow[]>([])
  const [refreshSignal, setRefreshSignal] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const conversationsRef = useRef<ChatConversationSummary[]>([])
  conversationsRef.current = conversations

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const refreshConversations = useCallback(async () => {
    try {
      const list = await chatApi.listConversations()
      setConversations(list)
      setListError(false)
      return list
    } catch {
      setListError(true)
      return conversationsRef.current
    } finally {
      setLoaded(true)
    }
  }, [])

  // Polling da lista (badge de não lidas) — pausa quando a aba está oculta
  useEffect(() => {
    refreshConversations()
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') refreshConversations()
    }, LIST_POLL_MS)
    const onVisible = () => document.visibilityState === 'visible' && refreshConversations()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refreshConversations])

  // Tempo real via Supabase Realtime (quando habilitado); o polling continua como fallback
  useEffect(() => {
    const supabase = getChatClient()
    const channel = supabase
      .channel('divarsity-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages_new' }, () => {
        refreshConversations()
        setRefreshSignal((n) => n + 1)
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refreshConversations])

  const openConversation = useCallback(
    (conversationId: string) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.conversationId === conversationId)
        if (existing) {
          return prev.map((w) => (w.conversationId === conversationId ? { ...w, minimized: false } : w))
        }
        const max = isMobile ? 1 : MAX_WINDOWS_DESKTOP
        return [{ conversationId, minimized: false }, ...prev].slice(0, max)
      })
      if (isMobile) setExpanded(false)
    },
    [isMobile]
  )

  const startConversationWith = useCallback(
    async (profileId: string) => {
      try {
        setNotice(null)
        const conversationId = await chatApi.startDirect(profileId)
        await refreshConversations()
        setView('list')
        openConversation(conversationId)
      } catch (err) {
        setExpanded(true)
        setNotice(err instanceof Error ? err.message : 'Não foi possível iniciar a conversa')
      }
    },
    [openConversation, refreshConversations]
  )

  // Permite abrir o chat a partir de qualquer página (ex.: botão "Enviar mensagem" no perfil)
  useEffect(() => {
    const handler = (event: Event) => {
      const { profileId } = (event as CustomEvent<OpenChatDetail>).detail ?? {}
      if (profileId) startConversationWith(profileId)
      else setExpanded(true)
    }
    window.addEventListener(OPEN_CHAT_EVENT, handler)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handler)
  }, [startConversationWith])

  const onActivity = useCallback(() => {
    refreshConversations()
  }, [refreshConversations])

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)
  const filtered = conversations.filter((c) => {
    const q = filter.trim().toLowerCase()
    return !q || (c.other_name ?? '').toLowerCase().includes(q) || (c.other_headline ?? '').toLowerCase().includes(q)
  })

  const openWindows = windows
    .map((w) => ({ ...w, conversation: conversations.find((c) => c.conversation_id === w.conversationId) }))
    .filter((w): w is OpenWindow & { conversation: ChatConversationSummary } => !!w.conversation)

  const closeWindow = (id: string) => setWindows((prev) => prev.filter((w) => w.conversationId !== id))
  const toggleWindow = (id: string) =>
    setWindows((prev) => prev.map((w) => (w.conversationId === id ? { ...w, minimized: !w.minimized } : w)))

  const panelBody = (
    <div className="flex-1 flex flex-col min-h-0">
      {notice && (
        <div className="mx-3 mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs px-3 py-2 flex items-start gap-2" role="alert">
          <span className="flex-1">{notice}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Fechar aviso">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      {view === 'new' ? (
        <NewConversation onBack={() => setView('list')} onSelect={(p) => startConversationWith(p.id)} />
      ) : (
        <>
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Buscar conversas..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pride-purple/50"
                aria-label="Buscar conversas"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto" aria-label="Conversas">
            {!loaded ? (
              <li className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">Carregando conversas...</li>
            ) : listError && conversations.length === 0 ? (
              <li className="p-6 text-center text-sm text-red-600 dark:text-red-400">Não foi possível carregar suas conversas.</li>
            ) : filtered.length === 0 ? (
              <li className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <ChatBubbleLeftRightIcon className="h-10 w-10 mx-auto mb-2 opacity-50" aria-hidden="true" />
                <p className="font-medium">{filter ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}</p>
                {!filter && (
                  <button type="button" onClick={() => setView('new')} className="mt-3 text-pride-purple dark:text-pride-pink font-medium hover:underline">
                    Iniciar nova conversa
                  </button>
                )}
              </li>
            ) : (
              filtered.map((c) => {
                const name = c.other_name || 'Usuário'
                const unread = c.unread_count > 0
                return (
                  <li key={c.conversation_id}>
                    <button
                      type="button"
                      onClick={() => openConversation(c.conversation_id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors',
                        unread && 'bg-pride-purple/5 dark:bg-pride-purple/10'
                      )}
                      aria-label={`Conversa com ${name}${unread ? `, ${c.unread_count} não lidas` : ''}`}
                    >
                      <Avatar src={c.other_avatar_url ?? undefined} name={name} size="md" verificationStatus={c.other_verified ? 'verified' : undefined} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className={cn('text-sm truncate text-gray-900 dark:text-white', unread ? 'font-bold' : 'font-medium')}>{name}</p>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {formatConversationTime(c.last_message_at ?? c.updated_at)}
                          </span>
                        </div>
                        <RoleBadge role={c.other_role} compact />
                        <div className="flex items-center gap-2">
                          <p className={cn('text-xs truncate flex-1', unread ? 'text-gray-900 dark:text-gray-100 font-semibold' : 'text-gray-500 dark:text-gray-400')}>
                            {c.last_message ? `${c.last_message_is_own ? 'Você: ' : ''}${c.last_message}` : 'Nenhuma mensagem ainda'}
                          </p>
                          {unread && (
                            <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-pride-red text-white text-[10px] font-bold flex items-center justify-center">
                              {formatUnread(c.unread_count)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </>
      )}
    </div>
  )

  const headerActions = (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(true)
          setView('new')
        }}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Nova conversa"
        title="Nova conversa"
      >
        <PencilSquareIcon className="h-5 w-5" />
      </button>
      <span className="p-1.5 text-gray-500" aria-hidden="true">
        {expanded ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronUpIcon className="h-5 w-5" />}
      </span>
    </div>
  )

  const unreadBadge = totalUnread > 0 && (
    <span
      className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-pride-red text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900"
      aria-label={`${totalUnread} mensagens não lidas`}
    >
      {formatUnread(totalUnread)}
    </span>
  )

  // ---------- Mobile ----------
  if (isMobile) {
    const active = openWindows[0]
    return (
      <>
        {!expanded && !active && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="fixed bottom-4 left-4 z-50 w-14 h-14 rounded-full bg-pride-purple text-white shadow-pride flex items-center justify-center"
            aria-label="Abrir mensagens"
          >
            <ChatBubbleLeftRightIcon className="h-7 w-7" />
            {unreadBadge}
          </button>
        )}
        {expanded && !active && (
          <div className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl flex flex-col" role="dialog" aria-label="Mensagens">
            <div className="flex items-center gap-2 h-14 px-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="flex-1 font-semibold text-gray-900 dark:text-white">Mensagens</h2>
              <button type="button" onClick={() => setView('new')} className="p-1.5 rounded-lg text-gray-500" aria-label="Nova conversa">
                <PencilSquareIcon className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => setExpanded(false)} className="p-1.5 rounded-lg text-gray-500" aria-label="Fechar mensagens">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            {panelBody}
          </div>
        )}
        {active && (
          <ChatWindow
            key={active.conversationId}
            conversation={active.conversation}
            minimized={false}
            fullScreen
            refreshSignal={refreshSignal}
            onToggleMinimize={() => undefined}
            onClose={() => {
              closeWindow(active.conversationId)
              setExpanded(true)
            }}
            onActivity={onActivity}
          />
        )}
      </>
    )
  }

  // ---------- Desktop: barra fixa no canto inferior esquerdo (estilo LinkedIn) ----------
  return (
    <div className="fixed bottom-0 left-4 z-50 flex items-end gap-3 pointer-events-none">
      <section
        className={cn(
          'pointer-events-auto w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden transition-[height] duration-200',
          expanded ? 'h-[min(560px,calc(100vh-5rem))]' : 'h-14'
        )}
        aria-label="Mensagens"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setExpanded((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setExpanded((v) => !v)
            }
          }}
          className="flex items-center gap-3 h-14 px-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer select-none flex-shrink-0"
          aria-expanded={expanded}
          aria-label={expanded ? 'Recolher mensagens' : 'Abrir mensagens'}
        >
          <span className="relative w-9 h-9 rounded-full bg-pride-purple text-white flex items-center justify-center flex-shrink-0">
            <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
            {unreadBadge}
          </span>
          <h2 className="flex-1 font-semibold text-gray-900 dark:text-white">Mensagens</h2>
          {headerActions}
        </div>
        {expanded && panelBody}
      </section>

      {openWindows.map((w) => (
        <div key={w.conversationId} className="pointer-events-auto">
          <ChatWindow
            conversation={w.conversation}
            minimized={w.minimized}
            refreshSignal={refreshSignal}
            onToggleMinimize={() => toggleWindow(w.conversationId)}
            onClose={() => closeWindow(w.conversationId)}
            onActivity={onActivity}
          />
        </div>
      ))}
    </div>
  )
}

// ---------- Nova conversa: busca de pessoas e recrutadores ----------
function NewConversation({ onBack, onSelect }: { onBack: () => void; onSelect: (p: ChatProfileResult) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ChatProfileResult[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const found = await chatApi.searchProfiles(q)
        if (!cancelled) {
          setResults(found)
          setError(false)
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setSearching(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-pride-purple">
          <ArrowLeftIcon className="h-4 w-4" /> Voltar às conversas
        </button>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Nova conversa</p>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pessoas ou empresas..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pride-purple/50"
            aria-label="Buscar pessoas ou empresas"
          />
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto" aria-label="Resultados da busca">
        {query.trim().length < 2 ? (
          <li className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">Digite ao menos 2 letras para buscar talentos ou recrutadores.</li>
        ) : searching ? (
          <li className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">Buscando...</li>
        ) : error ? (
          <li className="p-6 text-center text-sm text-red-600 dark:text-red-400">Erro na busca. Tente novamente.</li>
        ) : results.length === 0 ? (
          <li className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">Nenhuma pessoa encontrada.</li>
        ) : (
          results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect(p)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                <Avatar src={p.avatar_url ?? undefined} name={p.social_name} size="md" verificationStatus={p.verified ? 'verified' : undefined} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.social_name}</p>
                  <RoleBadge role={p.role} compact />
                  {p.headline && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.headline}</p>}
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
