'use client'

import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/solid'
import { Logo } from './Logo'

const footerLinks = [
  {
    title: 'Produto',
    links: [
      { label: 'Vagas Formais', href: '/dashboard?tab=vagas' },
      { label: 'Freelances', href: '/dashboard?tab=freelances' },
      { label: 'Bicos & Serviços', href: '/dashboard?tab=bicos' },
      { label: 'Copiloto IA', href: '/copilot' },
      { label: 'Preços Justos', href: '/pricing-calculator' },
    ],
  },
  {
    title: 'Para Empresas',
    links: [
      { label: 'Contratar Talentos', href: '/enterprise' },
      { label: 'Painel ESG', href: '/esg-dashboard' },
      { label: 'Planos Corporativos', href: '/pricing#corporate' },
      { label: 'API & Integrações', href: '/api-docs' },
    ],
  },
  {
    title: 'Comunidade',
    links: [
      { label: 'Código de Conduta', href: '/code-of-conduct' },
      { label: 'Central de Segurança', href: '/safety' },
      { label: 'Denunciar', href: '/report' },
      { label: 'Diretrizes', href: '/guidelines' },
      { label: 'Blog & Histórias', href: '/blog' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de Ajuda', href: '/help' },
      { label: 'Contato', href: '/contact' },
      { label: 'Privacidade', href: '/privacy' },
      { label: 'Termos de Uso', href: '/terms' },
      { label: 'Acessibilidade', href: '/accessibility' },
    ],
  },
]

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/divarsity' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/divarsity' },
  { name: 'X', href: 'https://twitter.com/divarsity' },
  { name: 'YouTube', href: 'https://youtube.com/@divarsity' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-ink text-white" role="contentinfo">
      <div className="h-1.5 w-full bg-pride-stripe" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm space-y-6">
            <Logo size="md" wordmarkClassName="text-white" />
            <p className="text-sm leading-relaxed text-white/60">
              A primeira plataforma de empregabilidade exclusiva para Mulheres (Cis e Trans) e Pessoas LGBTQIAPN+.
              Conectamos talentos diversos a oportunidades reais em um ambiente seguro e acolhedor.
            </p>
            <ul className="flex flex-wrap gap-2" role="list">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/80 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="font-display text-sm font-semibold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row md:items-center">
          <p>© {currentYear} Divarsity. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Feito com <HeartIcon className="h-4 w-4 text-magenta-400" aria-label="amor" /> pela e para a comunidade LGBTQIAPN+
          </p>
        </div>
      </div>
    </footer>
  )
}
