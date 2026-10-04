import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PlaceholderPage } from '@/components/dashboard/PlaceholderPage'

export default async function RedePage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <PlaceholderPage title="Rede" description="Conecte-se com outros profissionais e aliados da diversidade." icon="users" />
}
