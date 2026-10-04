'use client'

import { ReactNode, useEffect } from 'react'
import { Logo } from './Logo'
import { Header } from './Header'
import { Footer } from './Footer'
import { Toaster } from '@/components/ui'

interface MainLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-gray-950">
      <Header />
      <main className="flex-1 pt-[68px]" id="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
      <Toaster />
    </div>
  )
}

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
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
      <Footer />
      <Toaster />
    </div>
  )
}
