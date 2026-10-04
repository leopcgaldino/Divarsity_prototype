'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState, useEffect } from 'react'
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, UserCircleIcon, GlobeAltIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Button, Checkbox } from '@/components/ui'
import { toastHelpers } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'

const sections = [
  {
    title: 'Visibilidade do Perfil',
    icon: '👤',
    description: 'Controle quem pode ver seu perfil e informações',
    settings: [
      { key: 'profile_visibility', label: 'Perfil Público', desc: 'Seu perfil pode ser encontrado por recrutadores e profissionais' },
      { key: 'show_online_status', label: 'Status Online', desc: 'Outras pessoas veem quando você está online' },
      { key: 'allow_direct_messages', label: 'Mensagens Diretas', desc: 'Permitir que qualquer pessoa te envie mensagem direta' },
      { key: 'show_profile_views', label: 'Visualizações do Perfil', desc: 'Mostrar quem visitou seu perfil' },
      { key: 'show_activity_status', label: 'Status de Atividade', desc: 'Mostrar quando você esteve online recentemente' },
    ]
  },
  {
    title: 'Buscabilidade e Descoberta',
    icon: '🔍',
    settings: [
      { key: 'searchable_by_email', label: 'Encontrável por E-mail', desc: 'Permitir que pessoas te encontrem pelo e-mail' },
      { key: 'searchable_by_name', label: 'Encontrável por Nome', desc: 'Permitir que pessoas te encontrem pelo nome' },
      { key: 'indexed_by_search_engines', label: 'Indexado no Google', desc: 'Seu perfil aparece em resultados de busca (Google, Bing, etc.)' },
      { key: 'show_in_directory', label: 'No Diretório Público', desc: 'Aparecer no diretório de profissionais da Divarsity' },
    ]
  },
  {
    title: 'Atividade e Interações',
    icon: '📊',
    settings: [
      { key: 'show_activity_feed', label: 'Feed de Atividade', desc: 'Mostrar suas atividades recentes no perfil' },
      { key: 'show_skills_endorsements', label: 'Endossos de Habilidades', desc: 'Mostrar endossos que você recebeu' },
      { key: 'show_recommendations', label: 'Recomendações', desc: 'Exibir recomendações recebidas' },
      { key: 'show_connections_count', label: 'Número de Conexões', desc: 'Mostrar quantas conexões você tem' },
      { key: 'show_mutual_connections', label: 'Conexões em Comum', desc: 'Mostrar conexões em comum com outros perfis' },
      { key: 'profile_views_tracking', label: 'Rastreamento de Visualizações', desc: 'Permitir rastreamento de quem viu seu perfil' },
    ]
  },
  {
    title: 'Dados e Publicidade',
    icon: '📊',
    settings: [
      { key: 'allow_third_party_apps', label: 'Apps de Terceiros', desc: 'Permitir apps de terceiros acessarem seu perfil (com sua permissão)' },
      { key: 'share_data_with_partners', label: 'Compartilhar com Parceiros', desc: 'Compartilhar dados anonimizados com parceiros da Divarsity' },
      { key: 'personalized_ads', label: 'Anúncios Personalizados', desc: 'Ver anúncios baseados no seu perfil e interesses' },
      { key: 'analytics_tracking', label: 'Rastreamento de Análise', desc: 'Nos ajuda a melhorar a plataforma com dados de uso anônimos' },
    ]
  },
  {
    title: 'Comunicações',
    icon: '📬',
    settings: [
      { key: 'email_notifications', label: 'Notificações por E-mail', desc: 'Receber notificações importantes por e-mail' },
      { key: 'push_notifications', label: 'Notificações Push', desc: 'Receber notificações no navegador/celular' },
      { key: 'marketing_emails', label: 'E-mails de Marketing', desc: 'Novidades, dicas e ofertas da Divarsity' },
      { key: 'security_alerts', label: 'Alertas de Segurança', desc: 'Alertas importantes sobre sua conta' },
      { key: 'weekly_digest', label: 'Resumo Semanal', desc: 'Resumo semanal de atividades e oportunidades' },
    ]
  },
  {
    title: 'Cookies e Rastreamento',
    icon: '🍪',
    settings: [
      { key: 'analytics_cookies', label: 'Cookies de Análise', desc: 'Nos ajuda a entender como você usa a plataforma' },
      { key: 'marketing_cookies', label: 'Cookies de Marketing', desc: 'Para mostrar anúncios relevantes em outros sites' },
      { key: 'third_party_cookies', label: 'Cookies de Terceiros', desc: 'Cookies de parceiros para funcionalidades extras' },
    ]
  },
  {
    title: 'Direitos de Dados (LGPD)',
    icon: '🛡️',
    settings: [
      { key: 'data_processing_consent', label: 'Consentimento LGPD', desc: 'Consentimento para processamento de dados conforme LGPD' },
    ],
    actions: [
      { label: 'Baixar Meus Dados', action: 'downloadData', variant: 'outline', icon: '⬇️' },
      { label: 'Solicitar Exclusão da Conta', action: 'deleteAccount', variant: 'destructive', icon: '🗑️', confirm: true },
    ]
  }
]

export default function PrivacySettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Record<string, boolean>>({})

  // Initialize settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('privacySettings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch {
        // Use defaults if parsing fails
      }
    }
  }, [])

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const saveSettings = async () => {
    setSaving(true)
    localStorage.setItem('privacySettings', JSON.stringify(settings))
    await new Promise(resolve => setTimeout(resolve, 1000))
    // toastHelpers.success('Preferências de privacidade salvas! 🛡️')
    setSaving(false)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacidade e Segurança</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Controle seus dados, privacidade e como suas informações são usadas</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 space-y-8">
            {sections.map(section => (
              <div key={section.title} className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                    {section.settings[0] && <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie suas preferências</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  {section.settings.map(setting => (
                    <label
                      key={setting.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{setting.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{setting.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings[setting.key] || false}
                        onChange={() => setSettings(prev => ({ ...prev, [setting.key]: !prev[setting.key] }))}
                        className="h-5 w-5 text-primary-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </label>
                  ))}
                </div>

                {section.actions && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    {section.actions.map(action => (
                      <button
                        key={action.action}
                        onClick={() => {
                          if (action.confirm && !window.confirm(`Tem certeza que deseja ${action.label.toLowerCase()}? Esta ação é irreversível.`)) return
                          if (action.action === 'downloadData') {
                            // TODO: Implement download
                          } else if (action.action === 'deleteAccount') {
                            if (window.confirm('TEM CERTEZA? Esta ação é IRREVERSÍVEL e apagará todos os seus dados permanentemente.')) {
                              // TODO: Implement delete
                            }
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          action.variant === 'destructive'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                            : action.variant === 'outline'
                            ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {action.icon} {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
              <button
                onClick={() => {
                  // Reset to defaults
                  localStorage.removeItem('privacySettings')
                  window.location.reload()
                }}
                className="px-6 py-2 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400"
              >
                Restaurar padrões
              </button>
              <button
                disabled={saving}
                onClick={saveSettings}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Preferências'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}