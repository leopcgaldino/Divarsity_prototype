import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { CopilotView } from '@/components/dashboard/CopilotView'

export default async function CopilotoPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <CopilotView />
}
