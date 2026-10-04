'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function MessagesPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mensagens</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Conversas com recrutadores e conexões</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h4M4 12h4m4 0h4m-6 4h4m-6 4h4m-10 4h4M4 16h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Nenhuma mensagem ainda</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Suas conversas com recrutadores e conexões aparecerão aqui.</p>
            <a href="/dashboard" className="mt-6 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Voltar ao feed
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}