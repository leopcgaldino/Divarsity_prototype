export interface ChatConversationSummary {
  conversation_id: string
  other_profile_id: string | null
  other_name: string | null
  other_avatar_url: string | null
  other_role: string | null
  other_headline: string | null
  other_verified: boolean | null
  last_message: string | null
  last_message_at: string | null
  last_message_is_own: boolean | null
  unread_count: number
  updated_at: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  is_own: boolean
  /** Somente no cliente: estado de envio otimista */
  status?: 'sending' | 'failed'
}

export interface ChatProfileResult {
  id: string
  social_name: string
  avatar_url: string | null
  role: string | null
  headline: string | null
  verified: boolean | null
}
