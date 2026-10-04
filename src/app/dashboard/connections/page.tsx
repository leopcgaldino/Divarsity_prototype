'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function ConnectionsPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Minha Rede</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Conecte-se com profissionais e expanda sua rede</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-.226-.356-.447a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-.226-.356-.447a3 3 0 00-5.356-1.857" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Sua rede está vazia</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Comece a construir sua rede profissional conectando-se com outros profissionais.</p>
            <a href="/dashboard" className="mt-6 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Explorar profissionais
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}