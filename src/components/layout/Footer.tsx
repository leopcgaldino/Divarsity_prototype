'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    produto: [
      { label: 'Vagas Formais', href: '/dashboard?tab=vagas' },
      { label: 'Freelances', href: '/dashboard?tab=freelances' },
      { label: 'Bicos & Serviços', href: '/dashboard?tab=bicos' },
      { label: 'Copiloto IA', href: '/copilot' },
      { label: 'Preços Justos', href: '/pricing-calculator' },
    ],
    empresa: [
      { label: 'Contratar Talentos', href: '/enterprise' },
      { label: 'Painel ESG', href: '/esg-dashboard' },
      { label: 'Planos Corporativos', href: '/pricing#corporate' },
      { label: 'API & Integrações', href: '/api-docs' },
    ],
    comunidade: [
      { label: 'Código de Conduta', href: '/code-of-conduct' },
      { label: 'Central de Segurança', href: '/safety' },
      { label: 'Denunciar', href: '/report' },
      { label: 'Diretrizes da Comunidade', href: '/guidelines' },
      { label: 'Blog & Histórias', href: '/blog' },
    ],
    suporte: [
      { label: 'Central de Ajuda', href: '/help' },
      { label: 'Contato', href: '/contact' },
      { label: 'Política de Privacidade', href: '/privacy' },
      { label: 'Termos de Uso', href: '/terms' },
      { label: 'Acessibilidade', href: '/accessibility' },
    ],
  }

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/divarsity', icon: '📷' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/divarsity', icon: '💼' },
    { name: 'Twitter', href: 'https://twitter.com/divarsity', icon: '🐦' },
    { name: 'YouTube', href: 'https://youtube.com/@divarsity', icon: '▶️' },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2" aria-label="Divarsity - Início">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">Divarsity</span>
            </Link>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-xs">
              A primeira plataforma de empregabilidade exclusiva para Mulheres (Cis e Trans) e Pessoas LGBTQIAPN+. 
              Conectamos talentos diversos a oportunidades reais em um ambiente seguro e acolhedor.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-xl" aria-hidden="true">{social.icon}</span>
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Feito com 💜 para a comunidade LGBTQIAPN+
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Produto</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.produto.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Para Empresas</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.empresa.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Comunidade</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.comunidade.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Suporte</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.suporte.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Divarsity. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>Brasil 🇧🇷</span>
              <span>PT-BR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}