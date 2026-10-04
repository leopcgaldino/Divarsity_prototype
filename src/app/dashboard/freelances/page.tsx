import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { OpportunityList } from '@/components/dashboard/OpportunityList'

export default async function FreelancesPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <OpportunityList type="FREELANCE" title="Freelances" />
}
