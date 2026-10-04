'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Code2,
  Wrench,
  MapPin,
  TrendingUp,
  Building2,
  Search,
  Filter,
} from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  description: string
  tags: string[]
  remote: boolean
  urgent: boolean
  salary: string | null
  createdAt: string
}

const typeIcons: Record<string, React.ReactNode> = {
  VAGA: <Briefcase className="w-4 h-4" />,
  FREELANCE: <Code2 className="w-4 h-4" />,
  BICO: <Wrench className="w-4 h-4" />,
}

const typeLabels: Record<string, string> = {
  VAGA: 'Vaga',
  FREELANCE: 'Freelance',
  BICO: 'Bico',
}

export function OpportunityList({ type, title }: { type: string; title: string }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams({ type })
    if (search) params.set('search', search)
    fetch(`/api/opportunities?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setOpportunities(data?.opportunities ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type, search])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              {typeIcons[type]} {title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Explore as melhores oportunidades de {title?.toLowerCase?.() ?? ''}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-card p-5 animate-pulse" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {(opportunities ?? []).map((opp, i) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl bg-card p-4 sm:p-5 hover:bg-accent/30 transition-all group cursor-pointer"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold truncate">{opp.title}</h3>
                  {opp.urgent && (
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive uppercase">
                      Urgente
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{opp.company}</span>
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{opp.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {typeLabels[opp.type] ?? opp.type}
                  </span>
                  {opp.remote && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                      Remoto
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {opp.category}
                  </span>
                  {(opp.tags ?? []).slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
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
            {(opportunities ?? []).length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nenhuma oportunidade encontrada</p>
                <p className="text-sm mt-1">Tente ajustar os filtros ou volte mais tarde.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
