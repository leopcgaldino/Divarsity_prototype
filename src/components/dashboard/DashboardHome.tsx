'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Code2,
  Wrench,
  FileText,
  TrendingUp,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Building2,
} from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  tags: string[]
  remote: boolean
  urgent: boolean
  createdAt: string
  salary: string | null
}

export function DashboardHome() {
  const { data: session } = useSession()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/opportunities?limit=6')
      .then((r) => r.json())
      .then((data) => setOpportunities(data?.opportunities ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const firstName = session?.user?.name?.split?.(' ')?.[0] ?? 'Usuário'

  const quickLinks = [
    { label: 'Vagas', href: '/dashboard/vagas', icon: <Briefcase className="w-5 h-5" />, count: '850+', color: 'bg-violet-500/10 text-violet-600' },
    { label: 'Freelances', href: '/dashboard/freelances', icon: <Code2 className="w-5 h-5" />, count: '320+', color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Bicos', href: '/dashboard/bicos', icon: <Wrench className="w-5 h-5" />, count: '180+', color: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Candidaturas', href: '/dashboard/candidaturas', icon: <FileText className="w-5 h-5" />, count: '0', color: 'bg-amber-500/10 text-amber-600' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card p-4 sm:p-6" style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                Olá, {firstName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Explore oportunidades que combinam com você.
              </p>
            </div>
            <Link
              href="/dashboard/copiloto"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm shrink-0 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" /> Copiloto IA
            </Link>
          </div>
        </motion.div>

        {/* Quick links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickLinks.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className="group block p-3 sm:p-4 rounded-xl bg-card hover:bg-accent/50 transition-all" style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                  {item.icon}
                </div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.count} disponíveis</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent opportunities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Oportunidades recentes</h2>
            <Link href="/dashboard/vagas" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-card p-5 animate-pulse" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(opportunities ?? []).map((opp, i) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-xl bg-card p-4 sm:p-5 hover:bg-accent/30 transition-all cursor-pointer"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{opp.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{opp.company}</span>
                      </p>
                    </div>
                    {opp.urgent && (
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive uppercase">
                        Urgente
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {opp.type === 'VAGA' ? 'Vaga' : opp.type === 'FREELANCE' ? 'Freelance' : 'Bico'}
                    </span>
                    {opp.remote && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                        Remoto
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {opp.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {opp.location}
                    </span>
                    {opp.salary && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {opp.salary}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              {(opportunities ?? []).length === 0 && !loading && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Nenhuma oportunidade encontrada ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
