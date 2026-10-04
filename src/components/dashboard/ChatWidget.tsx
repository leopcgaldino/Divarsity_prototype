'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ChevronLeftIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui'

interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  verificationStatus?: 'verified' | 'pending' | 'rejected'
  isGroup?: boolean
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  time: string
  isOwn: boolean
  read: boolean
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Maria Silva',
    avatar: undefined,
    lastMessage: 'Obrigada pela oportunidade! Vou analisar...',
    time: '14:30',
    unread: 2,
    online: true,
    verificationStatus: 'verified',
  },
  {
    id: '2',
    name: 'João Santos - TechCorp',
    avatar: undefined,
    lastMessage: 'Perfeito, agendamos para amanhã às 10h?',
    time: '11:15',
    unread: 0,
    online: true,
    verificationStatus: 'verified',
  },
  {
    id: '3',
    name: 'Ana Costa',
    avatar: undefined,
    lastMessage: 'Vi seu perfil e gostaria de conectar...',
    time: '09:45',
    unread: 1,
    online: false,
    verificationStatus: 'pending',
  },
  {
    id: '4',
    name: 'Equipe Divarsity',
    avatar: undefined,
    lastMessage: 'Nova vaga compatível com seu perfil!',
    time: 'Ontem',
    unread: 3,
    online: false,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Carlos Oliveira',
    avatar: undefined,
    lastMessage: 'Obrigado pela recomendação! 🙏',
    time: 'Ontem',
    unread: 0,
    online: true,
    verificationStatus: 'verified',
  },
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', conversationId: '1', senderId: 'other', senderName: 'Maria Silva', content: 'Oi! Tudo bem? Vi a vaga de Desenvolvedora Full Stack.', time: '10:00', isOwn: false, read: true },
    { id: '2', conversationId: '1', senderId: 'me', senderName: 'Você', content: 'Oi Maria! Tudo ótimo. A vaga ainda está aberta.', time: '10:05', isOwn: true, read: true },
    { id: '3', conversationId: '1', senderId: 'other', senderName: 'Maria Silva', content: 'Que ótimo! Tenho experiência com React, Node.js e AWS.', time: '10:10', isOwn: false, read: true },
    { id: '4', conversationId: '1', senderId: 'me', senderName: 'Você', content: 'Perfeito! Vamos agendar uma conversa?', time: '10:15', isOwn: true, read: true },
    { id: '5', conversationId: '1', senderId: 'other', senderName: 'Maria Silva', content: 'Obrigada pela oportunidade! Vou analisar...', time: '14:30', isOwn: false, read: false },
  ],
  '2': [
    { id: '1', conversationId: '2', senderId: 'other', senderName: 'João Santos', content: 'Olá! Gostei muito do seu perfil.', time: '09:00', isOwn: false, read: true },
    { id: '2', conversationId: '2', senderId: 'me', senderName: 'Você', content: 'Obrigado João! Fico feliz em saber.', time: '09:10', isOwn: true, read: true },
    { id: '3', conversationId: '2', senderId: 'other', senderName: 'João Santos', content: 'Perfeito, agendamos para amanhã às 10h?', time: '11:15', isOwn: false, read: true },
  ],
}

// Emoji picker data - moved outside component for faster compilation
const EMOJIS = [
  '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰',
  '😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏',
  '😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠',
  '😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥',
  '😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','😴','🤤','😪','😵','🤐','🥴',
  '🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀',
  '☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾',
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
    }
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const filteredConversations = mockConversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeConversation = mockConversations.find(c => c.id === activeConversationId)

  useEffect(() => {
    if (activeConversationId) {
      setMessages(mockMessages[activeConversationId] || [])
    } else {
      setMessages([])
    }
    setNewMessage('')
  }, [activeConversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversationId) return
    
    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: activeConversationId,
      senderId: 'me',
      senderName: 'Você',
      content: newMessage.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      read: true,
    }
    
    setMessages(prev => [...prev, newMsg])
    setNewMessage('')
    
    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: activeConversationId,
        senderId: 'other',
        senderName: activeConversation?.name || 'Contato',
        content: 'Recebi sua mensagem! Respondo em breve.',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        read: false,
      }
      setMessages(prev => [...prev, reply])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (time: string) => time

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-pride-gradient shadow-pride text-white flex items-center justify-center hover:shadow-pride hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pride-purple/50 relative"
            aria-label="Abrir mensagens"
            aria-expanded={false}
          >
            <ChatBubbleLeftRightIcon className="h-7 w-7 flex-shrink-0" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-pride-red rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse">
              {mockConversations.reduce((acc, c) => acc + c.unread, 0)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - closes on click outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                "fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col overflow-hidden animate-slide-up",
                isMobile && "w-[calc(100vw-1.5rem)] max-w-full left-6 right-6 max-h-[85vh]",
                isTablet && "w-[380px] max-w-[90vw] max-h-[75vh]",
                !isMobile && !isTablet && "w-[380px] max-w-[380px] h-[65vh] max-h-[65vh] min-h-[500px]"
              )}
              role="dialog"
              aria-label="Mensagens"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (activeConversationId) {
                        setActiveConversationId(null)
                      } else {
                        setIsOpen(false)
                      }
                    }}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label={activeConversationId ? 'Voltar às conversas' : 'Fechar chat'}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto"
                    aria-label="Fechar chat"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  <div className="h-10 w-10 rounded-xl bg-pride-gradient/10 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-pride-purple dark:text-pride-pink" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Mensagens</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mockConversations.filter(c => c.unread > 0).length} não lidas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Buscar mensagens">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Mais opções">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Conversation List or Active Chat */}
              <div className="flex-1 flex overflow-hidden">
                {/* Conversations List */}
                <AnimatePresence mode="wait">
                  {!activeConversationId && (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="w-full lg:w-80 border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col overflow-hidden"
                    >
                      {/* Search */}
                      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="relative">
                          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <input
                            type="search"
                            placeholder="Buscar conversas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pride-purple/50 focus:border-pride-purple/50 text-sm transition-all"
                            aria-label="Buscar conversas"
                          />
                        </div>
                      </div>

                      {/* Conversations */}
                      <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredConversations.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center px-4 text-gray-500 dark:text-gray-400">
                            <ChatBubbleLeftRightIcon className="h-12 w-12 mb-3 opacity-50" aria-hidden="true" />
                            <p className="font-medium">Nenhuma conversa ainda</p>
                            <p className="text-sm mt-1">Suas mensagens aparecerão aqui</p>
                          </div>
                        ) : (
                          filteredConversations.map((conv) => (
                            <motion.button
                              key={conv.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 }}
                              onClick={() => setActiveConversationId(conv.id)}
                              className={cn(
                                'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group relative overflow-hidden',
                                'hover:bg-pride-gradient/5 dark:hover:bg-pride-gradient/10'
                              )}
                              aria-label={`Conversa com ${conv.name}, ${conv.unread > 0 ? `${conv.unread} não lidas` : ''}`}
                            >
                              <div className="relative flex-shrink-0">
                                <Avatar
                                  src={conv.avatar}
                                  name={conv.name}
                                  size="lg"
                                  verificationStatus={conv.verificationStatus}
                                  prideBorder={conv.verificationStatus === 'verified'}
                                />
                                {conv.online && !conv.isGroup && (
                                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" aria-label="Online" />
                                )}
                                {conv.isGroup && (
                                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-pride-purple border-2 border-white dark:border-gray-900 rounded-full" aria-label="Grupo" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-gray-900 dark:text-white truncate pr-2 group-hover:text-pride-purple dark:group-hover:text-pride-pink transition-colors">
                                    {conv.name}
                                  </p>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">{conv.time}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-2">
                                  {conv.unread > 0 && (
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pride-gradient text-white text-[10px] font-bold flex items-center justify-center">
                                      {conv.unread > 9 ? '9+' : conv.unread}
                                    </span>
                                  )}
                                  <span>{conv.lastMessage}</span>
                                </p>
                              </div>
                            </motion.button>
                          ))
                        )}
                      </div>

                      {/* New Conversation Button */}
                      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-pride-purple dark:text-pride-pink hover:bg-pride-gradient/5 dark:hover:bg-pride-gradient/10 transition-all duration-200 font-medium">
                          <div className="h-10 w-10 rounded-xl bg-pride-gradient/10 flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <span>Nova conversa</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active Conversation */}
                <AnimatePresence mode="wait">
                  {activeConversationId && activeConversation && (
                    <motion.div
                      key={activeConversationId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col overflow-hidden relative"
                    >
                      {/* Chat Header */}
                      <div className="flex items-center gap-3 p-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                        <Avatar
                          src={activeConversation.avatar}
                          name={activeConversation.name}
                          size="lg"
                          verificationStatus={activeConversation.verificationStatus}
                          prideBorder={activeConversation.verificationStatus === 'verified'}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{activeConversation.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            {activeConversation.online ? (
                              <>
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" aria-hidden="true" />
                                Online
                              </>
                            ) : (
                              activeConversation.isGroup ? 'Grupo' : 'Offline'
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Videochamada">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                          <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Ligar">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </button>
                          <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Mais opções">
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-label="Mensagens" aria-live="polite">
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center px-4 text-gray-500 dark:text-gray-400">
                            <ChatBubbleLeftRightIcon className="h-12 w-12 mb-3 opacity-50" aria-hidden="true" />
                            <p className="font-medium">Nenhuma mensagem ainda</p>
                            <p className="text-sm mt-1">Comece a conversa!</p>
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn('flex gap-2', msg.isOwn && 'flex-row-reverse')}
                            >
                              {!msg.isOwn && (
                                <Avatar
                                  src={msg.senderAvatar}
                                  name={msg.senderName}
                                  size="sm"
                                />
                              )}
                              <div className={cn('flex flex-col max-w-[70%]', msg.isOwn ? 'items-end' : 'items-start')}>
                                {!msg.isOwn && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">{msg.senderName}</p>
                                )}
                                <div className={cn(
                                  'relative rounded-2xl px-4 py-2.5 text-sm',
                                  msg.isOwn
                                    ? 'bg-pride-gradient text-white rounded-tr-none shadow-pride-sm'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
                                )}>
                                  <p className="whitespace-pre-wrap">{msg.content}</p>
                                  <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{msg.time}</span>
                                    {msg.isOwn && msg.read && (
                                      <svg className="w-4 h-4 text-pride-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12 6.07 13.41 11.66 19l12-12-1.42-1.41z"/></svg>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {msg.isOwn && (
                                <Avatar
                                  src={undefined}
                                  name="Você"
                                  size="sm"
                                />
                              )}
                            </motion.div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky bottom-0">
                        <div className="flex items-end gap-2">
                          <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Anexar arquivo">
                            <PaperClipIcon className="h-5 w-5" />
                          </button>
                          <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Adicionar foto">
                            <PhotoIcon className="h-5 w-5" />
                          </button>
                          <button 
                            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                            aria-label={showEmojiPicker ? 'Fechar emojis' : 'Adicionar emoji'}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          >
                            <FaceSmileIcon className={cn('h-5 w-5 transition-transform', showEmojiPicker && 'rotate-90 text-pride-purple')} />
                          </button>
                          <div className="flex-1 relative">
                            <textarea
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder="Digite uma mensagem..."
                              rows={1}
                              className="w-full px-4 py-2.5 pr-12 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pride-purple/50 focus:border-pride-purple/50 resize-none max-h-32 text-sm"
                              aria-label="Mensagem"
                            />
                          </div>
                          <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className={cn(
                              'p-2.5 rounded-xl transition-all duration-200 flex-shrink-0',
                              newMessage.trim()
                                ? 'bg-pride-gradient text-white hover:shadow-pride hover:scale-105'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            )}
                            aria-label="Enviar mensagem"
                          >
                            <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Gravar áudio">
                            <MicrophoneIcon className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {/* Emoji Picker (simplified) */}
                        {showEmojiPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                          >
                            <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
                              {EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => setNewMessage(prev => prev + emoji)}
                                  className="p-2 text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                  aria-label={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}