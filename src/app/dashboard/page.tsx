import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardHome } from '@/components/dashboard/DashboardHome'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <DashboardHome />
}
