'use client'

import Link from 'next/link'
import { ReactNode, useEffect } from 'react'
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-1 pt-16 pb-8" id="main-content">
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="Divarsity - Início">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Divarsity</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center pt-16 pb-8 px-4">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}