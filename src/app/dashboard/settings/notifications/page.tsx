'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { Button, Checkbox } from '@/components/ui'
import { toastHelpers } from '@/components/ui/Toast'

type NotificationChannel = 'email' | 'push' | 'in_app';
type NotificationSetting = { email: boolean; push: boolean; in_app: boolean };

type NotificationKey = 
  | 'application_received' | 'application_status' | 'interview_invitation' | 'application_rejected' | 'application_accepted'
  | 'connection_request' | 'connection_accepted' | 'endorsement_received' | 'profile_view'
  | 'new_message' | 'message_reply' | 'message_mention'
  | 'new_job_match' | 'saved_job_expiring' | 'new_freelance_project' | 'saved_gig_expiring'
  | 'security_alert' | 'password_changed' | 'login_new_device' | 'account_update'
  | 'newsletter' | 'product_updates' | 'events_webinars' | 'tips_career';

type NotificationItem = {
  key: NotificationKey
  label: string
  description: string
}

const notificationCategories: Array<{ title: string; description: string; icon: string; notifications: NotificationItem[] }> = [
  {
    title: 'Mensagens',
    description: 'Notificações de mensagens e conversas',
    icon: '💬',
    notifications: [
      { key: 'new_message', label: 'Nova mensagem', description: 'Você recebeu uma nova mensagem' },
      { key: 'message_reply', label: 'Resposta recebida', description: 'Alguém respondeu sua mensagem' },
      { key: 'message_mention', label: 'Menção em mensagem', description: 'Você foi mencionado em uma conversa' },
    ]
  },
  {
    title: 'Oportunidades',
    description: 'Alertas de novas oportunidades',
    icon: '💼',
    notifications: [
      { key: 'new_job_match', label: 'Nova vaga compatível', description: 'Vaga compatível com seu perfil' },
      { key: 'saved_job_expiring', label: 'Vaga salva expirando', description: 'Uma vaga salva está prestes a expirar' },
      { key: 'new_freelance_project', label: 'Novo projeto freelance', description: 'Projeto compatível com suas skills' },
      { key: 'saved_gig_expiring', label: 'Bico salvo expirando', description: 'Um bico salvo está prestes a expirar' },
    ]
  },
  {
    title: 'Sistema e Segurança',
    description: 'Notificações importantes da plataforma',
    icon: '🔒',
    notifications: [
      { key: 'security_alert', label: 'Alerta de segurança', description: 'Acesso suspeito à sua conta' },
      { key: 'password_changed', label: 'Senha alterada', description: 'Sua senha foi alterada' },
      { key: 'login_new_device', label: 'Novo login', description: 'Login de novo dispositivo' },
      { key: 'account_update', label: 'Atualização de conta', description: 'Alterações importantes na sua conta' },
    ]
  },
  {
    title: 'Marketing e Novidades',
    description: 'Comunicações da Divarsity',
    icon: '📢',
    notifications: [
      { key: 'newsletter', label: 'Newsletter semanal', description: 'Resumo semanal de oportunidades' },
      { key: 'product_updates', label: 'Atualizações da plataforma', description: 'Novos recursos e melhorias' },
      { key: 'events_webinars', label: 'Eventos e webinars', description: 'Convites para eventos exclusivos' },
      { key: 'tips_career', label: 'Dicas de carreira', description: 'Dicas personalizadas para sua carreira' },
    ]
  }
]

const defaultNotificationSettings: Record<NotificationKey, NotificationSetting> = {
  // Candidaturas
  application_received: { email: true, push: true, in_app: true },
  application_status: { email: true, push: true, in_app: true },
  interview_invitation: { email: true, push: true, in_app: true },
  application_rejected: { email: true, push: false, in_app: true },
  application_accepted: { email: true, push: true, in_app: true },

  // Conexões
  connection_request: { email: true, push: true, in_app: true },
  connection_accepted: { email: false, push: true, in_app: true },
  endorsement_received: { email: true, push: true, in_app: true },
  profile_view: { email: false, push: false, in_app: true },

  // Mensagens
  new_message: { email: true, push: true, in_app: true },
  message_reply: { email: true, push: true, in_app: true },
  message_mention: { email: false, push: true, in_app: true },

  // Oportunidades
  new_job_match: { email: true, push: true, in_app: true },
  saved_job_expiring: { email: true, push: true, in_app: true },
  new_freelance_project: { email: true, push: true, in_app: true },
  saved_gig_expiring: { email: true, push: true, in_app: true },

  // Sistema
  security_alert: { email: true, push: true, in_app: true },
  password_changed: { email: true, push: true, in_app: true },
  login_new_device: { email: true, push: true, in_app: true },
  account_update: { email: true, push: false, in_app: true },

  // Marketing
  newsletter: { email: true, push: false, in_app: false },
  product_updates: { email: false, push: false, in_app: true },
  events_webinars: { email: true, push: false, in_app: true },
  tips_career: { email: true, push: false, in_app: true },
}

export default function NotificationsSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Record<NotificationKey, NotificationSetting>>(defaultNotificationSettings)

  const toggleSetting = (key: NotificationKey, channel: NotificationChannel) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [channel]: !prev[key][channel]
      }
    }))
  }

  const toggleAll = (key: NotificationKey, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: { email: value, push: value, in_app: value }
    }))
  }

  const saveSettings = async () => {
    setSaving(true)
    // TODO: Save to backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    // toastHelpers.success('Preferências salvas! ✨')
    setSaving(false)
  }

  const resetToDefaults = () => {
    setSettings(defaultNotificationSettings)
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return '📧'
      case 'push': return '🔔'
      case 'in_app': return '📱'
      default: return ''
    }
  }

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'email': return 'E-mail'
      case 'push': return 'Push'
      case 'in_app': return 'No App'
      default: return ''
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notificações</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Configure como e quando você quer receber notificações</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferências de Notificação</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Escolha como e quando quer ser notificada</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { const allEnabled = Object.keys(defaultNotificationSettings).reduce((acc, key) => ({ ...acc, [key]: { email: true, push: true, in_app: true } }), {} as any); setSettings(prev => ({ ...prev, ...allEnabled })) }}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Ativar todas
                </button>
                <button
                  onClick={resetToDefaults}
                  className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400"
                >
                  Restaurar padrões
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {Object.entries(notificationCategories).map(([categoryKey, category]) => (
              <div key={categoryKey} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.notifications.map(notification => (
                    <div key={notification.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {notification.label}
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {notification.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {(['email', 'push', 'in_app'] as const).map(channel => (
                            <label key={channel} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings[notification.key]?.[channel] || false}
                                onChange={() => toggleSetting(notification.key, channel)}
                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                                {getChannelLabel(channel)}
                              </span>
                              <span className="text-xs text-gray-400 hidden sm:inline">
                                {getChannelIcon(channel)}
                              </span>
                            </label>
                          ))}
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => toggleAll(notification.key, true)}
                              className="px-2 py-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                              title="Ativar todas"
                            >
                              ✓ Todas
                            </button>
                            <button
                              onClick={() => toggleAll(notification.key, false)}
                              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                              title="Desativar todas"
                            >
                              ✕ Nenhuma
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-4">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400"
            >
              Restaurar padrões
            </button>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}