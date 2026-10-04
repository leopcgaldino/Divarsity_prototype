'use client'

import { Header, NavItem } from './Header'
import { Footer } from './Footer'
import { Home, Info, HelpCircle, Mail } from 'lucide-react'

const landingNav: NavItem[] = [
  { label: 'Início', href: '/', icon: <Home className="w-4 h-4" /> },
  { label: 'Sobre', href: '/#sobre', icon: <Info className="w-4 h-4" /> },
  { label: 'Como Funciona', href: '/#como-funciona', icon: <HelpCircle className="w-4 h-4" /> },
  { label: 'Contato', href: '/#contato', icon: <Mail className="w-4 h-4" /> },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header navItems={landingNav} variant="landing" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
