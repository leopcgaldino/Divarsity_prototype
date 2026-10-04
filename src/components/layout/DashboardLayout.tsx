'use client'

import { Header, NavItem } from './Header'
import {
  Briefcase,
  Code2,
  Wrench,
  FileText,
  Users,
  MessageSquare,
  Bot,
  Settings,
  LayoutDashboard,
} from 'lucide-react'

const dashboardNav: NavItem[] = [
  { label: 'Início', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Vagas', href: '/dashboard/vagas', icon: <Briefcase className="w-4 h-4" /> },
  { label: 'Freelances', href: '/dashboard/freelances', icon: <Code2 className="w-4 h-4" /> },
  { label: 'Bicos', href: '/dashboard/bicos', icon: <Wrench className="w-4 h-4" /> },
  { label: 'Candidaturas', href: '/dashboard/candidaturas', icon: <FileText className="w-4 h-4" /> },
  { label: 'Rede', href: '/dashboard/rede', icon: <Users className="w-4 h-4" /> },
  { label: 'Mensagens', href: '/dashboard/mensagens', icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'Copiloto IA', href: '/dashboard/copiloto', icon: <Bot className="w-4 h-4" /> },
  { label: 'Configurações', href: '/dashboard/configuracoes', icon: <Settings className="w-4 h-4" /> },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header
        navItems={dashboardNav}
        variant="dashboard"
        showSearch
        showNotifications
      />
      <main className="flex-1 mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
