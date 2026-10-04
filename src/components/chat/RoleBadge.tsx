import { BuildingOfficeIcon, SparklesIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { getRoleKind, ROLE_LABELS, type ChatRoleKind } from '@/lib/chat/utils'

const STYLES: Record<ChatRoleKind, { icon: typeof UserIcon; className: string }> = {
  recruiter: { icon: BuildingOfficeIcon, className: 'text-pride-blue dark:text-pride-lightBlue' },
  talent: { icon: SparklesIcon, className: 'text-pride-purple dark:text-pride-pink' },
  admin: { icon: ShieldCheckIcon, className: 'text-pride-green' },
  unknown: { icon: UserIcon, className: 'text-gray-500 dark:text-gray-400' },
}

/** Diferencia visualmente talentos de recrutadores/empresas PJ */
export function RoleBadge({ role, compact = false }: { role: string | null | undefined; compact?: boolean }) {
  const kind = getRoleKind(role)
  const { icon: Icon, className } = STYLES[kind]
  return (
    <span className={cn('inline-flex items-center gap-1 font-medium', compact ? 'text-[11px]' : 'text-xs', className)}>
      <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      {ROLE_LABELS[kind]}
    </span>
  )
}
