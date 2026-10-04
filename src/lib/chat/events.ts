export const OPEN_CHAT_EVENT = 'divarsity:open-chat'

export interface OpenChatDetail {
  /** profiles.id do contato; se omitido, apenas abre a lista de conversas */
  profileId?: string
}

/** Abre o widget de mensagens (opcionalmente já em uma conversa com o perfil informado) */
export function openChat(detail: OpenChatDetail = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<OpenChatDetail>(OPEN_CHAT_EVENT, { detail }))
}
