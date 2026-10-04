import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ApplicationsView } from '@/components/dashboard/ApplicationsView'

export default async function CandidaturasPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <ApplicationsView />
}
