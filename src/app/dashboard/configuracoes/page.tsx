import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SettingsView } from '@/components/dashboard/SettingsView'

export default async function ConfiguracoesPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <SettingsView />
}
