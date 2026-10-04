'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User as UserIcon, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function CopilotView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou o Copiloto IA da Divarsity. Posso ajudar você a:\n\n• Encontrar vagas adequadas ao seu perfil\n• Melhorar seu currículo\n• Preparar-se para entrevistas\n• Tirar dúvidas sobre diversidade no mercado de trabalho\n\nComo posso ajudar?',
    },
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input?.trim?.()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages((prev) => [...(prev ?? []), userMsg])
    setInput('')
    setStreaming(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages((prev) => [...(prev ?? []), assistantMsg])

    try {
      const allMessages = [...(messages ?? []), userMsg]
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      })

      if (!response.ok) throw new Error('Erro na resposta')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let partialRead = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          partialRead += decoder.decode(value, { stream: true })
          const lines = partialRead.split('\n')
          partialRead = lines.pop() ?? ''
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                const content = parsed?.choices?.[0]?.delta?.content ?? ''
                if (content) {
                  setMessages((prev) => {
                    const updated = [...(prev ?? [])]
                    const last = updated[updated.length - 1]
                    if (last?.role === 'assistant') {
                      updated[updated.length - 1] = { ...last, content: (last.content ?? '') + content }
                    }
                    return updated
                  })
                }
              } catch { /* skip */ }
            }
          }
        }
      }
    } catch (error) {
      console.error('Copilot error:', error)
      setMessages((prev) => {
        const updated = [...(prev ?? [])]
        const last = updated[updated.length - 1]
        if (last?.role === 'assistant' && !last.content) {
          updated[updated.length - 1] = { ...last, content: 'Desculpe, ocorreu um erro. Tente novamente.' }
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
        <div className="flex items-center gap-3 pb-4 border-b mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight flex items-center gap-2">
              Copiloto IA <Sparkles className="w-4 h-4 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">Assistente inteligente de carreira</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
          <AnimatePresence initial={false}>
            {(messages ?? []).map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[85%] sm:max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`} style={msg.role !== 'user' ? { boxShadow: 'var(--shadow-sm)' } : {}}>
                  {msg.content}
                  {msg.role === 'assistant' && !msg.content && streaming && i === (messages?.length ?? 0) - 1 && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Pensando...</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Pergunte algo ao Copiloto..." disabled={streaming} className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50" />
            <button onClick={sendMessage} disabled={streaming || !(input?.trim?.())} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
