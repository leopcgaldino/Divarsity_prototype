'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'pride' | 'outline' | 'pride-outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  dotColor?: string
  icon?: ReactNode
  removable?: boolean
  onRemove?: () => void
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    dot, 
    dotColor, 
    icon, 
    removable, 
    onRemove, 
    children, 
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
      secondary: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      destructive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      pride: 'bg-gradient-to-r from-pride-red via-pride-orange via-pride-yellow via-pride-green via-pride-blue to-pride-purple text-white shadow-pride-sm',
      outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-transparent',
      'pride-outline': 'border-2 border-transparent bg-gradient-to-r from-pride-red via-pride-orange via-pride-yellow via-pride-green via-pride-blue to-pride-purple bg-clip-text text-transparent',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-base gap-2',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full transition-colors duration-200',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn('rounded-full', size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')}
            style={{ backgroundColor: dotColor || 'currentColor' }}
            aria-hidden="true"
          />
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              'ml-1 rounded-full p-0.5 transition-colors',
              'hover:bg-black/10 dark:hover:bg-white/10',
              size === 'sm' && 'h-4 w-4',
              size === 'md' && 'h-5 w-5',
              size === 'lg' && 'h-6 w-6'
            )}
            aria-label="Remover"
          >
            <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export const VerificationBadge = ({ status, size = 'md' }: { status: 'pending' | 'verified' | 'rejected'; size?: 'sm' | 'md' | 'lg' }) => {
  const configs = {
    verified: {
      label: 'Verificado',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      variant: 'success' as const,
      dotColor: '#10b981',
    },
    pending: {
      label: 'Pendente',
      icon: (
        <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ),
      variant: 'warning' as const,
      dotColor: '#f59e0b',
    },
    rejected: {
      label: 'Recusado',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10 7.293 11.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      variant: 'destructive' as const,
      dotColor: '#ef4444',
    },
  }

  const config = configs[status]

  return (
    <Badge variant={config.variant} size={size} dot dotColor={config.dotColor} icon={config.icon}>
      {config.label}
    </Badge>
  )
}

export const PlanBadge = ({ plan, size = 'md' }: { plan: 'free' | 'premium' | 'plus' | 'corporate'; size?: 'sm' | 'md' | 'lg' }) => {
  const configs = {
    free: { label: 'Gratuito', variant: 'default' as const },
    premium: { label: 'Premium', variant: 'primary' as const },
    plus: { label: 'Plus', variant: 'pride' as const },
    corporate: { label: 'Corporativo', variant: 'secondary' as const },
  }

  const config = configs[plan]

  return <Badge variant={config.variant} size={size}>{config.label}</Badge>
}

export const OpportunityTypeBadge = ({ type, size = 'md' }: { type: 'formal' | 'freelance' | 'gig'; size?: 'sm' | 'md' | 'lg' }) => {
  const configs = {
    formal: { label: 'Vaga Formal', variant: 'primary' as const, icon: '🏢' },
    freelance: { label: 'Freelance', variant: 'secondary' as const, icon: '💻' },
    gig: { label: 'Bico/Serviço', variant: 'success' as const, icon: '🔧' },
  }

  const config = configs[type]

  return (
    <Badge variant={config.variant} size={size} icon={<span aria-hidden="true">{config.icon}</span>}>
      {config.label}
    </Badge>
  )
}

export const ContractTypeBadge = ({ contractType, size = 'sm' }: { contractType: 'clt' | 'pj' | 'internship' | 'trainee' | 'freelance' | 'gig'; size?: 'sm' | 'md' | 'lg' }) => {
  const labels = {
    clt: 'CLT',
    pj: 'PJ',
    internship: 'Estágio',
    trainee: 'Trainee',
    freelance: 'Freelance',
    gig: 'Bico',
  }

  const variants = {
    clt: 'primary' as const,
    pj: 'secondary' as const,
    internship: 'success' as const,
    trainee: 'warning' as const,
    freelance: 'outline' as const,
    gig: 'default' as const,
  }

  return (
    <Badge variant={variants[contractType]} size={size}>
      {labels[contractType]}
    </Badge>
  )
}

export const WorkModalityBadge = ({ modality, size = 'sm' }: { modality: 'remote' | 'hybrid' | 'onsite'; size?: 'sm' | 'md' | 'lg' }) => {
  const configs = {
    remote: { label: 'Remoto', variant: 'success' as const, icon: '🏠' },
    hybrid: { label: 'Híbrido', variant: 'warning' as const, icon: '🔄' },
    onsite: { label: 'Presencial', variant: 'primary' as const, icon: '🏢' },
  }

  const config = configs[modality]

  return (
    <Badge variant={config.variant} size={size} icon={<span aria-hidden="true">{config.icon}</span>}>
      {config.label}
    </Badge>
  )
}

export const AffirmativeActionBadge = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => (
  <Badge variant="pride" size={size} icon={<span aria-hidden="true">✊</span>}>
    Vaga Afirmativa
  </Badge>
)