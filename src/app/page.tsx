'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  UsersIcon,
  SparklesIcon,
  BriefcaseIcon,
  LockClosedIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'
import { MainLayout } from '@/components/layout/MainLayout'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Ambiente 100% seguro',
    description: 'Verificação biométrica e documental para garantir perfis reais. Zero tolerância a assédio e discriminação.',
    accent: 'bg-pride-green',
  },
  {
    icon: UsersIcon,
    title: 'Comunidade exclusiva',
    description: 'Feita por e para Mulheres (Cis e Trans) e Pessoas LGBTQIAPN+. Networking genuíno e acolhedor.',
    accent: 'bg-pride-purple',
  },
  {
    icon: BriefcaseIcon,
    title: '3 modalidades de trabalho',
    description: 'Vagas formais (CLT/PJ), freelances por projeto e bicos rápidos. Tudo em um só lugar.',
    accent: 'bg-pride-blue',
  },
  {
    icon: SparklesIcon,
    title: 'Copiloto de carreira com IA',
    description: 'Gerador de currículos, simulador de entrevistas e calculadora de preço justo.',
    accent: 'bg-magenta-500',
  },
  {
    icon: GlobeAltIcon,
    title: 'Remoto, híbrido ou presencial',
    description: 'Filtros por localização, modalidade e tipo de contrato. Oportunidades perto de você.',
    accent: 'bg-pride-orange',
  },
  {
    icon: LockClosedIcon,
    title: 'Sua identidade protegida',
    description: 'Nome social e pronomes no perfil público. Dados civis ficam restritos à verificação interna.',
    accent: 'bg-pride-red',
  },
]

const stats = [
  { value: '10k+', label: 'Talentos cadastrados' },
  { value: '500+', label: 'Empresas parceiras' },
  { value: '2k+', label: 'Oportunidades ativas' },
  { value: '98%', label: 'Satisfação da comunidade' },
]

const steps = [
  {
    step: '01',
    title: 'Crie seu perfil inclusivo',
    description: 'Cadastre-se com seu nome social, pronomes e identidade. Seus dados legais ficam protegidos.',
    icon: UsersIcon,
  },
  {
    step: '02',
    title: 'Explore oportunidades',
    description: 'Filtre vagas CLT/PJ, freelas e bicos por localização e modalidade. Receba alertas personalizados.',
    icon: MagnifyingGlassIcon,
  },
  {
    step: '03',
    title: 'Conecte-se e cresça',
    description: 'Converse com recrutadoras, use o Copiloto IA para otimizar seu currículo e construa sua rede.',
    icon: SparklesIcon,
  },
]

const plans = [
  {
    name: 'Gratuito',
    price: 0,
    description: 'Ideal para começar a explorar',
    features: [
      'Perfil completo e público',
      'Busca e candidatura a oportunidades',
      'Até 15 conexões por mês',
      'Chat básico com recrutadoras',
      'Exportação de currículo em PDF',
    ],
    cta: 'Começar grátis',
    popular: false,
  },
  {
    name: 'Premium',
    price: 11.99,
    description: 'Mais visibilidade e oportunidades',
    features: [
      'Tudo do Gratuito',
      '+40% visibilidade nas buscas',
      'Selo "Perfil Destaque"',
      'Alertas instantâneos de vagas',
      'Quem visitou seu perfil (30 dias)',
      'Filtros avançados de busca',
    ],
    cta: 'Assinar Premium',
    popular: false,
  },
  {
    name: 'Plus',
    price: 19.99,
    description: 'Poder total com IA para sua carreira',
    features: [
      'Tudo do Premium',
      '+70% visibilidade nas buscas',
      'Copiloto de Carreira IA ilimitado',
      'Currículos e cartas gerados por IA',
      'Simulador de entrevistas por IA',
      'Painel analítico completo',
      'Dicas de precificação para freelas',
    ],
    cta: 'Assinar Plus',
    popular: true,
  },
]

const identities = [
  'Mulheres Cis', 'Mulheres Trans', 'Pessoas Não-Binárias', 'Lésbicas', 'Gays', 'Bissexuais',
  'Travestis', 'Homens Trans', 'Queer', 'Intersexo', 'Assexuais', 'Pansexuais',
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
}

function SectionHeading({ eyebrow, title, description, light }: { eyebrow: string; title: React.ReactNode; description?: string; light?: boolean }) {
  return (
    <motion.div {...fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
      <p className={cn('mb-4 text-sm font-semibold uppercase tracking-widest', light ? 'text-magenta-400' : 'text-magenta-600 dark:text-magenta-400')}>
        {eyebrow}
      </p>
      <h2 className={cn('text-3xl font-bold sm:text-5xl', light ? 'text-white' : 'text-ink dark:text-white')}>{title}</h2>
      {description && (
        <p className={cn('mt-5 text-lg leading-relaxed text-pretty', light ? 'text-white/70' : 'text-ink-muted dark:text-gray-400')}>
          {description}
        </p>
      )}
    </motion.div>
  )
}

export default function HomePage() {
  const router = useRouter()

  return (
    <MainLayout showFooter={true}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-magenta-400/20 blur-3xl" />
          <div className="absolute bottom-0 -left-32 h-[24rem] w-[24rem] rounded-full bg-primary-400/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm font-medium text-ink shadow-soft dark:border-white/10 dark:bg-gray-900 dark:text-white"
            >
              <span className="h-3 w-6 rounded-full bg-pride-stripe" aria-hidden="true" />
              Plataforma 100% inclusiva
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-extrabold leading-[1.02] text-ink dark:text-white sm:text-6xl lg:text-7xl"
            >
              Trabalho onde você pode ser{' '}
              <span className="pride-text">quem você é.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted dark:text-gray-300 text-pretty"
            >
              A primeira plataforma de empregabilidade exclusiva para Mulheres e Pessoas LGBTQIAPN+.
              Vagas formais, freelas e bicos em um ambiente seguro, livre de preconceito.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Button size="lg" variant="pride" onClick={() => router.push('/register')}>
                Criar conta gratuita
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/enterprise')}>
                Sou empresa
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-muted dark:text-gray-400"
              role="list"
            >
              {['Verificação biométrica', 'Dados protegidos (LGPD)', 'Sem taxas sobre seus ganhos'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-pride-green" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] shadow-pride">
              <Image
                src="/images/hero-community.png"
                alt="Grupo diverso de profissionais LGBTQIAPN+ sorrindo e conversando em um escritório acolhedor"
                width={928}
                height={1152}
                priority
                className="h-[28rem] w-full object-cover sm:h-[34rem]"
              />
              <div className="absolute inset-x-0 bottom-0 h-2 bg-pride-stripe" aria-hidden="true" />
            </div>

            <div className="absolute -left-4 bottom-10 hidden rounded-2xl border border-ink/5 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-gray-900 sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pride-green/15">
                  <ShieldCheckIcon className="h-5 w-5 text-pride-green" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-white">Perfis verificados</p>
                  <p className="text-xs text-ink-muted dark:text-gray-400">Segurança em primeiro lugar</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-8 hidden rounded-2xl bg-ink px-4 py-3 text-white shadow-soft sm:block">
              <p className="font-display text-2xl font-bold">2k+</p>
              <p className="text-xs text-white/70">vagas afirmativas</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Identities marquee */}
      <section aria-label="Pessoas que fazem parte da comunidade" className="overflow-hidden border-y border-ink/10 bg-white py-5 dark:border-white/10 dark:bg-gray-900">
        <div className="flex w-max animate-marquee gap-10">
          {[...identities, ...identities].map((identity, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-xl font-semibold text-ink dark:text-white" aria-hidden={i >= identities.length}>
              {identity}
              <span className="h-2 w-2 rounded-full bg-magenta-500" aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 dark:border-white/10 dark:bg-white/10 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ delay: index * 0.08 }}
                className="flex flex-col-reverse gap-1 bg-cream p-8 dark:bg-gray-950"
              >
                <dt className="text-sm text-ink-muted dark:text-gray-400">{stat.label}</dt>
                <dd className="font-display text-4xl font-bold text-ink dark:text-white sm:text-5xl">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Por que a Divarsity"
            title={<>Tudo para você <span className="pride-underline">prosperar</span> com orgulho</>}
            description="Cada funcionalidade foi pensada para sua segurança, visibilidade e crescimento profissional."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                {...fadeUp}
                transition={{ delay: index * 0.06 }}
                className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-gray-900"
              >
                <div className={cn('mb-6 flex h-12 w-12 items-center justify-center rounded-2xl text-white', feature.accent)}>
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-ink dark:text-white">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted dark:text-gray-400">{feature.description}</p>
                <span className={cn('absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100', feature.accent)} aria-hidden="true" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="scroll-mt-24 bg-ink py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Como funciona" title="Três passos até sua próxima oportunidade" light />

          <ol className="grid gap-6 md:grid-cols-3" role="list">
            {steps.map((item, index) => (
              <motion.li
                key={item.step}
                {...fadeUp}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-display text-5xl font-extrabold text-white/20">{item.step}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-magenta-500 to-primary-600">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-white/65">{item.description}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Planos"
            title="Para cada momento da sua carreira"
            description="Sem taxas sobre seus ganhos. 100% do que você negociar é seu. Assinaturas a partir de R$ 11,99/mês."
          />

          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                {...fadeUp}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  'relative flex flex-col rounded-3xl p-8',
                  plan.popular
                    ? 'bg-ink text-white shadow-pride dark:bg-gray-900 dark:ring-1 dark:ring-white/15'
                    : 'border border-ink/10 bg-white text-ink dark:border-white/10 dark:bg-gray-900 dark:text-white'
                )}
              >
                {plan.popular && (
                  <>
                    <div className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-pride-stripe" aria-hidden="true" />
                    <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-magenta-500 to-primary-600 px-3 py-1 text-xs font-semibold">
                      Mais popular
                    </span>
                  </>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className={cn('mt-1 text-sm', plan.popular ? 'text-white/65' : 'text-ink-muted dark:text-gray-400')}>{plan.description}</p>
                <p className="mt-8 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold">
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`}
                  </span>
                  {plan.price > 0 && <span className={plan.popular ? 'text-white/60' : 'text-ink-muted'}>/mês</span>}
                </p>
                <ul className="mt-8 flex-1 space-y-3" role="list">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <CheckIcon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', plan.popular ? 'text-magenta-400' : 'text-pride-green')} aria-hidden="true" />
                      <span className={plan.popular ? 'text-white/85' : 'text-ink/80 dark:text-gray-300'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'pride' : 'outline'}
                  className="mt-8 w-full"
                  onClick={() => router.push(`/register?plan=${plan.name.toLowerCase()}`)}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-magenta-600 via-primary-700 to-pride-blue px-6 py-20 text-center text-white sm:px-16"
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-pride-stripe" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
          <p className="relative mb-6 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            Junte-se a milhares de talentos diversos
          </p>
          <h2 className="relative mx-auto max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Sua carreira merece um espaço onde você possa ser 100% você
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-lg text-white/80">
            Cadastre-se grátis hoje. Sem taxas escondidas, sem compromisso.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="bg-white text-ink hover:bg-cream dark:bg-white dark:text-ink" onClick={() => router.push('/register')}>
              Começar agora, é grátis
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={() => router.push('/enterprise')}>
              Quero contratar talentos diversos
            </Button>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  )
}
