'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  UsersIcon, 
  SparklesIcon,
  BriefcaseIcon,
  ComputerDesktopIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  LockClosedIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { Button, Badge, Card } from '@/components/ui'
import { MainLayout } from '@/components/layout/MainLayout'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Ambiente 100% Seguro',
    description: 'Verificação biométrica e documental para garantir perfis reais. Zero tolerância a assédio e discriminação.',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: UsersIcon,
    title: 'Comunidade Exclusiva',
    description: 'Plataforma feita por e para Mulheres (Cis e Trans) e Pessoas LGBTQIAPN+. Networking genuíno e acolhedor.',
    color: 'text-pride-purple',
    bgColor: 'bg-pride-purple/10 dark:bg-pride-purple/10',
  },
  {
    icon: BriefcaseIcon,
    title: '3 Modalidades de Trabalho',
    description: 'Vagas formais (CLT/PJ), Freelances por projeto e Bicos/Serviços rápidos. Tudo em um só lugar.',
    color: 'text-primary-500',
    bgColor: 'bg-primary-50 dark:bg-primary-900/20',
  },
  {
    icon: SparklesIcon,
    title: 'Copiloto de Carreira com IA',
    description: 'Gerador de currículos, simulador de entrevistas e calculadora de preço justo para assinantes Plus.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: GlobeAltIcon,
    title: 'Remoto, Híbrido ou Presencial',
    description: 'Filtros avançados por localização, modalidade e tipo de contrato. Encontre oportunidades perto de você.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: LockClosedIcon,
    title: 'Proteção de Identidade',
    description: 'Nome social, pronomes e identidade no perfil público. Dados legais (CPF, nome civil) apenas para verificação interna.',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
  },
]

const stats = [
  { value: '10k+', label: 'Talentos Cadastrados' },
  { value: '500+', label: 'Empresas Parceiras' },
  { value: '2k+', label: 'Oportunidades Ativas' },
  { value: '98%', label: 'Satisfação da Comunidade' },
]

const plans = [
  {
    name: 'Gratuito',
    price: 0,
    period: '/mês',
    description: 'Ideal para começar a explorar',
    features: [
      'Perfil completo e público',
      'Busca e candidatura a oportunidades',
      'Até 15 conexões por mês',
      'Chat básico com recrutadores',
      'Exportação de currículo em PDF',
    ],
    cta: 'Começar Grátis',
    variant: 'outline',
    popular: false,
  },
  {
    name: 'Premium',
    price: 11.99,
    period: '/mês',
    description: 'Mais visibilidade e oportunidades',
    features: [
      'Tudo do Gratuito',
      '+40% visibilidade nas buscas',
      'Badge "Perfil Destaque Premium"',
      'Alertas instantâneos de oportunidades',
      'Quem visitou seu perfil (30 dias)',
      'Filtros avançados de busca',
    ],
    cta: 'Assinar Premium',
    variant: 'primary',
    popular: false,
  },
  {
    name: 'Plus',
    price: 19.99,
    period: '/mês',
    description: 'Poder total com IA para sua carreira',
    features: [
      'Tudo do Premium',
      '+70% visibilidade nas buscas',
      'Copiloto de Carreira IA ilimitado',
      'Gerador de currículos e cartas por IA',
      'Simulador de entrevistas por IA',
      'Painel analítico completo do perfil',
      'Dicas de precificação para freelas/bicos',
    ],
    cta: 'Assinar Plus',
    variant: 'pride',
    popular: true,
  },
]

export default function HomePage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <MainLayout showFooter={true}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50 dark:from-primary-900/10 to-white dark:to-gray-950">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-100 dark:bg-purple-900/20 blur-3xl opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-pride-red/10 via-pride-orange/10 via-pride-yellow/10 via-pride-green/10 via-pride-blue/10 to-pride-purple/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pride-red/10 text-pride-red dark:bg-pride-red/20 dark:text-pride-red font-medium text-sm mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pride-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pride-red" />
              </span>
              Lançamento Oficial: Plataforma 100% Inclusiva
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            >
              A primeira plataforma de{' '}
              <span className="pride-text">empregabilidade exclusiva</span>{' '}
              para Mulheres e LGBTQIAPN+
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10"
            >
              Vagas formais, freelas e bicos em um ambiente seguro, livre de preconceito e com prioridade 
              para quem historicamente é excluída do mercado de trabalho. Seu talento merece ser visto.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button 
                size="xl" 
                variant="pride" 
                className="w-full sm:w-auto px-8 py-4 text-lg"
                onClick={() => router.push('/register')}
              >
                Criar conta gratuita →
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                className="w-full sm:w-auto px-8 py-4 text-lg"
                onClick={() => router.push('/enterprise')}
              >
                Sou empresa →
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                <span>Verificação biométrica</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartIcon className="h-5 w-5 text-pride-pink" />
                <span>Comunidade acolhedora</span>
              </div>
              <div className="flex items-center gap-2">
                <LockClosedIcon className="h-5 w-5 text-primary-500" />
                <span>Dados protegidos (LGPD)</span>
              </div>
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-blue-500" />
                <span>PWA - Funciona offline</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <dt className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white pride-text">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="pride" className="mb-4">Por que escolher a Divarsity?</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tudo o que você precisa para{' '}
              <span className="pride-text">prosperar profissionalmente</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Construímos cada funcionalidade pensando na sua segurança, visibilidade e crescimento profissional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" padding="lg" className="h-full card-hover">
                  <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center mb-4', feature.bgColor)}>
                    <feature.icon className={cn('h-6 w-6', feature.color)} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Como funciona em <span className="pride-text">3 passos simples</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Crie seu perfil inclusivo',
                description: 'Cadastre-se com seu nome social, pronomes e identidade. Seus dados legais ficam protegidos e só são usados para verificação de segurança.',
                icon: UsersIcon,
              },
              {
                step: '02',
                title: 'Explore oportunidades',
                description: 'Filtre vagas CLT/PJ, freelas e bicos por localização, modalidade e tipo. Receba alertas personalizados das melhores oportunidades para você.',
                icon: MagnifyingGlassIcon,
              },
              {
                step: '03',
                title: 'Conecte-se e cresça',
                description: 'Candidate-se, converse com recrutadoras no chat interno, use o Copiloto IA para otimizar seu currículo e construa sua rede profissional.',
                icon: SparklesIcon,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-pride-red via-pride-orange via-pride-yellow via-pride-green via-pride-blue to-pride-purple" />
                <div className="relative pl-16">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-4 border-primary-500">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{item.step}</span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Planos flexíveis para <span className="pride-text">cada momento da carreira</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sem taxas sobre seus ganhos. 100% do que você negociar vai direto para seu bolso. Assinaturas transparentes a partir de R$ 11,99/mês.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  variant={plan.popular ? 'pride' : 'outlined'} 
                  padding="lg" 
                  className={cn('relative h-full flex flex-col', plan.popular && 'scale-105 z-10 shadow-pride')}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="pride" size="sm">Mais Popular</Badge>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1" role="list">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.variant as any} 
                    className="w-full"
                    onClick={() => router.push(`/register?plan=${plan.name.toLowerCase()}`)}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c4dff 0%, #5b21b6 50%, #86007D 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-pride-red/10 via-pride-orange/10 via-pride-yellow/10 via-pride-green/10 via-pride-blue/10 to-pride-purple/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="pride-outline" size="lg" className="mb-6 border-2">✨ Junte-se a milhares de talentos diversos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Sua carreira merece um espaço onde você possa ser 100% você mesmo
            </h2>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-8">
              Cadastre-se grátis hoje e comece a explorar oportunidades feitas para você. 
              Sem taxas escondidas, sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg" onClick={() => router.push('/register')}>
                Começar agora - É grátis →
              </Button>
              <Button size="xl" variant="ghost" className="w-full sm:w-auto px-8 py-4 text-lg text-white hover:bg-white/10" onClick={() => router.push('/enterprise')}>
                Quero contratar talentos diversos
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  )
}