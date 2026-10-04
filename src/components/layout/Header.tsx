'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface HeaderProps {
  navItems?: NavItem[]
  variant?: 'landing' | 'dashboard'
  showSearch?: boolean
  showNotifications?: boolean
}

export function Header({
  navItems = [],
  variant = 'landing',
  showSearch = false,
  showNotifications = false,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleSignOut = () => {
    signOut({ redirectTo: '/' })
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-200',
          scrolled
            ? 'bg-background/90 backdrop-blur-md border-b shadow-sm'
            : 'bg-background/70 backdrop-blur-sm border-b border-transparent'
        )}
      >
        {/* Pride strip */}
        <div className="h-1 pride-gradient w-full" />

        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Logo */}
            <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">D</span>
              </div>
              <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">
                Divarsity
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-none">
              {navItems?.map((item: NavItem) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-2 shrink-0">
              {showSearch && (
                <div className="hidden md:flex items-center">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar oportunidades..."
                      className="pl-9 pr-3 py-1.5 text-sm rounded-lg border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 w-48 lg:w-64 transition-all"
                    />
                  </div>
                </div>
              )}

              {showNotifications && session && (
                <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>
              )}

              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {session.user?.name?.charAt?.(0)?.toUpperCase?.() ?? 'U'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute right-0 top-full mt-1 w-56 bg-popover border rounded-lg z-50"
                          style={{ boxShadow: 'var(--shadow-lg)' }}
                        >
                          <div className="p-3 border-b">
                            <p className="font-medium text-sm truncate">
                              {session.user?.name ?? 'Usuário'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {session.user?.email ?? ''}
                            </p>
                          </div>
                          <div className="p-1">
                            <Link
                              href="/dashboard/configuracoes"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                            >
                              <Settings className="w-4 h-4" /> Configurações
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left"
                            >
                              <LogOut className="w-4 h-4" /> Sair
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              {navItems?.length > 0 && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Menu"
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-background border-l overflow-y-auto lg:hidden"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-display font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {showSearch && (
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="pl-9 pr-3 py-2 text-sm rounded-lg border bg-muted/50 w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              )}

              <nav className="p-2">
                {navItems?.map((item: NavItem) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                    {item.label}
                  </Link>
                ))}
              </nav>

              {session && (
                <div className="mt-auto p-4 border-t">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {session.user?.name?.charAt?.(0)?.toUpperCase?.() ?? 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{session.user?.name ?? 'Usuário'}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email ?? ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg w-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
