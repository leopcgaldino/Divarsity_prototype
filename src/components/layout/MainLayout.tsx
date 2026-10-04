'use client'

import { ReactNode, useEffect } from 'react'
import { Header, NavItem } from './Header'
import { Logo } from './Logo'
import { Toaster } from '@/components/ui'
import { Footer } from './Footer'
import { Home, Info, HelpCircle, Mail } from 'lucide-react'

const landingNav: NavItem[] = [
  { label: 'Início', href: '/', icon: <Home className="w-4 h-4" /> },
  { label: 'Sobre', href: '/#sobre', icon: <Info className="w-4 h-4" /> },
  { label: 'Como Funciona', href: '/#como-funciona', icon: <HelpCircle className="w-4 h-4" /> },
  { label: 'Contato', href: '/#contato', icon: <Mail className="w-4 h-4" /> },
]

interface MainLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header navItems={landingNav} variant="landing" />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}

/** Layout enxuto para login, cadastro e onboarding. */
export function AuthLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-gray-950">
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="h-1 w-full bg-pride-stripe" aria-hidden="true" />
        <div className="bg-cream/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-ink/5 dark:border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Logo size="sm" />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
