'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Transition } from '@headlessui/react'
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  BriefcaseIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button, Avatar, Dropdown } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Logo } from './Logo'

const navigation = [
  { name: 'Início', href: '/dashboard', icon: HomeIcon },
  { name: 'Vagas', href: '/dashboard?tab=vagas', icon: BriefcaseIcon },
  { name: 'Freelances', href: '/dashboard?tab=freelances', icon: ComputerDesktopIcon },
  { name: 'Bicos', href: '/dashboard?tab=bicos', icon: WrenchScrewdriverIcon },
  { name: 'Minha Rede', href: '/connections', icon: UsersIcon },
  { name: 'Mensagens', href: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Copiloto IA', href: '/copilot', icon: SparklesIcon },
]

const publicNavigation = [
  { name: 'Oportunidades', href: '/#recursos' },
  { name: 'Como funciona', href: '/#como-funciona' },
  { name: 'Planos', href: '/#planos' },
  { name: 'Para empresas', href: '/enterprise' },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const darkMode = resolvedTheme === 'dark'

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href.split('?')[0]) && href.split('?')[0] !== '/dashboard'

  const userMenuItems = [
    { label: 'Meu Perfil', href: '/profile', icon: <UserCircleIcon className="h-4 w-4" /> },
    { label: 'Configurações', href: '/settings', icon: <Cog6ToothIcon className="h-4 w-4" /> },
    { label: 'Minha Assinatura', href: '/subscription', icon: <CreditCardIcon className="h-4 w-4" /> },
    { divider: true },
    { label: 'Sair', onClick: signOut, icon: <ArrowRightOnRectangleIcon className="h-4 w-4" />, danger: true },
  ]

  const iconButton =
    'rounded-full p-2 text-ink/60 hover:text-ink hover:bg-ink/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="h-1 w-full bg-pride-stripe" aria-hidden="true" />
      <div className="bg-cream/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-ink/5 dark:border-white/10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
          <div className="flex h-16 items-center justify-between gap-4">
            <Logo href={user ? '/dashboard' : '/'} size="sm" />

            {user ? (
              <div className="hidden lg:flex lg:items-center lg:gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-ink text-white dark:bg-white dark:text-ink'
                        : 'text-ink/70 hover:text-ink hover:bg-ink/5 dark:text-gray-300 dark:hover:bg-white/10'
                    )}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="hidden md:flex md:items-center md:gap-1">
                {publicNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-full text-sm font-medium text-ink/70 hover:text-ink hover:bg-ink/5 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="hidden md:flex md:items-center md:gap-2">
              {user && (
                <form onSubmit={handleSearch} className="relative hidden xl:block" role="search">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar oportunidades"
                    className="w-52 pl-9 pr-4 py-2 rounded-full border border-ink/10 bg-white dark:border-gray-700 dark:bg-gray-900 text-sm text-ink dark:text-gray-100 placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Buscar oportunidades"
                  />
                </form>
              )}

              <button
                onClick={cycleTheme}
                className={iconButton}
                aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>

              {user ? (
                <>
                  <button className={cn(iconButton, 'relative')} aria-label="Notificações, 3 não lidas">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-magenta-500 ring-2 ring-cream dark:ring-gray-950" aria-hidden="true" />
                  </button>
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="sm" className="gap-2 pl-1">
                        <Avatar
                          src={profile?.avatar_url}
                          name={profile?.social_name || user.email}
                          size="sm"
                          verificationStatus={profile?.verification_status}
                          prideBorder={profile?.verification_status === 'verified'}
                        />
                        <span className="hidden sm:block text-sm font-medium">
                          {profile?.social_name?.split(' ')[0] || 'Usuário'}
                        </span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    }
                    items={userMenuItems}
                  />
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                    Entrar
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => router.push('/register')}>
                    Criar conta
                  </Button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(iconButton, 'md:hidden')}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>

          <Transition
            show={mobileMenuOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <div className="md:hidden py-4 border-t border-ink/10 dark:border-white/10">
              {user && (
                <form onSubmit={handleSearch} className="mb-4" role="search">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink/40" aria-hidden="true" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar vagas, freelas, bicos..."
                      className="w-full pl-10 pr-4 py-3 rounded-full border border-ink/10 bg-white dark:border-gray-700 dark:bg-gray-900 text-ink dark:text-gray-100 placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label="Buscar oportunidades"
                    />
                  </div>
                </form>
              )}

              <div className="flex flex-col gap-1 mb-4">
                {(user ? navigation : publicNavigation).map((item) => {
                  const Icon = 'icon' in item ? (item.icon as typeof HomeIcon) : null
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-colors',
                        user && isActive(item.href)
                          ? 'bg-ink text-white dark:bg-white dark:text-ink'
                          : 'text-ink/80 hover:bg-ink/5 dark:text-gray-300 dark:hover:bg-white/10'
                      )}
                    >
                      {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-ink/10 dark:border-white/10">
                <Button variant="outline" className="w-full justify-start gap-3" onClick={() => { cycleTheme(); setMobileMenuOpen(false) }}>
                  {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                  {darkMode ? 'Modo claro' : 'Modo escuro'}
                </Button>
                {user ? (
                  <>
                    <Button variant="outline" className="w-full justify-start gap-3" onClick={() => { router.push('/profile'); setMobileMenuOpen(false) }}>
                      <UserCircleIcon className="h-5 w-5" />
                      Meu Perfil
                    </Button>
                    <Button variant="destructive" className="w-full justify-start gap-3" onClick={() => { signOut(); setMobileMenuOpen(false) }}>
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => { router.push('/login'); setMobileMenuOpen(false) }}>
                      Entrar
                    </Button>
                    <Button variant="pride" className="w-full" onClick={() => { router.push('/register'); setMobileMenuOpen(false) }}>
                      Criar conta gratuita
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Transition>
        </nav>
      </div>
    </header>
  )
}
