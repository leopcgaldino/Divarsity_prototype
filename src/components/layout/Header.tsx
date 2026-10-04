'use client'

import { useState, Fragment } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, Transition } from '@headlessui/react'
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button, Avatar, Dropdown, Badge } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'

const navigation = [
  { name: 'Início', href: '/dashboard', icon: '🏠' },
  { name: 'Vagas', href: '/dashboard?tab=vagas', icon: '💼' },
  { name: 'Freelances', href: '/dashboard?tab=freelances', icon: '💻' },
  { name: 'Bicos', href: '/dashboard?tab=bicos', icon: '🔧' },
  { name: 'Minha Rede', href: '/connections', icon: '👥' },
  { name: 'Mensagens', href: '/messages', icon: '💬' },
  { name: 'Copiloto IA', href: '/copilot', icon: '🤖' },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const darkMode = resolvedTheme === 'dark'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const userMenuItems = [
    { label: 'Meu Perfil', href: '/profile', icon: <UserCircleIcon className="h-4 w-4" /> },
    { label: 'Configurações', href: '/settings', icon: <span className="text-lg">⚙️</span> },
    { label: 'Minha Assinatura', href: '/subscription', icon: <span className="text-lg">💳</span> },
    { divider: true },
    { label: 'Sair', onClick: signOut, icon: <span className="text-lg">🚪</span>, danger: true },
  ]

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50')}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2" aria-label="Divarsity - Início">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">Divarsity</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <form onSubmit={handleSearch} className="relative" role="search">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vagas, freelas, bicos..."
                className="w-72 pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                aria-label="Buscar oportunidades"
              />
            </form>
            
            <div className="flex items-center gap-1 ml-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                    pathname.startsWith(item.href.replace('/dashboard', '')) || (item.href === '/dashboard' && pathname === '/dashboard')
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  aria-current={pathname.startsWith(item.href.replace('/dashboard', '')) ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                if (theme === 'light') setTheme('dark')
                else if (theme === 'dark') setTheme('system')
                else setTheme('light')
              }}
              className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={darkMode ? 'Modo claro' : theme === 'system' ? 'Modo sistema' : 'Modo escuro'}
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : theme === 'system' ? <MoonIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button className="relative rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Notificações">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" aria-label="3 notificações não lidas" />
            </button>

            {/* User Menu */}
            {user ? (
              <Dropdown
                trigger={
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar 
                      src={profile?.avatar_url} 
                      name={profile?.social_name || user.email} 
                      size="sm" 
                      verificationStatus={profile?.verification_status}
                      prideBorder={profile?.verification_status === 'verified'}
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {profile?.social_name?.split(' ')[0] || 'Usuário'}
                    </span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                }
                items={userMenuItems}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push('/login')}>
                  Entrar
                </Button>
                <Button onClick={() => router.push('/register')}>
                  Cadastrar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4" role="search">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar vagas, freelas, bicos..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-label="Buscar oportunidades"
                />
              </div>
            </form>
            
            <div className="flex flex-col gap-1 mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    pathname.startsWith(item.href.replace('/dashboard', '')) || (item.href === '/dashboard' && pathname === '/dashboard')
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <span aria-hidden="true" className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => { 
                if (theme === 'light') setTheme('dark')
                else if (theme === 'dark') setTheme('system')
                else setTheme('light')
                setMobileMenuOpen(false)
              }}>
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                {darkMode ? 'Modo Claro' : theme === 'system' ? 'Modo Sistema' : 'Modo Escuro'}
              </Button>
              {user ? (
                <>
                  <Button variant="outline" className="w-full justify-start gap-3" onClick={() => { router.push('/profile'); setMobileMenuOpen(false); }}>
                    <UserCircleIcon className="h-5 w-5" />
                    Meu Perfil
                  </Button>
                  <Button variant="destructive" className="w-full justify-start gap-3" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sair
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full" onClick={() => { router.push('/login'); setMobileMenuOpen(false); }}>
                    Entrar
                  </Button>
                  <Button className="w-full" onClick={() => { router.push('/register'); setMobileMenuOpen(false); }}>
                    Cadastrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Transition>
      </nav>
    </header>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}