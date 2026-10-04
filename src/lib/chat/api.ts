import { createUntypedClient } from '@/lib/supabase/client'
import type { ChatConversationSummary, ChatMessage, ChatProfileResult } from './types'

// As funções RPC do chat estão em supabase/migrations/20261004120000_chat_widget.sql.
// Usamos o client sem tipos porque src/types/supabase.ts ainda não foi regenerado.
let client: ReturnType<typeof createUntypedClient> | null = null
export function getChatClient() {
  if (!client) client = createUntypedClient()
  return client
}

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await getChatClient().rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

export const chatApi = {
  listConversations: async () =>
    (await rpc<ChatConversationSummary[] | null>('chat_list_conversations')) ?? [],

  getMessages: async (conversationId: string, after?: string | null) =>
    (await rpc<ChatMessage[] | null>('chat_get_messages', {
      p_conversation_id: conversationId,
      p_after: after ?? null,
    })) ?? [],

  sendMessage: async (conversationId: string, content: string) => {
    const rows = await rpc<ChatMessage[]>('chat_send_message', {
      p_conversation_id: conversationId,
      p_content: content,
    })
    return rows[0]
  },

  markRead: (conversationId: string) =>
    rpc<void>('chat_mark_read', { p_conversation_id: conversationId }),

  startDirect: (otherProfileId: string) =>
    rpc<string>('chat_start_direct', { p_other_profile_id: otherProfileId }),

  searchProfiles: async (query: string) =>
    (await rpc<ChatProfileResult[] | null>('chat_search_profiles', { p_query: query })) ?? [],
}
