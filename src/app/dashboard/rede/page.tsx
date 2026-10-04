// Autenticação garantida pelo middleware (src/middleware.ts)
import { PlaceholderPage } from '@/components/dashboard/PlaceholderPage'

export default function RedePage() {
  return <PlaceholderPage title="Rede" description="Conecte-se com outros profissionais e aliados da diversidade." icon="users" />
}
