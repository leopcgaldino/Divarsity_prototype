# Divarsity - Plataforma de Empregabilidade Inclusiva

> A primeira plataforma de empregabilidade exclusiva para Mulheres (Cis e Trans) e Pessoas LGBTQIAPN+.

## 🌈 Sobre o Projeto

Divarsity é uma Web Application responsiva (PWA / Mobile First) que funciona como uma rede profissional inclusiva (estilo "LinkedIn Inclusivo"), integrando:

- **Vagas Formais** (CLT, PJ, Estágio, Trainee)
- **Freelances** (Projetos por entrega)
- **Bicos & Serviços Rápidos** (Diárias, reparos, eventos, etc.)

### Princípios Fundamentais

- 🏳️‍🌈 **Exclusividade e Acolhimento**: Plataforma para Mulheres (Cis/Trans) e LGBTQIAPN+
- 🛡️ **Proteção de Identidade**: Nome social e pronomes públicos; dados legais (CPF, nome civil) apenas para verificação interna
- ✅ **Verificação Biométrica**: Liveness check + documento para selo "Perfil Verificado"
- 💰 **Zero Taxas**: 100% do negociado vai para quem executou o trabalho
- 🤖 **Copiloto IA**: Gerador de currículos, simulador de entrevistas, calculadora de preço justo (Plano Plus)

## 🛠 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Design System customizado |
| **Backend/DB** | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| **Pagamentos** | Stripe (global) + Mercado Pago (Brasil) |
| **Auth** | Supabase Auth (Email/Password + Google OAuth) |
| **UI Components** | Headless UI, Heroicons, Framer Motion |
| **Forms** | React Hook Form + Zod |
| **Notificações** | Sonner (toasts) |
| **Deploy** | Vercel (recomendado) |

## 📁 Estrutura do Projeto

```
divarsity/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout com providers
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registro page
│   │   ├── onboarding/         # Onboarding multi-step
│   │   ├── dashboard/          # Feed de oportunidades
│   │   └── auth/callback/      # OAuth callback
│   ├── components/
│   │   ├── ui/                 # Design System (Button, Input, Card, etc.)
│   │   ├── layout/             # Header, Footer, MainLayout
│   │   ├── onboarding/         # OnboardingForm
│   │   └── dashboard/          # OpportunityFeed
│   ├── hooks/
│   │   └── useAuth.tsx         # Auth context + hooks
│   ├── lib/
│   │   ├── supabase/           # Cliente Supabase (browser/server)
│   │   └── utils.ts            # Utilitários gerais
│   └── types/
│       └── index.ts            # Tipos TypeScript completos
├── supabase/
│   └── schema.sql              # Schema completo do banco
├── .env.example                # Variáveis de ambiente
├── tailwind.config.ts          # Config Tailwind + Pride Gradient
├── next.config.js              # Config Next.js
└── package.json
```

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Supabase](https://supabase.com)
- Conta no [Stripe](https://stripe.com) (opcional, para pagamentos)

### 1. Clone e instale dependências

```bash
cd divarsity
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret

# Stripe (opcional - para pagamentos)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PLUS_MONTHLY=price_...
STRIPE_PRICE_CORPORATE_MONTHLY=price_...
```

### 3. Configure o Supabase

1. Crie um novo projeto no Supabase
2. Vá no SQL Editor e execute o conteúdo de `supabase/schema.sql`
3. Em **Authentication > Providers**, habilite **Google** e configure os callbacks:
   - `http://localhost:3000/auth/callback` (desenvolvimento)
   - `https://seu-dominio.com/auth/callback` (produção)
4. Em **Storage**, crie buckets: `avatars`, `covers`, `documents`, `portfolio`

### 4. Rode o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🗄️ Schema do Banco de Dados

O arquivo `supabase/schema.sql` contém:

- **Tabelas principais**: `users`, `profiles`, `experiences`, `education`, `portfolio_items`, `external_links`, `profile_skills`
- **Assinaturas**: `subscriptions`, `payment_history`
- **Oportunidades**: `opportunities`, `opportunity_skills`, `opportunity_applications`
- **Networking**: `connections`, `conversations`, `conversation_participants`, `messages`, `message_reactions`
- **IA**: `ai_copilot_sessions`, `ai_generated_documents`
- **Segurança**: `reports`, `content_moderation_logs`
- **Analytics**: `profile_analytics`, `company_esg_metrics`
- **Notificações**: `notifications`
- **RLS Policies**: Políticas de segurança por tabela
- **Triggers**: `updated_at` automático
- **Funções**: `get_public_profile`, `increment_profile_views`, `search_opportunities`

## 🎨 Design System

### Cores Principais

```css
/* Primary - Roxo/Violeta */
--primary-500: #7c4dff;
--primary-600: #6d28d9;

/* Pride Gradient */
--pride-red: #FF0018;
--pride-orange: #FFA52C;
--pride-yellow: #FFFF41;
--pride-green: #008018;
--pride-blue: #0000F9;
--pride-purple: #86007D;
```

### Componentes Principais

- `Button` - 6 variantes (primary, secondary, outline, ghost, destructive, pride)
- `Input/Textarea/Select` - Com label, error, hint, icons
- `Card` - 4 variantes (default, outlined, elevated, pride)
- `Avatar` - Com status online, badge de verificação, borda pride
- `Badge` - 9 variantes + especializados (Verification, Plan, OpportunityType, etc.)
- `Modal/Sheet/ConfirmDialog` - Com animações Framer Motion
- `Dropdown/SelectDropdown` - Menu dropdown acessível

## 📱 PWA

O projeto está configurado para funcionar como PWA:
- `next-pwa` para service worker
- Manifest em `public/manifest.json`
- Ícones em `public/icons/`
- Funciona offline para visualização de oportunidades já carregadas

## 🔐 Segurança

- **RLS (Row Level Security)** em todas as tabelas
- **Validação server-side** em todas as Server Actions
- **Rate limiting** via Supabase
- **Content Security Policy** configurável
- **LGPD compliance**: Dados sensíveis criptografados, direito ao esquecimento

## 🧪 Testes

```bash
# Unitários
npm run test

# E2E
npm run test:e2e

# Lint
npm run lint
```

## 📦 Deploy na Vercel

1. Conecte seu repositório na Vercel
2. Adicione as variáveis de ambiente
3. Configure o domínio personalizado
4. Deploy automático a cada push na `main`

### Variáveis de Produção

```env
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# ... demais variáveis
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 💜 Agradecimentos

- Comunidade LGBTQIAPN+ brasileira
- Mulheres em tecnologia
- Contribuidores open source
- Supabase, Vercel, Tailwind CSS teams

---

**Feito com 💜 para a comunidade**

[Website](https://divarsity.com.br) • [Instagram](https://instagram.com/divarsity) • [LinkedIn](https://linkedin.com/company/divarsity)