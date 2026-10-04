import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/hooks/useTheme'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Divarsity - Empregabilidade Inclusiva para Mulheres e LGBTQIAPN+',
    template: '%s | Divarsity',
  },
  description: 'A primeira plataforma de empregabilidade exclusiva para Mulheres (Cis e Trans) e Pessoas LGBTQIAPN+. Vagas, freelas e bicos em um ambiente seguro e acolhedor.',
  keywords: ['emprego', 'vagas', 'freelance', 'mulheres', 'LGBTQIAPN+', 'diversidade', 'inclusão', 'trabalho'],
  authors: [{ name: 'Divarsity Team' }],
  creator: 'Divarsity',
  publisher: 'Divarsity',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://divarsity.com.br',
    siteName: 'Divarsity',
    title: 'Divarsity - Empregabilidade Inclusiva',
    description: 'Conectamos talentos diversos a oportunidades reais. Vagas, freelas e bicos para Mulheres e Pessoas LGBTQIAPN+.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Divarsity - Plataforma de Empregabilidade Inclusiva',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Divarsity - Empregabilidade Inclusiva',
    description: 'A primeira plataforma de emprego exclusiva para Mulheres e Pessoas LGBTQIAPN+.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} font-sans`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}