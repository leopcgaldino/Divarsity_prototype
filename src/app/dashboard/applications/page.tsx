'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function ApplicationsPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Minhas Candidaturas</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Gerencie e acompanhe suas candidaturas</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2h6z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Nenhuma candidatura ainda</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Suas candidaturas aparecerão aqui quando você se candidatar a vagas.</p>
            <a href="/dashboard" className="mt-6 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Explorar vagas
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}