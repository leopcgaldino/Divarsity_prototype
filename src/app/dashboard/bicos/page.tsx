// Autenticação garantida pelo middleware (src/middleware.ts)
import { OpportunityList } from '@/components/dashboard/OpportunityList'

export default function BicosPage() {
  return <OpportunityList type="BICO" title="Bicos" />
}
