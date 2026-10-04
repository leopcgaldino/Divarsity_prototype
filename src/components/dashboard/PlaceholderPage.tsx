'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Users, MessageSquare, Construction } from 'lucide-react'

const icons: Record<string, React.ReactNode> = {
  users: <Users className="w-12 h-12" />,
  message: <MessageSquare className="w-12 h-12" />,
}

export function PlaceholderPage({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <DashboardLayout>
      <div className="text-center py-12 sm:py-20">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          {icons[icon] ?? <Construction className="w-12 h-12" />}
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto px-4">{description}</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
          <Construction className="w-4 h-4" /> Em breve
        </div>
      </div>
    </DashboardLayout>
  )
}
