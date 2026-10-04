// Autenticação garantida pelo middleware (src/middleware.ts)
import { OpportunityList } from '@/components/dashboard/OpportunityList'

export default function VagasPage() {
  return <OpportunityList type="VAGA" title="Vagas" />
}
