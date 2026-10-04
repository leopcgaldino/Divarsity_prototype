// Autenticação garantida pelo middleware (src/middleware.ts)
import { OpportunityList } from '@/components/dashboard/OpportunityList'

export default function FreelancesPage() {
  return <OpportunityList type="FREELANCE" title="Freelances" />
}
