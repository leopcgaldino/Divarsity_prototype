'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useSession } from 'next-auth/react'
import { Settings, User as UserIcon } from 'lucide-react'
import { useState } from 'react'

export function SettingsView() {
  const { data: session } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Save error:', e)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6" /> Configurações
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie seu perfil e preferências</p>
        </div>

        <div className="rounded-xl bg-card p-4 sm:p-6 space-y-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="font-semibold flex items-center gap-2"><UserIcon className="w-4 h-4" /> Perfil</h2>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">E-mail</label>
            <input type="email" value={session?.user?.email ?? ''} disabled className="w-full px-3 py-2 rounded-lg border bg-muted text-sm text-muted-foreground" />
          </div>
          <button onClick={handleSave} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            {saved ? '✓ Salvo!' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
