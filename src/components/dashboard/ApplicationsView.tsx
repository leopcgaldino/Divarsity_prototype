'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface ApplicationData {
  id: string
  status: string
  createdAt: string
  opportunity: {
    title: string
    company: string
    type: string
  }
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PENDENTE: { label: 'Pendente', icon: <Clock className="w-4 h-4" />, color: 'text-amber-600 bg-amber-500/10' },
  EM_ANALISE: { label: 'Em Análise', icon: <AlertCircle className="w-4 h-4" />, color: 'text-blue-600 bg-blue-500/10' },
  APROVADO: { label: 'Aprovado', icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-600 bg-emerald-500/10' },
  REJEITADO: { label: 'Rejeitado', icon: <XCircle className="w-4 h-4" />, color: 'text-destructive bg-destructive/10' },
}

export function ApplicationsView() {
  const [apps, setApps] = useState<ApplicationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/applications')
      .then((r) => r.json())
      .then((data) => setApps(data?.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6" /> Candidaturas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Acompanhe o status das suas candidaturas
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-card p-5 animate-pulse" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (apps ?? []).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground rounded-xl bg-card" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Nenhuma candidatura ainda</p>
            <p className="text-sm mt-1">Candidate-se a vagas para acompanhar aqui.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(apps ?? []).map((app, i) => {
              const sc = statusConfig[app.status] ?? statusConfig.PENDENTE
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{app.opportunity?.title ?? 'Oportunidade'}</h3>
                    <p className="text-sm text-muted-foreground truncate">{app.opportunity?.company ?? ''}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 ${sc.color}`}>
                    {sc.icon} {sc.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
