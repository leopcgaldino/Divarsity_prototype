import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PlaceholderPage } from '@/components/dashboard/PlaceholderPage'

export default async function MensagensPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <PlaceholderPage title="Mensagens" description="Converse com recrutadores e outros profissionais." icon="message" />
}
