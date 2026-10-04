'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button, Avatar, Badge } from '@/components/ui'
import { 
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  SparklesIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Avatar as UIAvatar } from '@/components/ui'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Início', href: '/dashboard', icon: HomeIcon, label: 'Início' },
  { name: 'Vagas', href: '/dashboard?vagas', icon: BriefcaseIcon, label: 'Vagas' },
  { name: 'Freelances', href: '/dashboard?freelances', icon: BriefcaseIcon, label: 'Freelances' },
  { name: 'Bicos', href: '/dashboard?bicos', icon: SparklesIcon, label: 'Bicos' },
  { name: 'Minhas Candidaturas', href: '/applications', icon: BriefcaseIcon, label: 'Candidaturas' },
  { name: 'Minha Rede', href: '/connections', icon: UsersIcon, label: 'Rede' },
  { name: 'Mensagens', href: '/messages', icon: ChatBubbleLeftRightIcon, label: 'Mensagens' },
  { name: 'Copiloto IA', href: '/copilot', icon: SparklesIcon, label: 'Copiloto' },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon, label: 'Configurações' },
]

const userNavigation = [
  { name: 'Meu Perfil', href: '/profile', icon: UserCircleIcon },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut: authSignOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await authSignOut()
    router.push('/login')
    router.refresh()
  }

  const currentPath = pathname.split('?')[0]
  const searchParams = pathname.split('?')[1] || ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex relative">
      {/* Animated Pride Background Accent */}
      <div 
        className="fixed inset-0 -z-10 bg-pride-gradient-soft opacity-5 dark:opacity-10 animate-pride-flow bg-[size:300%_300%] pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Top Pride Accent Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-pride-gradient animate-pride-flow bg-[size:300%_300%] z-50"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 relative"
            aria-label="Sidebar"
          >
            {/* Sidebar Pride Glow */}
            <div 
              className="absolute inset-0 bg-pride-gradient/5 dark:bg-pride-gradient/10 pointer-events-none"
              aria-hidden="true"
            />
            
            <div className="flex flex-col h-full relative z-10">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-pride-gradient/10 dark:bg-pride-gradient/5" aria-hidden="true" />
                <Link href="/dashboard" className="flex items-center gap-2 relative" aria-label="Divarsity - Início">
                  <div className="h-8 w-8 rounded-xl bg-pride-gradient relative overflow-hidden shadow-pride-sm animate-pulse-soft">
                    <div className="absolute inset-0 bg-pride-gradient animate-pride-flow bg-[size:300%_300%] opacity-80" />
                    <span className="text-white font-bold text-lg relative z-10">D</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-gray-900 via-primary-600 to-pride-purple dark:from-white dark:via-primary-400 dark:to-pride-pink bg-clip-text text-transparent">
                    Divarsity
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  aria-label="Fechar sidebar"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 relative">
                <div className="absolute inset-0 bg-pride-gradient/5 dark:bg-pride-gradient/5 pointer-events-none" aria-hidden="true" />
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Buscar oportunidades..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pride-purple/50 focus:border-pride-purple/50 transition-all duration-200"
                    aria-label="Buscar oportunidades"
                  />
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative" aria-label="Navegação principal">
                <div className="absolute inset-0 bg-pride-gradient/5 dark:bg-pride-gradient/5 pointer-events-none" aria-hidden="true" />
                {navigation.map((item, index) => {
                  const isActive = currentPath === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden group',
                        isActive
                          ? 'bg-pride-gradient/10 dark:bg-pride-gradient/20 text-pride-purple dark:text-pride-pink border border-pride-purple/30 dark:border-pride-pink/30 shadow-pride-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-pride-gradient/5 dark:hover:bg-pride-gradient/10 hover:text-pride-purple dark:hover:text-pride-pink'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className="absolute left-0 top-0 bottom-0 w-1 bg-pride-gradient"
                          aria-hidden="true"
                        />
                      )}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon 
                          className={cn('h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-200 group-hover:scale-110', 
                            isActive 
                              ? 'text-pride-purple dark:text-pride-pink drop-shadow-[0_0_8px_rgba(134,0,125,0.5)]' 
                              : 'text-gray-400 dark:text-gray-500 group-hover:text-pride-purple/70 dark:group-hover:text-pride-pink/70'
                          )} 
                          aria-hidden="true" 
                        />
                        <span className="truncate relative z-10">{item.label}</span>
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 relative">
                <div className="absolute inset-0 bg-pride-gradient/5 dark:bg-pride-gradient/5 pointer-events-none" aria-hidden="true" />
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-pride-gradient/5 dark:hover:bg-pride-gradient/10 transition-all duration-300 relative group"
                >
                  <UIAvatar
                    src={profile?.avatar_url}
                    name={profile?.social_name || user?.email}
                    size="md"
                    verificationStatus={profile?.verification_status}
                    prideBorder={true}
                    className="relative z-10 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-pride-purple dark:group-hover:text-pride-pink transition-colors">
                      {profile?.social_name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {profile?.headline || 'Usuário'}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-pride-gradient/0 group-hover:bg-pride-gradient/5 rounded-xl transition-opacity duration-300" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-pride-purple/50 dark:hover:border-pride-pink/50 transition-all duration-300"
        aria-label="Abrir menu"
      >
        <div className="relative p-1 bg-pride-gradient rounded-lg">
          <ChevronRightIcon className="h-6 w-6 text-white bg-white/10 px-1 py-0.5 rounded" />
        </div>
      </button>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen bg-gray-50 dark:bg-gray-950 relative">
        {/* Subtle Pride Pattern Background */}
        <div 
          className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pride-red/5 via-transparent to-pride-purple/5 dark:from-pride-red/10 dark:to-pride-purple/10 pointer-events-none"
          aria-hidden="true"
        />
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 relative">
          {/* Header Pride Accent */}
          <div 
            className="absolute top-0 left-0 right-0 h-0.5 bg-pride-gradient animate-pride-flow bg-[size:300%_300%]"
            aria-hidden="true"
          />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Search (mobile) */}
              <div className="flex-1 lg:hidden">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pride-purple/50 focus:border-pride-purple/50 transition-all duration-200"
                    aria-label="Buscar oportunidades"
                  />
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Search (desktop) */}
                <div className="hidden lg:flex-1 max-w-md">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <input
                      type="search"
                      placeholder="Buscar oportunidades, pessoas, empresas..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pride-purple/50 focus:border-pride-purple/50 transition-all duration-200"
                      aria-label="Buscar oportunidades"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl text-gray-500 hover:bg-pride-gradient/5 dark:hover:bg-pride-gradient/10 transition-all duration-300 group" aria-label="Notificações">
                  <BellIcon className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:text-pride-purple dark:group-hover:text-pride-pink" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-pride-red rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-pride-gradient/0 group-hover:bg-pride-gradient/10 rounded-xl transition-opacity" aria-hidden="true" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-pride-gradient/5 dark:hover:bg-pride-gradient/10 transition-all duration-300 group"
                    aria-label="Menu do usuário"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <UIAvatar
                      src={profile?.avatar_url}
                      name={profile?.social_name || user?.email}
                      size="sm"
                      verificationStatus={profile?.verification_status}
                      prideBorder={true}
                      className="relative z-10 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[150px] group-hover:text-pride-purple dark:group-hover:text-pride-pink transition-colors">
                      {profile?.social_name?.split(' ')[0] || user?.email?.split('@')[0]}
                    </span>
                    <ChevronRightIcon className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', userMenuOpen && 'rotate-90 text-pride-purple dark:text-pride-pink')} />
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-pride border border-gray-200/50 dark:border-gray-700/50 py-1 z-50 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-pride-gradient/5 dark:bg-pride-gradient/10" aria-hidden="true" />
                        <div className="absolute top-0 left-0 right-0 h-1 bg-pride-gradient animate-pride-flow bg-[size:300%_300%]" aria-hidden="true" />
                        <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 relative z-10">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {profile?.social_name || user?.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                        {userNavigation.map((item, index) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-pride-gradient/5 dark:hover:bg-pride-gradient/10 hover:text-pride-purple dark:hover:text-pride-pink transition-all duration-200 relative z-10"
                          >
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <item.icon className="h-4 w-4 text-gray-400 group-hover:text-pride-purple dark:group-hover:text-pride-pink transition-colors" aria-hidden="true" />
                              {item.name}
                            </motion.div>
                          </Link>
                        ))}
                        <hr className="my-1 border-gray-200/50 dark:border-gray-700/50 relative z-10" />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 relative z-10 group"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          Sair
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8 relative lg:pr-4">
          {children}
        </div>
      </main>


    </div>
  )
}